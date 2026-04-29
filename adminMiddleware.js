const SOSAlert = require('../models/SOSAlert');
const EmergencyRequest = require('../models/EmergencyRequest');
const IncidentReport = require('../models/IncidentReport');
const LiveLocation = require('../models/LiveLocation');
const User = require('../models/User');
const UnsafeZone = require('../models/UnsafeZone');

// @route   POST /api/sos
// @desc    Trigger an SOS alert with location
// @access  Private (Requires valid JWT)
exports.triggerSOS = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location data (latitude, longitude) is required.' });
    }

    // req.user is set by authMiddleware
    const newSOS = new SOSAlert({
      userId: req.user.id,
      latitude,
      longitude,
    });

    await newSOS.save();

    // Emit rich payload so admin map updates instantly
    const io = req.app.get('io');
    if (io) {
      const userDoc = await User.findById(req.user.id).select('name').lean();
      io.emit('sos_triggered', {
        userId:    req.user.id,
        name:      userDoc?.name || 'Unknown User',
        latitude,
        longitude,
        type:      'sos',
        updatedAt: new Date().toISOString()
      });
      io.emit('sos_updated'); // backward-compat for other listeners
    }

    res.status(201).json({ 
      message: 'SOS Alert triggered successfully. Help is on the way.',
      alert: newSOS 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/emergency
// @desc    Submit an emergency request
// @access  Private
exports.requestEmergency = async (req, res) => {
  try {
    const { type, description } = req.body;

    if (!type || !description) {
      return res.status(400).json({ message: 'Please provide request type and description.' });
    }

    const newRequest = new EmergencyRequest({
      userId: req.user.id,
      type,
      description,
    });

    await newRequest.save();

    // Emit event to admins
    const io = req.app.get('io');
    if (io) {
      io.emit('emergency_updated');
    }

    res.status(201).json({ 
      message: 'Emergency request submitted successfully.',
      emergency: newRequest 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/report
// @desc    Submit an incident report
// @access  Private
exports.reportIncident = async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ message: 'Please provide title, description, and location.' });
    }

    const newReport = new IncidentReport({
      userId: req.user.id,
      title,
      description,
      location,
    });

    await newReport.save();

    // Emit event to admins
    const io = req.app.get('io');
    if (io) {
      io.emit('report_updated');
    }

    res.status(201).json({ 
      message: 'Incident report submitted successfully.',
      report: newReport 
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   POST /api/live-location
// @desc    Update live location of a user
// @access  Private
exports.updateLiveLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // We can either create a new record for history or update an existing one. 
    // Creating a new one creates a breadcrumb trail.
    const liveLoc = new LiveLocation({
      userId: req.user.id,
      latitude,
      longitude
    });

    await liveLoc.save();

    // Update SOS alert location if one is active; capture result to know type
    const activeSOS = await SOSAlert.findOneAndUpdate(
      { userId: req.user.id, status: 'active' },
      { latitude, longitude }
    );

    // Emit rich payload — admin map patches just this marker instantly
    const io = req.app.get('io');
    if (io) {
      const userDoc = await User.findById(req.user.id).select('name').lean();
      io.emit('live_location_update', {
        userId:    req.user.id,
        name:      userDoc?.name || 'Unknown User',
        latitude,
        longitude,
        type:      activeSOS ? 'sos' : 'live',
        updatedAt: new Date().toISOString()
      });
      io.emit('sos_updated'); // backward-compat
    }

    res.status(200).json({ message: 'Location updated', liveLoc });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/unsafe-zones
// @desc    Get all unsafe zones (with auto-seeding if empty)
// @access  Private
exports.getUnsafeZones = async (req, res) => {
  try {
    let zones = await UnsafeZone.find({});

    // Auto-seed some dummy unsafe zones if none exist
    if (zones.length === 0) {
      const seedZones = [
        { latitude: 20.5940, longitude: 78.9630, radius: 80, riskLevel: 'high', description: 'Unlit alleyway' },
        { latitude: 20.5930, longitude: 78.9620, radius: 60, riskLevel: 'medium', description: 'Construction site' },
        { latitude: 20.5950, longitude: 78.9610, radius: 100, riskLevel: 'high', description: 'Reported incidents area' }
      ];
      await UnsafeZone.insertMany(seedZones);
      zones = await UnsafeZone.find({});
    }

    res.json(zones);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/history
// @desc    Get user's past reports and emergencies
// @access  Private
exports.getUserHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const emergencies = await EmergencyRequest.find({ userId }).sort({ createdAt: -1 });
    const reports = await IncidentReport.find({ userId }).sort({ createdAt: -1 });
    const sosAlerts = await SOSAlert.find({ userId }).sort({ createdAt: -1 });

    res.json({
      emergencies,
      reports,
      sosAlerts
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

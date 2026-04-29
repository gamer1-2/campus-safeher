const SOSAlert = require('../models/SOSAlert');
const EmergencyRequest = require('../models/EmergencyRequest');
const IncidentReport = require('../models/IncidentReport');
const LiveLocation = require('../models/LiveLocation');

// @route   GET /api/admin/sos
// @desc    Get all SOS alerts
// @access  Private/Admin
exports.getAllSOS = async (req, res) => {
  try {
    const alerts = await SOSAlert.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/admin/live-locations
// @desc    Get live locations for all active users (SOS + recently tracked)
// @access  Private/Admin
exports.getLiveLocations = async (req, res) => {
  try {
    const TWO_MINUTES_AGO = new Date(Date.now() - 2 * 60 * 1000);

    // Aggregate: get the most recent LiveLocation entry per user in the last 2 minutes
    const rawLiveUsers = await LiveLocation.aggregate([
      { $match: { createdAt: { $gte: TWO_MINUTES_AGO } } },
      { $sort: { createdAt: -1 } },
      { $group: { _id: '$userId', doc: { $first: '$$ROOT' } } },
      { $replaceRoot: { newRoot: '$doc' } }
    ]);

    // Populate user name/email
    await LiveLocation.populate(rawLiveUsers, { path: 'userId', select: 'name email' });

    // Get all active SOS alerts
    const activeSOSAlerts = await SOSAlert.find({ status: 'active' }).populate('userId', 'name email');

    // Build a Set of userIds that have an active SOS
    const sosUserIds = new Set(
      activeSOSAlerts.map(a => a.userId?._id?.toString()).filter(Boolean)
    );

    // Format live-location users; mark as 'sos' if they also have an active alert
    const result = rawLiveUsers.map(loc => ({
      _id: loc._id,
      userId: loc.userId,
      latitude: loc.latitude,
      longitude: loc.longitude,
      type: sosUserIds.has(loc.userId?._id?.toString()) ? 'sos' : 'live',
      updatedAt: loc.createdAt
    }));

    // Add SOS users who have no recent LiveLocation ping (older location from the alert itself)
    const liveUserIds = new Set(
      rawLiveUsers.map(l => l.userId?._id?.toString()).filter(Boolean)
    );
    activeSOSAlerts.forEach(alert => {
      if (!liveUserIds.has(alert.userId?._id?.toString())) {
        result.push({
          _id: alert._id,
          userId: alert.userId,
          latitude: alert.latitude,
          longitude: alert.longitude,
          type: 'sos',
          updatedAt: alert.updatedAt || alert.createdAt
        });
      }
    });

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/admin/emergency
// @desc    Get all emergency requests
// @access  Private/Admin
exports.getAllEmergencies = async (req, res) => {
  try {
    const emergencies = await EmergencyRequest.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(emergencies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   GET /api/admin/reports
// @desc    Get all incident reports
// @access  Private/Admin
exports.getAllReports = async (req, res) => {
  try {
    const reports = await IncidentReport.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @route   PATCH /api/admin/emergency/:id/resolve
// @desc    Mark emergency request as resolved
// @access  Private/Admin
exports.resolveEmergency = async (req, res) => {
  try {
    const emergency = await EmergencyRequest.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    
    if (!emergency) {
      return res.status(404).json({ message: 'Emergency request not found' });
    }

    res.json({ message: 'Emergency marked as resolved', emergency });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Emergency request not found' });
    }
    res.status(500).send('Server error');
  }
};

// @route   DELETE /api/admin/report/:id
// @desc    Delete an incident report
// @access  Private/Admin
exports.deleteReport = async (req, res) => {
  try {
    const report = await IncidentReport.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    await report.deleteOne();
    res.json({ message: 'Report removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.status(500).send('Server error');
  }
};

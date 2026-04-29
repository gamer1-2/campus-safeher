module.exports = function (req, res, next) {
  // authMiddleware should have already set req.user
  if (!req.user) {
    return res.status(401).json({ message: 'Authorization denied' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }

  next();
};

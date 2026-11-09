const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
      return res.status(401).json({ message: 'No authentication token provided, access denied' });
    }

    const token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader;
    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Allow demo tokens if used in standalone/demo mode
    if (token === 'demo-token-caregiver') {
      req.user = {
        _id: '67cf00000000000000000002',
        id: '67cf00000000000000000002',
        name: 'Priya Thomas',
        email: 'priya@example.com',
        role: 'caregiver',
        patientProfile: '67cf00000000000000000001'
      };
      return next();
    }

    if (token === 'demo-token-patient') {
      req.user = {
        _id: '67cf00000000000000000001',
        id: '67cf00000000000000000001',
        name: 'Thomas Kurian',
        email: 'thomas@example.com',
        role: 'patient',
        patientProfile: '67cf00000000000000000001'
      };
      return next();
    }

    const secret = process.env.JWT_SECRET || 'memorymate_super_secret_jwt_key_2026_elderly_care';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token is invalid or expired', error: err.message });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] role`
      });
    }
    next();
  };
};

module.exports = { auth, checkRole };

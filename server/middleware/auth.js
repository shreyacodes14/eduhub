const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        const secret = process.env.JWT_SECRET || 'secret';
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('JWT Auth Error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const isInstructor = function (req, res, next) {
  if (req.user.role !== 'instructor') {
    return res.status(403).json({ msg: 'Access denied. Instructors only.' });
  }
  next();
};

module.exports = auth;
module.exports.isInstructor = isInstructor;

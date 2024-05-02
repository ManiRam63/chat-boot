const jwt = require('jsonwebtoken');
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const userId = decodedToken.user._id;
    if (!userId) {
        res.status(401).json({ message:'invalid user id' });
    } else {
      req.user = decodedToken.user; 
      next();
    }
  } catch {
    res.status(401).json({ message:'Unauthorized or Invalid token' });
  }
};
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorisation.split(' ')[1];
    const verifiedToken = jwt.verify(token, 'secret_key_for_development_purposes_only');
    req.userData = { email: verifiedToken.email, userId: verifiedToken.userId };
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Not authorised'
    });
  }
};

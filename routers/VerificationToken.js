var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


function verifyToken(req, res, next) {
  //console.log(req.headers)
  // check header or url parameters or post parameters for token
  var token = req.headers['healthproject'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  // verifies secret and checks exp
  jwt.verify(token, process.env.SECRET_KEY, function (err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything is good, save to request for use in other routes
    req.userId = decoded.id;
    //console.log(req.userId);
    next();
  });
}
module.exports = verifyToken;
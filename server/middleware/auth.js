const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../static");


module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  // Verify token
  try {
    await jwt.verify(token,"abc", (error, decoded) => {
      if (error) {
        res.status(401).json({ msg: "Token is not valid" });
      } else {
       
        req.id = decoded.id;
        console.log("authorise data",req.id)
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};

const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization");



  //  console.log("RAW AUTH HEADER:", token);
  // console.log("JWT SECRET:", process.env.JWT_SECRET);





  if (!token) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  try {
     const actualToken = token.replace("Bearer", "").trim();
    
    //  console.log("ACTUAL TOKEN:", actualToken);
    


    
    const decoded = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {

    console.log("JWT ERROR:", error.message);
    

    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = app => {
    const files = require("./files.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken } = jwtTokenUtils;
   

  app.post("/image", verifyToken,  files.postImage)
  app.post("/document", verifyToken,   files.postDocument)
  


    }

module.exports = app => {
    const files = require("./files.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   

  app.post("/image",  files.postImage)
  app.post("/document",   files.postDocument)
  


    }

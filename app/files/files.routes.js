module.exports = app => {
    const files = require("./files.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken } = jwtTokenUtils;
   
    require('../cloudinary/cloudinary.js')
    const upload = require('../cloudinary/multer.js');
  
  app.post("/image", verifyToken,   files.postImage)
  app.post("/document", verifyToken, upload.single("file"),   files.postDocument)
  


    }

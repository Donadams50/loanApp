module.exports = app => {
    const helper = require("./helper.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
    // require('../Cloudinary/cloudinary.js')
    // const upload = require('../Cloudinary/multer.js');

        //console.log("routes")
 app.post("/branch", helper.createBranch)
 app.post("/role", helper.createRole)
//app.get("/branches",  verifyToken, isAdmin,  helper.findAllMembers)
// app.get("/roles",  verifyToken, isAdmin,  helper.findAllMembers)

}
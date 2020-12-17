module.exports = app => {
    const member = require("./members.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
    // require('../Cloudinary/cloudinary.js')
    // const upload = require('../Cloudinary/multer.js');

        //console.log("routes")
 app.post("/member", verifyToken, isAdmin, member.create)
 app.post("/authenticate", member.signIn)
//  app.get("/members",  verifyToken, isAdmin,  member.findAllMembers)
//  app.get("/members/:id",  verifyToken, isAdmin,  member.findMembeById)
//  app.post("/feedback", verifyToken, member.postFeedback)
//  app.post("/changeadminpassword", member.changeAdminPassword)
//  app.post("/passwordchange", verifyToken, member.changePassword)
//  app.post("/resetpassword", member.resetPassword)
//  app.put("/member/:id", verifyToken,  member.updateMember)
//  app.put("/imagemember/:id", verifyToken,  upload.single("files"),  member.updateImage)
}
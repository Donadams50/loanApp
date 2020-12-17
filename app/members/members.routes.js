module.exports = app => {
    const member = require("./members.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
    

    app.post("/member", verifyToken, isAdmin, member.create)
    app.post("/authenticate", member.signIn)
    app.get("/members",  verifyToken, isAdmin,  member.findAllMembers)
    app.put("/member/:id", verifyToken, isAdmin,  member.updateMember)
    app.delete("/member/:id", verifyToken,  isAdmin,   member.deleteMember)
    app.get("/members/:id",  verifyToken, isAdmin,  member.findMembeById)
}
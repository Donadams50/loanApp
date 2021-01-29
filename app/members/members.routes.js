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
    app.get("/members/loanofficer/:id",  verifyToken, isAdmin,  member.findLoanOfficer)
    app.get("/members/unassignedloanofficer/:id",  verifyToken, isAdmin,  member.findUnasignedLoan)
    app.get("/member/count",  verifyToken, isAdmin,  member.countUsers)
    app.post("/forgotpassword",  member.forgotPassword)
    app.post("/reset",    member.resetPassword)
    app.post("/changepassword",  member.changePassword)
}

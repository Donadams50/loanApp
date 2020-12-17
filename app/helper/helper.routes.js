module.exports = app => {
    const helper = require("./helper.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   
        //console.log("routes")
 app.post("/branch", verifyToken, isAdmin, helper.createBranch)
 app.post("/role", verifyToken,  isAdmin , helper.createRole)
//app.get("/branches",  verifyToken, isAdmin,  helper.findAllMembers)
// app.get("/roles",  verifyToken, isAdmin,  helper.findAllMembers)

}
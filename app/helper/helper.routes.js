module.exports = app => {
    const helper = require("./helper.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   
 app.post("/branch",  helper.createBranch)
 app.post("/role",  helper.createRole)
 app.get("/branches",   helper.findAllBranches)
 app.get("/roles",    helper.findAllRoles)
 //app.put("/role/:id", verifyToken, isAdmin,  helper.updateRoler)
 //app.delete("/role/:id", verifyToken,  isAdmin,   helper.deleteRole)
 //app.put("/branch/:id", verifyToken, isAdmin,  helper.updateBranch)
 // app.delete("/branch/:id", verifyToken,  isAdmin,   helper.deleteBranch)
}
module.exports = app => {
    const helper = require("./helper.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   
 app.post("/branch", verifyToken, isAdmin, helper.createBranch)
 app.post("/role", verifyToken,  isAdmin , helper.createRole)
 app.get("/branches",   helper.findAllBranches)
 app.get("/roles",  verifyToken, isAdmin,  helper.findAllRoles)
 //app.put("/role/:id", verifyToken, isAdmin,  helper.updateRoler)
 //app.delete("/role/:id", verifyToken,  isAdmin,   helper.deleteRole)
 //app.put("/branch/:id", verifyToken, isAdmin,  helper.updateBranch)
 // app.delete("/branch/:id", verifyToken,  isAdmin,   helper.deleteBranch)
}
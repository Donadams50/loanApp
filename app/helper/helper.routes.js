module.exports = app => {
    const helper = require("./helper.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   
 app.post("/branch",  helper.createBranch)
 app.post("/role",  helper.createRole)
 app.get("/branches",   helper.findAllBranches)
 app.get("/roles",    helper.findAllRoles)
 app.get("/branch/count",   helper.countBranch)
 app.delete("/branch/:id",   helper.deleteBranch)
 app.put("/branch/:id",   helper.updateBranch)
 // app.delete("/branch/:id", verifyToken,  isAdmin,   helper.deleteBranch)
}
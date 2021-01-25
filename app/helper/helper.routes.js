module.exports = app => {
    const helper = require("./helper.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   
 app.post("/branch", verifyToken, isAdmin,  helper.createBranch)
 app.post("/role", verifyToken, isAdmin, helper.createRole)
 app.get("/branches", verifyToken, isAdmin,  helper.findAllBranches)
 app.get("/roles", verifyToken, isAdmin,   helper.findAllRoles)
 app.get("/branch/count", verifyToken, isAdmin,  helper.countBranch)
 app.delete("/branch/:id", verifyToken, isAdmin,  helper.deleteBranch)
 app.put("/branch/:id", verifyToken, isAdmin,  helper.updateBranch)
 app.post("/loantype", verifyToken, isAdmin,  helper.createLoantype)
}
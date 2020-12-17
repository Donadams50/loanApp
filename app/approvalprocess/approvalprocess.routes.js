module.exports = app => {
    const approvalProcess = require("./approvalprocess.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   

  app.post("/approvalprocess", verifyToken, isAdmin, approvalProcess.createApprovalProcess)
//  app.get("/approvalprocesses",  verifyToken, isAdmin,  approvalProcess.findApprovalProcess)
//  app.put("/approvalprocesses/:id", verifyToken, isAdmin,  approvalProcess.updateApprovalProcess)
//  app.delete("/approvalprocesses/:id", verifyToken,  isAdmin,   approvalProcess.deleteApprovalProcess)

}
module.exports = app => {
    const approvalProcess = require("./approvalprocess.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   

  app.post("/approvalprocess", approvalProcess.createApprovalProcess)
  app.get("/approvalprocess",  verifyToken, isAdmin,  approvalProcess.findApprovalProcess)
  app.put("/approvalprocess/:id", verifyToken, isAdmin,  approvalProcess.updateApprovalProcess)
  app.delete("/approvalprocess/:id", verifyToken,  isAdmin,   approvalProcess.deleteApprovalProcess)
  app.post("/loantype", approvalProcess.createLoanType)
  app.delete("/loantype/:id", approvalProcess.deleteLoanType)
}
module.exports = app => {
    const loanApplication = require("./loanpplication.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin , isApproval, isLoanOfficer} = jwtTokenUtils;
   

     app.post("/customerapplication", loanApplication.customerApplyLoan)
     app.post("/loanofficerapplication",  verifyToken, isLoanOfficer,  loanApplication.loanOfficerApplyLoan)
     app.get("/initaitedloan", verifyToken, isLoanOfficer,  loanApplication.loanOfficerGetAllLoan)
     app.get("/assignedloan", verifyToken, isApproval,  loanApplication.approvalGetAllLoan)
     app.post("/approvalrecommendation",  verifyToken, isApproval,  loanApplication.approvalRecommendation)
//   app.delete("/approvalprocess/:id", verifyToken,  isAdmin,   approvalProcess.deleteApprovalProcess)

}
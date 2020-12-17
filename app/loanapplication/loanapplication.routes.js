module.exports = app => {
    const loanApplication = require("./loanpplication.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin , isLoanOfficer} = jwtTokenUtils;
   

     app.post("/customerapplication", loanApplication.customerApplyLoan)
     app.post("/loanofficerapplication",  verifyToken, isLoanOfficer,  loanApplication.loanOfficerApplyLoan)
     app.get("/initaitedloan", verifyToken, isLoanOfficer,  loanApplication.loanOfficerGetLoan)
//   app.delete("/approvalprocess/:id", verifyToken,  isAdmin,   approvalProcess.deleteApprovalProcess)

}
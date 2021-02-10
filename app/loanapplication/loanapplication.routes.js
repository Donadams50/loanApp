module.exports = app => {
    const loanApplication = require("./loanpplication.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin , isApproval, isLoanOfficer} = jwtTokenUtils;
   

     app.post("/customerapplication",  loanApplication.customerApplyLoan)
     
     
     app.post("/loanofficerapplication",  verifyToken, isLoanOfficer,  loanApplication.loanOfficerApplyLoan)
     app.get("/loanofficer/assignedloan", verifyToken, isLoanOfficer,  loanApplication.loanOfficerGetAllLoan)
     app.get("/loanapplication/:id", verifyToken,   loanApplication.getLoanById)
     app.get("/approval/assignedloan", verifyToken, isApproval,  loanApplication.approvalGetAllLoan)
     app.post("/approvalrecommendation",  verifyToken, isApproval,  loanApplication.approvalRecommendation)
     app.post("/declinerecommendation",  verifyToken, isApproval,  loanApplication.declineRecommendation)
     app.post("/loanofficerrecommendation",  verifyToken, isLoanOfficer,  loanApplication.loanOfficerRecommendation)
     app.post("/loanofficerdeclinerecommendation",  verifyToken, isLoanOfficer,  loanApplication.loanOfficerDeclineRecommendation)
     app.get("/count/approval/loan", verifyToken, isApproval,  loanApplication.approvalLoanCount)
     app.get("/count/loanofficer/loan", verifyToken, isLoanOfficer,   loanApplication.LoanOfficerLoanCount)
     app.get("/report/approval", verifyToken, isApproval,  loanApplication.reportApproval)
     app.get("/report/loanofficer", verifyToken, isLoanOfficer,   loanApplication.reportLoanOfficer)
     app.post("/markdisbursed",  verifyToken,   loanApplication.markDisbursed)
}
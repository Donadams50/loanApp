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

}
module.exports = app => {
    const loanpayment = require("./loanpayment.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, verifyAppKey } = jwtTokenUtils;
   
  app.post("/initiate/payment", verifyToken, loanpayment.initaitePayment)
  
  app.put("/loanapp/paymentstatus", verifyToken, verifyAppKey, loanpayment.updatePaymentStatus)


    }
const axios = require('axios');
const dotenv=require('dotenv');
const db = require("../mongoose");
const sendemail = require('../helpers/emailhelper.js');
const LoanOfficerApplication = db.loanofficerapplications;
dotenv.config();
// Create approval process

exports.initaitePayment = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)
console.log(process.env.app_secret)
    const {  groupName , paymentDetails} = req.body;
  
    if (  groupName  && paymentDetails ){
        if ( groupName === " " || paymentDetails.length === 0 ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
      }else{    
        const headers = {
        'Content-Type': 'application/json',
        'Token':process.env.app_secret
          }
        const baseUrl= process.env.BASE_URL;
        const params =   
                         {
                            groupName: groupName,
                            paymentDetails: paymentDetails,                         
              
                         }
              
            
        
            try{   
                const   pay = await axios.post(''+baseUrl+'/bulkpay/3ptwebapp/loanpayment/', params, {headers: headers})
              //  console.log(pay.data)
                  if(pay){
                      console.log(req.user)
                    const emailFrom = 'astrapay@astrapolaris.com';
                    const subject = 'Payment link';                      
                    const hostUrl = "bulk.astrapay.com.ng/make_payment.html?payId="+pay.data.uniqueId+""
                    const hostUrl2 = "https://bulk.astrapay.com.ng/make_payment.html?payId="+pay.data.uniqueId+""    
                    const   text = 'Please click on the link below to make your payment'
                    const emailTo = req.user.email
                    const link = `${hostUrl}`; 
                    const link2 = `${hostUrl2}`;
                    const fullName = req.user.fullName

                      processEmail(emailFrom, emailTo, subject, link, link2, text, fullName);
                      res.status(201).send({
                        uniqueId: pay.data.uniqueId,
                        message:"Loan deatils cached successfully "})
                  }else{
                    res.status(400).send({message:"Error while caching payment details "})
                           
                       }
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while caching payment details "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format 5"
        });
    }
}

// update payment status
exports.updatePaymentStatus= async(req, res) => {
    const _id = req.body.loanId;
    console.log(req.body)
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }


    const {   loanId, status } = req.body;

    if (  loanId && status){
        if ( status===" " || loanId === " "){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{
       
    
    
         
            try{
                const updatepaymentstatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { paymentStatus: status });    
               console.log(updatepaymentstatus)      
            if(updatepaymentstatus)      {
            res.status(200).send({message:"payment updated succesfully"})       
          }else{
            res.status(400).send({message:"Error while updating payment status"})   
          }
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while updating payment status"})
            }
          
          
   
          
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
     

    

                   
};

// process email one
async function processEmail(emailFrom, emailTo, subject, link, link2, text, fName){
    try{
        //create org details
        // await delay();
       const sendmail =  await sendemail.emailUtility(emailFrom, emailTo, subject, link, link2, text, fName);
     //  console.log(sendmail)
        return sendmail
    }catch(err){
        console.log(err)
        return err
    }
  
  }
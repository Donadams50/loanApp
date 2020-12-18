
const db = require("../mongoose");
const CustomerApplication = db.customerapplications;
const LoanOfficerApplication = db.loanofficerapplications;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create approval process

exports.customerApplyLoan = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  form,   } = req.body;
  
    if ( form.branchName && form.firstName && form.lastName && form.nationality && form.address && form.pn  && form.email && form.guarantorName && form.guarantorAddress  && form.guarantorPn &&  form.guarantotBusiness &&  form.guarantorBvn && form.customerOccupation && form.customerOrg  && form.empStatus  && form.customerOfficeAddress && form.customerOrgPn && form.netMonthlyIncome && form.customerCardNo  && form.customerPassword  && form.month  && form.loanAmount && form.loanPurpose && form.loanDescription  && form.tenor  && form.customerAcctNo && form.existingBank  && form.existingType  && form.customerId  ){
        if ( form.branchName==="" || form.firstName==="" ||form.lastName==="" || form.nationality ==="" || form.address ==="" ||form.pn ==="" || form.email ==="" || form.guarantorName ==="" || form.guarantorAddress ==="" ||form.guarantorPn==="" || form.guarantotBusiness==="" ||  form.guarantorBvn ==="" || form.customerOccupation ==="" || form.customerOrg ==="" ||form.empStatus  ==="" || form.customerOfficeAddress==="" || form.customerOrgPn ==="" || form.netMonthlyIncome ==="" ||form.customerCardNo  ==="" || form.customerPassword  ==="" || form.month  ==="" || form.loanAmount ==="" || form.loanPurpose ==="" ||form.loanDescription ==="" || form.tenor ==="" ||form.customerAcctNo ==="" || form.existingBank ==="" || form.existingType  ==="" || form.customerId  ==="" ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const customerapplication = new CustomerApplication({
                form: req.body.form,
                branch:req.body.form.branch || '',
                branchId: req.body.form.branchId || '',
                status: "Initiated",
                assignedTo:""
                
              });
        
            try{                                              
                    const customerApplication = await  customerapplication.save()
                    console.log(customerApplication)                
                    res.status(201).send({message:"Loan request initaited"})
                           
               }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating branch "})
              }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}

exports.loanOfficerApplyLoan = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const { branch, branchId, form, customerApplicationId  } = req.body;
  
    if ( approvalProcess && branch && branchId){
        if ( form === "" || branch=== " " || branchId ==="" ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const loanofficerApplication = new LoanOfficerApplication({
                form: req.body.form,
                branch:req.body.branch || '',
                branchId: req.body.branchId || '',
                status: "On_Going",
                assignedTo: req.user.parent,
                signed: {"name": req.user.fullName, "remark": req.body.remark, "title": req.user.approvalTitle, "user_id":req.user.id},
                customerApplicationId: req.body.customerApplicationId || ''
                
              });
              
        
            try{     
                if (customerApplicationId){
                    const loanofficerApplication = await  loanofficerApplication.save()
                    console.log(loanofficerApplication) 
                       if(loanofficerApplication){
                        const updateCustomerForm = new CustomerApplication({
                            _id : customerApplicationId,
                            status: "Assigned",
                            assignedTo:req.user.id
                            
                          });
                          const updatecustomerform = await CustomerApplication.updateOne( {_id}, updateCustomerForm)
                          res.status(201).send({message:"Loan request submitted"})
                       }else{
                        res.status(500).send({message:"Error while creating loan request "})
                       }
                                   
                    
                  } else{                                        
                    const loanofficerApplication = await  loanofficerApplication.save()
                    console.log(loanofficerApplication)                
                    res.status(201).send({message:"Loan request submitted"})
                }
                           
               }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating loan request "})
              }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}
// Find approval process
exports.loanOfficerGetALLLoan = async (req, res) => {
    try{
        const status = "Initiated"
        const branch = req.query.branch
           const findPreFilledLoan = await CustomerApplication.find({status:status}).sort({"_id": -1})  
          // console.log(findApprovalProcess)
           res.status(200).send(findPreFilledLoan)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting approval process "})
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




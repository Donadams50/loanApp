
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

    const {  form   } = req.body;
  
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
                loanOfficer:""
                
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

    const {  form  } = req.body;
  
    // if ( form.branchName && form.firstName && form.lastName && form.nationality && form.address && form.pn  && form.email && form.guarantorName && form.guarantorAddress  && form.guarantorPn &&  form.guarantotBusiness &&  form.guarantorBvn && form.customerOccupation && form.customerOrg  && form.empStatus  && form.customerOfficeAddress && form.customerOrgPn && form.netMonthlyIncome && form.customerCardNo  && form.customerPassword  && form.month  && form.loanAmount && form.loanPurpose && form.loanDescription  && form.tenor  && form.customerAcctNo && form.existingBank  && form.existingType  && form.customerId  ){
    //     if ( form.branchName==="" || form.firstName==="" ||form.lastName==="" || form.nationality ==="" || form.address ==="" ||form.pn ==="" || form.email ==="" || form.guarantorName ==="" || form.guarantorAddress ==="" ||form.guarantorPn==="" || form.guarantotBusiness==="" ||  form.guarantorBvn ==="" || form.customerOccupation ==="" || form.customerOrg ==="" ||form.empStatus  ==="" || form.customerOfficeAddress==="" || form.customerOrgPn ==="" || form.netMonthlyIncome ==="" ||form.customerCardNo  ==="" || form.customerPassword  ==="" || form.month  ==="" || form.loanAmount ==="" || form.loanPurpose ==="" ||form.loanDescription ==="" || form.tenor ==="" ||form.customerAcctNo ==="" || form.existingBank ==="" || form.existingType  ==="" || form.customerId  ==="" ){
        if ( form ){
            if ( form===""  ){
    
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
           
              
        
            try{     
                if (form.customerApplicationId  ){
                    console.log("old") 
                    const loanofficerApplication = new LoanOfficerApplication({
                        form: req.body.form,
                        branch:req.body.form.branch || '',
                        branchId: req.body.form.branchId || '',
                        status: "On_Going",
                        assignedTo: req.user.parent,
                        loanOfficer: req.user.id,
                        signed: {"name": req.user.fullName, "remark": req.body.remark, "title": req.user.approvalTitle, "user_id":req.user.id},
                        customerApplicationId: req.body.form.customerApplicationId 
                        
                      });
                    const loanofficerApplicationsave = await  loanofficerApplication.save()
                    console.log(req.body.form.customerApplicationId) 
                       if(loanofficerApplicationsave){
                        // const updateCustomerForm = new CustomerApplication({
                        const     _id = req.body.form.customerApplicationId
                        //     status: "Assigned",
                        //     loanOfficer:req.user.id
                            
                        //   });
                        const updateOrder = await Orders.findOneAndUpdate({ _id }, { status: 'Completed' });
                          const updatecustomerform = await CustomerApplication.updateOne( {_id}, updateCustomerForm)
                          res.status(201).send({message:"Loan request submitted"})
                       }else{
                        res.status(500).send({message:"Error while creating loan request "})
                       }
                                   
                    
                  } else{    
                    console.log("new")  
                    const loanofficerApplication = new LoanOfficerApplication({
                        form: req.body.form,
                        branch:req.body.form.branch || '',
                        branchId: req.body.form.branchId || '',
                        status: "On_Going",
                        assignedTo: req.user.parent,
                        loanOfficer: req.user.id,
                        signed: {"name": req.user.fullName, "remark": req.body.remark, "title": req.user.approvalTitle, "user_id":req.user.id},
                        customerApplicationId: req.body.form.customerApplicationId || ''
                        
                      });                                  
                    const loanofficerApplicationsave = await  loanofficerApplication.save()
                    console.log(loanofficerApplicationsave)                
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




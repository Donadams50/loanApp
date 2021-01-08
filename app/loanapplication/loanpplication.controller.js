
const db = require("../mongoose");
const CustomerApplication = db.customerapplications;
const LoanOfficerApplication = db.loanofficerapplications;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Customer loan application

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

// loan officer submit loan or apply newly
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
                        const isLoanAssigned = await CustomerApplication.findOne({_id: req.body.form.customerApplicationId} )
                        console.log(isLoanAssigned.status) 
                        if(isLoanAssigned.status === "Assigned"){
                            res.status(400).send({
                                message:"This loan has been assigned to another loan officer"
                            });

                        }
                        else{
                            const findApprovalProcess = await ApprovalProcess.findOne().sort({"_id": -1}) 
                                    const loanofficerApplication = new LoanOfficerApplication({
                                        form: req.body.form,
                                        branch:req.body.form.branch || '',
                                        branchId: req.body.form.branchId || '',
                                        status: "On_Going",
                                        assignedTo: req.user.parent,
                                        loanOfficer: req.user.id,
                                        signed: {"name": req.user.fullName, "remark": "valid", "title": "loan_officer", "user_id":req.user.id},
                                        customerApplicationId: req.body.form.customerApplicationId ,
                                        declinedBy: '',
                                        approvalProcessId: "String",
                                        approvalProcess: "Array"
                                        });

                            
                            const loanofficerApplicationsave = await  loanofficerApplication.save()
                    
                       if(loanofficerApplicationsave){
                        console.log(req.body.form.customerApplicationId) 
                        // const updateCustomerForm = new CustomerApplication({
                        const     _id = req.body.form.customerApplicationId
                       
                        const updatecustomerform = await CustomerApplication.findOneAndUpdate({ _id }, { status: 'Assigned' });
                        const updatecustomerformone = await CustomerApplication.findOneAndUpdate({ _id }, { loanOfficer: req.user.id });
                        console.log("old") 
                        console.log(updatecustomerform) 
                          res.status(201).send({message:"Loan request accepted submitted"})
                       }else{
                        res.status(500).send({message:"Error while creating loan request "})
                       }
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
                        signed: {"name": req.user.fullName, "remark": "Valid", "title": "loan_officer", "user_id":req.user.id},
                        customerApplicationId: req.body.form.customerApplicationId || '',
                        declinedBy: ''
                        
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
// Find all  initiated loan for loan officer
exports.loanOfficerGetAllLoan = async (req, res) => {
    try{
        const status = "Initiated"
       // const branch = req.query.branch
           const findPreFilledLoan = await CustomerApplication.find({status:status}).sort({"_id": -1})  
          // console.log(findApprovalProcess)
           res.status(200).send(findPreFilledLoan)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting approval process "})
       }
};

// approval recommend  and give remark for loan

exports.approvalGetAllLoan = async (req, res) => {
    try{
     //   const status = "Initiated"
     //   const branch = req.query.branch
           const getLoanAssignedToMe = await LoanOfficerApplication.find({assignedTo:req.user.id}).sort({"_id": -1})  
           console.log(req.user.id)
           res.status(200).send(getLoanAssignedToMe)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting approval process "})
       }
};

// approval recommends and add remark
exports.approvalRecommendation= async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
     console.log(req.body)

    const {  remark , id } = req.body;
  
        if ( remark, id ){
            if ( remark==="" || id=== ""  ){
    
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{          
                 
                   try{     

                        const isLoanOngoing = await LoanOfficerApplication.findOne({_id: id} )
                        console.log(isLoanOngoing.status) 
                        if(isLoanOngoing.status === "Completed" || isLoanOngoing.status === "Declined"){
                            res.status(400).send({
                                message:"This loan has been completed or declined "
                            });

                        }
                        else{
                            const _id = req.body.id
                            if(req.user.parent === "None"){
                                console.log("last")
                            const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.approvalTitle, "user_id":req.user.id}  
                            const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                           const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Completed" });         
                            res.status(200).send({message:"Recommendation posted  successfully"})

                            }else{
                                console.log("still in process")
                                const assignedTo= req.user.parent                  
                                const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.approvalTitle, "user_id":req.user.id}  
                                const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                                const postNextToAssign = await LoanOfficerApplication.findOneAndUpdate({ _id }, { assignedTo: assignedTo });         
                                 res.status(200).send({message:"Recommendation posted  successfully"})
                            }
                           
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

// approval declines  and add remark
exports.declineRecommendation= async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
     console.log(req.body)

    const {  remark , id } = req.body;
  
        if ( remark, id ){
            if ( remark==="" || id=== ""  ){
    
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{          
                 
                   try{     

                        const isLoanOngoing = await LoanOfficerApplication.findOne({_id: id} )
                        console.log(isLoanOngoing.status) 
                        if(isLoanOngoing.status === "Completed" || isLoanOngoing.status === "Declined"){
                            res.status(400).send({
                                message:"This loan has been completed or declined"
                            });

                        }
                        else{
                            const _id = req.body.id
                            
                            console.log("declined")
                            const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.approvalTitle, "user_id":req.user.id}  
                            const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                            const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Declined" });         
                            res.status(200).send({message:"Loan declined  successfully"})

                            
                           
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




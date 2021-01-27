
const db = require("../mongoose");
const CustomerApplication = db.customerapplications;
const LoanOfficerApplication = db.loanofficerapplications;
const ApprovalProcess = db.approvalprocess;
const Groups = db.groups;
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
                            const findApprovalProcess = await ApprovalProcess.findOne({loanOfficer:req.user.id })
                               console.log(findApprovalProcess)
                                    const loanofficerApplication = new LoanOfficerApplication({
                                        form: req.body.form,
                                        branch:req.body.form.branch || '',
                                        branchId: req.body.form.branchId || '',
                                        status: "On_Going",
                                        assignedTo: findApprovalProcess.approvalProcess[1].userInOffice,
                                        loanOfficer: req.user.id,
                                        signed: {"name": req.user.fullName, "remark": "valid", "title": "loan_officer", "user_id":req.user.id},
                                        customerApplicationId: req.body.form.customerApplicationId ,
                                        declinedBy: '',
                                        approvalProcessId: findApprovalProcess._id,
                                        approvalProcess: findApprovalProcess.approvalProcess
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
                    const findApprovalProcess = await Groups.findOne({_id:req.user.groupId })
                    .populate('loanTypes')
                    console.log("JJ")
                    console.log(findApprovalProcess.loanTypes)
                    const appProcess = findApprovalProcess.loanTypes
                    console.log(appProcess.loanType)
                    console.log(req.body.form.loanType)
                    const    IndexApprovalProcess = appProcess.find( appProcess => appProcess.loanType === req.body.form.loanType);
                             IndexApprovalProcess.approvalProcess[0].userNameInOffice = req.user.fullName
                             IndexApprovalProcess.approvalProcess[0].userInOffice = req.user.id 
                    const addelementToApproval = await  IndexApprovalProcess.approvalProcess.forEach(function (element) {
                        element.status = "Awaiting confirmation";
                         element.remark = "";
                      });
                    const loanofficerApplication = new LoanOfficerApplication({
                        loanType:  req.body.form.loanType,
                        form: req.body.form,
                        branch:req.body.form.branch || '',
                        branchId: req.body.form.branchId || '',
                        status: "Initiated",
                        assignedTo: req.user.id,
                        loanOfficer: req.user.id,
                        // signed: {"name": req.user.fullName, "remark": "Valid", "title": "loan_officer", "user_id":req.user.id},
                        customerApplicationId: req.body.form.customerApplicationId || '',
                        declinedBy: '',
                        approvalProcessId: IndexApprovalProcess._id,
                        approvalProcess: IndexApprovalProcess.approvalProcess,
                        groupId: req.user.groupId
                        
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


// Find all loan  for a loan officer
exports.loanOfficerGetAllLoan = async (req, res) => {
    try{
     //   const status = "Initiated"
       const status = req.query.status

            if(status){
                const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status : status}).sort({"_id": -1})  
                console.log(req.user.id)
                res.status(200).send(getLoanAssignedToMe)
            }else{
                const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id}).sort({"_id": -1})  
           console.log(req.user.id)
           res.status(200).send(getLoanAssignedToMe)
                
            }
           
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting loan request "})
       }
};


//Approval recommend  and give remark for loan
exports.approvalGetAllLoan = async (req, res) => {
    try{
     const status5 = "Initiated"
     //   const branch = req.query.branch
           const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice": req.user.id, status:!status5}).sort({"_id": -1})  
           
           //index = a.filter( x => x.prop2 ==="yutu");

           console.log(req.user.id)
           res.status(200).send(getLoanAssignedToMe)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting loan request "})
       }
};

// approval recommends and add remark
exports.loanOfficerRecommendation= async(req,res)=>{
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
                            console.log(isLoanOngoing) 
                            if(isLoanOngoing.status === "Completed" || isLoanOngoing.status === "Declined" || isLoanOngoing.status === "Ongoing" ){
                                    res.status(400).send({
                                        message:"This loan has either been approved by another loan officer , completed or declined "
                                    });

                            }
                            else{
                                if(isLoanOngoing.loanOfficer === req.user.id){
                                   const _id = req.body.id
                                   const approvalProcess = isLoanOngoing.approvalProcess; 
                                   indexAssingnee = await approvalProcess.findIndex( x => x.userInOffice === req.user.id)

                                   let newApprovalProcess = [] 
                                   approvalProcess[parseInt(indexAssingnee)].status = "Approved" 
                                   approvalProcess[parseInt(indexAssingnee)].remark = remark    
                                      
                                   newApprovalProcess = approvalProcess
                                   console.log( newApprovalProcess)
                              
                                const loanapplication = new LoanOfficerApplication({
                                       _id : req.body.id,
                                       signed: isLoanOngoing.signed,
                                       approvalProcess: newApprovalProcess,
                                       loanType: isLoanOngoing.loanType,
                                       form: isLoanOngoing.form,
                                       branch: isLoanOngoing.branch,
                                       branchId: isLoanOngoing.branchId,
                                       status:   isLoanOngoing.status,
                                       assignedTo  : isLoanOngoing.assignedTo,
                                       loanOfficer: isLoanOngoing.loanOfficer,
                                       customerApplicationId: isLoanOngoing.customerApplicationId,
                                       declinedBy: isLoanOngoing.declinedBy,
                                       approvalProcessId : isLoanOngoing.approvalProcessId,
                                       groupId: isLoanOngoing.groupId
                                    });
                           
                           
                           
                                 const changeApprovalStatus = await LoanOfficerApplication.updateOne( {_id}, loanapplication)
                                   console.log(changeApprovalStatus)    
                                   if(changeApprovalStatus.nModified === 1){
                                    //AssingneeObject = await approvalProcess.find( x => x.userInOffice ===req.user.id);
                                    console.log("indexAssingnee");
                                    console.log(indexAssingnee);
                                    const assignedTo = approvalProcess[ parseInt(indexAssingnee + 1)].userInOffice
                                    const  signed= {"name": req.user.fullName, "remark": remark, "title": "Loan officer", "user_id":req.user.id}  
                                    const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                                    const postNextToAssign = await LoanOfficerApplication.findOneAndUpdate({ _id }, { assignedTo: assignedTo });         
                                   const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Ongoing" });   
                                    
                                    console.log("still in process") 
                                   

                                   res.status(200).send({message:"Recommendation posted  successfully"})
                                   }
                                   else{
                                    res.status(400).send({message:"error while posting recommendation "})
                                }

                            } else{
                                res.status(400).send({message:"This loan was not assigned to you recommendation "})
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
                         console.log(isLoanOngoing) 
                        if(isLoanOngoing.status === "Completed" || isLoanOngoing.status === "Declined" || isLoanOngoing.status === "Initiated"){
                            res.status(400).send({
                                message:"This loan has either been completed, declined or has not been approved by a loan officer "
                            });

                        }
                        else{
                            if(isLoanOngoing.assignedTo === req.user.id){

                            const _id = req.body.id
                                const approvalProcess = isLoanOngoing.approvalProcess;
                                indexAssingnee = await approvalProcess.findIndex( x => x.userInOffice === req.user.id)

                                 const lastItem = approvalProcess.slice(-1)[0];
                                 console.log("lastobject")
                                 console.log(lastItem)
                                if(lastItem.userInOffice === req.user.id){

                                console.log("last")
                                let newApprovalProcess = [] 
                                approvalProcess[parseInt(indexAssingnee)].status = "Approved" 
                                approvalProcess[parseInt(indexAssingnee)].remark = remark    
                                   
                                newApprovalProcess = approvalProcess
                                console.log( newApprovalProcess)
                           
                             const loanapplication = new LoanOfficerApplication({
                                    _id : req.body.id,
                                    signed: isLoanOngoing.signed,
                                    approvalProcess: newApprovalProcess,
                                    loanType: isLoanOngoing.loanType,
                                    form: isLoanOngoing.form,
                                    branch: isLoanOngoing.branch,
                                    branchId: isLoanOngoing.branchId,
                                    status:   isLoanOngoing.status,
                                    assignedTo  : isLoanOngoing.assignedTo,
                                    loanOfficer: isLoanOngoing.loanOfficer,
                                    customerApplicationId: isLoanOngoing.customerApplicationId,
                                    declinedBy: isLoanOngoing.declinedBy,
                                    approvalProcessId : isLoanOngoing.approvalProcessId,
                                    groupId: isLoanOngoing.groupId
                                 });
                        
                        
                        
                              const changeApprovalStatus = await LoanOfficerApplication.updateOne( {_id}, loanapplication)
                                console.log(changeApprovalStatus) 
                                if(changeApprovalStatus.nModified === 1){
                                const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.officeTitle, "user_id":req.user.id}  
                                const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                                const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Completed" });                      
                                res.status(200).send({message:"Recommendation posted  successfully"})
                                } 
                                 else{
                                    res.status(400).send({message:"Error while posting recommendation "})
                                }
                            }else{
                                    
                                        
                                   // indexAssingnee = approvalProcess.find( x => x.userInOffice ===req.user.id);
                                     let newApprovalProcess = [] 
                                     approvalProcess[parseInt(indexAssingnee)].status = "Approved" 
                                     approvalProcess[parseInt(indexAssingnee)].remark = remark    
                                        
                                     newApprovalProcess = approvalProcess
                                     console.log( newApprovalProcess)
                                
                                  const loanapplication = new LoanOfficerApplication({
                                         _id : req.body.id,
                                         signed: isLoanOngoing.signed,
                                         approvalProcess: newApprovalProcess,
                                         loanType: isLoanOngoing.loanType,
                                         form: isLoanOngoing.form,
                                         branch: isLoanOngoing.branch,
                                         branchId: isLoanOngoing.branchId,
                                         status:   isLoanOngoing.status,
                                         assignedTo  : isLoanOngoing.assignedTo,
                                         loanOfficer: isLoanOngoing.loanOfficer,
                                         customerApplicationId: isLoanOngoing.customerApplicationId,
                                         declinedBy: isLoanOngoing.declinedBy,
                                         approvalProcessId : isLoanOngoing.approvalProcessId,
                                         groupId: isLoanOngoing.groupId
                                      });
                             
                             
                             
                                   const changeApprovalStatus = await LoanOfficerApplication.updateOne( {_id}, loanapplication)
                                     console.log(changeApprovalStatus)    
                                     if(changeApprovalStatus.nModified === 1){
                                       const assignedTo = approvalProcess[ parseInt(indexAssingnee + 1)].userInOffice
                                       console.log("still in process")               
                                        const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.officeTitle, "user_id":req.user.id}  
                                        const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                                        const postNextToAssign = await LoanOfficerApplication.findOneAndUpdate({ _id }, { assignedTo: assignedTo });         
                                       
                                        res.status(200).send({message:"Recommendation posted  successfully"})
                                     }else{
                                        res.status(400).send({message:"Error while posting recommendation "})
                                    }
                            }


                        }else{
                            res.status(400).send({message:"You are not the next to sign on this loan "})
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
                            const changeApprovalStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { "approvalProcess.status": "Declined " });
                            const changeRemarkStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { "approvalProcess.remark": remark });
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


//loan officer decline loan

// approval declines  and add remark
exports.loanOfficerDeclineRecommendation= async(req,res)=>{
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
                        if(isLoanOngoing.status === "Completed" || isLoanOngoing.status === "Declined" || "Ongoing"){
                            res.status(400).send({
                                message:"This loan has been completed , declined  or approved"
                            });

                        }
                        else{
                            const _id = req.body.id
                            
                            console.log("declined")
                            const  signed= {"name": req.user.fullName, "remark": remark, "title": "Loan officer", "user_id":req.user.id}  
                            const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                            const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Declined" });         
                            const changeApprovalStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { "approvalProcess.status": "Declined " });
                            const changeRemarkStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { "approvalProcess.remark": remark });
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


// find all loan officer
exports.getLoanById = async (req, res) => {
    try{
        
             const id = req.params.id
         const findLoanById = await LoanOfficerApplication.find({_id: id})
        
         console.log(findLoanById)
         res.status(200).send(findLoanById)
     // }        
        }catch(err){
            console.log(err)
            res.status(500).send({message:"Error while getting loan by id "})
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




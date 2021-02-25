
const db = require("../mongoose");
const CustomerApplication = db.customerapplications;
const LoanOfficerApplication = db.loanofficerapplications;
const ApprovalProcess = db.approvalprocess;
const Groups = db.groups;
const Members = db.profiles;
const sendemail = require('../helpers/emailhelper.js');
const moment  = require('moment')
const uuid = require('uuid')


//Customer loan application
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

//loan officer submit loan or apply newly
exports.loanOfficerApplyLoan = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  form  } = req.body;
  
    // if ( form.branchName && form.firstName && form.lastName && form.nationality && form.address && form.pn  && form.email && form.guarantorName && form.guarantorAddress  && form.guarantorPn &&  form.guarantotBusiness &&  form.guarantorBvn && form.customerOccupation && form.customerOrg  && form.empStatus  && form.customerOfficeAddress && form.customerOrgPn && form.netMonthlyIncome && form.customerCardNo  && form.customerPassword  && form.month  && form.loanAmount && form.loanPurpose && form.loanDescription  && form.tenor  && form.customerAcctNo && form.existingBank  && form.existingType  && form.customerId  ){
    //     if ( form.branchName==="" || form.firstName==="" ||form.lastName==="" || form.nationality ==="" || form.address ==="" ||form.pn ==="" || form.email ==="" || form.guarantorName ==="" || form.guarantorAddress ==="" ||form.guarantorPn==="" || form.guarantotBusiness==="" ||  form.guarantorBvn ==="" || form.customerOccupation ==="" || form.customerOrg ==="" ||form.empStatus  ==="" || form.customerOfficeAddress==="" || form.customerOrgPn ==="" || form.netMonthlyIncome ==="" ||form.customerCardNo  ==="" || form.customerPassword  ==="" || form.month  ==="" || form.loanAmount ==="" || form.loanPurpose ==="" ||form.loanDescription ==="" || form.tenor ==="" ||form.customerAcctNo ==="" || form.existingBank ==="" || form.existingType  ==="" || form.customerId  ==="" ){
        if ( form ){
            if ( form==={} ){
    
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
         const limit = req.query.limit
         const status = req.query.status
         if(status){
           const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice": req.user.id,  status : status}).sort({"_id": -1}) 
           console.log(req.user.id)
           res.status(200).send(getLoanAssignedToMe)
           //index = a.filter( x => x.prop2 ==="yutu");
         }else{
            const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice": req.user.id}).sort({"_id": -1}) 
            console.log(req.user.id)
            res.status(200).send(getLoanAssignedToMe)
         }
           
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting loan request "})
       }
};


//approval recommends and add remark
exports.loanOfficerRecommendation= async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
     console.log(req.body)

    const {  remark , id , imageUrls} = req.body;
  
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
                                    const  signed= {"name": req.user.fullName, "remark": remark, "title": "Loan officer", "user_id":req.user.id ,"imageUrls": imageUrls || ""}  
                                    const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                                    const postNextToAssign = await LoanOfficerApplication.findOneAndUpdate({ _id }, { assignedTo: assignedTo });         
                                    const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Ongoing" });   
                                    const getuser = await Members.findOne({_id: assignedTo} )                                   
                                        const emailFrom = 'astrapay@astrapolaris.com';
                                        const subject = 'Recomendation alert ';                      
                                        const hostUrl = "approval-portal.netlify.app"
                                        const hostUrl2 = "https://approval-portal.netlify.app"    
                                        const   text = 'You are next in line to sign this loan requeast'
                                        const emailTo = getuser.email.toLowerCase()
                                        const link = `${hostUrl}`;
                                        const link2 = `${hostUrl2}`;
                                        const fullName = getuser.fullName

                                     processEmail(emailFrom, emailTo, subject, link, link2, text, fullName);
                                   res.status(200).send({message:"Recommendation posted  successfully"})
                                   }
                                   else{
                                    res.status(400).send({message:"error while posting recommendation "})
                                }

                            } else{
                                res.status(400).send({message:"This loan was not assigned to you. "})
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

//approval recommends and add remark
exports.approvalRecommendation= async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
     console.log(req.body)

    const {  remark , id , imageUrls} = req.body;
  
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
                                const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.officeTitle, "user_id":req.user.id, "imageUrls": imageUrls || ""}  
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
                                        const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.officeTitle, "user_id":req.user.id, "imageUrls": imageUrls || ""}  
                                        const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                                        const postNextToAssign = await LoanOfficerApplication.findOneAndUpdate({ _id }, { assignedTo: assignedTo });         
                                        const getuser = await Members.findOne({_id: assignedTo} )                                   
                                        const emailFrom = 'astrapay@astrapolaris.com';
                                        const subject = 'Recomendation alert ';                      
                                        const hostUrl = "approval-portal.netlify.app"
                                        const hostUrl2 = "https://approval-portal.netlify.app"    
                                        const   text = 'You are next in line to sign this loan requeast'
                                        const emailTo = getuser.email.toLowerCase()
                                        const link = `${hostUrl}`;
                                        const link2 = `${hostUrl2}`;
                                        const fullName = getuser.fullName

                                     processEmail(emailFrom, emailTo, subject, link, link2, text, fullName);
                                        res.status(200).send({message:"Recommendation posted  successfully"})
                                     }else{
                                        res.status(400).send({message:"Error while posting recommendation "})
                                    }
                            }


                        }else{
                            res.status(400).send({message:"You are not the next to sign this loan request "})
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

//approval declines  and add remark
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
                            const approvalProcess = isLoanOngoing.approvalProcess;
                            indexAssingnee = await approvalProcess.findIndex( x => x.userInOffice === req.user.id)
                            if(isLoanOngoing.assignedTo === req.user.id){
                                let newApprovalProcess = [] 
                                approvalProcess[parseInt(indexAssingnee)].status = "Declined" 
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

                            const _id = req.body.id
                            
                            console.log("declined")
                            const  signed= {"name": req.user.fullName, "remark": remark, "title": req.user.officeTitle, "user_id":req.user.id}  
                            const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                            const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Declined" });         
                         
                            res.status(200).send({message:"Loan declined  successfully"})
                            } else{
                                res.status(400).send({message:"Error while declining loan request "})
                            }

                            }else{
                                res.status(400).send({message:"You are not the next to sign this loan request "})
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


//loan officer  declines loan and add remark
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
                        if(isLoanOngoing.status === "Completed" || isLoanOngoing.status === "Declined"){
                            res.status(400).send({
                                message:"This loan has been completed , declined  or approved"
                            });

                        }
                        else{
                            const _id = req.body.id
                            const approvalProcess = isLoanOngoing.approvalProcess;
                            indexAssingnee = await approvalProcess.findIndex( x => x.userInOffice === req.user.id)
                           if(isLoanOngoing.loanOfficer === req.user.id){

                            const _id = req.body.id
                            let newApprovalProcess = [] 
                                   approvalProcess[parseInt(indexAssingnee)].status = "Declined" 
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
                                     
                         if(changeApprovalStatus.nModified === 1){
                            
                            console.log("declined")
                            const  signed= {"name": req.user.fullName, "remark": remark, "title": "Loan officer", "user_id":req.user.id}  
                            const postRecommendation = await LoanOfficerApplication.updateOne({_id: id}, { $addToSet: { signed: [signed] } } ) 
                            const changeStatus = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Declined" });         
                            res.status(200).send({message:"Loan declined  successfully"})
                          }
                        }else{
                            res.status(400).send({message:"This loan was not assigned to you. "})
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


//find  loan by loan id
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

 //approval loan count
 exports.approvalLoanCount = async (req, res) => {
    try{

        const ongoingLoan = await LoanOfficerApplication.countDocuments({"approvalProcess.userInOffice": req.user.id, status: "Ongoing"})
        const completedLoan = await LoanOfficerApplication.countDocuments({"approvalProcess.userInOffice": req.user.id, status: "Completed"})
        const declinedLoan = await LoanOfficerApplication.countDocuments({"approvalProcess.userInOffice": req.user.id, status: "Declined"})
        const disbursedLoan = await LoanOfficerApplication.countDocuments({"approvalProcess.userInOffice": req.user.id, status: "Disbursed"})
        const totalLoan = await LoanOfficerApplication.countDocuments({"approvalProcess.userInOffice": req.user.id})

      
        res.status(200).send(
            {
                ongoingLoan:ongoingLoan,
                completedLoan: completedLoan,
                declinedLoan: declinedLoan,
                totalLoan: totalLoan,
                disbursedLoan: disbursedLoan

            })
     }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while counting users "})
       }
};


//loan officer loan count
exports.LoanOfficerLoanCount = async (req, res) => {
    try{

        const ongoingLoan = await LoanOfficerApplication.countDocuments({loanOfficer: req.user.id, status: "Ongoing"})
        const completedLoan = await LoanOfficerApplication.countDocuments({loanOfficer: req.user.id, status: "Completed"})
        const declinedLoan = await LoanOfficerApplication.countDocuments({loanOfficer: req.user.id, status: "Declined"})
        const disbursedLoan = await LoanOfficerApplication.countDocuments({loanOfficer: req.user.id, status: "Disbursed"})
        const totalLoan = await LoanOfficerApplication.countDocuments({loanOfficer: req.user.id})

      
        res.status(200).send(
            {
                ongoingLoan:ongoingLoan,
                completedLoan: completedLoan,
                declinedLoan: declinedLoan,
                totalLoan: totalLoan,
                disbursedLoan: disbursedLoan

            })
     }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while counting users "})
       }
};




//loan officer gets report
exports.reportLoanOfficer = async (req, res) => {
    try{
     //   const status = "Initiated"
       const disbursed = req.query.disbursed
       const status = req.query.status
       const fromDate = req.query.fromDate
       const toDate = req.query.toDate
       console.log(fromDate)
       console.log(toDate)


       if(disbursed){
         const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status : status, disbursed: disbursed, updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).sort({"_id": -1})  
                console.log("ope")
                res.status(200).send(getLoanAssignedToMe)
            }else{
                const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status : status, updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).sort({"_id": -1})  
          //const query = {, 
                console.log("kotope")
                console.log(req.user.id)
                res.status(200).send(getLoanAssignedToMe)           
            }
           
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting loan request "})
       }
};


//approval gets reports
exports.reportApproval = async (req, res) => {
    try{
     //   const status = "Initiated"
       const disbursed = req.query.disbursed
       const status = req.query.status
       const fromDate = req.query.fromDate
       const toDate = req.query.toDate

       if(disbursed){
         const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice": req.user.id,  status : status, disbursed : disbursed, updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).sort({"_id": -1})  
              
         console.log(req.user.id)
                res.status(200).send(getLoanAssignedToMe)
            }else{
                const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice": req.user.id,  status : status, updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) }  }).sort({"_id": -1})             
                console.log(req.user.id)
                 res.status(200).send(getLoanAssignedToMe)
                
            }
           
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting loan request "})
       }
};


//mark as disbursed
exports.markDisbursed = async (req, res) => {
    try{
        console.log("err")
        const   _id = req.body.id         
    
        const markDisbursed = await LoanOfficerApplication.findOneAndUpdate({ _id }, { status: "Disbursed" });    
        console.log(markDisbursed)      
            if(markDisbursed)      {
            res.status(200).send({message:"Mark as disbursed succesfully"})       
          }else{
            res.status(400).send({message:"Error while marking as disbursed"})   
          }
           
                          
       }catch(err){
        
           console.log(err)
           res.status(500).send({message:"Error while marking as disbursed"})
       }
  };



// graph data for approval
exports.graphReportApproval = async (req, res) => {
    try{
     //   const status = "Initiated"
       const dateType = req.query.time
      
       if(dateType === "today"){
        fromDate = moment().startOf('day').format('YYYY-MM-DD 00:00:01');
        toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
         const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice":req.user.id, status: "Disbursed", updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').sort({"_id": -1})  
                console.log("today")
                res.status(200).send(getLoanAssignedToMe)
            }else if(dateType === "week"){
                console.log("week")
                fromDate = moment().startOf('week').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice":req.user.id, status: "Disbursed", updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})  
    
                res.status(200).send(getLoanAssignedToMe)           
             }else if(dateType === "month"){
                console.log("month")
                fromDate = moment().startOf('month').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice":req.user.id, status: "Disbursed",  updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})  
 
                res.status(200).send(getLoanAssignedToMe)           
            }else if(dateType === "year"){
                console.log("year")
                fromDate = moment().startOf('year').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('year').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice":req.user.id, status: "Disbursed", updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})  
      
                res.status(200).send(getLoanAssignedToMe)           
            }else{
                fromDate = moment().startOf('day').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({"approvalProcess.userInOffice":req.user.id, status: "Disbursed",  updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})        
                res.status(200).send(getLoanAssignedToMe)
            }
           
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting loan request "})
       }
};


// graph date for loan officer
exports.graphReportLoanOfficer = async (req, res) => {
    try{
     //   const status = "Initiated"
       const dateType = req.query.time
      
       if(dateType === "today"){
        fromDate = moment().startOf('day').format('YYYY-MM-DD 00:00:01');
        toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
         const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status: "Disbursed", updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').sort({"_id": -1})  
                console.log("today")
                res.status(200).send(getLoanAssignedToMe)
            }else if(dateType === "week"){
                console.log("week")
                fromDate = moment().startOf('week').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status: "Disbursed", updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})  
    
                res.status(200).send(getLoanAssignedToMe)           
             }else if(dateType === "month"){
                console.log("month")
                fromDate = moment().startOf('month').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('month').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status: "Disbursed",  updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})  
 
                res.status(200).send(getLoanAssignedToMe)           
            }else if(dateType === "year"){
                console.log("year")
                fromDate = moment().startOf('year').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('year').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status: "Disbursed", updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})  
      
                res.status(200).send(getLoanAssignedToMe)           
            }else{
                fromDate = moment().startOf('day').format('YYYY-MM-DD 00:00:01');
                toDate = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss');
                const getLoanAssignedToMe = await LoanOfficerApplication.find({loanOfficer:req.user.id, status: "Disbursed",  updatedAt:{ $gte: new Date(new Date(fromDate).setHours(00, 00, 00)), $lte: new Date(new Date(toDate).setHours(23, 59, 59)) } }).select('form.loanAmount -_id').select(' updatedAt -_id').sort({"_id": -1})        
                res.status(200).send(getLoanAssignedToMe)
            }
           
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting loan request "})
       }
};


// get loan details by phone number
exports.getLoanDetails = async (req, res) => {
    try{
        
             const phoneNumber = req.params.phoneNumber;
             const loanType = req.query.loanType;
             const lim = 1
             const findLoanByPhoneNumber = await LoanOfficerApplication.find({"form.phone": phoneNumber, loanType:loanType}).sort({"_id": -1}).limit(lim)
        
            console.log(findLoanByPhoneNumber)
            res.status(200).send(findLoanByPhoneNumber)
           
        }catch(err){
            console.log(err)
            res.status(500).send({message:"Error while getting loan by phone number "})
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




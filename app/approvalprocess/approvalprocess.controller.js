
const db = require("../mongoose");
const ApprovalProcess = db.approvalprocess;
const Groups = db.groups;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')

// create loan type
exports.createLoanType = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  loanTypeDescription, loanType, groupId } = req.body;
  
    if ( groupId && loanType ){
        // if ( approvalProcess.length < 8  ){
            if (groupId === "" || loanType=== "" ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const loanType = new ApprovalProcess({
                loanTypeDescription: req.body.loanTypeDescription,
                groupId: req.body.groupId,
                loanType: req.body.loanType
                
              });
        
            try{     
               
                
                
                const saveApprovalProcess = await  loanType.save()
                console.log(saveApprovalProcess)   

                if( saveApprovalProcess._id){
              const  id = req.body.groupId
             const updateGroup = await Groups.updateOne({_id: id}, { $addToSet: { loanTypes: [saveApprovalProcess._id] } } ) 

             console.log(updateGroup) 
                   
                   res.status(201).send({message:"loan type created"})
                  
                   }else{
                       res.status(400).send({message:"Error while creating loan type "})
                   }
                           
                
                       
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating loan type "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}
// Create approval process

exports.createApprovalProcess = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  approvalProcess , loanTypeId} = req.body;
  
    if ( approvalProcess && loanTypeId ){
        
            if ( approvalProcess.length < 0  || loanTypeId === ""  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
           
        
            try{     

               
                    const _id = req.body.loanTypeId
                    const updateApprovalProcess = await ApprovalProcess.findOneAndUpdate({ _id}, { approvalProcess: approvalProcess });
                    console.log(updateApprovalProcess)
                   
                   res.status(201).send({message:"approval process  created"})
                  
                           
                
                       
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating approval process "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}





// Find approval process
exports.findApprovalProcess = async (req, res) => {
    try{
           const findApprovalProcess = await ApprovalProcess.find().sort({"_id": -1})  
          // console.log(findApprovalProcess)
           res.status(200).send(findApprovalProcess)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting approval process "})
       }
};

//update approval process
exports.updateApprovalProcess = async(req, res) => {
    const _id = req.params.id;
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  approvalProcess  } = req.body;
  
    if ( approvalProcess ){
        if ( approvalProcess.length < 0  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{
           
                  
        const approvalProcess = new ApprovalProcess({
            _id : req.params.id,
            approvalProcess: req.body.approvalProcess
            
          });
    
    
        
            try{
                const updateapprovalProcess = await ApprovalProcess.updateOne( {_id}, approvalProcess)
                   console.log(updateapprovalProcess)                       
                   if( updateapprovalProcess){
                    const _id = req.body.approvalProcess[0].userInOffice
                    const updateLoanOfficer = await Members.findOneAndUpdate({ _id}, { isApprovalProcess: true });
                    console.log(updateLoanOfficer) 
                      res.status(200).send({message:"Approval process updated successfully"})
                  
                   }else{
                       res.status(400).send({message:"Error while updating approval process "})
                   }
                    
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while updating Approval process  "})
            }
          
          
   
          
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
     

    

                   
};

// delete aproval process
exports.deleteApprovalProcess = async (req, res) => {
    try{
        const id = req.params.id;
        const deletapprovalprocess= await ApprovalProcess.findByIdAndRemove(id)
        console.log(deletapprovalprocess)
        res.status(200).send({message:"Deleted succesfully"})
         
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while deleting approval process "})
       }
}


// delete aproval process
exports.deleteLoanType = async (req, res) => {
    try{
        const groupId = req.body.groupId
        const _id = req.params.id;
        const removeIdFromGroup= await Groups.updateOne({_id: groupId},{ $pull: { loanTypes: [_id] }  }, { safe: true, upsert: true })
        console.log("yes")
        console.log(removeIdFromGroup)
        if(removeIdFromGroup){
       //     const deleteloantype= await ApprovalProcess.findByIdAndRemove(id)
            console.log("yyy")
          //   console.log(deleteloantype)
        
              res.status(200).send({message:"Deleted succesfully"})
         }else{
            res.status(500).send({message:"Error while deleting loan type "})
         }
        
         
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while deleting approval process "})
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




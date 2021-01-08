
const db = require("../mongoose");
const ApprovalProcess = db.approvalprocess;
const Members = db.profiles;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create approval process

exports.createApprovalProcess = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  approvalProcess  } = req.body;
  
    if ( approvalProcess ){
        // if ( approvalProcess.length < 8  ){
            if ( approvalProcess.length < 0 ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const approvalProcess = new ApprovalProcess({
                approvalProcess: req.body.approvalProcess,
                loanOfficer: req.body.approvalProcess[0].userInOffice
                
              });
        
            try{     
                const isLoanOfficerExist = await ApprovalProcess.findOne({loanOfficer: req.body.approvalProcess[0].userInOffice} ) 
                
                if( isLoanOfficerExist){
                    res.status(400).send({message:" Loan officer already has an approval process"})

                }
                else{
                const saveApprovalProcess = await  approvalProcess.save()
                console.log(saveApprovalProcess)   

                if( saveApprovalProcess._id){
                    const _id = req.body.approvalProcess[0].userInOffice
                    const updateLoanOfficer = await Members.findOneAndUpdate({ _id}, { isApprovalProcess: true });
                    console.log(updateLoanOfficer)
                   
                   res.status(201).send({message:"approval process  created"})
                  
                   }else{
                       res.status(400).send({message:"Error while creating approval process "})
                   }
                           
                
                }         
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




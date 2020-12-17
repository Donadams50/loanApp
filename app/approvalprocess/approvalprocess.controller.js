
const db = require("../mongoose");
const ApprovalProcess = db.approvalprocess;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create approval process

exports.createApprovalProcess = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {   branchId, branch } = req.body;
  
    if ( branchId && branch ){
        if ( branchId==="" || branch===""  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const branches = new Branches({
                branchId: req.body.branchId,
                branch: req.body.branch
                
              });
        
            try{     
                     const isBranchIdExist = await Branches.findOne({branchId: branchId} )
                     const isBranchNameExist = await Branches.findOne({branch: branch} )
                    
                        if(isBranchIdExist || isBranchNameExist){
                            res.status(400).send({message:" branch id / branch name already exists"})

                        }
                        else{

                        
                                const savebranch = await  branches.save()
                            console.log(savebranch)                
                            res.status(201).send({message:"Branch  created"})
                           }
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


exports.createRole = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
    const {   roleId, role } = req.body;
  
    if ( roleId && role ){
        if ( roleId==="" || role===""  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const roles = new Roles({
                roleId: req.body.roleId,
                role: req.body.role
                
              });
    

         
            try{   
                const isRoleIdExist = await Roles.findOne({roleId: roleId} )
                     const isRoleNameExist = await Roles.findOne({role: role} )
                    
                        if(isRoleIdExist || isRoleNameExist){
                            res.status(400).send({message:" role_id/ role_name already exists"})

                        }else{   
                          const saverole = await  roles.save()
                          console.log(saverole)                
                          res.status(201).send({message:"Role created"})
                        }
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating role "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}


// Find all members
exports.findAllRoles = async (req, res) => {
    try{
           const findAllRoles = await Roles.find().sort({"_id": -1})  
           console.log(findAllRoles)
           res.status(200).send(findAllRoles)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting all roles "})
       }
};


// find member by the id in the request
exports.findAllBranches= async (req, res) => {
   
    try{
        const findAllBranches = await Branches.find().sort({"_id": -1})  
        console.log(findAllBranches)
        res.status(200).send(findAllBranches)
           
    }catch(err){
        console.log(err)
        res.status(500).send({message:"Error while getting all branches "})
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





const db = require("../mongoose");
const Branches = db.branches;
const Roles = db.roles;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create a new branch

exports.createBranch = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)
  // let {myrefCode} = req.query;
    const {   branchId, branch, branchAddress, branchPhoneNo } = req.body;
  
    if ( branchId && branch && branchPhoneNo && branchAddress){
        if ( branchId==="" || branch==="" || branchAddress==="" ||  branchPhoneNo ==="" ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const branches = new Branches({
                branchId: req.body.branchId,
                branch: req.body.branch,
                branchPhoneNo:req.body.branchPhoneNo,
                branchAddress: req.body.branchAddress

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


// Create a new role
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


// Find all roles
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


// find all branches
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


function getCode(){
    var numbers = "0123456789";

    var chars= "abcdefghijklmnopqrstuvwxyz";
  
    var code_length = 6;
    var number_count = 3;
    var letter_count = 3;
  
    var code = '';
  
    for(var i=0; i < code_length; i++) {
       var letterOrNumber = Math.floor(Math.random() * 2);
       if((letterOrNumber == 0 || number_count == 0) && letter_count > 0) {
          letter_count--;
          var rnum = Math.floor(Math.random() * chars.length);
          code += chars[rnum];
       }
       else {
          number_count--;
          var rnum2 = Math.floor(Math.random() * numbers.length);
          code += numbers[rnum2];
       }
    }
return code
}

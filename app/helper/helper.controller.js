
const db = require("../mongoose");
const Branches = db.branches;
const Roles = db.roles;
const Loantype = db.loantypes
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create a new branch

exports.createBranch = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
    const {    branch, branchAddress, branchPhoneNo } = req.body;
  
    if (  branch && branchPhoneNo && branchAddress){
        if (  branch==="" || branchAddress==="" ||  branchPhoneNo ==="" ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const branches = new Branches({
                
                branch: req.body.branch,
                branchPhoneNo:req.body.branchPhoneNo,
                branchAddress: req.body.branchAddress

                    });
        
            try{     
                    
                     const isBranchNameExist = await Branches.findOne({branch: branch} )
                    
                        if( isBranchNameExist){
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

// count of branch

exports.countBranch = async (req, res) => {
    try{

        const countBranch = await Branches.countDocuments()
        console.log(countBranch)
        res.status(200).send({countBranch:countBranch})
     }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while counting branch "})
       }
};


//update branch
exports.updateBranch= async(req, res) => {
    const _id = req.params.id;
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
      console.log(req.body)

    const {   branch, branchAddress, branchPhoneNo } = req.body;

    if (  branch && branchPhoneNo && branchAddress  ){
        if ( branch==="" || branchAddress==="" ||  branchPhoneNo ===""){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{
           
            const branch = new Branches({
                _id : req.params.id,
                branch: req.body.branch,
                branchPhoneNo:req.body.branchPhoneNo,
                branchAddress: req.body.branchAddress      
              });
    
    
         
            try{
                const updateBranch = await Branches.updateOne( {_id}, branch)
                    console.log(updateBranch)                       
                     res.status(200).send({message:"Branch updated  succesfully"})
                
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while updating branch"})
            }
          
          
   
          
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
     

    

                   
};

// delete branch
exports.deleteBranch = async (req, res) => {
    try{
        const id = req.params.id;
        const deleteBranch= await Branches.findByIdAndRemove(id)
        console.log(deleteBranch)
        res.status(200).send({message:"Deleted succesfully"})
         
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while deleting branch "})
       }
}


// Create a new loantype
exports.createLoantype = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
    const {   loantype } = req.body;
  
    if ( loantype ){
        if ( loantype===""   ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{          
            const loantype = new Loantype({
                loantype: req.body.loantype,            
              });
    

         
            try{   
               
                     const isLoanTypeExist = await Roles.findOne({loantype: loantype} )
                    
                        if(isLoanTypeExist){
                            res.status(400).send({message:"Loan type already exists"})

                        }else{   
                          const saveloantype = await  loantype.save()
                          console.log(saveloantype) 
                          if(saveloantype){                                          
                              res.status(201).send({message:"Laon type created"})
                         }else{
                            res.status(400).send({message:"error while saving loan type"})
                         }
                         
                        }
            }catch(err){
                console.log(err)
                res.status(500).send({message:"error while saving loan type "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}


// Find all loan type
exports.findAllLoantype = async (req, res) => {
    try{
           const findAllLoantype = await Loantype.find().sort({"_id": -1})  
           console.log(findAllLoantype)
           if ( findAllLoantype  ){
                res.status(200).send(findAllLoantype)
             }else{  

                res.status(400).send({message:"Error while getting all loantypes "})
               }
           
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting all loantypes "})
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

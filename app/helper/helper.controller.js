
const db = require("../mongoose");
const Branches = db.branches;
const Roles = db.roles;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create and Save a new User

exports.createBranch = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)
  // let {myrefCode} = req.query;
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
                const isRoleIdExist = await Branches.findOne({roleId: roleId} )
                     const isRoleNameExist = await Branches.findOne({role: role} )
                    
                        if(isRoleIdExist || isRoleNameExist){
                            res.status(400).send({message:" branch id / branch name already exists"})

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
        const{ limit}= req.query
        console.log(limit)
      const  lim = parseInt(limit)
      console.log(lim)
        if(limit){
        const findAllMembers = await Members.find({isAdmin:false}).sort({"_id": -1}).limit(lim)
        console.log(findAllMembers)
        res.status(200).send(findAllMembers)
         }else{
           const findAllMembers = await Members.find({isAdmin:false}).sort({"_id": -1})  
           console.log(findAllMembers)
        res.status(200).send(findAllMembers)
         }
        
         
                  
           
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting all users "})
       }
};


// find member by the id in the request
exports.findAllBranches= async (req, res) => {
   try{
       
            let id = req.params.id
        const findMemberById = await Members.find({id: id})
       
        console.log(findMemberById)
        res.status(200).send(findMemberById)
    // }        
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting member "})
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


const db = require("../mongoose");
const Members = db.profiles;
const Auths = db.auths;
const Offices = db.offices;
const passwordUtils =require('../helpers/passwordUtils');
const jwtTokenUtils = require('../helpers/jwtTokenUtils.js');
const sendemail = require('../helpers/emailhelper.js');

const { signToken } = jwtTokenUtils;
const uuid = require('uuid')


// Create and Save a new User

exports.create = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)
  const passwordGenerated =  getCode();
    const {   fullName,  role, roleId,  branch , branchId, officeTitle, officeId, email  } = req.body;
  
    if ( fullName && passwordGenerated  && role && roleId && email && branch && branchId ){
        if ( fullName==="" ||  passwordGenerated==="" || role==="" || roleId===""  || email==="" || branch===  "" || branchId===""  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{

            
            
            const members = new Members({
                fullName: req.body.fullName,
                role: req.body.role,
                roleId: req.body.roleId,
                branch:req.body.branch || '',
                branchId: req.body.branchId || '',
                email: req.body.email,
                officeTitle: req.body.officeTitle || '',
                officeId: req.body.officeId || '',
                groupId: req.body.groupId || '',
                forgotPasswordCode: ''
                
              });
              const auths = new Auths({
                email: req.body.email               
              });

         
            try{
              const isUserExist = await Members.findOne({email: email} )
              console.log(isUserExist)
               if(isUserExist){
                res.status(400).send({message:" Email already exists"})
               }else{
                auths.password = await passwordUtils.hashPassword(passwordGenerated.toLowerCase());
                 const emailFrom = 'astrapay@astrapolaris.com';
                const subject = 'Password notification';                      
                const hostUrl = "loan-admin.netlify.app"
                const hostUrl2 = "https://loan-admin.netlify.app" 
                   const fullName = req.body.fullName
                    const password = passwordGenerated
                  const   text = 'Welcome, Your password to login to astrapolaris loan app is shown below Password:'+password+''
                 const emailTo = req.body.email.toLowerCase();
                 const link = `${hostUrl}`;
                 const link2 = `${hostUrl2}`;
                  processEmail(emailFrom, emailTo, subject, link, link2, text, fullName);
                  const saveauth = await  auths.save()
                   console.log(saveauth)
                  if(saveauth._id){
                 const savemember = await  members.save()
                   console.log(savemember)
                   if( savemember._id){
                   if( req.body.roleId === 5){
                       const _id = req.body.officeId 
                       console.log("five")
                            const assignOffice = await Offices.findOneAndUpdate({ _id}, { userInOffice: savemember._id, userNameInOffice:req.body.fullName });
                            const markTrueAssignOffice = await Offices.findOneAndUpdate({ _id }, { isAssigned: true });
                            console.log(assignOffice) 
                            console.log(markTrueAssignOffice) 
                            res.status(201).send({message:"User  created"})
                   }else{
                    console.log("others")
                    res.status(201).send({message:"User  created"})
                   }
                }else{
                    res.status(400).send({message:"Error while creating profile "})
                }
             }
            
          }
                 
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating profile "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}

// Login user
exports.signIn = async(req, res) => {
  if (!req.body){
    res.status(400).send({message:"Content cannot be empty"});
}
console.log(req.body)
// let {myrefCode} = req.query;
const {   email, password  } = req.body;

if ( email && password ){
    if ( email==="" || password==="" ){
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }else{
        
        
        const members = new Members({
            email: req.body.email,
            password: req.body.password
            
          });

     
        try{
            const User = await Members.findOne({email: email} )
             const Auth = await Auths.findOne({email: email} )
               
           if(User){
            const retrievedPassword = Auth.password
            const id = User._id;
         const {  fullName,  role, roleId, branch, branchId, officeTitle , email, officeId, groupId} = User
            const isMatch = await passwordUtils.comparePassword(password.toLowerCase(), retrievedPassword);
            console.log(isMatch )
             if (isMatch){
              const tokens = signToken( id, fullName,  role, roleId, branch, branchId,  officeTitle, email ,officeId, groupId) 
        
            let user = {}
             
                  user.profile = { id,fullName,  role, roleId, branch, branchId,  officeTitle, email, officeId, groupId} 
                  user.token = tokens;                
                  res.status(200).send(user)                         
          }else{
              res.status(400).json({message:"Incorrect Login Details"})
          }
    
    
           }else{
            res.status(400).send({message:" User does not exists"})
      }
                   
            
        }catch(err){
            console.log(err)
            res.status(500).send({message:"Error while signing in "})
        }
    }
}else{
    res.status(400).send({
        message:"Incorrect entry format"
    });
}
};

// Find all members
exports.findAllMembers = async (req, res) => {
    try{
        
        const{ limit}= req.query
        console.log(limit)
      const  lim = parseInt(limit)
      console.log(lim)
        if(limit){
            const findAllMembers = await Members.find().sort({"_id": -1}).limit(lim)
        console.log(findAllMembers)
        res.status(200).send(findAllMembers)
         }else{
            const findAllMembers = await Members.find().sort({"_id": -1})    
           console.log(findAllMembers)
        res.status(200).send(findAllMembers)
         }
        
         
        //    const findAllMembers = await Members.find().sort({"_id": -1})  
        //    console.log(findAllMembers)
        //     res.status(200).send(findAllMembers)  
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting all users "})
       }
};

// find member by the id 
exports.findMembeById = async (req, res) => {
   try{
       
            let id = req.params.id
        const findMemberById = await Members.findOne({id: id})
       
        res.status(200).send(findMemberById)
           
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting member "})
       }

};

// Update members details
 
 exports.updateMember = async(req, res) => {
    const _id = req.params.id;
    console.log(req.body)

    const {   fullName, password , role, roleId, username, officeTitleBranch} = req.body;
  
    if ( fullName && password  && role && roleId&& username&& officeTitleBranch){
        if ( fullName==="" || password==="" || role==="" || roleId==="" || username==="" || officeTitleBranch===""  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{
           
                  
            const member = new Members({
                _id : req.params.id,
                fullName: req.body.fullName,
                role: req.body.role,
                roleId: req.body.roleId,
                username:req.body.username,
                branch:req.body.branch || '',
                branchId: req.body.branchId || '',
                officeTitleBranch:req.body.officeTitleBranch,
                forgotPasswordCode: req.body.forgotPasswordCode
              });
             
    
         
            try{
                const updateProfile = await Members.updateOne( {_id}, member)
                   //  console.log(updateProfile)                       
                 res.status(201).send({message:"Profile updated  succesfully"})
                
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while updating profile "})
            }
          
          
   
          
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
                   
};


// delete a user
exports.deleteMember = async (req, res) => {
    try{
        const id = req.params.id;
        const deletemember = await Members.findByIdAndRemove(id)
        console.log(deletemember)
        res.status(200).send({message:"Deleted succesfully"})
         
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while deleting member "})
       }
}



// find all loan officer
exports.findLoanOfficer = async (req, res) => {
    try{
        
             const id = req.params.id
         const findLoanOfficer = await Members.find({roleId: id})
        
         console.log(findLoanOfficer)
         res.status(200).send(findLoanOfficer)
     // }        
        }catch(err){
            console.log(err)
            res.status(500).send({message:"Error while getting all loan officer "})
        }
 
 };

 // find unassigned loan officer
exports.findUnasignedLoan = async (req, res) => {
    try{
        
             const id = req.params.id
             const isApprovalProcess = false
             const findUnasignedLoan = await Members.find({roleId: id , isApprovalProcess: isApprovalProcess})
        
              console.log(findUnasignedLoan)
             res.status(200).send(findUnasignedLoan)
     // }        
        }catch(err){
            console.log(err)
            res.status(500).send({message:"Error while getting member "})
        }
 
 };

// count all user
 exports.countUsers = async (req, res) => {
    try{

        const countUsers = await Members.countDocuments()
        console.log(countUsers)
        res.status(200).send({countUsers:countUsers})
     }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while counting users "})
       }
};




// admin forget password
exports.forgotPassword = async(req,res)=>{
        if (!req.body){
            res.status(400).send({message:"Content cannot be empty"});
        }
    console.log(req.body)
      // let {myrefCode} = req.query;
        const {   email } = req.body;
      
        if ( email   ){
            if ( email===""   ){
                res.status(400).send({
                    message:"Incorrect entry format"
                });
            }else{
                
                
    
             
                try{
                  const isUserExist = await Members.findOne({email: email} )
                  const isUserExist2 = await Auths.findOne({email: email} )
                    if(isUserExist && isUserExist2){
                    const code = uuid.v1()
                                
                    //const email = req.body.email.toLowerCase();
                    const _id = isUserExist._id;
                    const saveCode = await Members.findOneAndUpdate({ _id }, { forgotPasswordCode: code });
                    console.log(saveCode)
                    if(isUserExist && isUserExist2){
                    const username = isUserExist.fullName;
                    const emailFrom = 'astrapay@astrapolaris.com';
                    const subject = 'Reset password link';                      
                    const hostUrl = 'loan-admin.netlify.app/changepassword?code='+code+'' 
                    const hostUrl2 = 'https://loan-admin.netlify.app/changepassword?code='+code+''    
                    const   text = "Your password reset link is shown below. Click on the reset button to change your password"
                    const emailTo = req.body.email.toLowerCase();
                    const link = `${hostUrl}`;
                    const link2 = `${hostUrl2}`;
                     processEmailForgotPassword(emailFrom, emailTo, subject, link, link2, text, username);
                      
                      res.status(201).send({message:"Reset link sent succesfully"})

                    }else{
                        res.status(400).send({message:"Error while resetting password"})
                    }
                                     
                   }
                    else{
 


                         res.status(400).send({message:"User does not exist"})

              }
                           
                    
                }catch(err){
                    console.log(err)
                    res.status(500).send({message:"Error while resetting password   "})
                }
            }
        }else{
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }
}

   
// admin reset password
 exports.resetPassword = async(req,res)=>{
        if (!req.body){
            res.status(400).send({message:"Content cannot be empty"});
        }
    console.log(req.body)
      // let {myrefCode} = req.query;
        const { password, code} = req.body;
      
        if (   password && code ){
            if ( password === " " || code === " "  ){
                res.status(400).send({
                    message:"One of the entry is empty"
                });
            }else{
                
                
    
             
                try{
                  
                  const getuser = await Members.findOne({forgotPasswordCode: req.body.code} )
                  
                  if(getuser){
                    console.log(getuser)
                  const temporaryPassword = req.body.password
                   
                    const newpassword = await passwordUtils.hashPassword(temporaryPassword);
                    console.log(newpassword)
                    
                    const getAuth = await Auths.findOne({email: getuser.email} )
                   // const getAuth = await Auths.findOne({email: getuser.email} )
                   
                    
                    const _id =  getAuth._id
                    const newForgotPasswordCode = ""
                    const updatePassword = await Auths.findOneAndUpdate({ _id}, { password: newpassword });
                    if(updatePassword){
                    const _id =   getuser._id 
                    const updateCode = await Members.findOneAndUpdate({_id}, { forgotPasswordCode: newForgotPasswordCode  });
                    console.log(updatePassword)
                    console.log(updateCode)
                    
 
                    const emailFrom = 'astrapay@astrapolaris.com';
                    const subject = 'Reset Password Succesful ';                      
                    const hostUrl = "loan-admin.netlify.app"
                     const hostUrl2 = "https://loan-admin.netlify.app"    
                    const   text = 'Your password has been changed succesfully'
                    const emailTo = getuser.email.toLowerCase()
                    const link = `${hostUrl}`;
                    const link2 = `${hostUrl2}`;
                    const fullName = getuser.fullName
                     processEmail(emailFrom, emailTo, subject, link, link2, text, fullName);
                      
                    res.status(200).send({message:"Password reset was succesfull"})
                    }            
                 
                }  else{
                    res.status(400).send({
                        message:"This link you selected has already been used. "
                    });
                } 
                    
                }catch(err){
                    console.log(err)
                    res.status(500).send({message:"Error while creating profile "})
                }
            }
        }else{
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }
 }

 // admin forget password
exports.approvalForgotPassword = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)
  // let {myrefCode} = req.query;
    const {   email } = req.body;
  
    if ( email   ){
        if ( email===""   ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{
            
            

         
            try{
              const isUserExist = await Members.findOne({email: email} )
              const isUserExist2 = await Auths.findOne({email: email} )
                if(isUserExist && isUserExist2){
                const code = uuid.v1()
                            
                //const email = req.body.email.toLowerCase();
                const _id = isUserExist._id;
                const saveCode = await Members.findOneAndUpdate({ _id }, { forgotPasswordCode: code });
                console.log(saveCode)
                if(isUserExist && isUserExist2){
                const username = isUserExist.fullName;
                const emailFrom = 'astrapay@astrapolaris.com';
                const subject = 'Reset password link';                      
                const hostUrl = 'approval-portal.netlify.app/resetpassword?code='+code+'' 
                const hostUrl2 = 'https://approval-portal.netlify.app/resetpassword?code='+code+''    
                const   text = "Your password reset link is shown below. Click on the reset button to change your password"
                const emailTo = req.body.email.toLowerCase();
                const link = `${hostUrl}`;
                const link2 = `${hostUrl2}`;
                 processEmailForgotPassword(emailFrom, emailTo, subject, link, link2, text, username);
                  
                  res.status(201).send({message:"Reset link sent succesfully"})

                }else{
                    res.status(400).send({message:"Error while resetting password"})
                }
                                 
               }
                else{



                     res.status(400).send({message:"User does not exist"})

          }
                       
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while resetting password   "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}

// admin reset password
exports.approvalResetPassword = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)
  // let {myrefCode} = req.query;
    const { password, code} = req.body;
  
    if (   password && code ){
        if ( password === " " || code === " "  ){
            res.status(400).send({
                message:"One of the entry is empty"
            });
        }else{
            
            

         
            try{
              
              const getuser = await Members.findOne({forgotPasswordCode: req.body.code} )
              
              if(getuser){
                console.log(getuser)
              const temporaryPassword = req.body.password
               
                const newpassword = await passwordUtils.hashPassword(temporaryPassword);
                console.log(newpassword)
                
                const getAuth = await Auths.findOne({email: getuser.email} )
               // const getAuth = await Auths.findOne({email: getuser.email} )
               
                
                const _id =  getAuth._id
                const newForgotPasswordCode = ""
                const updatePassword = await Auths.findOneAndUpdate({ _id}, { password: newpassword });
                if(updatePassword){
                const _id =   getuser._id 
                const updateCode = await Members.findOneAndUpdate({_id}, { forgotPasswordCode: newForgotPasswordCode  });
                console.log(updatePassword)
                console.log(updateCode)
                

                const emailFrom = 'astrapay@astrapolaris.com';
                const subject = 'Reset Password Succesful ';                      
                const hostUrl = "approval-portal.netlify.app"
                 const hostUrl2 = "https://approval-portal.netlify.app"    
                const   text = 'Your password has been changed succesfully'
                const emailTo = getuser.email.toLowerCase()
                const link = `${hostUrl}`;
                const link2 = `${hostUrl2}`;
                const fullName = getuser.fullName
                 processEmail(emailFrom, emailTo, subject, link, link2, text, fullName);
                  
                res.status(200).send({message:"Password reset was succesfull"})
                }            
             
            }  else{
                res.status(400).send({
                    message:"This link you selected has already been used. "
                });
            } 
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating profile "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}

// user change password
exports.changePassword = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)
  // let {myrefCode} = req.query;
    const { oldPassword, newPassword} = req.body;
  
    if ( oldPassword && newPassword  ){
        if ( newPassword==="" || oldPassword===""  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{
                    
            try{
                const email = req.user.email
                console.log(req.user.email)
            //   const isUserExist = await Members.findOne({email: req.user.email} )
              const getpassword = await Auths.findOne({email: email} )
              const retrievedPassword = getpassword.password
              const isMatch = await passwordUtils.comparePassword(oldPassword.toLowerCase(), retrievedPassword);
              console.log(isMatch )
               if (isMatch){ 
                const newpassword = await passwordUtils.hashPassword(req.body.newPassword.toLowerCase());
                console.log("newpassword")
                console.log(newpassword) 
                console.log(getpassword._id)              
                //const email = req.body.email.toLowerCase();
                const _id  = getpassword._id
                const updatePassword = await Auths.findOneAndUpdate({ _id }, { password: newpassword });
                console.log(updatePassword)

                
                  
                res.status(200).send({message:"Password changed succesfully"})
                                 
             
               }else{
                res.status(400).send({message:"Incorrect old password "})
               }        
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating profile "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}


// process email one
async function processEmail(emailFrom, emailTo, subject, link, link2, text, fullName){
  try{
      //create org details
      // await delay();
     const sendmail =  await sendemail.emailUtility(emailFrom, emailTo, subject, link, link2, text, fullName);
   //  console.log(sendmail)
      return sendmail
  }catch(err){
      console.log(err)
      return err
  }

}


// process email forgot password
async function processEmailForgotPassword(emailFrom, emailTo, subject, link, link2, text, username){
    try{
        //create org details
        // await delay();
       const sendmail =  await sendemail.emaiforgotPassword(emailFrom, emailTo, subject, link, link2, text, username);
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

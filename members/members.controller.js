
const db = require("../mongoose");
const Members = db.profiles;
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
  // let {myrefCode} = req.query;
    const {   email, password , firstName, lastName, phoneNo, username } = req.body;
  
    if ( email && password  && lastName && firstName, phoneNo ){
        if ( email==="" || password==="" || firstName==="" || lastName==="" || phoneNo===""  ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{
            
            
            const members = new Members({
                email: req.body.email.toLowerCase(),
                firstName: req.body.firstName ,
                lastName: req.body.lastName,
                phoneNo: req.body.phoneNo,
                isAdmin: false,
                username: req.body.username,
                imgUrl: " "
                
              });
              const auths = new Auths({
                email: req.body.email.toLowerCase(),
                
                
              });

         
            try{
              const isUserExist = await Members.findOne({email: email} )
              console.log(isUserExist)
               if(isUserExist){
                res.status(400).send({message:" Email already exists"})
               }else{
                auths.password = await passwordUtils.hashPassword(req.body.password.toLowerCase());
                const emailFrom = 'Ahiajara Skin care    <noreply@Ahiajara.com>';
                const subject = 'Succesful Registration link';                      
               const hostUrl = "ahiajara.netlify.app/dashboard"
                 const hostUrl2 = "https://ahiajara.netlify.app/dashboard" 
              
              
            const   text = "We're excited to have you get started. Your Registration to Ahiajara skin care  was successful."
                const emailTo = req.body.email.toLowerCase();
             const link = `${hostUrl}`;
                 const link2 = `${hostUrl2}`;
                 processEmail(emailFrom, emailTo, subject, link, link2, text, firstName);
                 const saveauth = await  auths.save()
                  console.log(saveauth)
                  if(saveauth._id){
                 const savemember = await  members.save()
                   console.log(savemember)
                   }
            res.status(201).send({message:"User  created"})
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

// Retrieve all Tutorials from the database.
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
            email: req.body.email.toLowerCase(),
            password: req.body.password
            
          });

     
        try{
         const User = await Members.findOne({email: email} )
         const Auth = await Auths.findOne({email: email} )
         console.log(User)
           if(User){
            const retrievedPassword = Auth.password
            const id = User._id;
         const {  firstName, lastName, username, isAdmin, phoneNo, createdAt, updatedAt, isVerified, email, imgUrl } = User
            const isMatch = await passwordUtils.comparePassword(password.toLowerCase(), retrievedPassword);
            console.log(isMatch )
             if (isMatch){
              const tokens = signToken( id, firstName, lastName, username, isAdmin, phoneNo, createdAt, updatedAt, isVerified, email) 
            //  const Carts = db.carts;
            //const findProduct = await Products.find({_id:id}) 
            const countcart = await Carts.countDocuments({userId:id})
            let user = {}
             
                  user.profile = { id, firstName, lastName, username, isAdmin, phoneNo, createdAt, updatedAt, isVerified, email, imgUrl } 
                  user.token = tokens;   
                  user.cartcount = countcart             
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
exports.findMembeById = async (req, res) => {
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
// Update members details
 // Update a product
 exports.updateMember = async(req, res) => {
    const _id = req.params.id;
    console.log(req.body)

    const {   firstName, lastName, phoneNo, imgUrl, email , isAdmin ,username} = req.body;
    
    if ( firstName && lastName && phoneNo && imgUrl  ){
        if ( firstName==="" || lastName=== "" || phoneNo ==="" || imgUrl ===""){
            res.status(400).send({
                message:"Incorrect entry format"
            });
        }else{
            // if(req.file ){
  
                //   _id : req.params.id,
                  
            const member = new Members({
                _id : req.params.id,
                firstName: req.body.firstName,
                imgUrl: req.body.imgUrl,
                lastName: req.body.lastName,
                phoneNo: req.body.phoneNo,
                email: req.user.email,
                isAdmin: false  
              });
             
    
         
            try{
                const updateProfile = await Members.updateOne( {_id}, member)
             
                 
                
                 res.status(201).send({message:"Profile updated  succesfully"})
                
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while updating profile "})
            }
          
          
                                
                                   
                                  
        //         }else{
                    
        //     const skinissues = new Skinissues({
        //         _id : req.params.id,
        //         category: req.body.category,
        //         imgUrl: req.body.files,
        //         symptom: JSON.parse(req.body.symptom),
        //          name: req.body.name,
        //         description: req.body.description
                
        //       });
        //  //     recommendedProducts: JSON.parse(req.body.recommendedProducts)  
         
        //     try{
        //         const updateProduct = await Skinissues.updateOne( {_id}, skinissues)
            
        //          res.status(201).send({message:"Skin issue  created"})
          
                       
                
        //     }catch(err){
        //         console.log(err)
        //         res.status(500).send({message:"Error while creating Skin issue "})
        //     }
        //         } 
          
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
     

    //  

                   
};








    

    exports.changeAdminPassword = async(req,res)=>{
        if (!req.body){
            res.status(400).send({message:"Content cannot be empty"});
        }
    console.log(req.body)
      // let {myrefCode} = req.query;
        const {   email, password } = req.body;
      
        if ( email && password  ){
            if ( email==="" || password===""  ){
                res.status(400).send({
                    message:"Incorrect entry format"
                });
            }else{
                
                
    
             
                try{
                  const isUserExist = await Members.findOne({email: email} )
                  const getadminId = await Auths.findOne({email: email} )
                    if(isUserExist.isAdmin === true){
                  const newpassword = await passwordUtils.hashPassword(req.body.password.toLowerCase());
                    console.log("newpassword")
                    console.log(newpassword) 
                    console.log(getadminId._id)              
                    //const email = req.body.email.toLowerCase();
                    const _id  = getadminId._id
                    const updatePassword = await Auths.findOneAndUpdate({ _id }, { password: newpassword });
                    console.log(updatePassword)
 
                    const emailFrom = 'Ahiajara Skin care    <noreply@Ahiajara.com>';
                    const subject = 'Succesful Registration link';                      
                    const hostUrl = "ahiajara.netlify.app/dashboard"
                    const hostUrl2 = "https://ahiajara.netlify.app/dashboard"    
                    const   text = "Your password has just been changed"
                    const emailTo = req.body.email.toLowerCase();
                    const link = `${hostUrl}`;
                    const link2 = `${hostUrl2}`;
                     processEmail(emailFrom, emailTo, subject, link, link2, text, "Admin");
                      
                res.status(201).send({message:"Password changed succesfully"})
                                     
                   }
                    else{
 


                res.status(400).send({message:"You are not an admin"})

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
 
                    const emailFrom = 'Ahiajara Skin care    <noreply@Ahiajara.com>';
                    const subject = 'Succesful Registration link';                      
                    const hostUrl = "ahiajara.netlify.app/dashboard"
                    const hostUrl2 = "https://ahiajara.netlify.app/dashboard"    
                    const   text = "Your password has just been changed"
                    const emailTo = req.user.email.toLowerCase();
                    const link = `${hostUrl}`;
                    const link2 = `${hostUrl2}`;
                     processEmail(emailFrom, emailTo, subject, link, link2, text, req.user.firstName);
                      
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

    exports.resetPassword = async(req,res)=>{
        if (!req.body){
            res.status(400).send({message:"Content cannot be empty"});
        }
    console.log(req.body)
      // let {myrefCode} = req.query;
        const {email} = req.body;
      
        if ( email  ){
            if ( email === "" ){
                res.status(400).send({
                    message:"Your email is not correct"
                });
            }else{
                
                
    
             
                try{
                //   const isUserExist = await Members.findOne({email: req.user.email} )
                  const getuser = await Auths.findOne({email: req.body.email} )
                  console.log(getuser)
                  if(getuser){
                  const temporaryPassword = getCode()
                   console.log("tempo")
                   console.log(temporaryPassword)
                    const newpassword = await passwordUtils.hashPassword(temporaryPassword);
                    console.log("newpassword")
                    console.log(newpassword) 
                    console.log(getuser._id)              
                    const _id  = getuser._id
                    const updatePassword = await Auths.findOneAndUpdate({ _id }, { password: newpassword });
                    console.log(updatePassword)
 
                    const emailFrom = 'Ahiajara Skin care    <noreply@Ahiajara.com>';
                    const subject = 'Succesful Registration link';                      
                    const hostUrl = "ahiajara.netlify.app/dashboard"
                    const hostUrl2 = "https://ahiajara.netlify.app/dashboard"    
                    const   text = 'Your password has been reset to '+temporaryPassword+', login with it and change your password'
                    const emailTo = req.body.email.toLowerCase();
                    const link = `${hostUrl}`;
                    const link2 = `${hostUrl2}`;
                     processEmail(emailFrom, emailTo, subject, link, link2, text, "req.body.email");
                      
                    res.status(200).send({message:"Password reset was succesfull"})
                                     
                 
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

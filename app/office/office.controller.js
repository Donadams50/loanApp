
const db = require("../mongoose");
const Offices = db.offices;
const Members = db.profiles;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create approval process

exports.createOffice = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  officeTitle , officeTitleBranch} = req.body;
  
    if (  officeTitle  ){
        if ( officeTitle===""    ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{  
              const combinedOfficeBranch = ''+officeTitle+' '+officeTitleBranch+''
            const office = new Offices({
            
                officeTitleBranch: officeTitleBranch,
                officeTitle: officeTitle,
                isAssigned: false,
                userInOffice: "" ,
                userNameInOffice: "",
                combinedOfficeBranch: combinedOfficeBranch         

                
              });
        
            try{   
                const isOfficeExist = await Offices.findOne({combinedOfficeBranch: combinedOfficeBranch} )

                 if(isOfficeExist){
                    res.status(400).send({
                        message:"Office already exist"
                    });
                 }else{

                            const saveOffice = await  office.save()
                            console.log(saveOffice)                
                            res.status(201).send({message:"Office created"})
                        }
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating office "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
}

// Find approval process
exports.findOffices = async (req, res) => {
    try{
           const findOffices = await Offices.find().sort({"_id": -1})  
           res.status(200).send(findOffices)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting offices"})
       }
};

//update  office
exports.updateOffice= async(req, res) => {
    const _id = req.params.id;
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {   officeTitle, officeTitleBranch ,userNameInOffice , userInOffice, isAssigned } = req.body;

    if (  officeTitle  ){
        if ( officeTitle===""){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{
           
        const combinedOfficeBranch = ''+officeTitle+' '+officeTitleBranch+''
            const office = new Offices({
                _id : req.params.id,
                officeTitleBranch: officeTitleBranch ,
                officeTitle:  officeTitle ,
                userNameInOffice: userNameInOffice,
                userInOffice: userInOffice, 
                isAssigned: isAssigned  ,
                combinedOfficeBranch: combinedOfficeBranch    
              });
    
    
         
            try{
                const isOfficeExist = await Offices.findOne({combinedOfficeBranch: combinedOfficeBranch} )

                 if(isOfficeExist){
                    res.status(400).send({
                        message:"Office name already exist"
                    });
                 }else{
                const updateOffice = await Offices.updateOne( {_id}, office)
                    console.log(updateOffice)                       
                 res.status(200).send({message:"Office updated  succesfully"})
                }
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while updating Office"})
            }
          
          
   
          
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
     

    

                   
};

// delete office
exports.deleteOffice = async (req, res) => {
    try{
        const id = req.params.id;
        const deletaOffice= await Offices.findByIdAndRemove(id)
        console.log(deletaOffice)
        res.status(200).send({message:"Deleted succesfully"})
         
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while deleting office "})
       }
}

// find unassigned  office
exports.findNotAssignedoffices = async (req, res) => {
    try{
        
             
             const isOfficeAssigned = false
             const findNotAssignedoffices = await Offices.find({isAssigned: isOfficeAssigned})
        
              console.log(findNotAssignedoffices)
             res.status(200).send(findNotAssignedoffices)
             
        }catch(err){
            console.log(err)
            res.status(500).send({message:"Error while getting unassigned office "})
        }
 
 };

//count office
exports.countOffice = async (req, res) => {
    try{

        const countOffice = await Offices.countDocuments()
        console.log(countOffice)
        res.status(200).send({countOffice:countOffice})
     }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while counting office "})
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




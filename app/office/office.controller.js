
const db = require("../mongoose");
const Offices = db.offices;
const sendemail = require('../helpers/emailhelper.js');

const uuid = require('uuid')


// Create approval process

exports.createOffice = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  officeTitle } = req.body;
  
    if (  officeTitle  ){
        if ( officeTitle===""    ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{  
            const officeBranch = req.body.officeTitleBranch || ''  
            const office = new Offices({
            
                officeTitleBranch: ''+officeTitle+' '+officeBranch+'',
                officeTitle: officeTitle,
                isAssigned: false,
                userInOffice: ""                

                
              });
        
            try{   
                const isOfficeExist = await Offices.findOne({officeTitleBranch: ''+officeTitle+' '+officeBranch+''} )

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

//update approval process
exports.updateOffice= async(req, res) => {
    const _id = req.params.id;
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {   officeTitle  } = req.body;

    if (  officeTitle  ){
        if ( officeTitle===""){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{
           
            const officeBranch = req.body.officeTitleBranch || '' 
            const office = new Offices({
                _id : req.params.id,
                officeTitleBranch: ''+officeTitle+' '+officeBranch+'' ,
                officeTitle:  officeTitle             
              });
    
    
         
            try{
                const updateOffice = await Offices.updateOne( {_id}, office)
                    console.log(updateOffice)                       
                 res.status(201).send({message:"Office updated  succesfully"})
                
                
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

// delete aproval process
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




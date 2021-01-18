
const db = require("../mongoose");
const Groups = db.groups;
const ApprovalProcess = db.approvalprocess;



// Create approval process

exports.createGroup = async(req,res)=>{
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {  groupName , groupDescription} = req.body;
  
    if (  groupName  ){
        if ( groupName === " " ){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{  
              
            const group = new Groups({
            
                groupName:groupName,
                groupDescription: groupDescription,
                
              });
        
            try{   
                const isGroupExist = await Groups.findOne({groupName: groupName} )

                 if(isGroupExist){
                    res.status(400).send({
                        message:"Group already exist"
                    });
                 }else{

                            const savegroup = await  group.save()
                            console.log(savegroup)                
                            res.status(201).send({message:"group created"})
                        }
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while creating group "})
            }
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format 5"
        });
    }
}

// Find group
exports.findGroup = async (req, res) => {
    try{
           const findGroups = await Groups.find().sort({"_id": -1})  
           .populate('loanTypes')
           res.status(200).send(findGroups)
              
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while getting group"})
       }
};

//update  group
exports.updateGroup= async(req, res) => {
    const _id = req.params.id;
    if (!req.body){
        res.status(400).send({message:"Content cannot be empty"});
    }
console.log(req.body)

    const {   groupName, groupDescription } = req.body;

    if (  groupName  ){
        if ( groupName===""){
            res.status(400).send({
                message:"Incorrect entry format"
            });
    }else{
       
        const group = new Groups({
            _id: req.params.id,
            groupName:groupName,
            groupDescription: groupDescription
            
          });
    
    
         
            try{
                const isGroupExist = await Groups.findOne({groupName: groupName} )
                  const _id = req.params.id
                 if(!isGroupExist){
                    res.status(400).send({
                        message:"Group does already exist"
                    });
                 }else{
                const updateGroup = await Groups.updateOne( {_id}, group)
                    console.log(updateGroup)                       
                 res.status(200).send({message:"Group updated  succesfully"})
                }
                
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while updating Group"})
            }
          
          
   
          
        }
    }else{
        res.status(400).send({
            message:"Incorrect entry format"
        });
    }
     

    

                   
};

// delete group
exports.deleteGroup = async (req, res) => {
    try{
        const id = req.params.id;
        const findGroupById = await Groups.findOne({_id: id})
        console.log(findGroupById)
        const deletaGroup= await Groups.findByIdAndRemove(id)
     
        const  ids = findGroupById.loanTypes;

       const deletaApprovalProcess = await ApprovalProcess.deleteMany({_id:{$in:ids}})
  
     
       
        if(deletaGroup &&deletaApprovalProcess){
            res.status(200).send({message:"Deleted succesfully"})
        }else
        {
            res.status(400).send({message:"Deleted succesfully"})
        }
       
         
       }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while deleting office "})
       }
}


// get group by id

exports.getGroupById = async (req, res) => {
    try{
        
             
            const id = req.params.id
             const findGroupById = await Groups.findOne({_id: id})
             .populate('loanTypes')
              console.log(findGroupById)
             res.status(200).send(findGroupById)
             
        }catch(err){
            console.log(err)
            res.status(500).send({message:"Error while getting group "})
        }
 
 };

 exports.getGroupCount = async (req, res) => {
    try{

        const countgroup = await Groups.countDocuments()
        console.log(countgroup)
        res.status(200).send({countGroup:countgroup})
     }catch(err){
           console.log(err)
           res.status(500).send({message:"Error while counting group "})
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




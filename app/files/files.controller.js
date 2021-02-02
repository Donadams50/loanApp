

exports.postImage = async(req,res)=>{
    if (!req.files){
      
        res.status(400).send({message:"Content cannot be empty"});
     }
   

        
         try{              

            random = Math.random().toString(36).slice(-8);   
            file = req.files.image;
            const imageName = random+req.files.image.name;  
            console.log(Image) 
            file.mv('public/images/'+imageName); 
                     
                res.status(201).send(
                    {
                        message:"Picture uploaded successfully ",
                        imageUrl: imageName 
                    }
                    
                    )
            
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while uploading image "})
            }
       
   
}

exports.postDocument = async(req,res)=>{
    if (!req.files){
      
        res.status(400).send({message:"Content cannot be empty"});
     }
   

        
         try{              

            random = Math.random().toString(36).slice(-8);   
            file = req.files.file;
            const fileName = random+req.files.file.name;  
            console.log(fileName) 
            file.mv('public/files/'+fileName); 
                     
                res.status(201).send(
                    {
                        message:"File uploaded successfully ",
                        imageUrl: "files/"+fileName+""
                    }
                    
                    )
            
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while uploading file "})
            }
       
   
}
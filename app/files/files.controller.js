

exports.postImage = async(req,res)=>{
    if (!req.files){
      
        res.status(400).send({message:"Content cannot be empty"});
     }
     console.log(req.files)

        
         try{              

            random = Math.random().toString(36).slice(-8);   
            file = req.files.image;
            const Image = random+req.files.image.name;  
            console.log(Image) 
            file.mv('public/files/'+Image); 
                     
                res.status(201).send(
                    {
                        message:"Picture uploaded successfully ",
                        imageUrl: Image 
                    }
                    
                    )
            
            }catch(err){
                console.log(err)
                res.status(500).send({message:"Error while uploading image "})
            }
       
   
}
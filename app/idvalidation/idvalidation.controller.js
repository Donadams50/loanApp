const db = require("../mongoose");
const Bvndetails = db.bvndetails;

// Validate bvn

exports.validateBvn = async (req, res) => {
    try{
        const headers = {
            'Authorization': process.env.flutter_secret_KEY
          }
           const bvnnumber = req.params.bvnnumber
           validateBvn = await axios.get('https://api.flutterwave.com/v3/kyc/bvns/'+bvnnumber+'', {headers: headers})
           //console.log(validateBvn)
           if (validateBvn.data){
                res.status(200).send(validateBvn.data)
             }else{  

                res.status(400).send({message:"Error while validating bvn "})
               }
           
              
       }catch(err){
           console.log(err)
           res.status(400).send({message:err})
       }
};
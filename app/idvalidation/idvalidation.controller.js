const db = require("../mongoose");
const Bvndetails = db.bvndetails;
const axios = require('axios');
// Validate bvn

exports.validateBvn = async (req, res) => {
    try{
        const headers = {
            'Authorization': process.env.flutter_secret_KEY
          }
           const bvnnumber = req.params.bvnnumber
           const lim = 1;
           const findBvnDetails = await Bvndetails.findOne({"bvndetails.data.bvn": bvnnumber}).sort({"_id": -1}).limit(lim)
           console.log(findBvnDetails)
           if (findBvnDetails === null ){
            validateBvn = await axios.get('https://api.flutterwave.com/v3/kyc/bvns/'+bvnnumber+'', {headers: headers})
            //console.log(validateBvn)
            if (validateBvn.data){
             const bvndetails = new Bvndetails({
                 
                 bvndetails: validateBvn.data
 
                     });
                  const savebvn = await  bvndetails.save()
                 res.status(200).send(validateBvn.data)
              }else{  
 
                 res.status(400).send({message:"Error while validating bvn "})
                }
            
           }
           else{
            res.status(200).send(findBvnDetails.bvndetails)
            }
              
       }catch(err){
           console.log(err)
           res.status(400).send({message:err})
       }
};
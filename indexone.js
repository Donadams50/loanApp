// a = [
//     {amount:"abc",prop2:"success"},
//     {amount:"bnmb",prop2:"failed"},
//     {amount:"zxvz",prop2:"pending"}
//    ];
      
// index = a.filter( x => x.prop2 ==="yutu");
//  a.forEach(function (element) {
//   element.Active = "false";
// });
// let k = "prop1"
//let result = a.map(b => b.amount);

// const string = {JJJ:"yutu", KK:"yutu",prop1:"abc",JJJk:"yutu"}
// const keys = Object.entries(string);
// const requiredIndex = keys.indexOf('prop1');
// const h = keys.find(e => e[0] === "prop1");  // 0

 //  indexAssingnee = approvalProcess.find( x => x.userInOffice ===req.user.id)
 // console.log(h[1]);
// a = [
//     {prop1:"abc",prop2:"qwe"},
//     {prop1:"bnmb",prop2:"yutu"},
//     {prop1:"zxvz",prop2:"qwrq"}
//    ];
  //    let b = []
//  a.forEach((number, index, array) => {
//   if(number.prop2 === "success"){
//     array[index].failedAmount = 0
//     array[index].pendingAmount = 0
//     array[index].successAmount = number.amount


//   }else if(number.prop2 === "failed"){
//     array[index].failedAmount = number.amount
//     array[index].pendingAmount = 0
//     array[index].successAmount = 0

//   }else  if(number.prop2 === "pending"){
//     array[index].failedAmount = 0
//     array[index].pendingAmount = number.amount
//     array[index].successAmount = 0
//   }
//   b= array
  
 
// });

//console.log(result);

//   let lastItem = a.slice(-1)[0];
//        console.log("lastobject")
//        console.log(lastItem)



// index = b.find( x => x.loanType ==="pepper");

// console.log(index);
// let newCharge = []
// var serviceCharge = [
//     {
//         "charges": [
//             {
//                 "_id": "COMMISSION",
//                 "servicChargeSum": 110.0
//             },
//             {
//                 "_id": "3RD_PARTY_FEE",
//                 "servicChargeSum": 26.0
//             },
//             {
//                 "_id": "ASTRA_POLARIS_FEE",
//                 "servicChargeSum": 98.2
//             },
//             {
//                 "_id": "PROV_FEE",
//                 "servicChargeSum": 65.8
//             }
//         ],
//         "endDate": "2020-08-27T23:00:00Z[UTC]",
//         "startDate": "2020-08-20T23:00:00Z[UTC]"
//     },
//     {
//         "charges": [
//             {
//                 "_id": "COMMISSION",
//                 "servicChargeSum": 160.0
//             },
//             {
//                 "_id": "3RD_PARTY_FEE",
//                 "servicChargeSum": 52.0
//             },
//             {
//                 "_id": "ASTRA_POLARIS_FEE",
//                 "servicChargeSum": 56.4
//             },
//             {
//                 "_id": "PROV_FEE",
//                 "servicChargeSum": 131.6
//             }
//         ],
//         "endDate": "2020-10-01T23:00:00Z[UTC]",
//         "startDate": "2020-09-24T23:00:00Z[UTC]"
//     }
// ];

// serviceCharge.forEach((number, index, array)=>{

//   array[index].charges.forEach((number1, index1, array1)=>{
//     if(array1[index1]._id === 'COMMISSION'){
//       array[index].commissionAmount = array1[index1].servicChargeSum
//     //  console.log(array[index])
//     //  newCharge = array
//     }else if(array1[index1]._id === '3RD_PARTY_FEE'){
//       array[index].thirddPartyFee = array1[index1].servicChargeSum
//      // newCharge = array
//     }
//     else if(array1[index1]._id === 'ASTRA_POLARIS_FEE'){
//       array[index].astraPolarisFee = array1[index1].servicChargeSum
//     //  newCharge = array
//     }else if(array1[index1]._id === 'PROV_FEE'){
//       array[index].provFee = array1[index1].servicChargeSum
//     //  newCharge = array
//     }
//     newCharge = array
   
//   })
// })

// //console.log(newCharge)
// var yes = newCharge.map(report => ({
//   date: report.startDate,
//    commission: report.commissionAmount,
// astraPolarisFee: report.astraPolarisFee,
// provFee: report.provFee,
// thirddPartyFee: report.thirddPartyFee

// }));

// console.log(yes)
const cron = require('node-cron');
const axios = require('axios');
function delay() {
  return new Promise(resolve => setTimeout(resolve, 300000));
}
var validatePayment = cron.schedule('*\5 * * * *', async function() {
 console.log("i ran 3");
  validatePayment.stop();
  
   try{
      const array = ["one"]
       init2 = await  processArrayFinalPayment(array)
     //  console.log(init2[0].length)
       if(init2 === "done"){
         validatePayment.start();
         console.log("i am re-starting validate")
        }else{
         console.log("error from return statement")
        }
  
   }catch(err){
       console.log(err) 
       
   }finally{

   }
// console.log('You will see this message every 15 minutes');

})
validatePayment.start();


  //  loop handler
  async function processArrayFinalPayment(array) {
   
    for (const item of array) {
      console.log("processArrayFinalPayment")
      console.log(item)
      await delayedLog(item);
    }
   return "done"
  }
async function delayedLog(item) { 
   
  
   const headers = {
    'Content-Type': 'application/json',
    'X-Phantombuster-Key-1': 'PBBaRfZFGVEtcCrGPMOlsgwTw4rwKRq4kqDNvNZxUT8'
  }
 params = {
   "output": "first-result-object",
   "id": "7590881100908317",
   "argument":{
       "spreadsheetUrl":"Restaurant New york",
       "numberOfResultsPerSearch":500,
       "numberOfLinesPerLaunch":20,
       "specifyLanguage":"en",
       "extractCoordinates":false,
       "csvName":"restaurant"
       }
   }
        console.log("dalayed log")
        console.log(item)
        try{
          const   postSearch = await axios.post('https://api.phantombuster.com/api/v2/agents/launch?output=json', params,  {headers: headers})
          
          
          if(postSearch.data){
            console.log(postSearch.data) 
            //await delay();
            const   getResult = await axios.get('https://api.phantombuster.com/api/v1/agent/7590881100908317/output?containerId='+postSearch.data.containerId+'',   {headers: headers})
            console.log(getResult.data.data) 
          }else{

          }
          

        }catch(err){
          console.log(err)
            return err
          
        }

    }
    
   
  

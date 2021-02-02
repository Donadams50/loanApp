a = [
    {prop1:"abc",prop2:"yutu"},
    {prop1:"bnmb",prop2:"yutu"},
    {prop1:"zxvz",prop2:"qwrq"}
   ];
      
// index = a.filter( x => x.prop2 ==="yutu");
 a.forEach(function (element) {
  element.Active = "false";
});
let k = "prop1"

const string = {JJJ:"yutu", KK:"yutu",prop1:"abc",JJJk:"yutu"}
const keys = Object.entries(string);
const requiredIndex = keys.indexOf('prop1');
const h = keys.find(e => e[0] === "prop1");  // 0

 //  indexAssingnee = approvalProcess.find( x => x.userInOffice ===req.user.id)
  console.log(h[1]);
// a = [
//     {prop1:"abc",prop2:"qwe"},
//     {prop1:"bnmb",prop2:"yutu"},
//     {prop1:"zxvz",prop2:"qwrq"}
//    ];
      


//   let lastItem = a.slice(-1)[0];
//        console.log("lastobject")
//        console.log(lastItem)



// index = b.find( x => x.loanType ==="pepper");

// console.log(index);
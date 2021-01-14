a = [
    {prop1:"abc",prop2:"qwe"},
    {prop1:"bnmb",prop2:"yutu"},
    {prop1:"zxvz",prop2:"qwrq"}
   ];
      
 // index = a.findIndex( x => x.prop2 ==="yutu");
  // indexAssingnee = approvalProcess.find( x => x.userInOffice ===req.user.id)
//   console.log(index);
// a = [
//     {prop1:"abc",prop2:"qwe"},
//     {prop1:"bnmb",prop2:"yutu"},
//     {prop1:"zxvz",prop2:"qwrq"}
//    ];
      


//   let lastItem = a.slice(-1)[0];
//        console.log("lastobject")
//        console.log(lastItem)

b = [
    {
        "approvalProcess": [
            {
                "userInOffice": "5ff7048e0d34553234a16c2e",
                "role": "loan_officer",
                "officeTitleBranch": "Onikolobo",
                "officeTitle": "",
                "offficeId": "",
                "userNameInOffice": ""
            },
            {
                "userInOffice": "5ff6e1a7dd273214742f832b",
                "role": "approval",
                "officeTitleBranch": "Head of credit Ogunmakin",
                "officeTitle": "Head of credit",
                "offficeId": "5ff6d43d4fc8b90fe47c0d04",
                "userNameInOffice": ""
            }
        ],
        "_id": "5fff264223615831a8d74b4f",
        "loanTypeDescription": "just pepper",
        "groupId": "5fff25388511a31060daffe3",
        "loanType": "pepper",
        "createdAt": "2021-01-13T16:56:34.817Z",
        "updatedAt": "2021-01-13T17:03:04.738Z",
        "__v": 0
    },
    {
        "approvalProcess": [
            {
                "userInOffice": "5ffd667e7b2ae10017da32ae",
                "role": "loan_officer",
                "officeTitleBranch": "Onikolobo",
                "officeTitle": "Head of Credit",
                "offficeId": "5ffc81336a9a6300173cc102",
                "userNameInOffice": "Olayioye Segun"
            },
            {
                "userInOffice": "5ff6e1a7dd273214742f832b",
                "role": "loan_officer",
                "officeTitleBranch": "Adigbe",
                "officeTitle": "Head of finances",
                "offficeId": "5ff8357c2242b10017084797",
                "userNameInOffice": "Alaka Olasumbo"
            }
        ],
        "_id": "5fff2d0b5941ca4fd0dff874",
        "loanTypeDescription": "just roska",
        "groupId": "5fff25388511a31060daffe3",
        "loanType": "roska",
        "createdAt": "2021-01-13T17:25:31.862Z",
        "updatedAt": "2021-01-13T17:32:48.537Z",
        "__v": 0
    },
    {
        "approvalProcess": [],
        "_id": "5fff31664349bb001798ef57",
        "loanTypeDescription": "This gives a description of a loan for ship",
        "groupId": "5fff25388511a31060daffe3",
        "loanType": "Ship Loan",
        "createdAt": "2021-01-13T17:44:06.114Z",
        "updatedAt": "2021-01-13T17:44:06.114Z",
        "__v": 0
    }
]

index = b.find( x => x.loanType ==="pepper");

console.log(index);
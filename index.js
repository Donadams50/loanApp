const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

const cors = require("cors");
//const uuid = require('uuid')
app.use(cors()); 
const path = require('path')
const fileUpload=require('express-fileupload')
 app.use(fileUpload())

//set static folder
app.use(express.static(path.join(__dirname, 'public')));
const axios = require('axios')

const db = require("./app/mongoose");
console.log(db.url)
db.mongoose
  .connect(db.url, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
     useFindAndModify: false 
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
  
 require("./app/members/members.routes.js")(app)
 require("./app/helper/helper.routes.js")(app)
 require("./app/approvalprocess/approvalprocess.routes.js")(app)
 require("./app/loanapplication/loanapplication.routes.js")(app)
 require("./app/office/office.routes.js")(app)
 require("./app/group/group.routes.js")(app)





//  random = Math.random().toString(36).slice(-8);

//      
//          file = req.files.Image;
//          Image = random+req.files.Image.name;  
//          file.mv('public/images/'+Image); 
//          console.log("Image") 
//          
//      
// Connect to port 
const port = process.env.PORT || 5000     

app.listen(port, ()=> console.log(`listening on port ${port}...`)); 
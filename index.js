// import packages into the app. Express, body-parser, 
//const sql=require("./app/Database/db")
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

const cors = require("cors");
//const uuid = require('uuid')
app.use(cors()); 
const path = require('path')
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
 



// Connect to port
const port = process.env.PORT || 5000     

app.listen(port, ()=> console.log(`listening on port ${port}...`)); 
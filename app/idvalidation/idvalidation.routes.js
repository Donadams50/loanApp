module.exports = app => {
    const idvalidation = require("./idvalidation.controller");

    app.get("/bvn/validate/:bvnnumber",    idvalidation.validateBvn)
  


    }

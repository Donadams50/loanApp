module.exports = app => {
    const office = require("./office.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   

  app.post("/office",  office.createOffice)
  app.get("/office",   office.findOffices)
  app.put("/office/:id",   office.updateOffice)
  app.delete("/office/:id",    office.deleteOffice)
  app.get("/office/unassigned",   office.findNotAssignedoffices)
  app.get("/office/count",   office.countOffice)



    }

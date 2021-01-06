module.exports = app => {
    const office = require("./office.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   

  app.post("/office", verifyToken, isAdmin, office.createOffice)
  app.get("/office",  verifyToken, isAdmin,  office.findOffices)
  app.put("/office/:id", verifyToken, isAdmin,  office.updateOffice)
  app.delete("/office/:id", verifyToken,  isAdmin,   office.deleteOffice)
 // app.get("/office/unassigned",  verifyToken, isAdmin,  office.findNotAssignedoffices)

}
module.exports = app => {
    const group = require("./group.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   

  app.post("/group",  group.createGroup)
  app.get("/group",   group.findGroup)
  app.put("/group/:id",   group.updateGroup)
  app.delete("/group/:id",    group.deleteGroup)
  app.get("/group/:id",    group.getGroupById)
 
}

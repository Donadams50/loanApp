module.exports = app => {
    const group = require("./group.controller");
    const jwtTokenUtils = require('../helpers/jwtTokenUtils')
    const { verifyToken, isAdmin } = jwtTokenUtils;
   

  app.post("/group" , verifyToken, isAdmin,  group.createGroup)
  app.get("/group",  verifyToken, isAdmin, group.findGroup)
  app.put("/group/:id", verifyToken, isAdmin,  group.updateGroup)
  app.delete("/group/:id",  verifyToken, isAdmin,  group.deleteGroup)
  app.get("/group/:id",  verifyToken, isAdmin, group.getGroupById)
  app.get("/count/group", verifyToken, isAdmin, group.getGroupCount)
 
}


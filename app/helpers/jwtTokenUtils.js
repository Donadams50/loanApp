const  jwt =require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config();
  // require('./app/cloudinary/cloudinary.js')
  //   const upload = require(' ./app/cloudinary/multer.js');

exports.signToken= (id, fullname, userName, Role, roleID, Branch, branchID,  ApprovalLevel, ApprovalTitle)=> {
    const key = process.env.SECRET_KEY;
    const token = jwt.sign({ id: id, fullName:fullname , username:userName, role: Role, roleId:roleID , branch:Branch, branchId:branchID , approvalLevel:ApprovalLevel, approvalTitle: ApprovalTitle  }, key, { expiresIn: '1h' });
    return token;
  }

  exports.verifyToken= (req, res, next)=> { 
    const key = process.env.SECRET_KEY;
    const token = req.headers.authorization || req.params.token;
    if (!token) {
      res.status(403).json({ status: 403, error: 'No token provided' }); 
    }else{
      jwt.verify(token, key, (error, decoded) => {
        if (error) {
          console.log(error)
          res.status(401).json({ status: 401, error: 'Unauthorized' });
        }else{
         console.log(decoded)
           req.user = decoded;
          next();
        }
       
      });
    }
    
  }
  exports.isAdmin= (req, res, next)=> { 
    const token = req.headers.authorization || req.params.token;
  
        if (req.user.isAdmin === true) {
         console.log(req.user.isAdmin) 
          next();
          
        }else{
          console.log(req.user.isAdmin) 
          res.status(401).json({ status: 401, error: 'Unauthorized to access this resource' });
          
        }
    
  }

  
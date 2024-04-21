const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const secretKey = process.env.secretKey;


module.exports = {

  registerUser: async (req, res) => {
    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;
    try {
        const hashpassword = await bcrypt.hash(myPlaintextPassword, saltRounds);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hashpassword,
            role: req.body.role,
        });
        const savedUser = await user.save();
        res.status(201).send(savedUser);
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
            res.status(400).json({ message: 'Email already exists' });
        } else {
            res.status(400).send(error);
        }
    }
},
  

  updateUser: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token,'secret');
      console.log("Decoded Token:", decodedToken);

      const userRole = decodedToken.role; 
      console.log("User Role:", userRole);

      if (userRole === 'admin') {
          const updatedUser = {
              name: req.body.name,
              email: req.body.email,
              password: req.body.password,
              role: req.body.role,
          };

          await User.findByIdAndUpdate(req.params.id, updatedUser); 
          res.status(200).json({ message: 'User updated successfully!' });
      } else {
          console.log("Not an admin");
          res.status(403).json({ message: 'You are not an admin' });
      }
    } catch (error) {
        console.error('Error updating user', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
  },
      

  getUser: async (req, res) => {
    try {
      const userId = req.params.id;

      const user = await User.findById(userId);

      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error getting user', error);
      res.status(500).json(error);
    }
  },

  getAllUser: (req, res) => {
    User.find({}).then((users)=>{
      res.send(users);
  }).catch((error)=>{
      res.status(500).send(error);
  })
},

  deleteUser: async (req, res) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'secret');
      const role = decodedToken.role;
      if (role === 'admin') {
      await User.deleteOne({_id: req.params.id});
      res.status(201).json({ message: 'User deleted successfully!' });        
      } else {
        res.status(400).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error deleting user', error);
      res.status(500).json({ message: 'You are not an admin' },error);
    }
  },
};

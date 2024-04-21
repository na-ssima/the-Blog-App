const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// const secretKey = process.env.secretKey;

const generateToken = (email, _id, role) => {
  const token = jwt.sign({ email, _id, role },'secret' , { expiresIn: "2h" });
  return token;
};

module.exports = {
    login: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
    
            if (!user) {
              return res.status(401).json({ message: 'Invalid email' });
            }
    
            const validPassword = await bcrypt.compare(req.body.password, user.password);
    
            if (!validPassword) {
              return res.status(401).json({ message: 'Invalid password' });
            }
    
            const token = generateToken(user.email, user._id, user.role);
    
            res.status(201).json({
              message: 'Success',
              token,
            });
        } catch (error) {
            console.error('Error during login', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
};

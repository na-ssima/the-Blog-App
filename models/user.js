const mongoose = require('mongoose')

const UserShema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true},
    name:  { type: String, required: true},
    role: {type: String, required: true, default: 'user'},
    createdAt: {type: Date, default: Date.now},
    updatedAT: {type: Date, default: Date.now},
  })
  
  const User = mongoose.model('User', UserShema)
  
  module.exports = User;
  
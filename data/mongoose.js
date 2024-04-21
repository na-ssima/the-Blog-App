const mongoose = require('mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/BLOGAPPTEST")
.then(()=> console.log("connected to database"))
.catch((error)=> console.log("Error:", error))
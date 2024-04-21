const express = require('express')
const app = express()
const cors = require('cors');
require('./data/mongoose')

app.use(express.json())
app.use(cors()); 

app.use('/uploads', express.static('uploads'));



const middleware = require('./middlewares/midl')
app.use(middleware)

const errorhandling = require('./middlewares/error')
app.use(errorhandling)


const postRouter = require('./routes/postRouter')
app.use('/posts', postRouter)

const userRouter = require('./routes/userRouter');
app.use('/users', userRouter);

const LoginRouter = require('./routes/loginRouter')
app.use('/login', LoginRouter)

app.post('/login', (req, res) => {
    console.log('Login Request body:', req.body);
    res.json({ message: 'Login successful' });
});



app.listen(3001,()=>{
    console.log("Server is running")
})

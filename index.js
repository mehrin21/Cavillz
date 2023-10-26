const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express();
const bodyparser = require('body-parser')
const session = require('express-session')
const nocache = require('nocache')
const flash  = require('connect-flash')
const cookieparser = require('cookie-parser')
const dotenv = require('dotenv').config();
const PORT = process.env.PORT ||5000;
const user = require('./router/userRouter')//User
const Admin = require('./router/adminRouter')
dbConnect()
app.use(express.static("public"))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:false}))
app.use(cookieparser())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))
app.use(flash())
app.use(nocache())

app.set('view engine','ejs')
//user side
app.use('/',user)

// admin side
app.use('/admin',Admin)
app.listen(PORT,()=>{
    console.log(`sever is running at port ${PORT}`)
})







const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
require('dotenv').config()

mongoose.connect("mongodb+srv://shakil:shakil1212@cluster0.2pkhiac.mongodb.net/UserManage").then(() => {
  console.log(" port connected");
});

// mongoose.connect("mongodb://127.0.0.1:27017/UserManage").then(() => {
//   console.log(" port connected");
// });

const flash = require('express-flash');

const upload = require('./middleware/multer')
const cloudinary = require('./middleware/cloudinary')
const fs = require("fs")

app.use('/upload-images',upload.array('image'),async(req,res)=>{
  const uploder = async(path )=> await cloudinary.uploads(path,"images")
  
})





app.use(session({
    secret:process.env.SESSION_SCRKEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000*10 }
}));
app.use(flash());

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

//path
app.use((req,res,next)=>{
  console.log(req.method+req.originalUrl);
   next()
})


//cookies
app.use((req, res, next) => {
  res.set("Cache-control", "no-store,no-cashe");
  next();
});

//view engine
app.set("view engine", "ejs");

//User router
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

//adminRoute
const adminRoute = require("./routes/adminRoute");
const { promises } = require("nodemailer/lib/xoauth2");
app.use("/admin", adminRoute);


app.use((req,res) => {
  try {
      res.status(404).render('404')
  } catch (error) {
      res.status(500).render('500')
  }
})


app.listen(3000, () => {
  console.log("server is running");
});




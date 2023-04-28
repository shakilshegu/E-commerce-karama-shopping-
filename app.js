const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
require('dotenv').config()
mongoose.connect("mongodb://127.0.0.1:27017/UserManage").then(() => {
  console.log(" port connected");
});
const flash = require('express-flash');

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

//session
// app.use(
//   session({
//     secret: "SHAKIL",
//     saveUninitialized: true,
//     resave: false,
//     cookie: { maxAge: 30*200000 },
//   })
// );

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
app.use("/admin", adminRoute);

app.listen(3000, () => {
  console.log("server is running");
});




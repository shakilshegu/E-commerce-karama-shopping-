const express = require("express");
const userRouter = express();
const userController = require("../controllers/userController");
const usersession = require("../middleware/userSession");
const blockfunction = require("../middleware/blockfind");
const couponcontroller = require("../controllers/couponController")
const orderController = require("../controllers/orderController")
const categorycontroller = require("../controllers/categoryController")

//get------------
userRouter.get("/login", userController.getLogin);
userRouter.get("/signup", userController.getsignup);
userRouter.get("/", userController.getHome);
userRouter.get("/Logout", userController.getLogout);
userRouter.get("/verify", userController.verifymail);
userRouter.get("/block", userController.blockuser);
userRouter.get("/unblock", userController.unblockuser);
userRouter.get("/products", userController.getproducts);
userRouter.get("/cart", userController.getcart);
userRouter.get("/singleproduct", userController.getsingleproduct);
userRouter.get("/otp", userController.LoadOtp);
userRouter.patch("/addtocart", userController.addtocart);
userRouter.get("/checkout", userController.checkout);
userRouter.get("/orderplaced", userController.confermation);
userRouter.get("/resendotp", userController.resendotp);
userRouter.get("/delete-address", userController.deleteAddress);
userRouter.get("/getUserProfile", userController.getUserProfile);
userRouter.get("/order", userController.getOrder);
userRouter.get("/singleOrder", userController.singleOrder);
userRouter.get('/cancelOrder',orderController.cancelOrder)
userRouter.get("/returnOrder",orderController.returnOrder)
userRouter.get("/filter",userController.filtercategory)
userRouter.get("/editadress",userController.editaddress)
userRouter.get("/shakil",userController.contacts)

//post-------------
userRouter.post("/login", blockfunction, userController.postlogin);
userRouter.post("/signup", userController.signupSubmit);
userRouter.post("/checkotp", userController.verifyOtp);
userRouter.post("/deleteCart", userController.deleteCart);
userRouter.post("/addAddress", userController.postAddress);
userRouter.post("/changeQty", userController.changeQty);
userRouter.post("/place-order", userController.postPlaceOrder);
userRouter.post("/verifyPayment", userController.verifyPayment);
userRouter.post('/applycoupon',userController.applycoupon)
userRouter.post('/checkWallet',orderController.checkWallet)
userRouter.post('/update-profile',userController.updateData)
userRouter.post("/posteditaddress",userController.editpostaddress)



module.exports = userRouter;

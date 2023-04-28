const express = require("express");
const adminRouter = express();
const adminConroller = require("../controllers/adminController");
const categorycontroller = require("../controllers/categoryController");
const productcontroller = require("../controllers/productController");
const ordercontroller = require("../controllers/orderController")
const upload = require("../middleware/multer");
const couponcontroller = require("../controllers/couponController") 
const bannerController= require("../controllers/bannerController")
//get-----------------------
adminRouter.get("/", adminConroller.getLogin);
adminRouter.get("/home", adminConroller.gethome);
adminRouter.get("/usermanage", adminConroller.getusermanage);
adminRouter.get("/category", adminConroller.getcategory);
adminRouter.get("/products", adminConroller.getproducts);
adminRouter.get("/logout", adminConroller.getlogout);
adminRouter.get("/addcategory", categorycontroller.getaddcategory);
adminRouter.get("/editCategory/:id", categorycontroller.editcategory);
adminRouter.get("/addproducts", productcontroller.getaddproducts);
adminRouter.get("/editproducts", productcontroller.editproducts);
adminRouter.get("/deleteproducts", productcontroller.deleteproduct);
adminRouter.get('/order',ordercontroller.getOrder)
adminRouter.get('/singleOrder',ordercontroller.viewOrder)
adminRouter.get("/coupon",couponcontroller.getCoupon)
adminRouter.get("/addCoupon",couponcontroller.getaddcoupon)
adminRouter.post("/removeimage",productcontroller.removeimage)
adminRouter.get("/report",ordercontroller.report);
adminRouter.get('/sales',ordercontroller.sales)
adminRouter.get("/banner", bannerController.getBanner);
adminRouter.get('/addBanner',bannerController.getAddBanner)
adminRouter.get('/showBanner',bannerController.unlistBanner)
adminRouter.get("/deletebanner", bannerController.deletebanner);
adminRouter.get("/salesReport",adminConroller.getSalesReport)


//post----------------------
adminRouter.post("/", adminConroller.postLogin);
adminRouter.post("/addcategory", categorycontroller.postaddCategory);
adminRouter.post("/saveCategory/:id", categorycontroller.editpostcategory);
adminRouter.post("/addproducts",upload.array("image",3),productcontroller.postproduct);
adminRouter.post("/editproducts",upload.array("image",3),productcontroller.editpostproduct);
adminRouter.post("/updateStatus",ordercontroller.updatestatus)
adminRouter.post("/addCoupon",couponcontroller.postaddcoupon)
adminRouter.post('/addBanner',upload.single('image'),bannerController.postAddBanner)


module.exports = adminRouter;

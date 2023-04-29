const bcrypt = require("bcrypt");
const User = require("../models/usermodel");
const nodemailer = require("nodemailer");
const productcollection = require("../models/productModel");
const categorycollectons = require("../models/categoryModel");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel ");
const { otpGen } = require("../controllers/otpControllers");
const orderModel = require("../models/orderModel ");
const Coupon = require("../models/couponmodel");
const Banner = require("../models/bannerModel");

const Razorpay = require("razorpay");
const { Console } = require("console");
var instance = new Razorpay({
  key_id: process.env.key_id,
  key_secret: process.env.key_secret,
});

var username;

const sMail = (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "muhammadshakil1968@gmail.com",
      pass: "cogktsqlwylnbpgt",
    },
  });

  const mailOptions = {
    from: "muhammadshakil1968@gmail.com",
    to: email,
    subject: "Your OTP",
    text: `Your OTP is ${otp}`,
  };

  // send the email-------------------

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent:" + info.response);
    }
  });
};

var oneTimePin;
var userdata;

const signupSubmit = (req, res) => {
  oneTimePin = otpGen();
  userdata = req.body;
  req.session.pass = oneTimePin;
  sMail(req.body.email, oneTimePin);
  res.redirect("/otp");
};

const verifyOtp = async (req, res) => {
  try {
    let { val1, val2, val3, val4, val5, val6 } = req.body;
    let formOtp = new Number(val1 + val2 + val3 + val4 + val5 + val6);

    if (formOtp.number == oneTimePin) {
      let { name, email, number, password } = userdata;
      const spassword = await securePassword(password);
      const user = new User({
        name: name,
        email: email,
        number: number,
        password: spassword,
      });
      const userData = await user.save();
      res.render("user/login", { message: "registration failed" });
    } else {
      res.render("user/signup", { message: "registration failed" });
    }
  } catch (error) {
    console.log("verifyOtp", error.message);
  }
};
//otp page-------------
const LoadOtp = (req, res) => {
  try {
    res.render("user/otp");
  } catch (error) {
    console.log(error.message);
  }
};

//resend otp----------
const resendotp = (req, res) => {
  oneTimePin = otpGen();
  sMail(userdata.email, oneTimePin);
  res.redirect("/otp");
};

//password hashing-------------------------
const securePassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    console.log(error.message);
  }
};

//login------------------------------------------------------
const getLogin = (req, res) => {
  try {
    res.render("user/Login");
  } catch (error) {
    console.log(error.message);
  }
};

const postlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      email: email,
    });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        req.session.user = user._id;
        req.session.name = user.name;
        req.flash("success", "login successfully.");
        res.redirect("/");
      } else {
        res.render("user/Login", { message: "Invalid username and password" });
      }
    } else {
      res.render("user/Login", { message: "Invalid username and password" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//signup----------------------------------------
const getsignup = (req, res) => {
  try {
    res.render("user/signup");
  } catch (error) {
    console.log(error.message);
  }
};
const postsignup = async (req, res) => {
  try {
    const { name, email, number, password } = req.body;

    const data = await User.findOne({ email: email });
    if (data) {
      res.render("user/signup", { message: "email aleady exist" });
    } else {
      const data = new User({
        name: name,
        email: email,
        number: number,
        password: await securePassword(password),
      });
      req.session.email = email;
      req.session.name = name;
      req.session.number = number;
      req.session.password = password;
      const result = await data.save();
      if (result) {
        res.render("user/signup", { message: "registration successfully " });
      } else {
        res.render("user/signup", { message: "registration faild" });
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};
//block User---------------------------------------------------
const blockuser = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.query.id });
    if (userData) {
      await User.updateOne({ _id: userData._id }, { $set: { status: true } });
      res.redirect("/admin/usermanage");
    }
  } catch (error) {
    console.log(error);
  }
};
//UnBlock user----------------------------------------------------
const unblockuser = async (req, res) => {
  try {
    const userData = await User.findOne({ _id: req.query.id });
    if (userData) {
      await User.updateOne({ _id: userData._id }, { $set: { status: false } });
      res.redirect("/admin/usermanage");
    }
  } catch (error) {
    console.log(error);
  }
};
// list category ------------

//home---------------------------------------------
const getHome = async (req, res) => {
  try {
    const data = await productcollection.find();
    const bannerData = await Banner.find();
    if (req.session.user) {
      res.render("user/home", {
        user: req.session.name,
        products: data,
        banner: bannerData,
      });
    } else {
      req.session.user = false;
      res.render("user/home", { products: data, banner: bannerData });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//logout--------------------------------------------
const getLogout = async (req, res) => {
  try {
    req.session.user = false;
    req.session.name = false;
    res.redirect("login");
  } catch (error) {
    console.log(error.message);
  }
};

//verifiymail---------------------------------------
const verifymail = async (req, res) => {
  try {
    res.render("admin/verifyEmail.ejs");
  } catch (error) {
    console.log(error.massage);
  }
};

//product page--------------------------------------
const getproducts = async (req, res) => {
  try {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const pageNO = req.query.page;
    const perpage = 6;

    const data = await productcollection
      .find({
        $or: [
          { productname: { $regex: ".*" + search + ".*", $options: "i" } },
          { brand: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      })
      .skip((pageNO - 1) * perpage)
      .limit(perpage * 1);
    const count = await productcollection
      .find({
        $or: [
          { productname: { $regex: ".*" + search + ".*", $options: "i" } },
          { brand: { $regex: ".*" + search + ".*", $options: "i" } },
        ],
      })
      .countDocuments();
    const totalpage = Math.ceil(count / perpage);
    let a = [];
    let i = 0;
    for (var j = 1; j <= totalpage; j++) {
      a[i] = j;
      i++;
    }
    const data2 = await categorycollectons.find();
    console.log(data);
    res.render("user/products", { user: data, data2, total: a });
  } catch (error) {
    console.log(error.message);
  }
};
//single product page------------
const getsingleproduct = async (req, res) => {
  try {
    const id = req.query.id;
    const data = await productcollection.findById(id).populate("category");
    if (data) {
      res.render("user/singleproduct", { product: data });
    }
  } catch (error) {}
};

//cart page------------------------
const getcart = async (req, res) => {
  try {
    if (req.session.user) {
      const user = await User.findOne({ _id: req.session.user });
      const id = user._id;
      const cart = await Cart.findOne({ user: id });
      if (cart) {
        const userData = await User.findOne({ _id: req.session.user });
        const cartData = await Cart.findOne({ user: userData._id })
          .populate("product.productId")
          .lean();
        if (cartData) {
          let total;
          if (cartData.product != 0) {
            const total = await Cart.aggregate([
              {
                $match: { user: userData._id },
              },
              {
                $unwind: "$product",
              },
              {
                $project: {
                  price: "$product.price",
                  quantity: "$product.quantity",
                  image: "$product.image",
                },
              },
              {
                $group: {
                  _id: null,
                  total: {
                    $sum: {
                      $multiply: ["$quantity", "$price"],
                    },
                  },
                },
              },
            ]).exec();
            Total = total[0].total;
            cartData.product.forEach((element) => {});
            res.render("user/cart", {
              user: req.session.name,
              data: cartData.product,
              userId: userData._id,
              total: Total,
              cartData: cartData,
            });
          } else {
            res.render("user/cart", { user: req.session.name, data2: "hi" });
          }
        } else {
          res.render("user/cart", { user: req.session.name, data2: "hi" });
        }
      } else {
        res.render("user/cart", {
          user: req.session.name,
          data2: "hi",
        });
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};
//add cart---------------------------------------------
const addtocart = async (req, res) => {
  try {
    if (req.session.user) {
      const productId = req.body.id;
      const userName = req.session.user;
      const userdata = await User.findOne({ _id: userName });
      const userId = userdata._id;
      const productData = await productcollection.findById({
        _id: req.body.id,
      });
      const userCart = await Cart.findOne({ user: userId });
      if (userCart) {
        const productExist = await userCart.product.findIndex(
          (product) => product.productId == productId
        );
        if (productExist != -1) {
          await Cart.findOneAndUpdate(
            { user: userId, "product.productId": productId },
            { $inc: { "product.$.quantity": 1 } }
          ).then((value) => {
            res.json({ success: true });
          });
        } else {
          await Cart.findOneAndUpdate(
            { user: userId },
            {
              $push: {
                product: {
                  productId: productId,
                  price: productData.price,
                },
              },
            }
          );
        }
      } else {
        const data = new Cart({
          user: userId,
          product: [
            {
              productId: productId,
              price: productData.price,
            },
          ],
        });
        await data.save();
      }
      res.json({ success: true });
    } else {
      res.json({ failed: "signupplss" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//get checkout
const checkout = async (req, res) => {
  try {
    if (req.session.user) {
      const user = await User.findOne({ _id: req.session.user });
      const id = user._id;
      const cartData = await Cart.findOne({ user: id }).populate(
        "product.productId"
      );
      let Total;
      if (cartData.product != 0) {
        const total = await Cart.aggregate([
          {
            $match: { user: user._id },
          },
          {
            $unwind: "$product",
          },
          {
            $project: {
              price: "$product.price",
              quantity: "$product.quantity",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $multiply: ["$quantity", "$price"],
                },
              },
            },
          },
        ]).exec();
        Total = total[0].total;
        //pass the data to front
        const data = await User.findOne({
          name: req.session.name,
        });
        res.render("user/checkout", {
          address: data.address,
          total: Total,
          wallet: data.wallet,
        });
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//confermation after checkout
const confermation = async (req, res) => {
  try {
    const orderData = await Order.findOne().sort({ data: -1 }).limit(1);

    const userId = orderData.user;

    res.render("user/order_placed", { user: orderData });
  } catch (error) {
    console.log(error.message);
  }
};

//detete cart
const deleteCart = async (req, res) => {
  try {
    const id = req.body.id;
    const data = await Cart.findOneAndUpdate(
      { "product.productId": id },
      { $pull: { product: { productId: id } } }
    );
    if (data) {
      res.json({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//postAdrress
const postAddress = async (req, res) => {
  try {
    if (req.session.user) {
      const { name, country, town, district, postcode, phone } = req.body;
      const id = req.session.user;
      const data = await User.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            address: {
              name: name,
              country: country,
              town: town,
              district: district,
              postcode: postcode,
              phone: phone,
            },
          },
        },
        { new: true }
      );
      res.redirect("/checkout");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};
//change quantity
const changeQty = async (req, res) => {
  try {
    const userId = req.body.user;
    const productId = req.body.product;
    const value = Number(req.body.value);
    const stockAvailable = await productcollection.findById(productId);
    if (stockAvailable.quantity >= value) {
      await Cart.updateOne(
        {
          user: userId,
          "product.productId": productId,
        },
        {
          $set: { "product.$.quantity": value },
        }
      );
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error.message);
  }
};
//deleteAddress
const deleteAddress = async (req, res) => {
  try {
    if (req.session.user) {
      const userName = req.session.name;
      const id = req.query.id;
      await User.updateOne(
        { name: userName },
        {
          $pull: {
            address: {
              _id: id,
            },
          },
        }
      );
      res.redirect("/checkout");
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//cash on deivery--------
const postPlaceOrder = async (req, res) => {
  try {
    if (req.session.user) {
      const { total, address, payment, wallet, totalBefore } = req.body;
      const user = await User.findOne({
        name: req.session.name,
      });
      if (address === null) {
        res.json({ codFailed: true });
      }
      const cartData = await Cart.findOne({ user: user._id });
      const product = cartData.product;
      const status = payment == "cod" ? "placed" : "pending";
      const orderNew = new Order({
        deliveryDetails: address,
        totalAmount: total,
        status: status,
        user: user._id,
        paymentMethod: payment,
        product: product,
        wallet: wallet,
        totalBefore: totalBefore,
        discount: 0,
        Date: new Date(),
        couponCode: "",
      });
      await orderNew.save();
      let orderId = orderNew._id;
      if (orderNew.status == "placed") {
        const couponData = await Coupon.findById(req.session.couponId);
        if (couponData) {
          let newLimit = couponData.limit - 1;
          await Coupon.findByIdAndUpdate(couponData._id, {
            limit: newLimit,
          });
        }
        await Cart.deleteOne({ user: user._id });
        for (i = 0; i <  product.length; i++) {
          const productId =  product [i].productId;
          const quantity = Number( product [i].quantity);
          await productcollection.findByIdAndUpdate(productId, {
            $inc: { stock: -quantity },
          });
        }
        res.json({ codSuccess: true });
      } else {
        var options = {
          amount: total * 100, // amount in the smallest currency unit
          currency: "INR",
          receipt: "" + orderId,
        };
        instance.orders.create(options, function (err, order) {
          res.json({ order });
        });
      }
    } else {
      res.redirect("/");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// verify online payment
const verifyPayment = async (req, res) => {
  try {
    if (req.session.user) {
      let userData = await User.findOne({ name: req.session.name });
      const cartData = await Cart.findOne({ user: userData._id });
      const product = cartData.product;
      const details = req.body;
      const crypto = require("crypto");
      let hmac1 = crypto.createHmac("sha256", process.env.key_secret);
      console.log(hmac1);
      hmac1.update(
        details.payment.razorpay_order_id +
          "|" +
          details.payment.razorpay_payment_id
      );
      hmac1 = hmac1.digest("hex");

      if (hmac1 == details.payment.razorpay_signature) {
        let orderReceipt = details.order.receipt;

        const newOrder = await Order.find().sort({ date: -1 }).limit(1);

        const hai = newOrder.map((value) => {
          return value._id;
        });

        let test1 = await Order.findByIdAndUpdate(
          { _id: hai },
          { $set: { paymentId: details.payment.razorpay_payment_id } }
        ).then((value) => {
          console.log(value);
        });

        let test2 = await Order.findByIdAndUpdate(orderReceipt, {
          $set: { status: "placed" },
        });
        await Cart.deleteOne({ user: userData._id });
        for (i = 0; i < product.length; i++) {
          const productId = product[i].productId;
          const quantity = Number(product[i].quantity);
          await productcollection.findByIdAndUpdate(productId, {
            $inc: { stock: -quantity },
          });
        }
        res.json({ success: true });
      } else {
        await Order.deleteOne({ _id: details.order.receipt });
        res.json({ onlineSuccess: true });
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/serverERR", { message: error.message });
    console.log(error.message);
  }
};

// getordr
const getOrder = async (req, res) => {
  try {
    if (req.session.user) {
      const userData = await User.findOne({ name: req.session.name });
      const orderData = await Order.find({ user: userData._id });
      res.render("user/order", { user: req.session.name, data: orderData });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//signleorder
const singleOrder = async (req, res) => {
  try {
    if (req.session.user) {
      const id = req.query.id;
      const idLength = id.length;
      if (idLength != 24) {
        res.redirect("/IdMismatch");
      } else {
        const orderData = await Order.findById(id).populate(
          "product.productId"
        );
        if (orderData == null) {
          res.redirect("/IdMismatch");
        } else {
          res.render("user/single_order", {
            data: orderData.product,
            orderData,
          });
        }
      }
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/serverERR", { message: error.message });
    console.log(error.message);
  }
};
// applya coupon//
const applycoupon = async (req, res) => {
  try {
    let code = req.body.code;
    let amount = req.body.amount;
    let userData = await User.find({ name: req.session.name });
    let userexist = await Coupon.findOne({
      couponcode: code,
      used: { $in: [userData._id] },
    });
    if (userexist) {
      const couponData = await Coupon.findOne({ couponcode: code });
      if (couponData) {
        if (couponData.expiredate >= new Date()) {
          if (couponData.limit != 0) {
            if (couponData.mincartamount <= amount) {
              let discountvalue1 = couponData.couponamount;
              let distotal = Math.round(amount - discountvalue1);
              let percentagevalue = (discountvalue1 / amount) * 100;
              const discountvalue = parseFloat(percentagevalue.toFixed(2));
              let couponId = couponData._id;
              req.session.couponId = couponId;
              res.json({
                couponokey: true,
                distotal,
                discountvalue,
                code,
              });
            } else {
              res.json({ cartamount: true });
            }
          } else {
            res.json({ limit: true });
          }
        } else {
          res.json({ expire: true });
        }
      } else {
        res.json({ invalid: true });
      }
    } else {
      res.json({ user: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

//filter category-----------------
const filtercategory = async (req, res) => {
  try {
    let search = "";
    if (req.query.search) {
      search = req.query.search;
    }
    const categoryId = req.query.id;
    const data2 = await categorycollectons.find().lean();
    const data = await productcollection
      .find({ category: categoryId })
      .populate("category");
    const pageNO = req.query.page;
    const count = await productcollection
      .find(
        { category: categoryId },
        {
          $or: [
            { productname: { $regex: ".*" + search + ".*", $options: "i" } },
            { brand: { $regex: ".*" + search + ".*", $options: "i" } },
          ],
        }
      )
      .countDocuments();
    const perpage = 6;
    const totalpage = Math.ceil(count / perpage);
    let a = [];
    let i = 0;
    for (var j = 1; j <= totalpage; j++) {
      a[i] = j;
      i++;
    }

    //  const data = findproducts.filter((value)=>value.category._id==categoryId)
    res.render("user/products", { user: data, data2, total: a });
  } catch (error) {
    console.log(error.message);
  }
};

// update User data
const updateData = async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const mobile = req.body.mobile;
    const id = req.body.id;

    const data = await User.findByIdAndUpdate(id, {
      $set: { name: name, email: email, number: mobile },
    });
    if (data) {
      res.redirect("/getUserProfile");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//getUserProfile
const getUserProfile = async (req, res) => {
  try {
    if (req.session.user) {
      let userData = await User.findOne({ _id: req.session.user });
      res.render("user/userprofile", { data: userData });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error.message);
  }
};

//get edit address page

const editaddress = async (req, res) => {
  try {
    if (req.session.user) {
      const data = await User.findOne({
        _id: req.session.user,
        "address._id": req.query.id,
      }).lean();
      res.render("user/editaddress", { user: data.address });
    }
  } catch (error) {
    console.log(error);
  }
};

// post add address
const editpostaddress = async (req, res) => {
  try {
    if (req.session.user) {
      const data = await User.findOneAndUpdate(
        { _id: req.query.user },
        {
          $set: {
            "address.$": {
              name: req.body.name,
              town: req.body.town,
              postcode: req.body.postcode,
              phone: req.body.phone,
            },
          },
        }
      );
      if (data) {
        res.redirect("/checkout");
      }
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  getHome,
  getLogin,
  postsignup,
  getsignup,
  postlogin,
  getLogout,
  verifymail,
  blockuser,
  unblockuser,
  getproducts,
  getcart,
  getsingleproduct,
  addtocart,
  signupSubmit,
  verifyOtp,
  LoadOtp,
  checkout,
  confermation,
  deleteCart,
  postAddress,
  resendotp,
  changeQty,
  deleteAddress,
  getUserProfile,
  postPlaceOrder,
  verifyPayment,
  getOrder,
  singleOrder,
  applycoupon,
  filtercategory,
  updateData,
  editaddress,
  editpostaddress,
};

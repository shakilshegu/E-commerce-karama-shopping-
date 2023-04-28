const productscollection = require("../models/productModel");
const categorycollectons = require("../models/categoryModel");

// get products page  -------------------------------------
const getaddproducts = async (req, res) => {
  try {
    const category = await categorycollectons
      .find()
      .populate("category")
      .lean();
    res.render("admin/addproducts", { category: category });
  } catch (error) {
    console.log(error);
  }
};
// post add products---------------------------------------
const postproduct = async (req, res) => {
  try {
    console.log(req.body);
    const img = req.files.map((file) => file.filename);
    const products = new productscollection({
      productname: req.body.productname,
      brand: req.body.brand,
      price: req.body.price,
      description: req.body.description,
      quantity: req.body.quantity,
      category: req.body.category,
      image: img,
    });

    const productdata = await products.save();
    if (productdata) {
      res.redirect("/admin/products");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// get editproducts page ---------------------------
const editproducts = async (req, res) => {
  try {
    const categorydata = await categorycollectons.find();
    const id = req.query.id;
    const productData = await productscollection
      .findOne({ _id: id })
      .populate("category")
      .lean();

    if (productData) {
      res.render("admin/editproducts", {
        user: productData,
        category: categorydata,
      });
    } else {
      res.redirect("/editproduct");
    }
  } catch (error) {
    console.log(error.message);
  }
};

// post edit products---------------------------------
const editpostproduct = async (req, res) => {
  try {
    console.log(req.body);
    // const cateName = await categorycollectons.findOne({name:req.body.category}).lean()

    if (req.files) {
      const existingProduct = await productscollection.findById(req.query.id);
      let images = existingProduct.image;
      req.files.forEach((file) => {
        images.push(file.filename);
      });
      var img = images;
    }
    await productscollection.updateOne(
      { _id: req.query.id },
      {
        $set: {
          productname: req.body.productname,
          brand: req.body.brand,
          price: req.body.price,
          description: req.body.description,
          quantity: req.body.quantity,
          category: req.body._id,
          image: img,
        },
      }
    );
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};

//delete products-------------------------
const deleteproduct = async (req, res) => {
  try {
    const id = req.query.id;
    await productscollection.deleteOne({ _id: id });
    res.redirect("/admin/products");
  } catch (error) {
    console.log(error.message);
  }
};

//remove products-------------------------------------
const removeimage = async (req, res) => {
  try {
    let id = req.body.id;
    let position = req.body.position;
    let productImg = await productscollection.findById(id);
    let image = productImg.image[position];
    await productscollection.updateOne(
      { _id: id },
      { $pullAll: { image: [image] } }
    );
    res.json({ remove: true });
  } catch (error) {
    res.render("admin/500");
    console.log(error);
  }
};

module.exports = {
  getaddproducts,
  postproduct,
  editproducts,
  editpostproduct,
  deleteproduct,
  removeimage,
};

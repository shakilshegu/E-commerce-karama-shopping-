const categorycollection = require("../models/categoryModel");

//get category-----------------------------------------
const getaddcategory = async (req, res) => {
  try {
    res.render("admin/addcategory");
  } catch (error) {
    console.log(error.message);
  }
};
//post add category----------------------------------
const postaddCategory = async (req, res) => {
  try {
    const category = req.body.category;
    const existingCategory = await categorycollection.findOne({
      name: { $regex: category, $option: "i" },
    });
    if (existingCategory) {
      res.render("admin/addcategory", { message: "category already exist " });
    } else {
      const resulte = await categorycollection.create({ category: category });
      if (category) {
        res.render("admin/addcategory");
      } else {
        res.redirect("addcategory");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
//edit category-------------------------------------------------
const editcategory = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await categorycollection.findById(id);
    console.log(data);
    let { id: _id } = data;
    res.render("admin/editCategory", { data, id });
  } catch (error) {
    console.log(error);
  }
};
//edit category-----------------------------------
const editpostcategory = async (req, res) => {
  const id = req.params.id;
  const obj = {
    categoryName: req.body.category,
  };
  try {
    const dataRes = await categorycollection.findByIdAndUpdate(id, {
      category: obj.categoryName,
    });

    const data = await categorycollection.find();
    res.render("admin/category", { data });
  } catch (err) {
    res.send(err.message);
  }
};
//list and unlist category-------
const unlistCategory = async (req, res) => {
  const id = req.query.id;
  const data = await categorycollection.findOne({ _id: id });
  if (data.status == false) {
    await categorycollection.findOneAndUpdate(
      { _id: id },
      { $set: { status: true } }
    );
  } else {
    await categorycollection.findOneAndUpdate(
      { _id: id },
      { $set: { status: false } }
    );
  }
  res.redirect("/admin/category");
};

module.exports = {
  postaddCategory,
  editcategory,
  editpostcategory,
  getaddcategory,
  unlistCategory,
};

const Product = require("../models/productModel");
const path = require("path");

module.exports.createProduct = async (req, res) => {
  try {
    req.body.user = req.user.userId;
    const product = await Product.create(req.body);
    res.status(201).json({ msg: "Product Created", Product: product });
  } catch (error) {
    res.status(501).json({ msg: "Server Error", Eror: error.message });
  }
};
module.exports.getAllProducts = async (req, res) => {
  try {
    const product = await Product.find({});
    if (!product) {
      return res.status(401).json({ msg: "no product found" });
    }
    res.status(201).json({ msg: "All product", Product: product });
  } catch (error) {
    res.status(501).json({ msg: "Some error occured", Error: error.message });
  }
};

module.exports.getSingleProduct = async (req, res) => {
  const { id:productId } = req.params; // id = productId
  try {
    const product = await Product.findById({_id:productId}).populate('review');
    if (!product) {
      return res.status(401).json({ msg: "no product found" });
    }
    res.status(201).json({ msg: "Product", Product: product });
  } catch (error) {
    res.status(501).json({ msg: "Some error occured", Error: error.message });
  }
};

module.exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(401).json({ msg: "no product found" });
    }
    res.status(201).json({ msg: "Updated Product", Product: product });
  } catch (error) {
    res.status(501).json({ msg: "Some error occured", Error: error.message });
  }
};
module.exports.deleteProduct = async (req, res) => {
  const { id: productId } = req.params;
  try {
    const product = await Product.findOne({_id:productId });
    if (!product) {
      return res.status(401).json({ msg: "no product found" });
    }
    await product.remove();
    res.status(201).json({ msg: "Deleted Product", Product: product });
  } catch (error) {
    res.status(501).json({ msg: "Some error occured", Error: error.message });
  }
};
module.exports.uploadImage = async (req, res) => {
//   console.log(req.files);
  try {
    if (!req.files) {
      return res.status(401).json({ msg: "no file uploaded" });
    }
    const productImage = req.files.image;
    if (!productImage.mimetype.startsWith("image")) {
      return res.status(401).json({ msg: "plz upload image" });
    }
    const maxSize = 1024 * 1024;
    if (productImage.size > maxSize) {
      return res
        .status(401)
        .json({ msg: "plz upload image smaller than 1 mb" });
    }
    const imagePath = path.join(
      __dirname,
      "../public/uploads" + `${productImage.name}`
    );
    await productImage.mv(imagePath);
    res.status(201).json({ image: `uploads/${productImage.name}` });
  } catch (error) {
    res.status(501).json({ msg: "Some error occured", Error: error.message });
  }
};

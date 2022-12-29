const express = require("express");
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} = require("../controller/productController");

const { getSingleProductReviews } = require("../controller/reviewController");

const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authenticate");

router
  .route("/")
  .post([authenticateUser, authorizePermission("admin")], createProduct)
  .get(getAllProducts);

  
router.route("/uploadImage")
.post([authenticateUser,authorizePermission('admin')],uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch([authenticateUser, authorizePermission("admin")], updateProduct)
  .delete([authenticateUser, authorizePermission("admin")], deleteProduct);

router.route('/:id/reviews')
.get(getSingleProductReviews)


module.exports = router;

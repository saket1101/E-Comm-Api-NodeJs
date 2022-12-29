const express = require("express");
const {
  getAllOrders,
  createOrder,
  getCurrentUserOrder,
  getSingleOrder,
  updateOrder,
} = require("../controller/orderController");
const router = express.Router();

const {
  authenticateUser,
  authorizePermission,
} = require("../middleware/authenticate");

router
  .route("/")
  .post(authenticateUser, createOrder)
  .get(authenticateUser, authorizePermission("admin"), getAllOrders);

router.route("/showAllMyOrders").get(authenticateUser, getCurrentUserOrder);

router
  .route("/:id")
  .get(authenticateUser, getSingleOrder)
  .patch(authenticateUser, updateOrder);

  module.exports = router
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const checkPermission = require("../utilies/permission");

const fakeStripeApi = async (amount, currency) => {
  const client_Secret = "somerandomvalud";
  return { client_Secret, amount };
};

module.exports.getAllOrders = async (req, res) => {
  try {
    const order = await Order.find({});
    res
      .status(201)
      .json({ msg: "AllOrders", Order: order, Count: order.length });
  } catch (error) {
    res.status(501).json({ msg: "some error occured", Error: error.message });
  }
};
module.exports.getSingleOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res
        .status(401)
        .json({ msg: `no order found with this id : ${orderId}` });
    }
    checkPermission(req.user, order.user);
    res.status(201).json({ msg: "Your order", order: order });
  } catch (error) {
    res.status(501).json({ msg: "some error occured", Error: error.message });
  }
};
module.exports.getCurrentUserOrder = async (req, res) => {
  try {
    const orders = await Order.findOne({ user: req.user.userId });
    res
      .status(201)
      .json({ msg: "your order", orders: orders, count: orders.length });
  } catch (error) {
    res.status(501).json({ msg: "some error occured", Error: error.message });
  }
};
module.exports.updateOrder = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    const { paymentIntentId } = req.body;
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      return res
        .status(401)
        .json({ msg: `no order found with this id : ${orderId}` });
    }
    checkPermission(req.user, order.user);
    order.paymentIntentId = paymentIntentId;
    order.status = "confirmed";
    await order.save();
    res.status(201).json({ msg: "order Updated", order: order });
  } catch (error) {}
};
module.exports.createOrder = async (req, res) => {
  try {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 0) {
      return res.status(401).json(`No Item found in cart`);
    }
    if (!tax || !shippingFee) {
      return res.status(401).json({ msg: "no tax or shippingFee included" });
    }
    let orderItems = [];
    let subTotal = 0;
    for (const item of cartItems) {
      const dbProduct = await Product.findOne({ _id: item.product });
      console.log(dbProduct);
      if (!dbProduct) {
        return res
          .status(401)
          .json({ msg: `no cart item found with Id : ${item.product}` });
      }
      const { name, price, image, _id } = dbProduct;
      const singleOrderItems = {
        amount: item.amount,
        name,
        price,
        image,
        product: _id,
      };
      // add item to order
      orderItems = [...orderItems, singleOrderItems];
      // calculate item
      subTotal += item.amount * price;
    }
    // calculate total value
    const total = tax + shippingFee + subTotal;
    // set fake strip payment api for client secret
    const paymentIntent = await fakeStripeApi({
      amount: total,
      currency: "INR",
    });
    const order = await Order.create({
      tax,
      shippingFee,
      subTotal,
      total,
      orderItems,
      clientSecret: paymentIntent.client_Secret,
      user: req.user.userId,
    });
    // console.log(orderItem);
    // console.log(subTotal);
    res
      .status(201)
      .json({ msg: "created orders", order, clientSecret: order.clientSecret });
  } catch (error) {
    res.status(501).json({ msg: "some error occured", Error: error.message });
  }
};

const Review = require("../models/reviewModel");
const Product = require("../models/productModel");
const checkPermission = require("../utilies/permission");

module.exports.getAllReviews = async (req, res) => {
    try{
        const review = await Review.find().populate({path:'product',select:'name company price'})
        if(!review){
            return res.status(201).send('No reviews found')
        }
        res.status(201).json({ msg: "All Reviews",Review:review,Count:review.length });

    }catch(error){
        res.status(501).json({msg:"Some error occured",Error:error})
    }
};
module.exports.getSingleReview = async (req, res) => {
    try{
        const {id:reviewId} = req.params;
        const review = await Review.findOne({reviewId})
        if(!review){
            return res.status(201).send('No reviews found')
        }
        res.status(201).json({ msg: "Your review",Review:review });

    }catch(error){
        res.status(501).json({msg:"Some error occured",Error:error})
    }
};

module.exports.createReview = async (req, res) => {
  try {
    const { product: productId } = req.body;

    const isProductAval = await Product.findOne({ _id: productId });
    if (!isProductAval) {
      return res.status(401).json({ msg: "Product is not available" });
    }
    const isReviewSubmitted = await Review.findOne({
      product: productId,
      user: req.user.userId,
    });
    if (isReviewSubmitted) {
      return res.status(201).json({ msg: "review has already submited" });
    }
    req.body.user = req.user.userId;
    const review = await Review.create(req.body);
    res.status(201).json({ msg: "review created", Review: review });
  } catch (error) {
    res.status(501).json({ msg: "Some error occured", Error: error });
  }
};
module.exports.updateReview = async (req, res) => {
    try{
        const {id:reviewId} = req.params;

        const {title,comment,ratings} = req.body;

        const review = await Review.findOne({_id:reviewId})
        if(!review){
            return res.status(201).send('No reviews found')
        }
        review.title = title;
        review.comment = comment;
        review.ratings = ratings;

        checkPermission(req.user,review.user)

        await review.save();

        res.status(201).json({ msg: "Updated Reviews",Reviews:review });

    }catch(error){
        res.status(501).json({msg:"Some error occured",Error:error})
    }
};
module.exports.deleteReview = async (req, res) => {
    try{
        const {id:reviewId} = req.params;
        // console.log(reviewId);
        const review = await Review.findOne({_id:reviewId})
        if(!review){
            return res.status(201).send('No reviews found')
        }
        checkPermission(req.user,req.review);
        await review.remove();
        res.status(201).json({ msg: "Review Deleted Successfully" });

    }catch(error){
        res.status(501).json({msg:"Some error occured",Error:error})
    }
};

module.exports.getSingleProductReviews = async (req,res)=>{
    try{
        const {id:productId} = req.params
        const review = await Review.find({product:productId})

        res.status(201).json({msg:"Reviews are...",Review:review,Count:review.length})

    }catch(error){
        res.status(501).json({msg:"Some error occured",Error:error})
    }
}
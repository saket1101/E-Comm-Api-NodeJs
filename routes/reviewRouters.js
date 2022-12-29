const express = require('express');
const { getAllReviews, createReview, getSingleReview, updateReview, deleteReview } = require('../controller/reviewController');
const router = express.Router();
const {authenticateUser} = require('../middleware/authenticate')

router.route('/').get(getAllReviews).post(authenticateUser,createReview);

router.route('/:id')
.get(getSingleReview)
.patch(authenticateUser,updateReview)
.delete(authenticateUser,deleteReview)


module.exports = router
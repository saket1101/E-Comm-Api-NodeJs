const mongoose = require('mongoose');
const {Schema} = require('mongoose');''
mongoose.set('strictPopulate',false)

const reviewSchema = new Schema({
    title:{
        type:String,
        required:[true,'plz prodvide title'],
        maxlength:100
    },
    comment:{
        type:String,
        required:[true,'plz provide comment'],
        maxlength:[500, 'comment should not be more than 500 characters']
    },
    ratings:{
        type:Number,
        required:true,
        max:5,
        min:1,
        default:4
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:true
    }
},{timestamps:true});

reviewSchema.index({product:1,user:1},{unique:true});

reviewSchema.statics.calculateAverageRating = async function(productId){
    const result = await this.aggregate([
        {$match:{product:productId}},
        {group:{
            _id:null,
            averageRating:{$avg:"$rating"},
            noofReviews:{$sum:1}
        }}
    ]);
    try{
        this.model('Product').findOneAndUpdate({_id:productId},{
            averageRating:Math.ceil(result[0]?.averageRating || 0),
            noofReviews:result[0]?.noofReviews || 0
        })

    }catch(error){
        console.log(error)
    }
}

reviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product);
})

reviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product);

})

const Review = mongoose.model('Review',reviewSchema);

module.exports = Review
const mongoose = require('mongoose');
const {Schema} = require('mongoose');
mongoose.set({'strictPopulate':false})


const productSchema = new Schema ({
    name:{
        type:String,
        trim:true,
        required:[true,'please provide product name']
    },
    price:{
        type:String,
        required:[true,'plz provide price'],
        default:0
    },
    description:{
        type:String,
        required:[true,'plz provide description'],
        maxlength:[1000,'description should not be more than 1000 characters']
    },
    category:{
        type:String,
        required:[true,'plz provide category'],
        enum:['office','kitchen','bedroom']
    },
    color:{
        type:[String],
        default:['#222'],
        required:[true,'plz provide color']
    },
    image:{
        type:String,
        default:'uploads/example.jpeg'

    },
    company:{
        type:String,
        required:[true,'plz provide company'],
        enum:{
            values:['ikea','lakme','tata'],
            message:'{VALUE} is not mentioned'
        }
    },
    feature:{
        type:Boolean,
        default:false
    },
    inventory:{
        type:Number,
        required:true,
        default:15
    },
    freeShipping:{
        type:Boolean,
        default:false
    },
    averageRating:{
        type:Number,
        default:0
    },
    nofReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true, toJSON:{virtuals:true},toObject:{virtuals:true}});

productSchema.virtual('review',{
ref:'Review',
localField:'_id',
foreignField:'product',
justOne:false

})

productSchema.pre('remove',async function (next){
    this.model('Review').deleteMany({product:this._id});
})

const Product = mongoose.model('Product',productSchema)

module.exports = Product
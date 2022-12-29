const mongoose = require('mongoose')

mongoose.set("strictQuery",true)

const connectDb = (url)=>{
    mongoose.connect(url)
}

module.exports = connectDb
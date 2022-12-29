const mongoose = require('mongoose');
const {Schema} = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt')

const userSchema =new Schema ({
name:{
    type:String,
    required:[true,'plz provide your name'],
    min:3
},
email:{
    type:String,
    required:[true,'plz provide your email'],
    unique:true,
    validate:{
        validator:validator.isEmail,
        msg:'plz provide a valid email'
    }
},
password:{
    type:String,
    required:[true,'plz provide your password'],
    minlength:[8,'your password shoud be more than  8 letter']
},
role:{
    type:String,
    enum:['admin','user'],
    default:'user'
}
});
userSchema.pre('save',async function(){
    // console.log(this.modifiedPaths())
    // console.log(this.isModified('name'));
    if(!this.isModified('password'))return;
    const gensalt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,gensalt)
})

userSchema.methods.comparePassword = async function(userPassword){
    // console.log(userPassword);
    const isMatch = await bcrypt.compare(userPassword,this.password);
    // console.log(isMatch)
    return isMatch;
}

const User = mongoose.model('User',userSchema);

module.exports = User;
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require("../models/task");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate(value){
             if(!validator.isEmail(value)){
                 throw new Error("Invalid Email-id");
             }
        }
    },
    
    password: {

        type: String,
        required: true,
        minlength: 6
    },

    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},{
    timestamps: true
})

userSchema.virtual("task",{
    ref: "tasks",
    localField: "_id",
    foreignField: "owner"
})

userSchema.methods.generateAuthToken = async function(){
    
    const user = this;
    //console.log(user._id);
    const token = jwt.sign({_id: user._id.toString()},'thisissecretkey');
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
}

userSchema.methods.toJSON = function(){
    const user = this;
    //console.log(user);
    const userObj = user.toObject();
    //console.log(user.email);
    delete userObj.password;
    delete userObj.tokens;
    delete userObj.avatar;
    //console.log(user);
    return userObj;

}
userSchema.statics.findByCredentials = async (email,password) => {

    const user = await User.findOne({email});
    //console.log(user);
    if (!user){
        throw new Error("Unable to login");
    }

    const user_password = await bcrypt.compare(password,user.password);
    //console.log(user_password);
    if (!user_password){
        throw new Error("Unable to login");
    }
    return user;
}

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    //console.log(user.password);

    next();
})

userSchema.pre('remove',async function(next){

    const user = this;
    await Task.deleteMany({owner: user._id});
    next();
})
const User = mongoose.model("Users",userSchema);


module.exports = User
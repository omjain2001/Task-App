const mongoose = require("mongoose");
const validator = require("validator");
const config = require("config");

const connectionURL = config.get("dbConnectionUrl");
mongoose.connect(connectionURL, {
  useNewUrlParser: true,
  useCreateIndex: true,
});

console.log("database connected");

/*
const db = mongoose.model("task-manager-api",{
    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        default: 18,
        validate(value){
            if (value < 18){
                throw new Error("Only Adults are allowed for the assigned task.");
            }
        }
        
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address !!!");
            }
        }
    }

})
*/

/*
const user1 = new db({
    name: "Om",
    email: "omjain639@gmail.com",
    age: 19
})
const user2 = new db({
    name: "Mahima",
    age: 22,
    email: "mhsi@dksd.com"
})


user1.save().then((result) => {
    console.log(user1);
}).catch(error => {
    console.log("Error!!!");
})

user2.save().then(result => {
    console.log(result);
}).catch(error => {
    console.log("Error!!");
})
*/

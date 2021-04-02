const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../../src/models/user");
const Task = require("../../src/models/task");


const userOne = {

    _id: new mongoose.Types.ObjectId(),
    name: "Om Prasanna Jain",
    email: "omjain639@gmail.com",
    password: "omjain_26",
    tokens: [{
        token: jwt.sign({_id: this._id},process.env.jwtSecretKey)
    }]
}

const userTwo = {

    _id: new mongoose.Types.ObjectId(),
    name: "Om",
    email: "omjain639@gmail.com",
    password: "omjain_26",
    tokens: [{
        token: jwt.sign({_id: this._id},process.env.jwtSecretKey)
    }]
}

const taskOne = {

    _id: new mongoose.Types.ObjectId(),
    description: "Play Badminton",
    completed: false,
    owner: userOne._id
}

const taskTwo = {

    _id: new mongoose.Types.ObjectId(),
    description: "Play Cricket",
    completed: true,
    owner: userOne._id
}

const taskThree = {

    _id: new mongoose.Types.ObjectId(),
    description: "Do all assignments",
    completed: false,
    owner: userTwo._id
}

const setDataBase = async () => {
    
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
}


module.exports = {

    userOne,
    taskOne,
    taskTwo,
    taskThree,
    setDataBase
}
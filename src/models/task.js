const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./user");

const taskSchema = new mongoose.Schema({

    description: {
        type: String,
        required: true
    },

    completed: {
        type: Boolean,
        default: false
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
},{
    timestamps: true
});

taskSchema.pre('save', async function(next){
    if (this.isModified('secret_method')){
        this.secret_method = await bcrypt.hash(this.secret_method,8);
    }
})
const Task = mongoose.model("tasks",taskSchema);

module.exports = Task;
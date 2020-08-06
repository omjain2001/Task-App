const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const taskRouter = new express.Router();

taskRouter.post("/tasks",auth,async (req,res) => {

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    
    try{
        await task.save();
        res.status(201).send(task);
    } catch(e){
        res.status(400).send(e.message);
    }
    
    
    
    /*
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(200).send("Task created successfully");
    } catch(e){
        res.status(400).send("Enter required field");
    }
    */
    /*
    task.save().then(() => {
        console.log(task);
        res.status(200).send("Task created successfully");
    }).catch(error => {
        res.status(400).send("Enter required field");
    })
    */
})

taskRouter.get("/tasks",auth,async (req,res) => {
    
    try {
        const match = {};
        var sort = {};
        if (req.query.completed){
            match.completed = (req.query.completed==='true');
        }
        if (req.query.sortBy){
            const arr = req.query.sortBy.split(":");
            sort[arr[0]] = arr[1]==='desc' ? -1 : 1;
        } 
        //const task = await Task.find({owner: req.user._id});
        // Alternative method ...... 
        await req.user.populate({
            path: 'task',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.task);
    } catch (e){
        res.status(404).send("Error occurred while fetching the tasks");
    }
    
    /*
    Task.find({}).then(task => {
        res.send(task);
    }).catch(error => {
        res.status(404).send("Error occurred while fetching the tasks");
    })
    */
})

taskRouter.get("/tasks/:id",auth,async (req,res) => {
    try{
        const task = await Task.findOne({_id: req.params.id,owner: req.user._id});
        if (!task){
            return res.status(401).send("Task not found !!");
        }
        res.send(task);
    } catch(e) {
        res.status(400).send({Error: "Invalid Id"});
    }
    
    /*
    Task.findOne({
        _id: req.params.id
    }).then((task) => {
        res.send(task);
    }).catch(() => {
        res.status(400).send({Error: "Invalid Id"});
    })
    */
})



taskRouter.patch("/tasks/:id",auth,async (req,res) => {

    const updates = Object.keys(req.body);
    const allowedUpdate = Object.keys(Task.schema.obj);
    const isValid = updates.every(value => {
        return allowedUpdate.includes(value);
    })

    if (!isValid){
        res.status(400).send("Invalid key");
    }
    try{

        const task = await Task.findOne({_id: req.params.id, owner: req.user._id});
        updates.forEach(update => task[update] = req.body[update]);
        await task.save();
        //const updated_task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true});
        if (!task){return res.status(400).send("Task not found . Try again")}
        res.status(200).send("Task Updated successfully");
    } catch(e){
        res.status(400).send(e.message);
    }
    
})



taskRouter.delete("/tasks/:id",auth,async (req,res) => {
    try{
        const deleted_task = await Task.findOneAndDelete({_id: req.params.id,owner: req.user._id});
        if (!deleted_task){
            return res.status(401).send("Task not found !!");
        }
        res.status(201).send(deleted_task);
    } catch(e){
        res.status(400).send("Item not found!!");
    }
})

module.exports = taskRouter;
/*    Notes     
1. Remaining part - email sending and after that video 146 -  Mocking Libraries
*/

const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user");
const taskRouter = require("./routers/task");
const config = require("config");

const app = express();
const port = config.get("PORT");

app.use(express.json());
app.use(userRouter, taskRouter);
//app.use(taskRouter);

app.listen(port, () => {
  console.log("App started on port : " + port);
});

/*
const multer = require("multer");
const upload = new multer({
    dest: "images",
    limits: {
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        
        if(!file.originalname.match(/\.(doc|docx)$/)){
            cb(new Error("File should be in pdf format."));
        }   
        cb(undefined,true);
        
        
        
    }
})

app.post("/upload", upload.single('upload'),(req,res) => {
    
    res.send();
},(error,req,res,next) => { // This is the callback function which express recognizes to call 
                            // when uncaught error is present.
    
    res.status(400).send({error: "Please upload word document only."});
})

*/

/*
const User = require("./models/user");
const main = async () => {

    const user = await User.findById("5f22c4a30fc341223021421c");
    console.log(user);
    await user.populate("task").execPopulate();
    console.log(user.task);
}

main();
*/

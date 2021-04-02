const express = require("express");
const User = require("../models/user");
const userRouter = new express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");
const sharp = require("sharp");

userRouter.post("/users", async (req, res) => {
  const user = new User(req.body);

  // Instead of using .then() and .catch(), we are using async-await and try-catch to catch the error.
  try {
    const get_user = await User.findOne({ email: user.email });
    if (get_user) {
      throw new Error("User already exist");
    }

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e.message);
  }

  /*
    user.save().then(result => {
        console.log(user);
        res.status(200).send("http request successful");
    }).catch(error => {
        console.log(error);
        res.status(411).send(error.message);
    })
    */
});

userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(401).send("Invalid Credentials :(");
  }
});

userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.send("Logged Out successfully :)");
  } catch (e) {
    res.status(400).send("Error occured !!");
  }
});

userRouter.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send("Logged Out all the users successfully.");
  } catch (e) {
    res.status(400).send("Error in logging out !!");
  }
});

userRouter.get("/users/me", auth, async (req, res) => {
  res.send(req.user);
  /*
    try{
        const user = await User.find({});
        res.status(200).send(user);
    } catch(e){
        res.status(400).send(e);
    }
    */

  /*
    User.find({}).then(data => {
        res.send(data);
    })
    */
});

userRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "name email");
    if (!user) {
      return res.status(400).send("User not found !!");
    }
    res.status(200).send(user);
  } catch (e) {
    res.status(404).send(e);
  }
  /*
    User.findById(req.params.id,'name email').then(data => {
        if (!data){
            return res.status(404).send("Enter the id");
        }
        res.send(data);
    }).catch(error => {
        res.status(404).send("Invalid Id");
    })
    */
});

userRouter.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = Object.keys(User.schema.obj);
  const isValid = updates.every((key) => {
    return allowedUpdates.includes(key);
  });

  if (!isValid) {
    return res.status(402).send("Invalid Value");
  }
  try {
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    //res.send("Updated successfully :)");

    //const updated_user = await User.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true});
    res.status(201).send(req.user);
  } catch (e) {
    res.status(400).send("Can't Update the user.");
  }
});

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    // const deleted_user = await User.findByIdAndDelete(req.params.id);
    // if(!deleted_user){
    //     return res.status(400).send("User not found !!");
    // }
    res.status(201).send("Deleted Successfully");
  } catch (e) {
    res.status(401).send("User does not exist.");
  }
});
const avatar = multer({
  // If you want buffer of file object, then don't provide 'dest'
  // in the options object.
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      cb(new Error("Please upload only .jpg or .png images"));
    }
    cb(undefined, true);
  },
});
userRouter.post(
  "/users/me/avatar",
  auth,
  avatar.single("avatar"),
  async (req, res) => {
    // req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 300, height: 300 })
      .jpeg()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send(req.user.avatar);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

userRouter.delete("/users/me/avatar", auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
});

userRouter.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new Error();
    }
    user.set("Content-Type", "image/jpg");
    res.send(user.avatar);
  } catch (e) {
    res.status(404).send("Image not found");
  }
});

module.exports = userRouter;

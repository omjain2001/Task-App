const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const {
    userOne,
    taskOne,
    taskTwo,
    taskThree,
    setDataBase

} = require("./fixtures/db");

beforeEach(setDataBase);

test("Should sign up the user",async () => {

    const response = await request(app).post("/users").send({
        name: "Om P. Jain",
        email: "omjain2606@gmail.com",
        password: "omjain_06"
    }).expect(201);

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(response.body).toMatchObject({
        user: {
            name: "Om Prasanna Jain",
            email: "omjain639@gmail.com",
            password: "omjain_26"
        },
        token: user.tokens[0].token
    })
})

test("Should Login a user",async () => {

    const response = await request(app)
    .post("/users/login")
    .send({
        email: "omjain639@gmail.com",
        password: "omjain_26"
    })
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .expect(200);

    const user = await User.findById(response.body.user._Id);
    expect(user.tokens[1].token).toBe(response.body.token);

})

test("Should delete the user", async () => {

    await request(app)
    .delete("/users/me")
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOne._id);
    expect(user).toBeNull();
})

test("Should upload the avatar", async () => {

    await request(app)
    .post("/users/me/avatar")
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .attach('avatar','tests/fixtures/profile-pic.jpg')
    .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.avatar).toEqual(expect.any('Buffer'));
})

test("Should update User", async () => {

    await request(app)
    .patch("/users/me")
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name: "Om Jain"
    })
    .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.name).toBe("Om Jain");
})

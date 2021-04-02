const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const User = require("../src/models/user");
const {
    userOne,
    taskOne,
    taskTwo,
    taskThree,
    setDataBase

} = require("./fixtures/db");

beforeEach(setDataBase);

test("Should create a task", async () => {

    const response = await request(app)
    .post("/tasks")
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        description: "Learn Nodejs"
    })
    .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();

})

test("Should get tasks", async () => {

    await request(app)
    .get("/tasks")
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOne._id);
    expect(user.task.length).toBe(2);
})

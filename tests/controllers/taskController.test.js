const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../../app");
require("../setup");

let token;
let userId;

beforeAll(async () => {
  const registerResponse = await request(app).post("/auth/register").send({
    name: "Test User",
    email: "test@example.com",
    password: "password123",
  });

  userId = registerResponse.body.user.id;

  const loginResponse = await request(app).post("/auth/login").send({
    email: "test@example.com",
    password: "password123",
  });

  token = loginResponse.body.token;
});

describe("Task Controller", () => {
  describe("POST /task", () => {
    it("should create a new task", async () => {
      const res = await request(app)
        .post("/task")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          description: "This is a test task",
          dueDate: "2024-12-31T00:00:00.000Z",
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty("message", "Task created successfully!");
      expect(res.body.task).toHaveProperty("status", "Pending"),
        expect(res.body.task).toHaveProperty("title", "Test Task");
      expect(res.body.task).toHaveProperty(
        "description",
        "This is a test task",
      );
      expect(res.body.task).toHaveProperty(
        "dueDate",
        "2024-12-31T00:00:00.000Z",
      );
    });
  });

  describe("GET /task", () => {
    it("should fetch all tasks for the authenticated user", async () => {
      const res = await request(app)
        .get("/task")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    });
  });

  describe("PATCH /task/:id", () => {
    let taskId;

    beforeAll(async () => {
      const createResponse = await request(app)
        .post("/task")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Test Task",
          description: "This is a test task",
          dueDate: "2024-12-31T00:00:00.000Z",
        });

      taskId = createResponse.body.task.taskId;
    });

    it("should update the task", async () => {
      const res = await request(app)
        .patch(`/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Updated Task Title",
          description: "Updated description",
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Task updated successfully!");
      expect(res.body.task).toHaveProperty("title", "Updated Task Title");
    });
  });

  describe("DELETE /task/:id", () => {
    let taskId;

    beforeAll(async () => {
      const createResponse = await request(app)
        .post("/task")
        .set("Authorization", `Bearer ${token}`)
        .send({
          title: "Task to be deleted",
          description: "This task will be deleted",
          dueDate: "2024-12-31T00:00:00.000Z",
        });

      taskId = createResponse.body.task.taskId;
    });

    it("should delete the task", async () => {
      const res = await request(app)
        .delete(`/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("message", "Task successfully removed!");

      const task = await request(app)
        .get(`/task/${taskId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(task.statusCode).toEqual(404);
    });
  });
});

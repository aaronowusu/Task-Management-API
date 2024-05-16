const mongoose = require("mongoose");
const Task = require("../../models/task");
const User = require("../../models/user");
require("../setup");

describe("Task Model Test", () => {
  let user;

  beforeAll(async () => {
    user = new User({
      name: "Test User",
      email: "testuser@example.com",
      password: "password123",
    });
    await user.save();
  });

  it("should create a task successfully", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      user: user._id,
    };
    const validTask = new Task(taskData);
    const savedTask = await validTask.save();

    expect(savedTask._id).toBeDefined();
    expect(savedTask.title).toBe(taskData.title);
    expect(savedTask.description).toBe(taskData.description);
    expect(savedTask.status).toBe("Pending");
    expect(savedTask.user.toString()).toBe(user._id.toString());
  });

  it("should fail to create a task without required fields", async () => {
    const taskWithoutRequiredField = new Task({
      description: "Test Description",
    });
    await expect(taskWithoutRequiredField.save()).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });

  it("should only allow valid enum values for status", async () => {
    const taskData = {
      title: "Test Task",
      description: "Test Description",
      user: user._id,
      status: "InvalidStatus",
    };
    const invalidTask = new Task(taskData);

    await expect(invalidTask.save()).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });
});

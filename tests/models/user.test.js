const mongoose = require("mongoose");
const User = require("../../models/user");
require("../setup");

describe("User Model Test", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should create a user successfully", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };
    const validUser = new User(userData);
    const savedUser = await validUser.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).not.toBe(userData.password);
  });

  it("should fail to create a user without required fields", async () => {
    const userWithoutRequiredField = new User({ name: "John Doe" });
    await expect(userWithoutRequiredField.save()).rejects.toThrow(
      mongoose.Error.ValidationError,
    );
  });

  it("should fail to create a user with a duplicate email", async () => {
    const userData = {
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    };
    const user1 = new User(userData);
    await user1.save();

    const user2 = new User(userData);
    await expect(user2.save()).rejects.toThrow(mongoose.mongo.MongoServerError);
  });
});

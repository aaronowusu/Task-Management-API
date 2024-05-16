const request = require("supertest");
const app = require("../../app");
require("../setup");

describe("Auth Controller", () => {
  describe("POST /auth/register", () => {
    it("should register a new user", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty(
        "message",
        "User registered successfully!",
      );
      expect(res.body).toHaveProperty("user");
    });

    it("should return validation error if email is invalid", async () => {
      const res = await request(app).post("/auth/register").send({
        name: "Test User",
        email: "invalid-email",
        password: "password123",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("errors");
    });
  });

  describe("POST /auth/login", () => {
    it("should login a user and return a token", async () => {
      await request(app).post("/auth/register").send({
        name: "Test User",
        email: "testlogin@example.com",
        password: "password123",
      });

      const res = await request(app).post("/auth/login").send({
        email: "testlogin@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return error if credentials are invalid", async () => {
      const res = await request(app).post("/auth/login").send({
        email: "nonexistent@example.com",
        password: "password123",
      });

      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty("message", "Invalid credentials");
    });
  });
});

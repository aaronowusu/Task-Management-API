const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const taskSchema = new Schema(
  {
    taskId: { type: Schema.Types.ObjectId, ref: "Task" },
    title: { type: String },
    description: { type: String },
  },
  { _id: false },
);

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  tasks: [taskSchema],
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model("User", UserSchema);

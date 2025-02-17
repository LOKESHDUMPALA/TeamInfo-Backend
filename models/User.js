const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    role: String,
    name: String,
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    teamname: String,
    projectname: String,
    progress: { type: Number, default: 0 }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

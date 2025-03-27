const mongoose = require("mongoose");

const SignUpSchema = mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const SignUpUser = mongoose.model('Users', SignUpSchema);

module.exports = SignUpUser;
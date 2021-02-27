const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const db = require('./mongodb');

let userSchema = new Schema({
    userName: { type: String, required: true , trim: true, unique: true },
    emailId: { type: String, match: /\S+@\S+\.\S+/, trim: true, required: true },
    password: { type :String, trim: true, required: true },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    phoneNumber: { type: Number, required: true},
    createdOn: { type: Date }
});

let usersModel = db.model('users', userSchema);

module.exports = usersModel;
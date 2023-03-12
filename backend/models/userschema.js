const mongoose = require("mongoose");

const user = new mongoose.Schema({
    name: {
        type:String
    },
    email: { type: String},
    profile_picture: { type: String},
    access_token:{ type: String }
});

const files = new mongoose.Schema({
    name: {
        type:String
    },
    path:{
        type:String
    },
    mimetype: {
        type:String
    },
    size: {
        type:Number
    }
  });

const userSchema = mongoose.model("fUser",user);
const fileSchema = mongoose.model("Files", files);

module.exports = { userSchema, fileSchema }
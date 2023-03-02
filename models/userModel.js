const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  password : {
    type :String ,
    required : true
  },
  age : {
    type : Number
  }
});


const User = mongoose.model('User' , userSchema);


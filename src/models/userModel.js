const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    title :{
        type     : String,
        required : [ true, `title must be provided from these values: ["Mr", "Mrs", "Miss"]`],
        enum     : ["Mr", "Mrs", "Miss"],
        trim     : true
    },
    name :{
        type     : String,
        required : [true, "User name must be provided"],
        trim     : true
    },
    phone :{
        type     : String,
        required : [true, "mobile number must be provided"],
        unique   : [true, "mobile number already exist"],
        trim     : true
    },
    email :{
        type     : String,
        required : [true, "email address must be provided"],
        unique   : [true, "email address already exist"],
        trim     : true,
        lowercase: true
    },
    password :{
        type     : String,
        required : [true, "password must be provided"],
    },
    address :{
        street : {type :String, trim : true},
        city   : {type :String, trim : true},
        pincode: {type :String, trim : true}

    }

}, {timestamps : true})


module.exports = mongoose.model("User", userSchema)
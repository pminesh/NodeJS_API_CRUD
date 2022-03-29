import mongoose from "mongoose";

var schema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:String,
    status:String,
    image:{
        type:Array//Single file upload : String
    }
});

const empDB = mongoose.model('employee_dbs',schema);

export {empDB}
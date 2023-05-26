const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    password: {
        type:String,
        require:true
    }
})

const AdminModel = mongoose.model("admins", AdminSchema);

module.exports = AdminModel

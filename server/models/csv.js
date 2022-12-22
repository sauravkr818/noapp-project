const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema

const dataSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    linkedIn:{
        type: String,
        required: true,
    }
});
const csvSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    
    data:[dataSchema]
});

module.exports = mongoose.model("csvUser", csvSchema);

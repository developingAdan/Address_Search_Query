const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    streetName: {type: String, required: true},
    city: {type: String, required: true},
    state: {type: String, required: true},
    zipCode: {type: Number, required: true}
})

module.exports = mongoose.model("address", addressSchema)
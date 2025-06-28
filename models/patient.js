const mongoose = require ('mongoose')

const patientSchema = new mongoose.Schema( {
   name: String,
   email: String,
   password: String
})

const patientModel = mongoose.model ("patients", patientSchema )
module.exports = patientModel 
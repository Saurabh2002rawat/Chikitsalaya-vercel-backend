const mongoose = require ('mongoose')

const doctorSchema = new mongoose.Schema( {
   name:String,
   email : String ,
   password:String
})

const doctorModel = mongoose.model ("doctors", doctorSchema)
module.exports = doctorModel
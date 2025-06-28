const mongoose = require ('mongoose')

const appointmentSchema = new mongoose.Schema( {
   name: String,
   email: String,
   date: Date,
   time : String,
   reason: String,
   doctor : String,
   prescription: String, 
   report: String,       
   bill: String   
})

const appointmentModel = mongoose.model ("appointments", appointmentSchema )
module.exports = appointmentModel 
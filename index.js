const express = require ("express")
const mongoose = require ('mongoose')
const cors = require ("cors")
const patientModel = require ('./models/patient')
const doctorModel = require('./models/doctor'); 
const appointmentModel = require ('./models/appointment') ;
const multer = require('multer');
const { storage } = require('./config/cloudinaryConfig');
// const upload = multer({ storage });


const app = express ()
app.use( express.json() )
app.use( cors() ) 

mongoose.connect( "mongodb://localhost:27017/nitw" ) ;
// 127.0.0.1


// ------------------------------------------------------- patient auth

app.post ('/patientRegister' , (req, res) => {
   patientModel.create( req.body )
   .then( patient => res.json(patient) )
   .catch( err => res.json( err) )
})

app.post( "/patientLogin", async (req, res ) => {
   const { email, password} = req.body ;
   try {
      const user = await patientModel.findOne({ email}) ;
   
      if ( user ) {
         if ( user.password === password ) {
            res.json( {
               status : 'success',
               name : user.name,
               email:user.email
         }) ;
         }
         else {
            res.json({status:'incorrect password'}) ;
         }
      }
         else {
            res.json({status:'incorrect user'}) ;
         }
      }
      catch (err) {
         res.json({ status: 'error' });
      }
   })

// ------------------------------------------------------- doctor auth

app.post ('/doctorRegister' , (req, res) => {
   doctorModel.create( req.body )
   .then( doctor => res.json(doctor) )
   .catch( err => res.json( err) )
})

app.post( "/doctorLogin", async (req, res ) => {
   const { email, password} = req.body ;
   try {
      const user = await doctorModel.findOne({ email}) ;
   
      if ( user ) {
         if ( user.password === password ) {
            res.json( {
               status : 'success',
               name : user.name,
               email: user.email
         }) ;
         }
      }
         else {
            res.json({status:'incorrect password'}) ;
         }
      }
      catch (err) {
         res.json({ status: 'incorrect user' });
      }
   })

// ------------------------------------------------------- appointments

app.post ( '/bookAppointment' , ( req, res ) => {
   appointmentModel.create( req.body )
   .then ( appointment => res.json ('success'))
   .catch( err => res.json( err ) )
})

app.get('/doctors', async (req, res) => {
  try {
    const doctors = await doctorModel.find({}, 'name'); // Only return name field
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
});

// -------------------------------------------------------  records

app.get('/appointments/:doctorName', async (req, res) => {
  const { doctorName } = req.params;
  try {
    const appointments = await appointmentModel.find({ doctor: doctorName });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

// File upload route
const upload = multer({ storage });
app.post('/upload/:appointmentId', upload.single('file'), async (req, res) => {
  const { appointmentId } = req.params;
  const { type } = req.body; // 'prescription' | 'report' | 'bill'

  try {
    const fileUrl = req.file.path;
    if (!['prescription', 'report', 'bill'].includes(type)) {
      return res.status(400).json({ status: 'Invalid type' });
    }

    const update = { [type]: fileUrl };
    await appointmentModel.findByIdAndUpdate(appointmentId, update);
    res.json({ status: 'success', url: fileUrl });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

// patient view for records

app.get('/patientRecords/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const records = await appointmentModel.find({ email });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch patient records' });
  }
});

// fetch appointments 

app.get('/patientAppointments/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const appointments = await appointmentModel.find({ email });
    res.json(appointments);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching appointments' });
  }
});

// delete record 
app.delete('/deleteAppointment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await appointmentModel.findByIdAndDelete(id);
    res.json({ status: 'success', message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});






// ------------------------------------------------------- end


app.listen( 3001, () => {
   console.log ( " server is running")
})
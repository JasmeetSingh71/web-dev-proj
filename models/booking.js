const mongoose = require('mongoose');

const { Schema } = mongoose;


//  User Schema
const bookingSchema = new mongoose.Schema({
 user:  String,
  name: String,
  email: String,
  date: String,
  service: String
});


   const Booking = mongoose.model('booking', bookingSchema);


   module.exports=Booking;

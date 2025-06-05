const mongoose = require('mongoose');

const { Schema } = mongoose;
async function main() {
  await mongoose.connect("mongodb+srv://jasmeetdb:Jasmeet%401234@bookingsite.l1vxeep.mongodb.net/user");


  


}
 module.exports=main;


 //  Logout Route
// app.get('/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.redirect('/login.html');
//   });
// });
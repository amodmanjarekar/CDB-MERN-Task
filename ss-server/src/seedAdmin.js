// To create a default admin

// const mongoose = require('mongoose');
// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(
//     () => {console.log("Connected to MongoDB")},
//     (err) => {console.log(err)}
// );

// const Admin = require('./models/Admin');


// const seedAdmin = async () => {
//   const existing = await Admin.findOne({ username: 'admin' });
//   if (existing) {
//     console.log('Admin user already exists');
//     process.exit();
//   }

//   const admin = new Admin({ username: 'admin', password: 'password' });
//   await admin.save();
//   console.log('Admin user created');
//   process.exit();
// };

// seedAdmin();

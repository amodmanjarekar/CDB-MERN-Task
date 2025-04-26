const mongoose = require('mongoose');

// Define the profile schema
const profileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  skills: { type: [String], required: true },
});

// Create and export the profile model
const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;

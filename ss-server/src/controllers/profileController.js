const Profile = require('../models/Profile');

// Get all profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new profile
const addProfile = async (req, res) => {
  const { name, skills } = req.body;
  try {
    const newProfile = new Profile({ name, skills });
    await newProfile.save();
    res.status(201).json(newProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Edit a profile
const editProfile = async (req, res) => {
  const { id } = req.params;
  const { name, skills } = req.body;
  try {
    const updatedProfile = await Profile.findByIdAndUpdate(id, { name, skills }, { new: true });
    if (!updatedProfile) return res.status(404).json({ message: "Profile not found" });
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a profile
const deleteProfile = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProfile = await Profile.findByIdAndDelete(id);
    if (!deletedProfile) return res.status(404).json({ message: "Profile not found" });
    res.json(deletedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getProfiles, addProfile, editProfile, deleteProfile };

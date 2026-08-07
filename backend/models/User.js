import mongoose from 'mongoose';

// Auth itself now lives entirely in Firebase (feature #3). This collection
// only stores the app-specific profile data that Firebase doesn't hold:
// district, role, and the Cloudinary profile picture.
const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    district: { type: String, default: '' },
    profilePicture: { type: String, default: '' }, // cloudinary url (or Google's photo URL)
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    district: this.district,
    profilePicture: this.profilePicture,
    role: this.role,
  };
};

export default mongoose.model('User', userSchema);

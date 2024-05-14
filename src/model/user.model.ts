import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      unique: true
    },
    username: {
      type: String,
      required: true
    },
    firstname: {
      type: String,
      default: ''
    },
    lastname: {
      type: String,
      default: ''
    },
    isGuest: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    },
    phone: {
      type: String,
      default: ''
    },
    password: {
      type: String,
      required: false,
      default: '',
      select: false
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
const UserModel = mongoose.model('User', userSchema);
export default UserModel;

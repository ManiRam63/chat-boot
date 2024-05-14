import mongoose from 'mongoose';
const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true
    },
    roomType: {
      type: String,
      required: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);
const RoomModel = mongoose.model('Room', roomSchema);
export default RoomModel;

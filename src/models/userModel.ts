import { timeStamp } from "console";
import { model, Schema, Document } from "mongoose";
interface iuser extends Document {
  name: string;
  email: string;
  number: number;
  location: {
    type: "Point";
    coordinates: [number, number];
  };
  password: string;
}
const userSchema = new Schema<iuser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      trim:true,
      required: true,
      unique: true,
    },
    number: {
      type: Number,
      minlength: [10, "incorrect number"],
      required: true,
      unique: true
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
userSchema.index({ location: "2dsphere" });
export const User = model<iuser>("User", userSchema);

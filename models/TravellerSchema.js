import mongoose from "mongoose"
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()

const travellerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },

  lastName: {
    type: String,
    required: true
  },
  
  email: {
    type: String,
    required: true,
    unique: true
  },
  
  password: {
    type: String,
    required: true,
  },
  
  phoneNumber: {
    type: String,
  },
  
  sharedRides: [{
    tripId: {
      type: String,
    },
    driverName: String,
    driverPhoneNumber: String,
    cabNumber: String,
    sharedDate: {
      type: Date,
      default: Date.now
    },
    expired: {
      type: Boolean,
      default: false
    }
  }],
  
  auditTrail: [{
    tripId: {
      type: String,
    },
    action: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

travellerSchema.methods.generateToken = async function(){
  try{
    return jwt.sign({
      firstName : this.firstName,
      lastName : this.lastName,
      userId : this._id.toString(),
      rides : this.sharedRides
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn:"30d",
    }
    )
  }
  catch(err){
    console.error(err)
  }
}

export default mongoose.model("Traveller", travellerSchema);

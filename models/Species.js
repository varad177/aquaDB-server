// const mongoose = require("mongoose");
import mongoose from "mongoose";

// Define the schema for the data
const speciesSchema = new mongoose.Schema({
  longitude: {
    type: Number,
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  village: {
    type: String,
    required: false, // Optional field
  },
  species: {
    type: mongoose.Schema.Types.Mixed, // This allows for flexible data like 'cat.fish' keys
    default: {},
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  dataType: {
    type: String,
  },
  validate:{
    type:Boolean,
    default:false
  },
  dataId:{
    type: String,
  }
});

// Create the model for the schema

export default mongoose.model("SpeciesData", speciesSchema);

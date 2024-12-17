import mongoose from "mongoose";

// Schema for species details within each fishing record
const speciesSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true, // Ensures any leading/trailing spaces are removed
  },
  catch_weight: {
    type: Number,
    default: null, // Default to null if catch weight is not provided
  },
});

// Main schema for storing fishing data
const ValidatedCatchSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true, // Fishing date is mandatory
    },
    latitude: {
      type: Number,
      required: true, // Latitude is mandatory
    },
    longitude: {
      type: Number,
      required: true, // Longitude is mandatory
    },
    depth: {
      type: Number,
      default: null, // Depth can be null if not provided
    },
    species: [speciesSchema], // Array of species caught in this fishing event
    sea: {
      type: String,
      required: null, // Sea name is mandatory
    },
    state: {
      type: String,
      required: null, // State name is mandatory
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the user who uploaded the data
      required: true,
    },

    dataId: {
      type: String,
      required: true, // Unique identifier for this batch of data
    },

    total_weight: {
      type: Number,
      default: null, // Total weight of the catch, can be null
    },
    dataType: {
      type: String,
      enum: ["abundance", "occurrence","other" , "PFZ/NON-PFZ","Landing_vilage","Geo_refrence_data"], // Defines if data is of type "abundance" or "occurrence"
      required: true, // Indicates the type of data
    },
    
    
    LANDINGNAM: {
      type: String,
    },
    Gear_type: {
      type: String,
    },
    region:{
      type: String,
    },zoneType: {
      type: String,
    },
    meanlength:{
      type:Number
    },
    stage:{
      type:String
    }
    
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
  }
);

// Export the model for the fishing data schema
export default mongoose.model("ValidatedCatch", ValidatedCatchSchema);

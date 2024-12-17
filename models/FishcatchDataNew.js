import mongoose from "mongoose";

const speciesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Species name is mandatory
    trim: true,
  },
  catch_weight: {
    type: Number,
    default: null, // Default to null if catch weight is not provided
  },
});

const dataSchema = new mongoose.Schema(
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
    species: [
      {
        name: {
          type: String,
          required: true, // Species name is mandatory
        },
        catch_weight: {
          type: Number,
          default: null, // Default to null if catch weight is missing
        },
      },
    ],
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
      ref: "User",
      required: true, // Reference to the user who uploaded the data
    },

    dataId: {
      type: String,
      required: true, // Unique identifier for this data batch
    },
    verified: {
      type: Boolean,
      default: false, // Default to unverified if not provided
    },
    total_weight: {
      type: Number,
      default: null, // Can be null if not provided
    },
    dataType: {
      type: String,
      enum: ["abundance", "occurrence"],
      required: true, // Indicates the type of data batch
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the timestamp to current date
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
  }
);

export default mongoose.model("CatchData", dataSchema);

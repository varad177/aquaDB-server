import Log from "../models/logSchema.js";
import mongoose from "mongoose";
import ValidatedCatchData from "../models/ValidatedCatchData.js";

function generateRandomId() {
    const date = new Date();
    const timestamp = date.getTime(); // Get the current timestamp in milliseconds
    const randomNumber = Math.floor(Math.random() * 100000); // Generate a random number
    const randomId = `ID-${timestamp}-${randomNumber}`; // Combine the timestamp and random number
    return randomId;
}

const FishCatch = new mongoose.Schema(
    {
        status: { type: String, required: true },
        userId: { type: String, required: true },

        species: [{
            name: { type: String, required: true },
            catch_weight: { type: Number, default: null },
        }],

        total_weight: { type: Number, default: null },
        date: { type: Date, required: true },
        latitude: { type: Number, required: true },
        longitude: {  type: Number, required: true },
        depth: { type: Number, default: null },
        
        sea: { type: String, required: false },
        state: { type: String, required: false },
        
        dataId: { type: String, required: true },
        verified: { type: Boolean, default: false },
        
        dataType: { type: String, enum: ["abundance", "occurrence"], required: true },
        timestamp: { type: Date, default: Date.now }
    },
    {
        timestamps: true, // Automatically includes createdAt and updatedAt fields
    }
);

const Catches =  mongoose.model("Catches", FishCatch);

export const uploadAppData = async (req, res) => {
    try {
        const { status, userId, species, total_weight, date, latitude, longitude, depth, sea, state, dataType } = req.body;

        if (!userId || !species || !total_weight || !date || !latitude || !longitude ||  !dataType)  {
            console.log(date, latitude, longitude, species, userId, dataType, total_weight)
            return res.status(400).json({ message: "Missing required fields." });
        }

        const dataId = generateRandomId();
        const speciesJson = JSON.parse(species);

        const newCatch = new Catches({
            status,
            userId,
            species: speciesJson,
            total_weight,
            date,
            latitude,
            longitude,
            depth,
            sea,
            state,
            dataId,
            dataType,
            dataId
        });
        
        const logData = {
            userId,
            dataType,
            fileType: "fishmanual",
            dataId, // Include fileType here
        };
        console.log(logData);
        

        await newCatch.save();
        console.log(newCatch);
        await Log.create(logData);

        return res.status(200).json({
            message: "Data uploaded successfully.",
        });

        // return res.status(200).json(newCatch);

    } catch (err) {
        console.log("kuch hua");
        return res.status(500).json(err.message);
    }
}

export const getFishermanData = async (req, res) => {
    const { userId } = req.query; // Assuming userId is passed as a query parameter
    console.log(userId);

    if (!userId) {
        return res.status(400).json({ message: "UserId is required" });
    }
    try {

        // Fetch data from the database
        const catches = await ValidatedCatchData.find({ userId });

        if (catches.length === 0) {
        return res.status(404).json({ message: "No data found for the provided userId" });
        }

        // Respond with the fetched data
        res.status(200).json(catches.slice(0, 4));
        console.log(catches.slice(0, 1))
    } catch (error) {
        console.error("Error fetching validated catches:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
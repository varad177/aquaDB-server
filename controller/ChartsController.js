// import ValidatedCatch from "../models/ValidatedCatchData.js"; // Import your schema model

// // Function to handle the aggregation based on frontend request
// export const visualizeData = async (req, res) => {
//   const { xAxis, yAxis } = req.body;

//   let matchConditions = {};  // The filter conditions to apply
//   let groupByFields = {};    // The fields we group by in aggregation
//   let aggregationFields = {}; // Fields we want to aggregate

//   // Handle X-Axis Filters (Fishing Date Range or Location)
//   if (xAxis) {
//     // Handle Date Range Filter (fishingDate)
//     if (xAxis.type === 'fishingDate' && xAxis.range) {
//       matchConditions.date = {
//         $gte: new Date(xAxis.range.start), // Filter by start date
//         $lte: new Date(xAxis.range.end),   // Filter by end date
//       };
//       groupByFields.date = { $dateToString: { format: "%Y-%m-%d", date: "$date" } }; // Group by date in yyyy-mm-dd format
//     }

//     // Handle Latitude Range Filter (latitude)
//     if (xAxis.type === 'latitude' && xAxis.range) {
//       matchConditions.latitude = {
//         $gte: xAxis.range[0],  // Latitude start value
//         $lte: xAxis.range[1],  // Latitude end value
//       };
//     }

//     // Handle Longitude Range Filter (longitude)
//     if (xAxis.type === 'longitude' && xAxis.range) {
//       matchConditions.longitude = {
//         $gte: xAxis.range[0],  // Longitude start value
//         $lte: xAxis.range[1],  // Longitude end value
//       };
//     }
//   }

//   // Handle Y-Axis Filters (Catch)
//   if (yAxis.catchType === 'totalCatch') {
//     aggregationFields.totalCatch = { $sum: '$total_weight' }; // Sum of total catch weight
//   }

//   // Aggregate the Data
//   try {
//     const result = await ValidatedCatch.aggregate([
//       { $match: matchConditions },  // Apply the filter conditions (date, latitude, longitude)
//       { $group: { _id: groupByFields, ...aggregationFields } },  // Group by date and apply aggregation
//       { $sort: { _id: 1 } },  // Sort the result by date
//     ]);

//     res.status(200).json(result);  // Send the aggregated data back to the frontend
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error while fetching data');
//   }
// };

import ValidatedCatch from "../models/ValidatedCatchData.js"; // Adjust the path based on your project structure

// Controller to fetch chart data
export const getChartData = async (req, res) => {
  try {
    const { fromDate, toDate, xAxisField, filterValue } = req.query;

    // Validate required inputs
    if (!fromDate || !toDate || !xAxisField || filterValue === undefined) {
      return res.status(400).json({
        error: "fromDate, toDate, xAxisField, and filterValue are required.",
      });
    }

    // Ensure xAxisField is a valid field in the schema
    const allowedFields = ["total_weight", "depth", "sea", "state"]; // Extend as needed
    if (!allowedFields.includes(xAxisField)) {
      return res.status(400).json({
        error: `Invalid xAxisField. Allowed fields are: ${allowedFields.join(
          ", "
        )}`,
      });
    }

    // Parse date range and filter value
    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const parsedFilterValue = isNaN(filterValue)
      ? filterValue
      : parseFloat(filterValue);

    // Match query with dynamic filter for X-axis and date range
    const matchQuery = {
      date: { $gte: startDate, $lte: endDate },
    };

    // Add dynamic filter based on X-axis field
    if (xAxisField === "total_weight" || xAxisField === "depth") {
      matchQuery[xAxisField] = { $gte: parsedFilterValue };
    } else {
      matchQuery[xAxisField] = parsedFilterValue; // For string fields like "sea" or "state"
    }

    // Aggregation pipeline
    const aggregationPipeline = [
      { $match: matchQuery }, // Filter data
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          totalCatch: { $sum: "$total_weight" },
          avgDepth: { $avg: "$depth" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by date
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: "$_id.month" },
              "-",
              { $toString: "$_id.year" },
            ],
          },
          xAxisValue: `$${
            xAxisField === "total_weight"
              ? "totalCatch"
              : xAxisField === "depth"
              ? "avgDepth"
              : xAxisField
          }`,
        },
      },
    ];

    // Execute aggregation
    const chartData = await ValidatedCatch.aggregate(aggregationPipeline);

    // Respond with data
    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error fetching filtered chart data:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching chart data." });
  }
};

//mongodb charts
// Configuration for MongoDB Charts
// const chartsConfig = {
//   baseUrl: "https://charts.mongodb.com/charts-your-cluster-xyz/embed/charts",
//   chartIds: {
//     speciesWeight: "chartId_speciesWeight",
//     totalWeightOverTime: "chartId_totalWeightOverTime",
//     fishingLocation: "chartId_fishingLocation",
//     depthDistribution: "chartId_depthDistribution",
//     tagAnalysis: "chartId_tagAnalysis",
//     totalWeightBySea: "chartId_totalWeightBySea",
//     speciesTrends: "chartId_speciesTrends",
//     diversityIndex: "chartId_diversityIndex",
//   },
// };

// const chartsConfig = {
//   // baseUrl: "https://charts.mongodb.com/charts-sneha-lqltzmn/embed/charts",
//   baseUrl: "https://charts.mongodb.com/charts-sneha-lqltzmn",
//   chartIds: {
//     speciesWeight: "", // Replace with your actual chart ID
//     totalWeightOverTime: "chartId_totalWeightOverTime", // Replace with actual chart ID
//     fishingLocation: "chartId_fishingLocation", // Replace with actual chart ID
//     depthDistribution: "9642cbbd-e631-4e1f-86dd-f0086511843e", // Replace with actual chart ID
//     tagAnalysis: "chartId_tagAnalysis", // Replace with actual chart ID
//     totalWeightBySea: "chartId_totalWeightBySea", // Replace with actual chart ID
//     speciesTrends: "chartId_speciesTrends", // Replace with actual chart ID
//     diversityIndex: "chartId_diversityIndex", // Replace with actual chart ID
//   },
// };

// // Controller function to fetch chart URLs
// export const getChartUrl = async (req, res) => {
//   try {
//     const { chartType, filter } = req.body;

//     if (!chartsConfig.chartIds[chartType]) {
//       return res.status(400).json({ error: "Invalid chart type." });
//     }

//     // Build the URL with filters
//     const chartId = chartsConfig.chartIds[chartType];
//     const encodedFilter = encodeURIComponent(JSON.stringify(filter || {}));
//     const chartUrl = `${chartsConfig.baseUrl}?id=${chartId}&filter=${encodedFilter}`;

//     res.json({ chartUrl });
//   } catch (error) {
//     console.error("Error generating chart URL:", error);
//     res.status(500).json({ error: "Failed to generate chart URL." });
//   }
// };

// Import necessary modules
import dotenv from "dotenv";
dotenv.config();

// Function to generate filtered dashboard URL
// export const getFilteredDashboard = (req, res) => {
//   const { sea, state, species, depth, dateRange } = req.body;

//   // Build filters dynamically based on user input
//   let filters = {};

//   if (sea) filters.sea = sea;
//   if (state) filters.state = state;
//   if (species) filters["species.name"] = { $in: species };
//   if (depth) filters.depth = { $gte: depth[0], $lte: depth[1] };
//   if (dateRange) {
//     filters.date = {
//       $gte: new Date(dateRange[0]),
//       $lte: new Date(dateRange[1]),
//     };
//   }

//   // Encode filters for MongoDB Charts parameterized dashboard
//   const encodedFilters = encodeURIComponent(JSON.stringify(filters));
//   const dashboardURL = `https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/d897f82a-2cd3-46af-930f-b3d1f9987d58?filters=${encodedFilters}`;

//   // Return the generated URL
//   res.status(200).json({ dashboardURL });
// };

export const getFilteredDashboard = async (req, res) => {
  const { depth, dateRange, tags } = req.body;

  // Build the MongoDB query filters
  let filters = {};

  if (depth && depth.length === 2) filters.depth = { $gte: depth[0], $lte: depth[1] };
  if (dateRange && dateRange.length === 2) {
    filters.date = { $gte: new Date(dateRange[0]), $lte: new Date(dateRange[1]) };
  }
  if (tags && tags.length > 0) filters.tags = { $in: tags };

  try {
    // Query the MongoDB database based on filters
    const data = await ValidatedCatch.aggregate([
      { $match: filters },
      // Add any aggregation logic as required, e.g., grouping by date, computing averages, etc.
    ]);

    // Prepare data to be sent to the frontend
    const chartData = {
      chart: data, // The data for rendering the chart
      dashboardURL: `https://charts.mongodb.com/charts-sneha-lqltzmn/public/dashboards/d897f82a-2cd3-46af-930f-b3d1f9987d58?filters=${encodeURIComponent(
        JSON.stringify(filters)
      )}`,
    };

    res.status(200).json(chartData);
  } catch (error) {
    console.error("Error fetching filtered data", error);
    res.status(500).json({ error: "Error fetching filtered data" });
  }
};

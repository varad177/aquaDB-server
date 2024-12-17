import Catch from "../models/FishCatchData.js";

import moment from 'moment'; 

// Helper function for generating random colors




const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  

const formatChartData = (data, field) => {
    const labels = data.map(item => item._id);
    const chartData = data.map(item => item.totalCatchWeight);
    return {
      labels,
      datasets: [
        {
          label: `Total Catch Weight by ${field}`,
          data: chartData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };
  };


  const parseDate = (dateStr) => {
    const date = moment(dateStr, 'YYYY-MM-DD', true);
    return date.isValid() ? date.toDate() : null;
  };

export let  totalCatchWeightByDate = async(req , res)=>{
    const { from, to  , filter} = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalCatchWeight: { $sum: "$total_weight" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ]);
    const chartData = formatChartData(data, 'Date');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}



export let  totalCatchWeightBySpecies = async(req , res)=>{
    const { from, to } = req.body;

    // Parse the 'from' and 'to' dates
    const fromDate = parseDate(from);
    const toDate = parseDate(to);
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      const data = await Catch.aggregate([
        {
          $match: {
            date: { $gte: fromDate, $lte: toDate }, // Filter by date range
          },
        },
        { $unwind: '$species' },
        {
          $group: {
            _id: '$species.name',
            totalCatchWeight: Number({ $sum: '$species.catch_weight' }),
          },
        },
        {
          $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
        },
      ]);
      const chartData = formatChartData(data, 'Species');
      res.json(chartData);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
}


export let  totalCatchWeightBySea = async(req , res)=>{

 const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: '$sea',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
      },
    ]);
    const chartData = formatChartData(data, 'Sea');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}

export let totalCatchWeightByState = async(req , res)=>{
    const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: '$state',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
      },
    ]);
    const chartData = formatChartData(data, 'State');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}

export let totalCatchWeightByDepth = async(req , res)=>{
    const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $project: {
          depthCategory: {
            $cond: {
              if: { $lte: ['$depth', 50] },
              then: '0-50 meters',
              else: {
                $cond: {
                  if: { $lte: ['$depth', 100] },
                  then: '50-100 meters',
                  else: '100+ meters',
                },
              },
            },
          },
          total_weight: 1,
        },
      },
      {
        $group: {
          _id: '$depthCategory',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 },
      },
    ]);
    const chartData = formatChartData(data, 'Depth');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}
export let totalCatchWeightByDataType = async(req , res)=>{
    const { from, to } = req.body;

  // Parse the 'from' and 'to' dates
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
  }

  try {
    const data = await Catch.aggregate([
      {
        $match: {
          date: { $gte: fromDate, $lte: toDate }, // Filter by date range
        },
      },
      {
        $group: {
          _id: '$data_type',
          totalCatchWeight: { $sum: '$total_weight' },
        },
      },
      {
        $sort: { totalCatchWeight: -1 }, // Sort by total catch weight
      },
    ]);
    const chartData = formatChartData(data, 'Data Type');
    res.json(chartData);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching data', error: err });
  }
}
   












// bubble chart 

export const getCatchDataForBubbleChart = async (req, res) => {
    const { from, to } = req.body;
  
    // Parse the 'from' and 'to' dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      // Query the catches within the date range
      const data = await Catch.find({
        date: { $gte: fromDate, $lte: toDate },
      });
  
      // Map the data to a format that Chart.js expects for a bubble chart
      const chartData = data.map((item) => ({
        x: item.date,  // X-axis: Date
        y: item.total_weight,  // Y-axis: Total catch weight
        r: item.species.length * 2,  // Radius: Size of the bubble based on the number of species
      }));
  
      // Send the data to the frontend
      res.json({
        datasets: [
          {
            label: 'Catch Data',
            data: chartData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
  };


  export const getCatchWeightVsDepth = async (req, res) => {
    const { from, to } = req.body;
  
    // Parse the 'from' and 'to' dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      // Query the catches within the date range
      const data = await Catch.find({
        date: { $gte: fromDate, $lte: toDate },
      });
  
      // Map the data to a format that Chart.js expects for a bubble chart
      const chartData = data.map((item) => ({
        x: item.total_weight,  // X-axis: Total catch weight
        y: item.depth !== null && item.depth !== undefined ? item.depth : 0,  // Y-axis: Depth (fallback to 0 if null)
        r: item.species.length * 2,  // Radius: Number of species
      }));
  
      // Send the data to the frontend
      res.json({
        datasets: [
          {
            label: 'Catch Weight vs Depth',
            data: chartData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
  };
  
  

  export const getLocationDataForBubbleChart = async (req, res) => {
    const { from, to } = req.body;
  
    // Parse the 'from' and 'to' dates
    const fromDate = new Date(from);
    const toDate = new Date(to);
  
    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD.' });
    }
  
    try {
      // Query the catches within the date range
      const data = await Catch.find({
        date: { $gte: fromDate, $lte: toDate },
      });
  
      // Map the data to a format that Chart.js expects for a bubble chart
      const chartData = data
      .filter(item => item.depth && item.depth !== 0) // Filter out items with no depth or depth equal to 0
      .map((item) => ({
        x: item.longitude,  // X-axis: Longitude
        y: item.latitude,   // Y-axis: Latitude
        r: item.depth * 2,   // Radius: Depth multiplied by 2
      }));
    
  
      // Send the data to the frontend
      res.json({
        datasets: [
          {
            label: 'Catch Location Data',
            data: chartData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching data', error: err });
    }
  };
  

//   DoughnutChart 

export const getSpeciesDistribution = async (req, res) => {
    const { from, to } = req.body;
  
    try {
      const catches = await Catch.find({
        date: { $gte: new Date(from), $lte: new Date(to) },
      });
  
      // Aggregate species data
      const speciesData = {};
  
      catches.forEach((catchEntry) => {
        catchEntry.species.forEach((specie) => {
          if (!speciesData[specie.name]) {
            speciesData[specie.name] = 0;
          }
          speciesData[specie.name] += specie.catch_weight || 0;
        });
      });
  
      // Format for DoughnutChart
      const chartData = {
        labels: Object.keys(speciesData),
        datasets: [
          {
            data: Object.values(speciesData),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      };
  
      res.status(200).json(chartData);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching species distribution', error: err.message });
    }
  };




  export const getCatchWeightBySea = async (req, res) => {
    const { from, to } = req.body;
  
    try {
      const catches = await Catch.find({
        date: { $gte: new Date(from), $lte: new Date(to) },
      });
  
      const seaData = {};
  
      catches.forEach((catchEntry) => {
        const sea = catchEntry.sea || 'Unknown';
        if (!seaData[sea]) {
          seaData[sea] = 0;
        }
        seaData[sea] += catchEntry.total_weight || 0;
      });
  
      // Format for DoughnutChart
      const chartData = {
        labels: Object.keys(seaData),
        datasets: [
          {
            data: Object.values(seaData),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      };
  
      res.status(200).json(chartData);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching catch weight by sea', error: err.message });
    }
  };



  export const getCatchWeightByState = async (req, res) => {
    const { from, to } = req.body;
  
    try {
      const catches = await Catch.find({
        date: { $gte: new Date(from), $lte: new Date(to) },
      });
  
      const stateData = {};
  
      catches.forEach((catchEntry) => {
        const state = catchEntry.state || 'Unknown';
        if (!stateData[state]) {
          stateData[state] = 0;
        }
        stateData[state] += catchEntry.total_weight || 0;
      });
  
      // Format for DoughnutChart
      const chartData = {
        labels: Object.keys(stateData),
        datasets: [
          {
            data: Object.values(stateData),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
          },
        ],
      };
  
      res.status(200).json(chartData);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching catch weight by state', error: err.message });
    }
  };
  



  //line chart



// Controller to get the data for the line chart
// Controller for Total Catch Weight per Month
export const getTotalCatchWeightPerMonth = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: "Both fromDate and toDate are required." });
    }
  
    try {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
  
      if (startDate > endDate) {
        return res.status(400).json({ error: "fromDate cannot be later than toDate." });
      }
  
      const data = await Catch.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $project: { year: { $year: "$date" }, month: { $month: "$date" }, total_weight: 1 } },
        { $group: { _id: { year: "$year", month: "$month" }, totalCatchWeight: { $sum: "$total_weight" } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
  
      const labels = data.map(item => `${item._id.month}-${item._id.year}`);
      const totalCatchWeightData = data.map(item => item.totalCatchWeight);
  
      res.json({
        labels,
        datasets: [
          {
            label: "Total Catch Weight per Month",
            data: totalCatchWeightData,
            borderColor: "rgba(75,192,192,1)",
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  

  // Controller for Number of Catches per Month
export const getNumberOfCatchesPerMonth = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: "Both fromDate and toDate are required." });
    }
  
    try {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
  
      if (startDate > endDate) {
        return res.status(400).json({ error: "fromDate cannot be later than toDate." });
      }
  
      const data = await Catch.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $project: { year: { $year: "$date" }, month: { $month: "$date" } } },
        { $group: { _id: { year: "$year", month: "$month" }, catchCount: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
  
      const labels = data.map(item => `${item._id.month}-${item._id.year}`);
      const catchCountData = data.map(item => item.catchCount);
  
      res.json({
        labels,
        datasets: [
          {
            label: "Number of Catches per Month",
            data: catchCountData,
            borderColor: "rgba(153,102,255,1)",
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  




  
  


  // Controller for Catch Count by Species per Month
export const getCatchCountBySpeciesPerMonth = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ error: "Both fromDate and toDate are required." });
    }
  
    try {
      const startDate = new Date(fromDate);
      const endDate = new Date(toDate);
  
      if (startDate > endDate) {
        return res.status(400).json({ error: "fromDate cannot be later than toDate." });
      }
  
      const data = await Catch.aggregate([
        { $match: { date: { $gte: startDate, $lte: endDate } } },
        { $project: { year: { $year: "$date" }, month: { $month: "$date" }, species: 1 } },
        { $unwind: "$species" },
        { $group: { _id: { year: "$year", month: "$month", species_name: "$species.name" }, countBySpecies: { $sum: 1 } } },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);
  
      const labels = [...new Set(data.map(item => `${item._id.month}-${item._id.year}`))];
      const speciesCatchCountData = [];
      const speciesNames = [...new Set(data.map(item => item._id.species_name))];
  
      speciesNames.forEach(species => {
        const speciesData = data.filter(item => item._id.species_name === species);
        const speciesCatchCount = speciesData.map(item => item.countBySpecies);
        speciesCatchCountData.push({
          label: `${species} Catch Count per Month`,
          data: speciesCatchCount,
          borderColor: getRandomColor(),
          tension: 0.4,
        });
      });
  
      res.json({
        labels,
        datasets: speciesCatchCountData,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  



  
  // Controller for Catch Weight for Each Species per Month
  export const getCatchWeightForEachSpeciesPerMonth = async (req, res) => {
    const { from, to } = req.body;
  
    // Ensure both from and to dates are provided in the request
    if (!from || !to) {
      return res.status(400).json({ error: "Please provide both 'from' and 'to' dates." });
    }
  
    try {
      // Aggregate catch data based on the date range and species catch weight
      const catchData = await Catch.aggregate([
        {
          $match: {
            date: {
              $gte: new Date(from), // From date (inclusive)
              $lte: new Date(to),   // To date (inclusive)
            },
          },
        },
        {
          $unwind: "$species", // Flatten the species array
        },
        {
          $group: {
            _id: {
              speciesName: "$species.name", // Group by species name
              monthYear: { $dateToString: { format: "%m-%Y", date: "$date" } }, // Format date as month-year
            },
            totalCatchWeight: { $sum: "$species.catch_weight" }, // Sum the catch weight for each species
          },
        },
        {
          $sort: {
            "_id.monthYear": 1, // Sort by month-year in ascending order
          },
        },
        {
          $group: {
            _id: "$_id.speciesName", // Group by species name
            data: {
              $push: {
                monthYear: "$_id.monthYear", // Month-Year as label
                totalCatchWeight: "$totalCatchWeight", // Total catch weight
              },
            },
          },
        },
      ]);
  
      // If no data found, return a response with empty data
      if (catchData.length === 0) {
        return res.status(200).json({
          labels: [],
          datasets: [],
        });
      }
  
      // Format the response for each species
      const formattedData = catchData.map((species) => ({
        label: `${species._id} Catch Weight per Month`,
        data: species.data.map((item) => item.totalCatchWeight),
        borderColor: getBorderColor(species._id), // Dynamically get color based on species name
        tension: 0.4,
      }));
  
      // Generate labels from the first dataset (all species should have the same month-year labels)
      const labels = catchData[0].data.map((item) => item.monthYear);
  
      return res.status(200).json({
        labels,
        datasets: formattedData,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred while fetching data." });
    }
  };
  
  // Helper function to return a color based on species name
  const getBorderColor = (speciesName) => {
    const speciesColors = {
      pomfret: "#9DB709",
      rionfish: "#8F9187",
      "indian mackerel": "#0937D9",
      "spiny grouper": "#C22122",
      dhamil: "#AE4898",
      shark: "#CD66DC",
      croakers: "#8FB463",
      tuna: "#52D8DE",
      perches: "#F6D094",
    };
    return speciesColors[speciesName.toLowerCase()] || "#000000"; // Default to black if not found
  };
  ;
  


//   pie chart 


export const getSpeciesData = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Please provide both fromDate and toDate." });
    }
  
    try {
      const speciesData = await Catch.aggregate([
        {
          $match: {
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
          },
        },
        { $unwind: "$species" },
        {
          $group: {
            _id: "$species.name",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            name: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]);
  
      const speciesLabels = speciesData.map((item) => item.name);
      const speciesCount = speciesData.map((item) => item.count);
  
      return res.status(200).json({
        labels: speciesLabels,
        data: speciesCount,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching species data", error: error.message });
    }
  };
  




export const getCatchTypeData = async (req, res) => {
  const { from:fromDate, to:toDate } = req.body;

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: "Please provide both fromDate and toDate." });
  }

  try {
    const catchTypeData = await Catch.aggregate([
      {
        $match: {
          date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
        },
      },
      {
        $group: {
          _id: "$dataType",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          type: "$_id",
          count: 1,
          _id: 0,
        },
      },
    ]);

    const catchTypeLabels = catchTypeData.map((item) => item.type);
    const catchTypeCount = catchTypeData.map((item) => item.count);

    return res.status(200).json({
      labels: catchTypeLabels,
      data: catchTypeCount,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error fetching catch type data", error: error.message });
  }
};


export const getSeaData = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Please provide both fromDate and toDate." });
    }
  
    try {
      const seaData = await Catch.aggregate([
        {
          $match: {
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
          },
        },
        {
          $group: {
            _id: "$sea",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            sea: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]);
  
      const seaLabels = seaData.map((item) => item.sea);
      const seaCount = seaData.map((item) => item.count);
  
      return res.status(200).json({
        labels: seaLabels,
        data: seaCount,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching sea data", error: error.message });
    }
  };
  

  export const getStateData = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
  
    if (!fromDate || !toDate) {
      return res.status(400).json({ message: "Please provide both fromDate and toDate." });
    }
  
    try {
      const stateData = await Catch.aggregate([
        {
          $match: {
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) },
          },
        },
        {
          $group: {
            _id: "$state",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            state: "$_id",
            count: 1,
            _id: 0,
          },
        },
      ]);
  
      const stateLabels = stateData.map((item) => item.state);
      const stateCount = stateData.map((item) => item.count);
  
      return res.status(200).json({
        labels: stateLabels,
        data: stateCount,
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching state data", error: error.message });
    }
  };
  


  function formatDate(dateString) {
    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with leading zero if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month and pad with leading zero if needed
    const year = date.getFullYear(); // Get year
  
    return `${day}-${month}-${year}`;
  }


  export const getDateTotalWeightData = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
  
    try {
      const from = moment(fromDate).startOf('day').toDate();
      const to = moment(toDate).endOf('day').toDate();
  
      // Fetch catches within the date range
      const catches = await Catch.find({
        date: { $gte: from, $lte: to }
      });
  
      const data = catches.map(catchData => ({
        x: new Date(catchData.date).getTime(), // Convert to timestamp
        y: catchData.total_weight
      }));
  
      const chartData = {
        datasets: [
          {
            label: "Date vs Total Weight",
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      };
  
      return res.status(200).json(chartData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching Date vs Total Weight data" });
    }
  };


 
  

  export const getLatitudeDepthData = async (req, res) => {
    const { from:fromDate, to:toDate } = req.body;
    console.log(req.body);
    
  
    try {
      const from = moment(fromDate).startOf('day').toDate();
      const to = moment(toDate).endOf('day').toDate();
  
      // Fetch catches within the date range
      const catches = await Catch.find({
        date: { $gte: from, $lte: to }
      });
  
      const data = catches.map(catchData => ({
        x: catchData.latitude,
        y: catchData.depth
      }));

    
      
  
      const chartData = {
        datasets: [
          {
            label: "Latitude vs Depth",
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 1)',
          },
        ],
      };
  
      return res.status(200).json(chartData);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Error fetching Latitude vs Depth data" });
    }
  };




const tourModel = require("./../models/tourModel");
//

exports.getAllTours = async (req, res) => {
  try {
    // Copying req.query and excluding some parameters
    const queryObj = { ...req.query };
    const excluded = ["page", "sort", "limit", "fields"];
    excluded.forEach((el) => delete queryObj[el]);
    console.log(req.query, queryObj);
    // WAYS TO QUERY
    // ex: const tours = await tourModel.find({ difficulty: 'easy'};
    // or const tours = tourModel.find().where('duration').equals('5');
    // 1) ADVANCED FILTERING
    // URL: /tours?duration[gte]=5&difficulty=easy
    // MongoDB filter Obj: {difficulty: 'easy', duration: {$gte:5}}
    // Express (req.query) gives: {difficulty: 'easy', duration: {gte:5}}
    // we need to add back '$'
    /////
    // QueryObj to String
    // Searching for (gte|gt|lte|lt)
    // Adding '$' to matches
    // Parsing to Obj
    let queryStr = JSON.stringify(queryObj);
    queryStr = JSON.parse(
      queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    );
    let query = tourModel.find(queryStr);
    // Find by query
    // 2) SORTING
    // mongoose: sort('price rating')
    // URL: /tours?sort=price,rating (asc) or -price (desc)

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-__v");
    }
    // 3) PAGINATION
    // URL: /tours?page=2&limit=10
    // Mongoose: query.skip(10).limit(10)
    // Result 1-10 on page 1, 11 - 20 on page 2 etc...
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;
    //
    query = query.skip(skip).limit(limit);

    // If we're skipping more documents than we have, throw an error
    if (req.query.page) {
      const numTours = await tourModel.countDocuments();
      if (skip >= numTours) {
        throw new Error("This page does not exist");
      }
    }
    // Execute query
    // implemented: query.sort().select().skip().limit()
    const tours = await query;
    // Response
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.getTour = async (req, res) => {
  try {
    // req.params.id shows value of the route parameter in ROUTER ('/:id')
    const tour = await tourModel.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const updated = await tourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(updated);

    res.status(200).json({
      status: "Successfully updated",
      data: {
        updated,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "Failed to update document",
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    const newTour = await tourModel.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    // console.log(err);
    res.status(400).json({
      status: "Failed to create document",
      message: err,
    });
  }
};
exports.deleteTour = async (req, res) => {
  try {
    // We don't need to return data so no need to return variable
    await tourModel.findByIdAndRemove(req.params.id);
    res.status(204).json({
      status: "success",
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

// ALIASING MIDDLEWARE

exports.aliasTop = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage";
  next();
};

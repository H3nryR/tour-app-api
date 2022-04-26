const mongoose = require("mongoose");
const slugify = require("slugify");

//Schema
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name field is required"],
      unique: [true, "Name is already taken"],
      trim: true,
      maxlength: [40, "Maximal length must be <= 40 characters"],
      minlength: [10, "Minimal length must be >= 10 characters "],
    },
    duration: {
      type: Number,
      required: [true, "Duration field is required"],
    },
    maxGroupSize: {
      type: Number,
      required: [true, "Grup size field is required"],
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty field is required"],
      enum: {
        values: ["easy", "medium", "hard", "God mode"],
        message: `Only: "easy", "medium", "hard", "God mode" `,
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Must be above >= 1"],
      max: [5, "Must be <= 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Price field is required"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        // validate works ONLY on save
        // hence we need to use save method to keep validation
        // during update
        validator: function (val) {
          // this points to current document
          // val = priceDiscount, this.price
          return val < this.price;
        },
        message: "Discount price: ({VALUE}) must be < price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "Summary field is required"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Description field is required"],
    },
    imageCover: {
      type: String,
      trim: true,
      required: [true, "imageCover field is required"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    slug: {
      type: String,
    },
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual properties
// Not to be saved to DB, usefully with deriving one filed from another
// we use regular function not an array function because we need 'this'
// keyword pointing to the document
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// MONGOOSE MIDDLEWARE (referred as: pre or post hooks)
// can be executed before (pre) or after(post)
// 4 types of mongoose middleware: document, query, aggregate, model

////////// Document Middleware ////////////
// defined on schema
// runs before hooks: 'save()' and '.create()'

tourSchema.pre("save", function (next) {
  // 'this' keyword will point to current. processed document
  // pre middleware has access to next like regular middleware
  // creating slug for documents being saved
  this.slug = slugify(this.name, { lower: true });
  next();
});
// we can run as much middleware as we want
tourSchema.pre("save", function (next) {
  console.log("Saving document...");
  next();
});
// post middleware has access to next and document saved
tourSchema.post("save", function (doc, next) {
  console.log("Document saved");
  console.log(doc);
  next();
});

///////// QUERY MIDDLEWARE //////////
// Another mongoose middleware
// runs before or after query is executed

// example: let's suppose we have some 'secret' fields that
// we don't want to expose to public
// 1) lets create secret field in schema
// 2) Before find we filter and choose tours with secret: true
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  // console.log("it's working");
  // console.log(this._conditions);
  this.start = Date.now();
  next();
});

// In post find we have  access to DOCUMENTS returned from query
tourSchema.post(/^find/, function (docs, next) {
  // console.log(this._conditions);
  console.log(`Query took ${Date.now() - this.start} milliseconds to execute`);
  next();
});
// /^find/, reg. expression will work for anything that starts with find
//Model
const tourModel = mongoose.model("tours", tourSchema);

module.exports = tourModel;

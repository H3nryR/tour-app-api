const express = require("express");
const router = express.Router();
const tourController = require("./../controllers/tourController");
const authController = require("./../controllers/authController");
// Middleware for Aliasing - prefill query for popular routs
// Query: ?limit=5&sort=-ratingsAverage,price
router.route("/top5").get(tourController.aliasTop, tourController.getAllTours);

// Routers
router
  .route("/")
  .get(authController.protect, tourController.getAllTours)
  .post(tourController.createTour);
router
  .route("/:id")
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;

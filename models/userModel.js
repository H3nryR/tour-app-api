const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
// MODEL name, email, photo, password, passwordConfirmation

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name field is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email field is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Not valid email"],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Password required"],
    minLength: 8,
    select: false,
  },
  passwordConfirmation: {
    type: String,
    required: [true, "Password confirmation required"],
    validate: {
      // validate works ONLY on save
      // hence we need to use save method to keep validation
      // during update
      validator: function (val) {
        // this points to current document
        return val === this.password;
      },
      message: "Wrong password",
    },
  },
});
// Using pre-save middleware on schema will happ. between the moment
// we receive data and the moment it's saved into DB
userSchema.pre("save", async function (next) {
  // Only run if password was modified
  if (!this.isModified("password")) return next();
  // bcrypt
  // we set current password to encrypted/hashed v. with 12 rounds
  this.password = await bcrypt.hash(this.password, 12);
  // At this point we don't need pass anymore.confirmation
  // since we passed 2 matching passwords and encrypted it
  this.passwordConfirmation = undefined;
  // = undefined; removes field from document
  next();
});

// Instance method / available on all documents of a certain collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // this keyword points to current document
  return await bcrypt.compare(candidatePassword, userPassword);
};
const userModel = mongoose.model("users", userSchema);

module.exports = userModel;

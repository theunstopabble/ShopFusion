const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Do log same email se account nahi bana sakte
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // By default naya user admin nahi hoga
    },
  },
  {
    timestamps: true, // Ye apne aap 'createdAt' aur 'updatedAt' fields add kar dega
  }
);

// Method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware: Password ko save karne se pehle hash (encrypt) karna
userSchema.pre("save", async function (next) {
  // Agar password change nahi hua hai, toh aage badho
  if (!this.isModified("password")) {
    next();
  }

  // Naya password hash karna
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

module.exports = User;

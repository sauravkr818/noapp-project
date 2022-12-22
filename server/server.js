const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/controller");
const csv = require("./routes/api/csvUpload");
const app = express();
const cors = require("cors")
const path = require("path");
// const upload = require("express-fileupload");

mongoose.set('strictQuery', true);


// app.use(upload());

app.use(cors({
  origin: '*'
}));
// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

  // Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);
// Routes
app.use("/api/controller", users);
app.use("/api/csvUpload", csv);
app.use("/public", express.static(path.join(__dirname, "public")));


const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
app.listen(port, () => console.log(`Server up and running on port ${port} !`));
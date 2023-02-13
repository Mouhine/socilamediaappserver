require("dotenv").config();
const express = require("express");

const cors = require("cors");
const app = express();

const dbConnect = require("./config/connectDB");
const { default: mongoose } = require("mongoose");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOptions");
const uploadRoutes = require("./routes/upload");
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

//middleware for cookies

mongoose.set("strictQuery", false);
// costume middleware

// routes
app.use("/auth", require("./routes/auth"));
app.use("/users", require("./routes/users"));
app.use("/posts", require("./routes/post"));
app.use("/comments", require("./routes/comment"));
uploadRoutes(app);

const PORT = process.env.PORT || 3000;
dbConnect();
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));

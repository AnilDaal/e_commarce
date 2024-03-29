import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import customerRoute from "./routes/customerRoute.js";
import publicRoute from "./routes/publicRoute.js";
import sellerRoute from "./routes/sellersRoute.js";
import dotenv from "dotenv";
import AppError from "./utils/appError.js";
import globelErrorHandling from "./controllers/errorController.js";
import adminRoute from "./routes/adminRoute.js";
import helmet from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

dotenv.config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 6000;

// uncaughtException
process.on("uncaughtException", (err) => {
  console.log("UNHANDLED Exception! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

// unhandled Rejection
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shutting down...");
  console.log(err);
  console.log(err.name, err.message);
  process.exit(1);
});

// app.set("view engine", "ejs");
// app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan("dev"));
app.use(express.json({ limit: "5mb" }));
// for mongodb query in inpatch
app.use(ExpressMongoSanitize());
// for bad html in inpatch
app.use(hpp());
app.use(helmet());

// mongoose
mongoose.set("strictQuery", true);
// mongoose.set("bufferCommands", false);
mongoose.connect(process.env.MONGO_DB, (err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("mongoose connect successfully");
  }
});

// routes
app.use("/api/v1/customer/", customerRoute);
app.use("/api/v1/public/", publicRoute);
app.use("/api/v1/seller/", sellerRoute);
app.use("/api/v1/admin/", adminRoute);
app.use("/public/", express.static("uploads"));

app.get("/", (req, res) => res.send("hello India!"));

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`, 404));
});

app.use(globelErrorHandling);

app.listen(port, () => {
  console.log(`E-Commarce App listening on port ${port}!`);
});

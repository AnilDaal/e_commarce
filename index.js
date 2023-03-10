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

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//mongoose
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

app.get("/", (req, res) => res.send("Hello India!"));
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.url} on this server`, 404));
});

app.use(globelErrorHandling);

app.listen(port, () => {
  console.log(`E-Commarce App listening on port ${port}!`);
});

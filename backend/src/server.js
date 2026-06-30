import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import eventRoutes from "./routes/eventRoute.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(eventRoutes);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

import express from "express";
import {
  getAllJobs,
  addJob,
  updateJob,
  deleteJob
} from "../controllers/job.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js"; 

const router = express.Router();

// Routes
router.get("/", getAllJobs);
router.post("/", protectRoute, addJob);          
router.put("/:id", protectRoute, updateJob);     
router.delete("/:id", protectRoute, deleteJob); 

export default router;

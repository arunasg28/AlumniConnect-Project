import Job from "../models/job.models.js";
import { createJobPostNotifications } from "../controllers/notification.controller.js";
import User from "../models/user.model.js";
// Get all jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("createdBy", "_id name email"); // Populate the createdBy field with user details
    res.status(200).json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error.message);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

export const addJob = async (req, res) => {
  try {
    const newJob = new Job({ ...req.body, createdBy: req.user._id });
    const savedJob = await newJob.save();

    if (!savedJob) {
      return res.status(500).json({ message: "Failed to save job" });
    }

    
    const allUsers = await User.find();  
    allUsers.forEach((user) => {
      createJobPostNotifications(user._id, savedJob._id); 
    });

    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Failed to add job:", error);
    res.status(500).json({ message: "Failed to add job", error });
  }
};
// Update a job
export const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company, role, description, location, link } = req.body;

  try {
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { company, role, description, location, link },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob); // Successfully updated job
  } catch (error) {
    console.error("Error updating job:", error.message);
    res.status(500).json({ message: "Failed to update job" });
  }
};

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id); // ✅ Use this instead of job.remove()
    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("Error deleting job:", error.message);
    res.status(500).json({ message: "Failed to delete job", error: error.message });
  }
};


import Notification from "../models/notification.model.js";
import Job from "../models/job.models.js";


export const getUserNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ recipient: req.user._id })
			.sort({ createdAt: -1 })
			.populate("relatedUser", "name username profilePicture")
			.populate("relatedPost", "content image")
			.populate("relatedJob", "company role location");


		res.status(200).json(notifications);
	} catch (error) {
		console.error("Error in getUserNotifications controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const markNotificationAsRead = async (req, res) => {
	const notificationId = req.params.id;
	try {
		const notification = await Notification.findByIdAndUpdate(
			{ _id: notificationId, recipient: req.user._id },
			{ read: true },
			{ new: true }
		);

		res.json(notification);
	} catch (error) {
		console.error("Error in markNotificationAsRead controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteNotification = async (req, res) => {
	const notificationId = req.params.id;

	try {
		await Notification.findOneAndDelete({
			_id: notificationId,
			recipient: req.user._id,
		});

		res.json({ message: "Notification deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};

export const createJobPostNotifications = async (userId, jobId) => {
	try {
	  console.log("Creating notification for jobId:", jobId);  // Log jobId to ensure it's passed correctly
	  const job = await Job.findById(jobId);  // Fetch the job by ID
	  
	  if (!job) {
		console.error("Job not found for ID:", jobId);  // Log error if job is not found
		return;
	  }
  
	  const notification = new Notification({
		recipient: userId,
		type: "job_update",
		relatedJob: job._id,
		content: `A new job has been posted: ${job.title}`,
	  });
  
	  await notification.save();
	} catch (error) {
	  console.error("Error creating job post notification:", error.message);
	}
  };
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { Image, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from 'react-router-dom';


const JobList = () => {
  const { jobId } = useParams();
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    company: "",
    role: "",
    description: "",
    location: "",
    link: "",
    image: null,
  });
  const [editingJob, setEditingJob] = useState(null);  // To track which job is being edited
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  const queryClient = useQueryClient();

  // Fetch jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.get("https://alumniconnect-project.onrender.com/api/jobs");
      setJobs(response.data);
    } catch (error) {
      console.error(error);
      setError("Error fetching jobs.");
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Job posting mutation
  const { mutate: createJobMutation, isPending } = useMutation({
    mutationFn: async (jobData) => {
      const res = await axios.post("https://alumniconnect-project.onrender.com/api/jobs", jobData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Job posted successfully");
      fetchJobs();
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to post job");
    },
  });

  // Job update mutation
  const { mutate: updateJobMutation } = useMutation({
    mutationFn: async (jobData) => {
      const res = await axios.put(`https://alumniconnect-project.onrender.com/api/jobs/${editingJob._id}`, jobData, {
        withCredentials: true,
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      toast.success("Job updated successfully");
      fetchJobs();
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update job");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const jobData = { ...newJob };
      if (newJob.image) jobData.image = await readFileAsDataURL(newJob.image);

      if (editingJob) {
        updateJobMutation(jobData);  // Update the job
      } else {
        createJobMutation(jobData);  // Add new job
      }
    } catch (error) {
      setError("Error handling job submission: " + (error.response?.data?.message || error.message));
    }
  };

  const resetForm = () => {
    setNewJob({
      company: "",
      role: "",
      description: "",
      location: "",
      link: "",
      image: null,
    });
    setImagePreview(null);
    setIsFormVisible(false);
    setEditingJob(null);  // Reset editingJob
  };

  const handleDelete = async (jobId) => {
    try {
      await axios.delete(`https://alumniconnect-project.onrender.com/api/jobs/${jobId}`, {
        withCredentials: true,
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      setError("Error deleting job: " + (error.response?.data?.message || error.message));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewJob({ ...newJob, image: file });
    if (file) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const { data: user } = useQuery({ queryKey: ["authUser"] });

  const handleEdit = (job) => {
    setEditingJob(job);
    setNewJob({
      company: job.company,
      role: job.role,
      description: job.description,
      location: job.location,
      link: job.link,
      image: job.image,
    });
    setImagePreview(job.image || null);
    setIsFormVisible(true);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="col-span-1 lg:col-span-1 lg:block lg:visible hidden">
        <Sidebar user={user} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Job Updates</h1>

          {/* Add/Edit Job Button */}
          <div className="mb-6">
            {!isFormVisible && (
              <button
                onClick={() => setIsFormVisible(true)}
                className="bg-error text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
              >
                + Add Job
              </button>
            )}
          </div>

          {/* Form Section */}
          {isFormVisible && (
            <form onSubmit={handleSubmit} className="bg-gray-50 shadow-lg rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                {editingJob ? "Edit Job" : "Add Job"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Company"
                  value={newJob.company}
                  onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Role"
                  value={newJob.role}
                  onChange={(e) => setNewJob({ ...newJob, role: e.target.value })}
                  className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Link"
                  value={newJob.link}
                  onChange={(e) => setNewJob({ ...newJob, link: e.target.value })}
                  className="border border-gray-300 p-2 rounded w-full focus:ring focus:ring-blue-200"
                />
              </div>
              <textarea
                placeholder="Description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="border border-gray-300 p-2 rounded w-full mt-4 focus:ring focus:ring-blue-200"
              />

              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
                >
                  {isPending ? <Loader className="size-5 animate-spin" /> : editingJob ? "Update Job" : "Add Job"}
                </button>
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Error Message */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <div key={job._id} className="bg-white rounded-lg shadow-md p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {job.role} at {job.company}
                    </h3>
                    <p className="text-gray-500 text-sm mb-2">{job.location}</p>
                    <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                    {job.link && (
                      <a href={job.link} className="text-blue-600 hover:underline" target="_blank" rel="noreferrer">
                        Apply Here
                      </a>
                    )}
                  </div>
                  {user && job.createdBy && user._id === job.createdBy._id && (
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => handleEdit(job)}
                        className="bg-yellow-400 text-white py-2 px-4 rounded-md shadow hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(job._id)}
                        className="bg-red-600 text-white py-2 px-4 rounded-md shadow hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No jobs available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobList;

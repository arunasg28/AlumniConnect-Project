import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios"; // Ensure your axiosInstance is correctly configured
import Sidebar from "./Sidebar";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// Fetch connected profiles from the API
const fetchConnectedProfiles = async () => {
  const response = await axiosInstance.get("/connections"); // Assumes your backend route is /connections
  return response.data;
};

const ConnectedProfilesPage = () => {
  const { data: connections = [], isLoading, error } = useQuery({
    queryKey: ["connectedProfiles"],
    queryFn: fetchConnectedProfiles,
  });

  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const { data: user } = useQuery({ queryKey: ["authUser"] });

  // Handle loading and error states
  if (isLoading) return <p>Loading connected profiles...</p>;
  if (error) {
    toast.error("Error loading connected profiles");
    return <p>Error loading connected profiles</p>;
  }

  // Filter connections based on the search term
  const filteredConnections = connections.filter((connection) =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar - hidden on mobile */}
      <div className="col-span-1 lg:col-span-1 lg:block lg:visible hidden">
        <Sidebar  user={user}  />
      </div>

      {/* Main Content */}
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-secondary rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">My Connections</h1>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative w-full">
              <input
                type="text"
                className="w-full p-4 pr-12 bg-gray-100 border border-gray-300 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                placeholder="Search connections by name or username..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M13.775 12.225C12.725 13.075 11.125 13.5 9.5 13.5C6.462 13.5 4 11.038 4 8C4 4.962 6.462 2.5 9.5 2.5C12.538 2.5 15 4.962 15 8C15 9.625 14.225 11.025 13.775 12.225ZM9.5 3.5C7.015 3.5 5 5.515 5 8C5 10.485 7.015 12.5 9.5 12.5C11.985 12.5 14 10.485 14 8C14 5.515 11.985 3.5 9.5 3.5ZM9.5 0C4.25 0 0 4.25 0 8C0 11.75 4.25 16 9.5 16C14.75 16 19 11.75 19 8C19 4.25 14.75 0 9.5 0Z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>

          {/* Render filtered connections */}
          {filteredConnections.length > 0 ? (
            <div className="space-y-4">
              {filteredConnections.map((connection) => (
                <div
                  key={connection._id}
                  className="bg-white rounded-lg  p-4 flex items-center justify-between transition-all hover:shadow-xl"
                >
                  <div className="flex items-center gap-4">
                    <Link to={`/profile/${connection.username}`}>
                      <img
                        src={connection.profilePicture || "/avatar.png"}
                        alt={connection.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </Link>

                    <div>
                      <Link
                        to={`/profile/${connection.username}`}
                        className="font-semibold text-lg text-gray-900 hover:text-primary"
                      >
                        {connection.name}
                      </Link>
                      <p className="text-gray-600">{connection.headline}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No connections found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConnectedProfilesPage;

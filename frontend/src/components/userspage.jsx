import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { Link } from "react-router-dom";

// Fetch users from the API
const fetchUsers = async () => {
  const response = await axiosInstance.get("/auth/all");
  console.log(response.data); // Check the structure of your API response
  return response.data.users || [];
};

const AllUsersPage = () => {
  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: "fetchUsers",
    queryFn: fetchUsers,
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || ""; // Get the search query from URL
  const departmentQuery = queryParams.get("department") || ""; // Filter by department
  const batchQuery = queryParams.get("batch") || ""; // Filter by batch

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error fetching users</p>;

  // Filter users based on the search query, department, and batch
  const filteredUsers = users.filter((user) => {
    const nameMatch = user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const departmentMatch = user?.contactDetails?.[0]?.department.toLowerCase().includes(departmentQuery.toLowerCase());
    const batchMatch = user.batch.toLowerCase().includes(batchQuery.toLowerCase());
    
    // If any of the filters match, include the user
    return nameMatch && departmentMatch && batchMatch;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col items-center space-y-6">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="border rounded-lg p-2 shadow-md w-full max-w-md"
            >
              <Link to={`/profile/${user.username}`} className="flex items-center space-x-4">
                {/* Avatar on the left */}
                <img
                  src={user.profilePicture || "/avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-md font-semibold text-gray-800 hover:text-blue-500 cursor-pointer">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-600">{user.headline}</p>
                  <p className="text-sm text-gray-600">{user?.contactDetails?.[0]?.department || "N/A"}</p>
                  
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p>No users found matching the search query.</p>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;

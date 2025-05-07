import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import { Link } from "react-router-dom";
import { Bell, Home, LogOut, User, Users, Menu, X, Briefcase } from "lucide-react"; // Import Briefcase icon
import { useState } from "react";
import SearchBar from "../searchbar";
import { FaRobot } from "react-icons/fa";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => axiosInstance.get("/notifications"),
    enabled: !!authUser,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => axiosInstance.get("/connections/requests"),
    enabled: !!authUser,
  });

  const { mutate: logout } = useMutation({
    mutationFn: () => axiosInstance.post("/auth/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const unreadNotificationCount = notifications?.data.filter((notif) => !notif.read).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-error shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <Link to="/homepage">
              <img className="h-8 rounded" src="../clg logo.png" alt="College logo" />
            </Link>
            <h1 className="flex items-center space-x-4 text-white font-mono">Alumni Connect</h1>

          </div>
          <div className="flex justify-between items-center mt-5">  {location.pathname !== '/' && <SearchBar />}</div>   
          {/* Hamburger Menu */}
          <button
            className="md:hidden text-white"
            onClick={() => setMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            {authUser ? (
              <>
                <Link to="/homepage" className="text-neutral flex flex-col items-center">
                  <Home size={20} />
                  <span className="text-xs text-white">Home</span>
                </Link>
                <Link to="/jobs" className="text-neutral flex flex-col items-center">
                  <Briefcase size={20} /> {/* Add Briefcase icon for Job Postings */}
                  <span className="text-xs text-white">Jobs</span>
                </Link>
                <Link
                  to="/network"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Users size={20} />
                  <span className="text-xs text-white">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full size-3 flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>

           <Link
                  to="/connected-profiles"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Users size={20} />
                  <span className="text-xs text-white">My connections</span>
                </Link>
                <Link
                  to="/notifications"
                  className="text-neutral flex flex-col items-center relative"
                >
                  <Bell size={20} />
                  <span className="text-xs text-white">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full size-3 flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>


                <Link
                  to={`/profile/${authUser.username}`}
                  className="text-neutral flex flex-col items-center"
                >
                  <User size={20} />
                  <span className="text-xs text-white">Me</span>
                </Link>

                {authUser.headline === "Faculty" && (
  <Link
    to="/chatbot"
    className="text-neutral flex flex-col items-center"
  >
    <FaRobot size={20} /> {/* You can change icon if you want */}
    <span className="text-xs text-white">Chatbot</span>
  </Link>
)}

                <button
                  className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                  onClick={() => logout()}
                >

                  <LogOut size={20} />
                  <span className="text-white">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar for Mobile */}
      <div
        className={`fixed inset-y-0 right-0 bg-error w-50 transform ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 z-20`}
      >
        <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
          <h1 className="flex items-center space-x-4 text-white font-mono">Alumni Connect</h1>
          <button
            className="text-white"
            onClick={closeMenu}
          >
            <X size={24} />
          </button>
        </div>
        <div className="flex flex-col gap-4 px-4 py-6">
          {authUser ? (
            <>
              <Link to="/homepage" className="text-neutral flex items-center" onClick={closeMenu}>
                <Home size={20} className="mr-2" />
                <span className="text-white">Posts/Events</span>
              </Link>
              <Link
                to="/jobs" // Add link to jobs in mobile menu
                className="text-neutral flex items-center"
                onClick={closeMenu}
              >
                <Briefcase size={20} className="mr-2" /> {/* Add Briefcase icon for mobile */}
                <span className="text-white">Job Updates</span>
              </Link>
              <Link
                to="/network"
                className="text-neutral flex items-center relative"
                onClick={closeMenu}
              >
                <Users size={20} className="mr-2" />
                <span className="text-white">My Network</span>
                {unreadConnectionRequestsCount > 0 && (
                  <span
                    className="absolute bg-blue-500 text-white text-xs rounded-full size-3 flex items-center justify-center"
                  >
                    {unreadConnectionRequestsCount}
                  </span>
                )}
              </Link>

              <Link
                to="/connected-profiles"
                className="text-neutral flex items-center relative"
                onClick={closeMenu}
              >
                <Users size={20} className="mr-2" />
                <span className="text-white">My Connections</span>
              </Link>

              <Link
                to="/notifications"
                className="text-neutral flex items-center relative"
                onClick={closeMenu}
              >
                <Bell size={20} className="mr-2" />
                <span className="text-white">Notifications</span>
                {unreadNotificationCount > 0 && (
                  <span
                    className="absolute bg-blue-500 text-white text-xs rounded-full size-3 flex items-center justify-center"
                  >
                    {unreadNotificationCount}
                  </span>
                )}
              </Link>
              <Link
                to={`/profile/${authUser.username}`}
                className="text-neutral flex items-center"
                onClick={closeMenu}
              >
                <User size={20} className="mr-2" />
                <span className="text-white">Profile</span>
              </Link>

              {authUser.headline === "Faculty" && (
  <Link
    to="/chatbot"
    className="text-neutral flex items-center"
  >
    <FaRobot size={20} /> 
    <span className=" text-white">Chatbot</span>
  </Link>
)}


              <button
                className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >


                <LogOut size={20} className="mr-2" />
                <span className="text-white">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost" onClick={closeMenu} >
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-primary" onClick={closeMenu}>
                Join now
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Background Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          onClick={closeMenu}
        />
      )}
    </nav>
  );
};

export default Navbar;

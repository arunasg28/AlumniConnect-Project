import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Camera, Clock, UserCheck, UserPlus, X } from "lucide-react";
import ContactDetailsSection from "./contactsSection";

const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
    queryKey: ["connectionStatus", userData._id],
    queryFn: () => axiosInstance.get(`/connections/status/${userData._id}`),
    enabled: !isOwnProfile,
  });

  const isConnected = userData.connections.some((connection) => connection === authUser._id);

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: (userId) => axiosInstance.post(`/connections/request/${userId}`),
    onSuccess: () => {
      toast.success("Connection request sent");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: acceptRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request accepted");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: rejectRequest } = useMutation({
    mutationFn: (requestId) => axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection request rejected");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const { mutate: removeConnection } = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
    onSuccess: () => {
      toast.success("Connection removed");
      refetchConnectionStatus();
      queryClient.invalidateQueries(["connectionRequests"]);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "An error occurred");
    },
  });

  const getConnectionStatus = useMemo(() => {
    if (isConnected) return "connected";
    if (connectionStatus?.data?.status) return connectionStatus.data.status;
    return "not_connected";
  }, [isConnected, connectionStatus]);

  const renderConnectionButton = () => {
    const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
    switch (getConnectionStatus) {
      case "connected":
        return (
          <div className='flex gap-2 justify-center'>
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className='mr-2' />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={20} className='mr-2' />
              Remove Connection
            </button>
          </div>
        );

      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className='mr-2' />
            Pending
          </button>
        );

      case "received":
        return (
          <div className='flex gap-2 justify-center'>
            <button
              onClick={() => acceptRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.data.requestId)}
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => sendConnectionRequest(userData._id)}
            className='bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center'
          >
            <UserPlus size={20} className='mr-2' />
            Connect
          </button>
        );
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  const { mutate: updateContact } = useMutation({
    mutationFn: (updatedData) => {
      const formattedArray = updatedData.contactDetails.contactDetails;
      return axiosInstance.put(`users/profile`, { contactDetails: formattedArray });
    },
    onSuccess: () => {
      toast.success("Contact details updated successfully");
      queryClient.invalidateQueries(["authUser"]);
    },
    onError: (error) => {
      console.error("Contact update error:", error);
      toast.error(error.response?.data?.message || "Failed to update contact details");
    },
  });

  const handleContactSave = (updatedContactArray) => {
    updateContact({ contactDetails: updatedContactArray });
  };

  return (
    <div className='flex flex-col sm:flex-row '>
      {/* Profile Card */}
      <div className='bg-white shadow rounded-l-lg mb-6 w-full'>
        <div
          className='relative h-48 rounded-tl-lg bg-cover bg-center'
          style={{
            backgroundImage: `url('${editedData.bannerImg || userData.bannerImg || "/banner.png"}')`,
          }}
        >
          {isEditing && (
            <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
              <Camera size={20} />
              <input
                type='file'
                className='hidden'
                name='bannerImg'
                onChange={handleImageChange}
                accept='image/*'
              />
            </label>
          )}
        </div>

        <div className='p-4'>
          <div className='relative -mt-20 mb-4'>
            <img
              className='w-32 h-32 rounded-full mx-auto object-cover'
              src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
              alt={userData.name}
            />

            {isEditing && (
              <label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
                <Camera size={20} />
                <input
                  type='file'
                  className='hidden'
                  name='profilePicture'
                  onChange={handleImageChange}
                  accept='image/*'
                />
              </label>
            )}
          </div>

          <div className='text-center mb-4'>
            {isEditing ? (
              <input
                type='text'
                value={editedData.name ?? userData.name}
                onChange={(e) => setEditedData({ ...editedData, name: e.target.value })}
                className='text-2xl font-bold mb-2 text-center w-full'
              />
            ) : (
              <h1 className='text-2xl font-bold mb-2'>{userData.name}</h1>
            )}

            <div className="text-gray-400 bg-gray-100 cursor-not-allowed text-center w-full">
              <p className="text-gray-600">
                {editedData.headline ?? userData.headline}
              </p>
              <p className='text-sm text-gray-500 mt-2'>{userData.connections?.length} connections</p>
            </div>
          </div>

          {isOwnProfile ? (
            isEditing ? (
              <button
                className='w-full bg-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark transition duration-300'
                onClick={handleSave}
              >
                Save Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className='w-full bg-error text-white py-2 px-4 rounded-full hover:bg-primary-dark transition duration-300'
              >
                Edit Profile
              </button>
            )
          ) : (
            <div className='flex justify-center'>{renderConnectionButton()}</div>
          )}
        </div>
      </div>

      {/* Contact Details Section */}
      {userData?.headline !== 'Faculty' && (
        <ContactDetailsSection
          userData={userData}
          isOwnProfile={isOwnProfile}
          onSave={handleContactSave}
        />
      )}
    </div>
  );
};

export default ProfileHeader;

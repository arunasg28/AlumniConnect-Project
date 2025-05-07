import { useState } from "react";

const ContactDetailsSection = ({ userData, isOwnProfile, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [contactDetails, setContactDetails] = useState(userData.contactDetails || []);
  const [originalData, setOriginalData] = useState([]);

  const handleDeleteContact = (index) => {
    const updatedContacts = [...contactDetails];
    updatedContacts.splice(index, 1);
    setContactDetails(updatedContacts);
  };

  const handleSave = () => {
    console.log("Saving data:", { contactDetails });
    setIsEditing(false);
    onSave({ contactDetails });
  };

  const handleCancel = () => {
    setContactDetails(originalData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow rounded-r-lg p-6 mb-6 w-full">
      <h2 className="text-xl font-semibold mb-4">Details</h2>

      {contactDetails.length > 0 ? (
        contactDetails.map((contact, index) => (
          <div key={index} className="mb-4 border-b pb-4">
            {["department", "batch", "registerNo", "phoneNo", "email"].map((field) => (
              <div className="mb-2" key={field}>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    value={contact[field] || ""}
                    onChange={(e) => {
                      const updated = [...contactDetails];
                      updated[index][field] = e.target.value;
                      setContactDetails(updated);
                    }}
                    className="border rounded p-1 ml-2"
                  />
                ) : (
                  contact[field] || "N/A"
                )}
              </div>
            ))}

            {isEditing && (
              <button
                onClick={() => handleDeleteContact(index)}
                className="text-red-500 mt-2"
              >
                Delete
              </button>
            )}
          </div>
        ))
      ) : (
        isEditing && (
          <div className="mb-4 border-b pb-4">
            {["department", "batch", "registerNo", "phoneNo", "email"].map((field) => (
              <div className="mb-2" key={field}>
                <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>{" "}
                <input
                  type="text"
                  value=""
                  onChange={() => {}}
                  className="border rounded p-1 ml-2"
                  disabled
                />
              </div>
            ))}
          </div>
        )
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleSave}
                className="bg-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setOriginalData([...contactDetails]);
                if (contactDetails.length === 0) {
                  setContactDetails([
                    { department: "", batch: "", registerNo: "", phoneNo: "", email: "" },
                  ]);
                }
                setIsEditing(true);
              }}
              className="mt-4 text-primary hover:text-primary-dark transition duration-300"
            >
              Edit Contact Details
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ContactDetailsSection;

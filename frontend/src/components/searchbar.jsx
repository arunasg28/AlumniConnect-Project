import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setQuery(query);

    // Redirect to the search page with query in the URL
    if (query.trim()) {
      navigate(`/userspage?search=${query}`); // Redirect to search page immediately
    } else {
      navigate("/userspage"); // Redirect to all users if the query is empty
    }
  };

  return (
    <div className="flex justify-center items-center mb-6">
      <div className="relative w-full max-w-md">
        {/* Search Icon */}
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9 3a6 6 0 104.472 10.472l4.44 4.44a1 1 0 001.416-1.414l-4.44-4.44A6 6 0 009 3zm0 2a4 4 0 110 8 4 4 0 010-8z"
            clipRule="evenodd"
          />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search for users..."
          value={query}
          onChange={handleSearchChange}
          className="w-full pl-10 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-error focus:border-error transition "
        />
      </div>
    </div>
  );
};

export default SearchBar;

import React from "react";

const SearchBox = () => {
  return (
    <div className="search_box">
      <input type="text" placeholder="Location" />
      <input type="date" placeholder="Check in" />
      <input type="date" placeholder="Check out" />
      <button>Search</button>
    </div>
  );
};

export default SearchBox;

import React, { useState } from 'react';
import './MySearch.css';
import { FiSearch, FiX } from 'react-icons/fi';

const SearchInput = ({ placeholder = "Введите ", onSearch }) => {
  const [value, setValue] = useState("");

  const handleInputChange = (e) => setValue(e.target.value);

  const handleClear = () => {
    setValue("");
    if (onSearch) onSearch("");
  };

  const handleSearch = () => {
    if (onSearch) onSearch(value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="my-search">
      <button className="icon-button search-icon" onClick={handleSearch}>
        <FiSearch size={18} />
      </button>

      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="search-input"
      />
      
      {value && (
        <button className="icon-button" onClick={handleClear}>
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};



export default SearchInput;
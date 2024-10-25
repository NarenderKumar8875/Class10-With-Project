import React from "react";


const Select = ({ name, className, err, value, setExp ,setFilter, options , fixedOption}) => {
  return (
    <>
      <select
        name={name}
        value={value}
        onChange={(e) => {
          setExp !==undefined? setExp(e): setFilter(e.target.value)
        }}
      >
        {/* {setExp !== undefined?<option hidden>Select Category</option>: <option value={''}>All</option>} */}
        {fixedOption}
        {options.map((option, i)=>{
          return <option key={i} value={option}>{option}</option>
        })}

      </select>
      <p className={className}>{err}</p>
    </>
  );
};

export default Select;

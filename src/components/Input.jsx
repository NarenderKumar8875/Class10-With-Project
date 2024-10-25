import React from "react";

const Input = ({type ,name, value ,err, className ,setExp}) => {
   
  return (
    <>
    <input
      type={type}
      name={name}
      value={value}
      onChange={(e)=>{setExp(e)}}
    />
    <p className={className}>{err}</p>
    </>
  );
};

export default Input;

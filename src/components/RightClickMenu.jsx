import React from "react";

const RightClickMenu = ({
  rightClick,
  deleteID,
  setExpenses,
  setRightClick,
  setExpense,
  setIsEdit
}) => {
  if (!rightClick.left) return;
  return (
    <div
      style={{ top: rightClick.top + "px", left: rightClick.left + "px" }}
      className="right-click-menu"
    >
      <p onClick={()=>{
        setIsEdit(deleteID)
        setExpenses((prevState)=>{
         const val = prevState.find((e)=>{
                return (e.id === deleteID)
            })
            setExpense(val)
            return prevState
        })
        setRightClick('')

      }}>Edit</p>
      
      <p
        onClick={() => {
          setExpenses((prev) => {
            return prev.filter((expense) => {
              return expense.id !== deleteID;
            });
          });
          setRightClick("");
        }}
      >
        Delete
      </p>
    </div>
  );
};

export default RightClickMenu;

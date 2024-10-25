import React, { useState } from "react";
import ExpenceList from "../ExpenceList";
import Input from "./Input";
import Select from "./Select";
import Options from "../Options";
import { useFilter } from "../hooks/useFilter";
import RightClickMenu from "./RightClickMenu";
import { useLocalStorage } from "../hooks/useLocalStorage";

const Expense = () => {
  const [expenses, setExpenses] = useLocalStorage('expenses',ExpenceList);

  const [expense, setExpense] = useLocalStorage('expense',{
    id: "",
    title: "",
    category: "",
    amount: "",
  });

  const [setFilterr, filtredData] = useFilter(
    expenses,
    (data) => data.category
  ); //custom hook for filter

  const [rightClick, setRightClick] = useState({});
  const [deleteID, setDeleteID] = useState("");
  const [isEdit, setIsEdit] = useLocalStorage('isEdit','');
  const [isSort, setIsSort] = useState(false);
  const [sortTitles, setSortTitles] = useState(false);
  const [sortCallback, setSortCllback] = useState(() => () => {});
  

  // total Amount with using reduce
  const amount = filtredData.reduce((acumlator, current) => {
    return acumlator + parseInt(current.amount);
  }, 0);

  const [errors, setErrors] = useState({});

  const validationConfig = {
    id: [],
    title: [
      { required: true, message: " Please enter Title" },
      {
        minLength: true,
        message: "Title should be at least 3 characters long",
      },
    ],
    category: [{ required: true, message: " Please enter Category" }],
    amount: [{ required: true, message: " Please enter Amount" }],
  };

  function findErr(formData) {
    const error = {};

    Object.entries(formData).forEach(([key, value]) => {
      validationConfig[key].some((rule) => {
        if (rule.required && !value) {
          error[key] = rule.message;
          return true;
        }

        if (rule.minLength && value.length < 3) {
          error[key] = rule.message;
          return true;
        }
      });
    });

    // if (formData.title === "") {
    //   error.title = "Title is require";
    // }
    // if (formData.category === "") {
    //   error.category = "Category is require";
    // }
    // if (formData.amount === "") {
    //   error.amount = "Amount is require";
    // }
    setErrors(error);
    return error;
  }

  function setExp(e) {
    const { name, value } = e.target;
    setExpense((prev) => {
      return { ...prev, [name]: value };
    });
    setErrors({});
  }

  // useRef se puri dom node ko acces kr skte h our uski value bhi
  // lekin useRef se components rerender nhi hota
  // m to useState wala trika hi sahi h

  // const titleRef = useRef(null);
  // const categoryRef = useRef(null);
  // const amountRef = useRef(null);

  function formSubmitHandle(e) {
    e.preventDefault();
    const Err = findErr(expense);

    if (Object.keys(Err).length) return;

    if (isEdit) {
      setExpenses((prevState) => {
        return prevState.map((exp) => {
          if (exp.id === deleteID) {
            return expense;
          }
          return exp;
        });
      });
      setExpense({
        id: "",
        title: "",
        category: "",
        amount: "",
      });
      setIsEdit("");
      return;
    }

    setExpenses((prev) => {
      return [...prev, { ...expense, id: crypto.randomUUID() }];
    });

    setExpense({
      id: "",
      title: "",
      category: "",
      amount: "",
    });

    // useRef wala trika------------->

    // return [...prev, {
    //   title: titleRef.current.value,
    //   category: categoryRef.current.value,
    //   amount: amountRef.current.value,
    //   id: crypto.randomUUID()
    // }]
  }

  // chek krna usefect se jb bhi components render hota h to useref call hota hai

  // useEffect(()=>{
  //   console.log(titleRef.current.value)
  // })

  function sortAmount() {
    if (!isSort) {
      setSortCllback(()=> (a,b)=> a.amount - b.amount)
      setIsSort(true);
    }
    if (isSort) {
      setSortCllback(()=> (a,b)=> b.amount - a.amount)
      setIsSort(false);
    }
  }

  function sortTitle() {
    if (!sortTitles) {
      setSortCllback(()=> (a,b)=> a.title.localeCompare(b.title))
      setSortTitles(true);
    }

    if (sortTitles) {
      setSortCllback(()=> (a,b)=> b.title.localeCompare(a.title))
      setSortTitles(false);
    }
  }
 
  
  return (
    <>
      <main>
        <form
          onSubmit={(e) => {
            formSubmitHandle(e);
          }}
        >
          <div className="inputs-container">
            <h2
            onClick={()=>{
              setLocalDeta((prev)=> [...prev, 4,5,6])
            }}
            >Enter Your Expense</h2>
            <div className="titll">
              <p>
                Title <b style={{ color: "red" }}>*</b>{" "}
              </p>

              <Input
                name="title"
                value={expense.title}
                setExp={setExp}
                type="text"
                err={errors.title}
                className="titleErr"
              />
            </div>

            <div className="Category">
              <p>
                category <b style={{ color: "red" }}>*</b>
              </p>
              <Select
                name="category"
                value={expense.category}
                setExp={setExp}
                className="catErr"
                err={errors.category}
                options={Options}
                fixedOption={<option hidden>Select Catrgory</option>}
              />
            </div>
            <div className="Amount">
              <p>
                Amount <b style={{ color: "red" }}>*</b>
              </p>
              <Input
                type="number"
                name="amount"
                value={expense.amount}
                setExp={setExp}
                className="amoErr"
                err={errors.amount}
              />
            </div>
          </div>
          <button type="submit">{isEdit ? "Save" : "Add Expense"}</button>
        </form>
        <div className="outputs-container">
          <RightClickMenu
            rightClick={rightClick}
            deleteID={deleteID}
            setExpenses={setExpenses}
            setRightClick={setRightClick}
            setExpense={setExpense}
            setIsEdit={setIsEdit}
          />
          <button onClick={()=> setSortCllback(()=> ()=>{})}>Clear FIlter</button>
          <table
            onClick={() => {
              if (rightClick.left) {
                setRightClick({});
              }
            }}
          >
            
            <tbody>
              <tr>
                <th>
                  <div className="thh">
                    Title
                    <i
                      onClick={sortTitle}
                      className="fa-solid fa-arrow-down-up-across-line"
                    ></i>
                  </div>
                </th>
                <th>
                  <Select
                    setFilter={setFilterr}
                    options={Options}
                    fixedOption={<option value="">All</option>}
                  />
                </th>
                <th>
                  <div className="thh">
                    Amount{" "}
                    <i
                      onClick={sortAmount}
                      className="fa-solid fa-arrow-down-up-across-line"
                    ></i>
                  </div>
                </th>
              </tr>

              {filtredData.sort(sortCallback).map(({ id, title, category, amount }) => {
                return (
                  <tr
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setRightClick({ left: e.clientX, top: e.clientY });
                      setDeleteID(id);
                    }}
                    key={id}
                  >
                    <td>{title}</td>
                    <td>{category}</td>
                    <td id="ttdd">{"₹ " + amount}</td>
                  </tr>
                );
              })}

              <tr>
                <th>Total</th>
                <th>{filtredData.length}</th>
                <th>{amount}</th>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
};

export default Expense;

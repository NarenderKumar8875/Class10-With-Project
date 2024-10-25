import { useState } from "react";

const useFilter = (data, callback) => {
  const [filter, setFilterr] = useState("");

  const filtredData = data.filter((item) => {
    return callback(item).toLowerCase().includes(filter.toLowerCase());
  });

  return [setFilterr, filtredData];
};
export { useFilter };

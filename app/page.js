"use client";
import React, { useState, useEffect } from "react";
import IncomeTable from "./components/IncomeTable";
import ExpenseTable from "./components/ExpenseTable";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseTracker = () => {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    email: "",
    password: "",
    phoneNumber: "",
    type: "income",
  });

  const [error, setError] = useState({});
  const [data, setData] = useState([]);
  const [edit, setEdit] = useState(null);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("transactions")) || [];
    setData(storedData);
  }, []);

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (formData.name.length < 3) {
      errors.name = "Name must be at least 3 characters long.";
      isValid = false;
    }

    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      errors.amount = "Please enter a valid amount.";
      isValid = false;
    }

    if (!formData.email.includes("@")) {
      errors.email = "Please enter a valid email address.";
      isValid = false;
    }

    if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    if (formData.phoneNumber.length < 10) {
      errors.phoneNumber = "Phone number must be at least 10 digits.";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const storedData = JSON.parse(localStorage.getItem("transactions")) || [];
    let updatedData = [...storedData];

    if (edit !== null) {
      updatedData.splice(edit, 1, formData);
      setEdit(null);
    } else {
      updatedData.push(formData);
    }

    setData(updatedData);
    localStorage.setItem("transactions", JSON.stringify(updatedData));
    setFormData({
      name: "",
      amount: "",
      email: "",
      password: "",
      phoneNumber: "",
      type: "income",
    });
  };

  function handleTypeChange(e) {
    setFormData({ ...formData, type: e.target.value });
  }

  const deleteEntry = (index, type) => {
    const updatedData = data.filter((_, itemIndex) => itemIndex !== index);
    setData(updatedData);
    localStorage.setItem("transactions", JSON.stringify(updatedData));
  };

  const editEntry = (index) => {
    setFormData(data[index]);
    setEdit(index);
  };

  const calcChart = () => {
    let incTotal = 0,
      expTotal = 0;

    data.map((item) => {
      if (item.type == "income") {
        incTotal += Number(item.amount);
      } else {
        expTotal += Number(item.amount);
      }
    });
    return { incTotal, expTotal };
  };

  const { incTotal, expTotal } = calcChart();

  const pieChart = {
    labels: ["income", "expense"],

    datasets: [
      {
        data: [incTotal, expTotal],
        backgroundColor: ["green", "red"],
      },
    ],
  };

  function netIncome() {
    let ans = incTotal - expTotal;
    console.log(ans);
    console.log(incTotal);
    console.log(expTotal);

    return ans;
  }

  return (
    <div>
      <h2>Expense Tracker</h2>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Enter Name"
          name="name"
          value={formData.name}
          onChange={changeHandler}
        />
        {error.name && <p style={{ color: "red" }}>{error.name}</p>}
        <br />

        <input
          type="number"
          placeholder="Enter Amount"
          name="amount"
          value={formData.amount}
          onChange={changeHandler}
        />
        {error.amount && <p style={{ color: "red" }}>{error.amount}</p>}
        <br />

        <input
          type="email"
          placeholder="Enter Email"
          name="email"
          value={formData.email}
          onChange={changeHandler}
        />
        {error.email && <p style={{ color: "red" }}>{error.email}</p>}
        <br />

        <input
          type="password"
          placeholder="Enter Password"
          name="password"
          value={formData.password}
          onChange={changeHandler}
        />
        {error.password && <p style={{ color: "red" }}>{error.password}</p>}
        <br />

        <input
          type="tel"
          placeholder="Phone Number"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={changeHandler}
        />
        {error.phoneNumber && (
          <p style={{ color: "red" }}>{error.phoneNumber}</p>
        )}
        <br />
        <label>
          <input
            type="radio"
            name="type"
            value="income"
            checked={formData.type === "income"}
            onChange={handleTypeChange}
          />
          Income
        </label>

        <label>
          <input
            type="radio"
            name="type"
            value="expense"
            checked={formData.type === "expense"}
            onChange={handleTypeChange}
          />
          Expense
        </label>
        <br />
        <button type="submit">
          {edit !== null ? "Update Entry" : "Add Entry"}
        </button>
      </form>

      <div className="sub-div">
        {/* <IncomeTable
          data={data.filter((item) => item.type === "income")}
          deleteEntry={(index) => deleteEntry(index, "income")}
          editEntry={editEntry}
        />

        <ExpenseTable
          data={data.filter((item) => item.type === "expense")}
          deleteEntry={(index) => deleteEntry(index, "expense")}
          editEntry={editEntry}
        /> */}
        <IncomeTable
          data={data.filter((item) => item.type === "income")}
          deleteEntry={(index) => {
            const originalIndex = data.findIndex(
              (item) =>
                item === data.filter((item) => item.type === "income")[index]
            );
            deleteEntry(originalIndex, "income");
          }}
          editEntry={(index) => {
            const originalIndex = data.findIndex(
              (item) =>
                item === data.filter((item) => item.type === "income")[index]
            );
            editEntry(originalIndex);
          }}
        />

        <ExpenseTable
          data={data.filter((item) => item.type === "expense")}
          deleteEntry={(index) => {
            const originalIndex = data.findIndex(
              (item) =>
                item === data.filter((item) => item.type === "expense")[index]
            );
            deleteEntry(originalIndex, "expense");
          }}
          editEntry={(index) => {
            const originalIndex = data.findIndex(
              (item) =>
                item === data.filter((item) => item.type === "expense")[index]
            );
            editEntry(originalIndex);
          }}
        />
      </div>

      <button>Net Income:{netIncome()}</button>

      <Pie data={pieChart} className="chart" />
    </div>
  );
};

export default ExpenseTracker;

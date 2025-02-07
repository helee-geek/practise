import React from "react";

const IncomeTable = ({ data, deleteEntry, editEntry }) => {

  console.log("Checking main");
  console.log("Checking again in main....");
  
  return (
    <div>
      <h3>Income Table</h3>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>{item.email}</td>
              <td>{item.phoneNumber}</td>
              <td>
                <button onClick={() => deleteEntry(index)}>Delete</button>
              </td>
              <td>
                <button onClick={() => editEntry(index)}>Edit</button>
              </td>
            </tr>
          ))}
          <tr>
          <td>Total Amount: {data.reduce((sum, item) => sum + Number(item.amount), 0)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default IncomeTable;

// import React from 'react';

// const TransactionList = ({ transactions }) => {
//   const sortedTransactions = [...transactions].sort((a, b) => {
//     const dateA = new Date(a.date);
//     const dateB = new Date(b.date);
//     return dateB - dateA;
//   });

//   return (
//     <div className="table-responsive transactions-table">
//       <table className="table table-striped">
//         <thead>
//           <tr>
//             <th>Date</th>
//             <th>Category</th>
//             <th>Type</th>
//             <th>Amount</th>
//             <th>Description</th>
//           </tr>
//         </thead>
//         <tbody>
//           {sortedTransactions.map((transaction) => (
//             <tr key={transaction.id}>
//               <td>{transaction.date}</td>
//               <td>{transaction.categoryName}</td>
//               <td>{transaction.amount >= 0 ? 'Income' : 'Expense'}</td>
//               <td>₹{Math.abs(transaction.amount)}</td>
//               <td>{transaction.description}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default TransactionList;
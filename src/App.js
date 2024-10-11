import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns'; // Import format function from date-fns
import './App.css'; // Import CSS for styling

function App() {
  const [transactions, setTransactions] = useState([]);
  const [formData, setFormData] = useState({
    date: '',
    store: '',
    amount: '',
  });
  const [notification, setNotification] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'https://personalfinance-production.up.railway.app';

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`${API_URL}/transactions`);
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setNotification('Failed to fetch transactions.');
    }
  };

  const addTransaction = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/transactions`, formData);
      fetchTransactions();
      setFormData({ date: '', store: '', amount: '' });
      setNotification('Transaction added successfully!');
    } catch (err) {
      console.error('Error adding transaction:', err);
      setNotification('Failed to add transaction.');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${API_URL}/transactions/${id}`);
      fetchTransactions();
      setNotification('Transaction deleted successfully!');
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setNotification('Failed to delete transaction.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h1>Financial Transactions</h1>
      {notification && <div className="notification">{notification}</div>}
      <form onSubmit={addTransaction} className="transaction-form">
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="store"
          placeholder="Store"
          value={formData.store}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          step="0.01"
          required
        />
        <button type="submit">Add Transaction</button>
      </form>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Store</th>
            <th>Amount ($)</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t.id}>
              <td>{format(new Date(t.date), 'MMMM d, yyyy')}</td>
              <td>{t.store}</td>
              <td>{parseFloat(t.amount).toFixed(2)}</td>
              <td>
                <button onClick={() => deleteTransaction(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

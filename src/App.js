import { useEffect, useState } from 'react';
import { FaTrash, FaSave, FaEdit, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { Helmet } from 'react-helmet';

import './App.css';


function App() {
  const [name, setName] = useState('');
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDatetime, setEditDatetime] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  async function getTransactions() {
    const url = process.env.REACT_APP_API_URL + '/transactions';
    console.log(url + "working!!!");
    try {
      const response = await fetch(url);
      return await response.json();
    } catch (err) {
      console.error('Fetch failed:', err);
      return [];
    }

  }

  useEffect(() => {
    async function fetchAll() {
      const url = process.env.REACT_APP_API_URL + '/transactions';
      try {
        const response = await fetch(url);
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error('Fetch failed:', err);
        setTransactions([]);
      }
    }

    console.log("working!!!");
    fetchAll();
  }, []);


  function addNewTransaction(e) {
    e.preventDefault();
    const url = process.env.REACT_APP_API_URL + '/transaction';
    const price = name.split(' ')[0];
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ price, name: name.substring(price.length + 1), description, datetime })
    }).then(
      response => response.json())
      .then(json => {
        setName('');
        setDatetime('');
        setDescription('');
        getTransactions().then(setTransactions);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }

  function handleDelete(id) {
    const confirmed = window.confirm('Are you sure you want to delete this transaction?');
    if (!confirmed) return;
    console.log('User confirmed delete for ID:', id);
    const url = process.env.REACT_APP_API_URL + `/transaction/${id}`;

    fetch(url, {
      method: 'DELETE'
    })
      .then(() => {
        setTransactions(prev => prev.filter(t => t._id !== id));
      })
      .catch(err => console.error(err));
  }

  function startEditing(transaction) {
    setEditId(transaction._id);
    setEditName(transaction.name);
    setEditPrice(transaction.price);
    setEditDatetime(transaction.datetime);
    setEditDescription(transaction.description);
  }

  function saveEdit(id) {
    const updatedTransaction = {
      price: Number(editPrice),
      name: editName,
      datetime: editDatetime,
      description: editDescription,
    };
    const url = process.env.REACT_APP_API_URL + `/transaction/${id}`;


    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedTransaction),
    })
      .then(res => res.json())
      .then(updated => {
        setTransactions(prev =>
          prev.map(t => (t._id === id ? updated : t))
        );
        setEditId(null);
        setEditName('');
        setEditPrice('');
        setEditDatetime('');
        setEditDescription('');
      })
      .catch(err => console.error('Update failed', err));
  }

  function cancelEdit() {
    setEditId(null);
    setEditName('');
    setEditDatetime('');
    setEditDescription('');
  }



  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  balance = balance.toFixed(2);
  const fraction = balance.split('.')[1];
  balance = balance.split('.')[0];
  return (
    <main>
      <header className="app-header">
        <h2 className="app-title">
          BalanceBuddy
          <FaInfoCircle
            className="header-info-icon"
            onClick={() => setShowHelp(!showHelp)}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setShowHelp(!showHelp);
            }}
            aria-label="How to use BalanceBuddy"
            role="button"
          />
        </h2>
        {showHelp && (
          <div className="help-popup">
            <p>
              💡 To add a transaction, type the amount and item name like <code>+200 Samsung TV</code>. <br /><br />
              The first number (with + or -) is the price; positive means income, negative means expense.
            </p>
            <button className="close-btn" onClick={() => setShowHelp(false)}>Close</button>
          </div>
        )}
      </header>
      <h1>${balance}<span>{fraction}</span></h1>


      <form onSubmit={addNewTransaction}>
        <div className='basic'>
          <input type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={'+200 new samsung tv'} />
          <input
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
            type="datetime-local" />
        </div>
        <div className='decription'>
          <input type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder={'description'} />
        </div>
        <button type="submit">Add new transaction</button>
      </form>
      <div className='transactions'>
        {transactions.length > 0 && transactions.map(transaction => (
          <div
            key={transaction._id}
            className="transaction"
            onMouseEnter={() => setHoveredId(transaction._id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="left">
              {editId === transaction._id ? (
                <>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={e => setEditPrice(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                  <input
                    type="datetime-local"
                    value={editDatetime}
                    onChange={e => setEditDatetime(e.target.value)}
                  />
                  <input
                    type="text"
                    value={editDescription}
                    onChange={e => setEditDescription(e.target.value)}
                  />
                </>
              ) : (
                <>
                  <div className="name">{transaction.name}</div>
                  <div className="description">{transaction.description}</div>
                </>
              )}            </div>
            <div className="right-container">
              <div className="right">
                <div className={"price " + (transaction.price < 0 ? 'red' : 'green')}>
                  {transaction.price}
                </div>
                <div className="date-time">{transaction.datetime}</div>
              </div>
              {hoveredId === transaction._id && (
                editId === transaction._id ? (
                  <>
                    <button className="save-btn" onClick={() => saveEdit(transaction._id)}><FaSave /></button>
                    <button className="cancel-btn" onClick={() => cancelEdit()}> <FaTimes /></button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => startEditing(transaction)}> <FaEdit /></button>
                    <button className="delete-btn" onClick={() => handleDelete(transaction._id)}><FaTrash /></button>
                  </>
                )
              )}
            </div>
          </div>)
        )}

      </div>

    </main>
  );
}

export default App;

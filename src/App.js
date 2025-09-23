import { useEffect, useState } from 'react';
import { FaTrash, FaSave, FaEdit, FaTimes, FaInfoCircle } from 'react-icons/fa';

import './App.css';

function App() {
  const [name, setName] = useState('');
  const [priceInput, setPriceInput] = useState('');  // separate field for price
  const [datetime, setDatetime] = useState('');
  const [description, setDescription] = useState('');
  
  const [transactions, setTransactions] = useState(() => {
    const saved = sessionStorage.getItem('transactions');
    return saved ? JSON.parse(saved) : [];
  });

  const [hoveredId, setHoveredId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDatetime, setEditDatetime] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [showHelp, setShowHelp] = useState(false);

  // synchronize to sessionStorage whenever transactions change
  useEffect(() => {
    sessionStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  function addNewTransaction(e) {
    e.preventDefault();
    // parse price
    const price = Number(priceInput);
    if (isNaN(price)) {
      alert('Please enter a valid number for price');
      return;
    }
    const newTx = {
      id: Date.now().toString(),
      price: price,
      name: name,
      datetime: datetime,
      description: description,
    };
    setTransactions(prev => [...prev, newTx]);
    setName('');
    setPriceInput('');
    setDatetime('');
    setDescription('');
  }

  function handleDelete(id) {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
  }

  function startEditing(tx) {
    setEditId(tx.id);
    setEditName(tx.name);
    setEditPrice(tx.price.toString());
    setEditDatetime(tx.datetime);
    setEditDescription(tx.description);
  }

  function saveEdit(id) {
    const price = Number(editPrice);
    if (isNaN(price)) {
      alert('Invalid price');
      return;
    }
    setTransactions(prev =>
      prev.map(tx => {
        if (tx.id === id) {
          return {
            ...tx,
            price: price,
            name: editName,
            datetime: editDatetime,
            description: editDescription,
          };
        }
        return tx;
      })
    );
    cancelEdit();
  }

  function cancelEdit() {
    setEditId(null);
    setEditName('');
    setEditPrice('');
    setEditDatetime('');
    setEditDescription('');
  }

  // compute balance
  const balanceRaw = transactions.reduce((sum, tx) => sum + tx.price, 0);
  const balanceFormatted = balanceRaw.toFixed(2);
  const [balanceInt, balanceFraction] = balanceFormatted.split('.');

  const dateOnly = datetime.split("T")[0];

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
              if (e.key === 'Enter' || e.key === ' ') {
                setShowHelp(!showHelp);
              }
            }}
            aria-label="How to use BalanceBuddy"
            role="button"
          />
        </h2>
        {showHelp && (
          <div className="help-popup">
            <p>
              💡 To add a transaction, fill in price, name, datetime, description.
            </p>
            <button className="close-btn" onClick={() => setShowHelp(false)}>Close</button>
          </div>
        )}
      </header>

      <h1>${balanceInt}<span>.{balanceFraction}</span></h1>

      <form onSubmit={addNewTransaction}>
        <div className="basic">
          <input
            type="text"
            value={priceInput}
            onChange={e => setPriceInput(e.target.value)}
            placeholder={'+200 or -50'}
          />
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Transaction name"
          />
          <input
            type="datetime-local"
            value={datetime}
            onChange={e => setDatetime(e.target.value)}
          />
        </div>
        <div className="description">
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <button type="submit">Add new transaction</button>
      </form>

      <div className="transactions">
        {transactions.length === 0 && <p>No transactions yet</p>}
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="transaction"
            onMouseEnter={() => setHoveredId(tx.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <div className="left">
              {editId === tx.id ? (
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
                  <div className="name">{tx.name}</div>
                  <div className="description">{tx.description}</div>
                </>
              )}
            </div>
            <div className="right-container">
              <div className="right">
                <div className={"price " + (tx.price < 0 ? 'red' : 'green')}>
                  {tx.price}
                </div>
                <div className="date-time">{tx.datetime? tx.datetime.split("T")[0] : ""}</div>
              </div>
              {hoveredId === tx.id && (
                editId === tx.id ? (
                  <>
                    <button className="save-btn" onClick={() => saveEdit(tx.id)}>
                      <FaSave />
                    </button>
                    <button className="cancel-btn" onClick={cancelEdit}>
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button className="edit-btn" onClick={() => startEditing(tx)}>
                      <FaEdit />
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(tx.id)}>
                      <FaTrash />
                    </button>
                  </>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;

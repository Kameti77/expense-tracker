# BalanceBuddy

BalanceBuddy is a lightweight, in-browser transaction tracker that helps you keep track of incomes and expenses in real time. It is ideal for demos, prototypes, or temporary use — it does **not** persist data across browser sessions, so everything resets when the tab/window is closed.

---

## 🚀 Features

- Add income or expense transactions with amount, name, date/time, and description  
- Edit or delete existing transactions  
- Displays running balance (sum of all transactions)  
- Session-based storage: data is stored in the browser session (via `sessionStorage`)  
- Data is visible only within your tab during that session — different users, devices, or new tabs won’t see your data  
- Clean, simple UI built with React

---

## 🧩 How It Works (Session Storage Approach)

1. On initial load, the app checks `sessionStorage` for a saved list of transactions.  
2. If found, it loads them into React state; otherwise, it starts empty.  
3. Whenever you add, edit, or delete a transaction, it updates both state *and* writes the new list back into `sessionStorage`.  
4. Because `sessionStorage` is scoped per browser tab and cleared when the tab or window closes, the data lives only for that session.  
5. There is **no backend database usage** in this mode; all data is local in the browser.  

This approach ensures that **two different users on different computers will never see each other’s transactions**, because each has their own isolated browser session and local storage.

---

## 📦 Installation & Usage

```bash
# Clone the repo
git clone https://github.com/yourusername/BalanceBuddy.git
cd BalanceBuddy

# Install dependencies
npm install

# Start development server
npm start

# Link to the website
Check out BalanceBuddy’s demo: [Go to live demo](https://expense-tracker-mm25.onrender.com/)

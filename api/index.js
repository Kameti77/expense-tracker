const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const Transaction = require('./models/Transaction.js');
const app = express();

app.use(cors());
app.use(express.json());
app.get('/api/test', (req, res) => {
    res.json({ body: 'test ok' })
})

app.post('/api/transaction', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const { name, description, datetime, price } = req.body;
    const transaction = await Transaction.create({ name, description, datetime, price })
    res.json(transaction);
})

app.get('/api/transactions', async (req, res) => {
    await mongoose.connect(process.env.MONGO_URL);
    const transactions = await Transaction.find();
    res.json(transactions);
})

app.put('/api/transaction/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const { id } = req.params;
        const updateData = req.body;

        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json(updatedTransaction);
    } catch (error) {
        console.error('Update error:', error);
        res.status(500).json({ error: 'Server error while updating transaction' });
    }
});

app.delete('/api/transaction/:id', async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        const { id } = req.params;

        const deleted = await Transaction.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        res.json({ success: true, message: 'Transaction deleted', deleted });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: 'Server error while deleting transaction' });
    }
});


app.listen(4000, () => console.log(`Server running on port 4000`));

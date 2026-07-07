const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const BILLS_FILE = path.join(__dirname, 'data', 'bills.json');
const USERS_FILE = path.join(__dirname, 'data', 'users.json');

function readBills() {
  try {
    const data = fs.readFileSync(BILLS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading bills.json:', err.message);
    return [];
  }
}

function writeBills(bills) {
  try {
    fs.writeFileSync(BILLS_FILE, JSON.stringify(bills, null, 2));
  } catch (err) {
    console.error('Error writing bills.json:', err.message);
  }
}

function findBill(billCode) {
  const bills = readBills();
  return bills.find(b => b.billCode === billCode);
}

function markBillPaid(billCode, transRefId) {
  const bills = readBills();
  const index = bills.findIndex(b => b.billCode === billCode);
  if (index === -1) return null;
  bills[index].status = 'paid';
  bills[index].paidAt = new Date().toISOString();
  bills[index].transRefId = transRefId;
  writeBills(bills);
  return bills[index];
}


app.post('/inquiry', (req, res) => {
  const { billCode, transRefId } = req.body;

  if (!billCode) {
    return res.status(200).json({
      err: 4001,
      message: 'Missing required field: billCode',
      data: null
    });
  }


  const bill = findBill(billCode);
  if (!bill) {
    return res.status(200).json({
      err: 4109,
      message: 'Bill not found',
      data: null
    });
  }

  if (bill.status === 'paid') {
    return res.status(200).json({
      err: 4109,
      message: 'Bill already paid',
      data: null
    });
  }

  return res.status(200).json({
    err: 200,
    message: 'success',
    data: {
      amount: bill.amount,
      currency: bill.currency || 'VND',
      phone: bill.phone || '',
      dueDate: bill.dueDate || null
    }
  });
});

app.post('/payment', (req, res) => {
  const { billCode, amount, transRefId } = req.body;

  if (!billCode || !amount || !transRefId) {
    return res.status(200).json({
      err: 4001,
      message: 'Missing required field (billCode, amount, transRefId)',
      data: null
    });
  }


  const bill = findBill(billCode);
  if (!bill) {
    return res.status(200).json({
      err: 4109,
      message: 'Bill not found',
      data: null
    });
  }

  if (bill.status === 'paid') {
    return res.status(200).json({
      err: 4109,
      message: 'Bill already paid',
      data: null
    });
  }

  if (Number(amount) !== Number(bill.amount)) {
    return res.status(200).json({
      err: 4002,
      message: `Amount mismatch: expected ${bill.amount}, got ${amount}`,
      data: null
    });
  }

  const updatedBill = markBillPaid(billCode, transRefId);
  if (!updatedBill) {
    return res.status(200).json({
      err: 9999,
      message: 'Failed to update bill status',
      data: null
    });
  }

  const billerRefId = uuidv4();

  return res.status(200).json({
    err: 200,
    message: 'success',
    data: {
      billerRefId,
      billCode,
      amount: bill.amount,
      paidAt: updatedBill.paidAt
    }
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Mock Biller Server running on http://localhost:${PORT}`);
  console.log(`Inquiry endpoint: POST http://localhost:${PORT}/inquiry`);
  console.log(`Payment endpoint: POST http://localhost:${PORT}/payment`);
});
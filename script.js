// Quick test to confirm script is loaded
console.log('Script loaded');

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const incomeText = document.getElementById('income-text');
const expenseText = document.getElementById('expense-text');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
let transactions = localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

// helper
function generateId() {
  return Math.floor(Math.random() * 1000000000);
}

function addTransaction(e) {
  e.preventDefault();

  const incomeVal = incomeText.value.trim();
  const expenseVal = expenseText.value.trim();
  const desc = text.value.trim() || 'Transaction';

  // Add income if provided
  if (incomeVal !== '') {
    const incomeTransaction = {
      id: generateId(),
      text: `${desc} (Income)`,
      amount: +Number(incomeVal)
    };
    transactions.push(incomeTransaction);
    addTransactionDOM(incomeTransaction);
  }

  // Add expense if provided
  if (expenseVal !== '') {
    const expenseTransaction = {
      id: generateId(),
      text: `${desc} (Expense)`,
      amount: -Math.abs(Number(expenseVal))
    };
    transactions.push(expenseTransaction);
    addTransactionDOM(expenseTransaction);
  }

  updateValues();
  updateLocalStorage();

  // reset inputs
  incomeText.value = '';
  expenseText.value = '';
  text.value = '';
}

function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? '-' : '+';
  const item = document.createElement('li');
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  item.innerHTML = `
    ${transaction.text}
    <span>${sign} Rs ${Math.abs(transaction.amount).toFixed(2)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

function updateValues() {
  const amounts = transactions.map(t => t.amount);
  const total = amounts.reduce((acc, item) => acc + item, 0);
  const income = amounts.filter(i => i > 0).reduce((acc, i) => acc + i, 0);
  const expense = amounts.filter(i => i < 0).reduce((acc, i) => acc + i, 0) * -1;

  balance.innerText = `Rs ${total.toFixed(2)}`;
  money_plus.innerText = `+Rs ${income.toFixed(2)}`;
  money_minus.innerText = `-Rs ${expense.toFixed(2)}`;
}

function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  init();
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function init() {
  list.innerHTML = '';
  transactions.forEach(addTransactionDOM);
  updateValues();
}

init();

form.addEventListener('submit', addTransaction);

// Функция для преобразования времени из миллисекунд в формат YYYY-MM-DD HH:MM:SS
function formatTimestamp(timestampMilliseconds) {
  const date = new Date(timestampMilliseconds);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getCurrency(simpleTransactionType) {
  let currency = '';
  if (simpleTransactionType.endsWith('_USD')) {
    currency = 'USDT';
  } else if (simpleTransactionType.endsWith('_MTT')) {
    currency = 'MTT';
  } else if (simpleTransactionType.endsWith('_BNB')) {
    currency = 'BNB';
  }
  return currency;
}

function getRatePrecision(fromCurrency, toCurrency) {
  if (fromCurrency === 'MTT' && toCurrency === 'USDT') {
    return 5;
  }
  if (fromCurrency === 'MTT' && toCurrency === 'BNB') {
    return 8;
  }
  return 6; // дефолт
}

function generateTransactionLink(type, hash, amount) {
  let url = '';
  let currency = getCurrency(type);

  if (type.startsWith('MTT_')) {
    url = `https://explorer.mtt.network/tx/${hash}`;
  } else if (type.startsWith('BSC_')) {
    url = `https://bscscan.com/tx/${hash}`;
  }

  const shortHash = `${hash.slice(0, 4)}...${hash.slice(-4)}`;
  return `<a href="${url}" target="_blank">${shortHash}</a> (${amount} ${currency})`;
}

function calculateRate(incoming, outgoing) {
  if (!incoming?.amount || !outgoing?.amount) return 'N/A';

  const fromCurrency = getCurrency(outgoing.type);
  const toCurrency = getCurrency(incoming.type);

  const precision = getRatePrecision(fromCurrency, toCurrency);
  const rate = (incoming.amount / outgoing.amount).toFixed(precision);  
  const rateText = `1 ${fromCurrency} = ${rate} ${toCurrency}`;
  return rateText;
}

function getMessageText(message, resolution) {
  if (!message) return '';
  if (!resolution) return message;
  return `${message} (<a href="${resolution}" target="_blank">Resolved</a>)`;
}

async function fetchTransactions() {
  try {
    const response = await fetch('https://95.111.203.22:8443/api/v1/exchange_transactions/list');
    if (!response.ok) {
      throw new Error('Ошибка при получении данных с API');
    }

    const data = await response.json();

    // Массив для хранения данных таблицы
    const transactions = data.map(tx => ({
      id: tx.id,
      timestamp: formatTimestamp(tx.timestampMilliseconds),
      incoming: generateTransactionLink(tx.incoming.type, tx.incoming.hash, tx.incoming.amount),
      outgoing: generateTransactionLink(tx.outgoing.type, tx.outgoing.hash, tx.outgoing.amount),
      status: tx.status,
      rate: calculateRate(tx.incoming, tx.outgoing),
      message: getMessageText(tx.message, tx.resolutionLink)
    }));

    return transactions;
  } catch (error) {
    console.error('Ошибка:', error);
    return []; // Если ошибка, возвращаем пустой массив
  }
}

// Функция для заполнения таблицы на странице
async function populateTransactionTable() {
  const transactions = await fetchTransactions();
  const tbody = document.querySelector('#transaction-table tbody');
  tbody.innerHTML = ''; // Очищаем таблицу перед заполнением

  transactions.forEach(tx => {
    const row = document.createElement('tr');
    let statusClass = 'bg-warning';
    if (tx.status === 'OK') {
      statusClass = 'bg-success';
    } else if (tx.status === 'ERROR') {
      statusClass = 'bg-danger';
    }

    row.innerHTML = `
      <td>${tx.id}</td>
      <td>${tx.timestamp}</td>
      <td>${tx.incoming}</td>
      <td>${tx.outgoing}</td>
      <td><span class="badge ${statusClass}">${tx.status}</span></td>
      <td>${tx.rate}</td>
      <td>${tx.message}</td>
    `;
    tbody.appendChild(row);
  });
}

// Вызов функции для заполнения таблицы при загрузке страницы
window.addEventListener('DOMContentLoaded', populateTransactionTable);

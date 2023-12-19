// Functionality for the Spending Tracker app

function showStartTracking() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('startTrackingPage').style.display = 'block';
    document.getElementById('showHistoryPage').style.display = 'none';

    // Set the maximum date for the input to today's date
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dateSpent').setAttribute('max', today);
}

function saveSpending() {
    const storeName = document.getElementById('storeName').value;
    const amountSpent = parseFloat(document.getElementById('amountSpent').value);
    const dateSpent = document.getElementById('dateSpent').value;

    const errorDisplay = document.getElementById('errorDisplay');

    if (!storeName || isNaN(amountSpent) || amountSpent <= 0 || !dateSpent) {
        errorDisplay.textContent = "Please enter valid store name, amount, and date.";
        return;
    }

    const currentDate = new Date();
    const selectedDate = new Date(dateSpent);

    if (selectedDate > currentDate) {
        errorDisplay.textContent = "Please select a date not in the future.";
        return;
    }

    const spendingData = {
        storeName: storeName,
        amountSpent: amountSpent,
        dateSpent: dateSpent
    };

    let existingData = JSON.parse(localStorage.getItem('spending')) || [];
    existingData.push(spendingData);
    localStorage.setItem('spending', JSON.stringify(existingData));

    document.getElementById('spendingForm').reset();
    errorDisplay.textContent = ''; // Clear error message after successful save
}

function showSpendingHistory() {
    document.querySelector('.container').style.display = 'none';
    document.getElementById('startTrackingPage').style.display = 'none';
    document.getElementById('showHistoryPage').style.display = 'block';

    const spendingHistory = JSON.parse(localStorage.getItem('spending')) || [];

    spendingHistory.sort((a, b) => new Date(a.dateSpent) - new Date(b.dateSpent));

    let historyHTML = '<h2>Spending History</h2>';
    let monthTotal = {};
    let yearTotal = {};
    let allTimeTotal = 0;
    let currentMonth = '';
    let currentYear = '';
    let index = 1;

    spendingHistory.forEach(data => {
        const date = new Date(data.dateSpent);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        if (currentMonth !== month || currentYear !== year) {
            if (currentMonth !== '' && currentYear !== '') {
                historyHTML += `<div>Total spent in ${currentMonth}: £${monthTotal[currentMonth].toFixed(2)}</div>`;
                index = 1;
            }

            currentMonth = month;
            currentYear = year;

            historyHTML += `<h3>${month} ${year}</h3>`;
            monthTotal[month] = 0;
        }

        historyHTML += `<div>${index}. ${day} ${month} ${year} - ${data.storeName} - £${data.amountSpent.toFixed(2)}
                        <span class="edit-icon" onclick="editSpending(${index - 1})" style="cursor: pointer;">✏️</span>
                        <span class="delete-icon" onclick="confirmDelete(${index - 1})" style="cursor: pointer;">❌</span></div>`;

        monthTotal[month] += data.amountSpent;
        yearTotal[year] = (yearTotal[year] || 0) + data.amountSpent;
        allTimeTotal += data.amountSpent;
        index++;
    });

    if (currentMonth !== '' && currentYear !== '') {
        historyHTML += `<div>Total spent in ${currentMonth}: £${monthTotal[currentMonth].toFixed(2)}</div>`;
    }

    let yearTotalHTML = '<h3>Total Spent per Year</h3>';
    for (const year in yearTotal) {
        yearTotalHTML += `<div>Total spent in ${year}: £${yearTotal[year].toFixed(2)}</div>`;
    }

    historyHTML += `<div>${yearTotalHTML}</div>`;
    historyHTML += `<div>Total spent all time: £${allTimeTotal.toFixed(2)}</div>`;

    document.getElementById('spendingHistory').innerHTML = historyHTML;
}

function backToHomePage() {
    document.querySelector('.container').style.display = 'block';
    document.getElementById('startTrackingPage').style.display = 'none';
    document.getElementById('showHistoryPage').style.display = 'none';
}

function editSpending(index) {
    const spendingHistory = JSON.parse(localStorage.getItem('spending')) || [];
    const data = spendingHistory[index];
    const newStoreName = prompt("Enter new store name:", data.storeName);
    const newAmountSpent = parseFloat(prompt("Enter new amount spent (£):", data.amountSpent));

    if (newStoreName && !isNaN(newAmountSpent) && newAmountSpent > 0) {
        data.storeName = newStoreName;
        data.amountSpent = newAmountSpent;
        spendingHistory[index] = data;
        localStorage.setItem('spending', JSON.stringify(spendingHistory));
        showSpendingHistory();
    }
}

function confirmDelete(index) {
    const confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
        const spendingHistory = JSON.parse(localStorage.getItem('spending')) || [];
        spendingHistory.splice(index, 1);
        localStorage.setItem('spending', JSON.stringify(spendingHistory));
        showSpendingHistory();
    }
}

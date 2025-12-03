// Add a new grocery item row
function addItem() {
  let list = document.getElementById("groceryList");

  let row = document.createElement("div");
  row.className = "item-row";

  row.innerHTML = `
    <input type="text" class="item-name" placeholder="Item name" />
    <input type="number" class="grocery" placeholder="Amount" />
    <button class="remove-btn" onclick="removeItem(this)">X</button>
  `;

  list.appendChild(row);
  updateSummary();
}

// Remove a row
function removeItem(button) {
  button.parentElement.remove();
  updateSummary();
}

// Calculate total, average, items count
function updateSummary() {
  let inputs = document.querySelectorAll(".grocery");
  let values = [];

  inputs.forEach((input) => {
    let val = Number(input.value);
    if (val > 0) values.push(val);
  });

  let total = values.reduce((a, b) => a + b, 0);
  let discount = Number(document.getElementById("discount").value) || 0;
  let finalTotal = total - (total * discount) / 100;
  let avg = values.length > 0 ? total / values.length : 0;

  document.getElementById("totalItems").innerText = "Items: " + values.length;
  document.getElementById("average").innerText = "Average: " + avg.toFixed(2);
  document.getElementById("total").innerText = "Total: " + total;
  document.getElementById("finalTotal").innerText =
    "Final Total After Discount: " + finalTotal.toFixed(2);
}

// Auto-update summary
document.addEventListener("input", function () {
  updateSummary();
});

// Save session to localStorage
function saveSession() {
  let items = [];
  let rows = document.querySelectorAll(".item-row");

  rows.forEach((row) => {
    let name = row.querySelector(".item-name").value;
    let amount = Number(row.querySelector(".grocery").value);

    if (name && amount > 0) {
      items.push({ name, amount });
    }
  });

  if (items.length === 0) {
    alert("Please enter at least one valid grocery item.");
    return;
  }

  let date = new Date().toLocaleString();

  let session = {
    date,
    items,
  };

  let sessions = JSON.parse(localStorage.getItem("grocerySessions")) || [];
  sessions.push(session);
  localStorage.setItem("grocerySessions", JSON.stringify(sessions));

  loadSessions();
}

// Load saved sessions
function loadSessions() {
  let container = document.getElementById("sessionList");
  container.innerHTML = "";

  let sessions = JSON.parse(localStorage.getItem("grocerySessions")) || [];

  sessions.forEach((session) => {
    let box = document.createElement("div");
    box.innerHTML = `
      <strong>${session.date}</strong><br>
      ${session.items
        .map((item) => `${item.name}: ${item.amount}`)
        .join("<br>")}
      <hr>
    `;
    container.appendChild(box);
  });
}

// Print receipt
function printReceipt() {
  window.print();
}

// Load sessions on start
loadSessions();

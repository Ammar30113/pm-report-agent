async function fetchCSV() {
  const response = await fetch('data/pm_data.csv');
  const text = await response.text();
  return parseCSV(text);
}

function parseCSV(data) {
  const rows = data.trim().split('\n');
  const headers = rows[0].split(',');
  const result = rows.slice(1).map(row => {
    const cells = row.split(',');
    const obj = {};
    headers.forEach((h, i) => { obj[h.trim()] = cells[i] ? cells[i].trim() : ''; });
    return obj;
  });
  return result;
}

function analyzePM(records) {
  const total = records.length;
  const completed = records.filter(r => r.status === 'completed').length;
  const overdue = records.filter(r => r.status === 'overdue').length;
  const pending = records.filter(r => r.status === 'pending').length;
  return { total, completed, overdue, pending };
}

function displayReport(summary) {
  const container = document.getElementById('report-container');
  container.innerHTML = `
    <p>Total PMs: ${summary.total}</p>
    <p>Completed: ${summary.completed}</p>
    <p>Overdue: ${summary.overdue}</p>
    <p>Pending: ${summary.pending}</p>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  const button = document.createElement('button');
  button.textContent = 'Generate Report';
  button.addEventListener('click', async () => {
    const records = await fetchCSV();
    const summary = analyzePM(records);
    displayReport(summary);
  });
  document.getElementById('report-container').appendChild(button);
});

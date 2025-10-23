const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const csvFilePath = path.join(__dirname, 'data', 'pm_data.csv');

// Helper function to check if a date is in the past
function isDateInPast(dateString) {
  const today = new Date();
  const comparisonDate = new Date(dateString);
  return comparisonDate < today;
}

// Initialize counters
let total = 0;
let completed = 0;
let pending = 0;
let overdue = 0;

// Read and parse the CSV file
fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    total++;
    const status = row.status.toLowerCase();
    const completionDate = row.completion_date;

    if (status === 'completed') {
      completed++;
    } else if (status === 'pending') {
      pending++;
    } else if (isDateInPast(completionDate)) {
      overdue++;
    }
  })
  .on('end', () => {
    // Log the summary
    console.log(`Total: ${total}, Completed: ${completed}, Pending: ${pending}, Overdue: ${overdue}`);
  })
  .on('error', (error) => {
    console.error('Error reading the CSV file:', error);
  });

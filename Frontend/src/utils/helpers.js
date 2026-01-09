/**
 * Simple helper to trigger browser print
 */
export const printElement = (title = 'Document') => {
  window.print();
};

/**
 * Simple helper to download data as a text/csv file
 */
export const downloadData = (data, filename = 'report.txt') => {
  const blob = new Blob([data], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
};

/**
 * Helper to generate a basic report string from objects
 */
export const generateBaseReport = (items, type = 'Record') => {
  let report = `--- HS WALTERS EMR ${type.toUpperCase()} ---\n`;
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;

  if (items && items.length > 0) {
    const keys = Object.keys(items[0]);
    report += keys.join(' | ') + '\n';
    report += '-'.repeat(keys.length * 15) + '\n';

    items.forEach(item => {
      report += keys.map(k => String(item[k])).join(' | ') + '\n';
    });
  } else {
    report += 'No records found.';
  }

  return report;
};

function arrayToCSV(data) {
    return data.map(row => row.join(",")).join("\n");
}

function downloadCSV(csvData, filename = 'data.csv') {
const blob = new Blob([csvData], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
document.body.removeChild(a);
URL.revokeObjectURL(url);
}

document.getElementById('btn_extractAsCsv')
    .addEventListener('click', function() {
const csvData = arrayToCSV(EXTRACTED_POKEMON);
downloadCSV(csvData);
});
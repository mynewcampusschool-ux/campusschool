const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const zip = new AdmZip();
zip.addLocalFile(path.join(__dirname, 'backend', 'database', 'sql', 'complete_database.sql'));
zip.writeZip(path.join(__dirname, 'complete_database.sql.zip'));
console.log('Done:', fs.statSync(path.join(__dirname, 'complete_database.sql.zip')).size, 'bytes');

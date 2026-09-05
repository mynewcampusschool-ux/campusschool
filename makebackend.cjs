const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const zip = new AdmZip();
zip.addLocalFolder(path.join(__dirname, 'backend'), 'backend');
zip.writeZip(path.join(__dirname, 'backend_files.zip'));
console.log('backend_files.zip:', fs.statSync(path.join(__dirname, 'backend_files.zip')).size, 'bytes');

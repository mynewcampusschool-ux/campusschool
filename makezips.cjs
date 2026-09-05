const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, 'dist');

// Zip 1: root files only
const zip1 = new AdmZip();
fs.readdirSync(distPath).forEach(f => {
  const full = path.join(distPath, f);
  if (fs.statSync(full).isFile()) {
    zip1.addLocalFile(full);
    console.log('root:', f);
  }
});
zip1.writeZip(path.join(__dirname, 'root_files.zip'));
console.log('root_files.zip done:', fs.statSync(path.join(__dirname, 'root_files.zip')).size, 'bytes');

// Zip 2: assets folder
const zip2 = new AdmZip();
zip2.addLocalFolder(path.join(distPath, 'assets'), 'assets');
zip2.writeZip(path.join(__dirname, 'assets_files.zip'));
console.log('assets_files.zip done:', fs.statSync(path.join(__dirname, 'assets_files.zip')).size, 'bytes');

const fs = require('fs');
const [replaceKeysInAllFiles] = require('./main-fs');

if (process.argv.length <= 3) {
  // eslint-disable-next-line no-console
  console.log('Формат команды: node index.js <директория> <файл замен в формате json>');
  process.exit(-1);
}

const dirTarget = process.argv[2];
let replacementList = {};
try {
  const replacementListJson = fs.readFileSync(process.argv[3], 'utf8');
  replacementList = JSON.parse(replacementListJson);
} catch (err) {
  // eslint-disable-next-line no-console
  console.error('Путь к файлу json указан неверно или содержит ошибку');
  process.exit(-1);
}

replaceKeysInAllFiles(dirTarget, replacementList);

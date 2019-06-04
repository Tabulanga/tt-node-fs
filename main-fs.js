const path = require('path');
const fs = require('fs').promises;

const getFileList = async (filepath) => {
  try {
    const currentFilepath = await fs.lstat(filepath);
    if (currentFilepath.isDirectory()) {
      const items = await fs.readdir(filepath);
      if (items.length !== 0) {
        const contentDirPromises = items.map(item => getFileList(path.join(filepath, item)));
        const contentFlattedList = (await Promise.all(contentDirPromises))
          .reduce((acc, arr) => acc.concat(arr), []);
        return contentFlattedList;
      }
      return [];
    }
    return filepath;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    return [];
  }
};

const findAndReplaceSubstr = (data, subStrs) => {
  let result = data;
  // eslint-disable-next-line no-restricted-syntax
  for (const key in subStrs) {
    if (Object.hasOwnProperty.call(subStrs, key)) {
      result = result
        .split(key)
        .join(subStrs[key]);
    }
  }
  return result;
};

const replaceKeysInFile = async (filepath, replacementList) => {
  try {
    const data = await fs.readFile(filepath, 'utf8');
    const newData = findAndReplaceSubstr(data, replacementList);
    fs.writeFile(filepath, newData, 'utf8');
    if (data !== newData) {
      // eslint-disable-next-line no-console
      console.log(`Изменен файл ${filepath}`);
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
    throw err;
  }
};

const replaceKeysInAllFiles = async (dir, replacementList) => {
  const fileList = await getFileList(dir);
  if (fileList) {
    fileList.forEach((file) => {
      replaceKeysInFile(file, replacementList);
    });
  }
};

module.exports = [
  replaceKeysInAllFiles,
  replaceKeysInFile,
  getFileList,
  findAndReplaceSubstr,
];

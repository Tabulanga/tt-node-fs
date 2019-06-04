const os = require('os');
const path = require('path');
const fs = require('fs');
const [replaceKeysInAllFiles,
  replaceKeysInFile,
  getFileList,
  findAndReplaceSubstr] = require('../main-fs');

const testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tt-node-fs-'));
const files = [
  ['aaa.txt', 'Azaza'],
  ['/subfolder/bbb.txt', 'Bazuka'],
  ['/subfolder/subsub/ccc.txt', 'Tumba&Pumba'],
  ['/subfolder/subsub/ddd.txt', 'Coco\ncoco\nloka'],
];
const replacementList = {
  Azaza: 'Acuna',
  Bazuka: 'Matata',
  Tumba: 'Timon',
  co: 'mo',
};

describe('Замена значений в файлах', () => {
  beforeAll(() => {
    fs.mkdirSync(path.join(testDir, '/subfolder'));
    fs.mkdirSync(path.join(testDir, '/subfolder/subsub'));
    fs.mkdirSync(path.join(testDir, '/subfolder/emptydir'));
  });

  beforeEach(() => {
    files.forEach(file => fs.writeFileSync(path.join(testDir, file[0]), file[1]));
    // eslint-disable-next-line no-console
    console.error = jest.fn();
  });

  test('getFileList() возвращает массив путей к файлам', async (done) => {
    const fileList = await getFileList(testDir);
    const filepath = path.join(testDir, files[1][0]);

    expect(Array.isArray(fileList)).toBeTruthy();
    expect(fileList.length).toEqual(4);
    expect(fileList[1]).toEqual(filepath);
    done();
  });

  test('getFileList() обработка ошибки неверной директории', async (done) => {
    const fileList = await getFileList(path.join(testDir, 'nothing'));

    // eslint-disable-next-line no-console
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(fileList).toEqual([]);
    done();
  });

  test('findAndReplaceSubstr() находит и заменяет подстроку', (done) => {
    const data = 'Azaza Coco\ncoco';
    const result = findAndReplaceSubstr(data, replacementList);

    expect(result).toEqual('Acuna Como\nmomo');
    done();
  });

  test('replaceKeysInFile() проводит замену в файле', async (done) => {
    const filepath = path.join(testDir, files[1][0]);
    await replaceKeysInFile(filepath, replacementList);
    const data = await fs.promises.readFile(filepath, 'utf8');
    expect(data).toEqual(replacementList.Bazuka);
    done();
  });
});

const { dir } = require('console');
const fs = require('fs');

const README_PATH = 'README.md';
const DIRS = fs.readdirSync('libs');

copyExtraFiles();

function copyExtraFiles() {
  if (!fs.existsSync(README_PATH)) {
    throw new Error('README do not exit');
  } else {
    DIRS.forEach((dir) => {
      console.log(dir);
      copyReadmeIntoLibFolder(README_PATH, dir);
    });
  }
}

function copyReadmeIntoLibFolder(srcPath, lib) {
  const fileBody = fs.readFileSync(srcPath).toString();

  fs.writeFileSync(`libs/${lib}/${README_PATH}`, fileBody);
}

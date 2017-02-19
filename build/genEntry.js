const glob = require('glob');
const path = require('path');
const fs = require('fs');
const cp = require('child_process');
const log = console.log;
const exec = cp.exec;
const getEntry = () => {
  return new Promise((resolve, reject) => {
    glob(path.resolve(__dirname, '../src/pages/**/*.entry.js'), (err, files) => {
      if (err) return reject(err);
      resolve(files);
    });
  });
}

const removeEntry = (files) => {
  return new Promise((resolve, reject) => {
    const rm = exec(`rm -rf ${files.join(' ')}`);
    rm.stdout.on('data', data => {
      log(data);
    });
    rm.on('exit', code => {
      resolve(code);
    });
  });
}

const getTemp  = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(__dirname, '../cli/entry_template.js'), (err, content) => {
      if (err) reject(err);
      resolve(content.toString());
    });
  });
};

const writeFile = (file, content) => {
  return new Promise((resolve, reject) => {
    const ma = file.match(/\/(\w+)\.entry\.js$/);
    const entryName = ma ? ma[1] : '';
    fs.writeFile(file, content.replace(/{name}/, entryName).replace(/module.exports\s*=\s*`/, '').replace(/\s*`\s*/, ''), err => {
      if (err) reject(err);
      resolve();
    });
  });
};

const writeFiles = function* (files, content) {
  let i = 0;
  let len = files.length;
  for (; i < len; i++) {
    yield writeFile(files[i], content);
  }
}

const genEntry = function* () {
  const files = yield getEntry();
  yield removeEntry(files);
  const content = yield getTemp();
  yield* writeFiles(files, content);
  log('重写成功!');
}

const runTask = (genF) => {
  const gen = genF();
  const next = (data) => {
    const res = gen.next(data);
    if (res.done) return;
    res.value.then(data => next(data)).catch(e => log(e));
  }
  next();
};

runTask(genEntry);




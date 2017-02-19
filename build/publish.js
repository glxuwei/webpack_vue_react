const path = require('path');
const child = require('child_process');
const inquirer = require("inquirer");
const spawn = child.spawn;
const exec = child.exec;
const glob = require('glob');
const fs = require('fs');

const config = {
  dist_dir: path.resolve(__dirname, '../../../../dist_m_pictrip'),
  git_rep: 'git@git.2b6.me:fe-dist/dist_fe_pictrip_m_static.git',
  publish_files: path.resolve(__dirname, '../pub.txt')
}

function buildUI() {
  const loader = [
    '/ 正在发布 .',
    '| 正在发布 ..',
    '\\ 正在发布 ...',
    '- 正在发布 ....'
  ];
  let i = 4;
  const ui = new inquirer.ui.BottomBar({bottomBar: loader[i % 4]});
  const timer = setInterval(function () {
    ui.updateBottomBar(loader[i++ % 4]);
  }, 200);

  return {
    ui,
    clear () {
      clearInterval(timer);
    }
  }
};
let bu = null;
function mkStaticDir(dir) {
  bu = buildUI();
  return new Promise((resolve, reject) => {
    var exist = fs.existsSync(dir);
    if (exist) {
      exec(`rm -rf ${dir}; mkdir -p ${dir};`, () => {
        resolve(dir);
      });
    } else {
      spawn('mkdir', ['-p',dir]).on('exit',() => {
        resolve(dir);
      });
    }
  });
};

function clone(dir) {
  return new Promise((resolve, reject) => {
    spawn('git', ['clone', config.git_rep, dir]).on('exit', () => {
      resolve(dir);
    });
  });
};

function cleanStaticDir(dir) {
  return new Promise((resolve, reject) => {
    let staticdir = path.join(dir, 'static');
    exec(`rm -rf ${staticdir}`, () => {
      resolve(dir);
    });
  })
};

function copy (dir) {
  return new Promise((resolve, reject) => {
    spawn('cp', ['-rf', path.resolve(__dirname, '../dist/static'), dir]).on('exit', () => {
        resolve(dir);
    })
  });
};
function copyTmpl(dir) {
  console.log('copytmpl')
  console.log(path.resolve(__dirname, '../../../views/vue/'), 'resolve', path.join(dir, 'html'))
  return new Promise((resolve, reject) => {
    spawn('cp', ['-rf', path.resolve(__dirname, '../../../views/vue/'), path.join(dir, 'static/html/')]).on('exit', () => {
        resolve(dir);
    })
  });
}

function cleanMap (dir) {
  return new Promise((resolve, reject) => {
    glob(path.join(dir,'**'), (err, files) => {
      files = files.filter(file => {
        return file.match(/\.map/);
      });
      var len = files.length, i = 0;
      files.forEach(file => {
          spawn('rm', ['-f', file]).on('exit', () => {
            i++;
            if (i === len) {
              resolve(dir);
            }
          });
      });
    });
  });
};

function commit (cwd) {

  var msg = 'build';

  // 判断是否是编译中心自动编译，是的话，完善一下 log 信息
  (function(){
    var args = process.argv.splice(2);
    if(args&&args.length&&args[0]=='buildSystem_AutoBuildCommit'){
      msg = `${args[0]} ; account: ${args[1]} ; commitLog: ${args[2]} ;`;
    }
  })();


  return new Promise((resolve, reject) => {
    exec(`git add -A .; git commit -m '${msg}'; git push;`, {cwd}, (error, stdout, stderr) => {
      if (error) {
        reject(new Error('git提交失败!'))
      } else {
        resolve(cwd);
      }
    });
  })
}

function pubText (cwd) {
  bu.ui.updateBottomBar('\n发布成功--------->');
  bu.clear();
  return new Promise((resolve, reject) => {
    exec('git diff --name-status HEAD HEAD^', {cwd}, (error, stdout, stderr) => {
      console.log(`\n提交文件信息:\n ${stdout}`);
      child.execSync(`rm -rf ${config.publish_files}`);
      let txtmat = stdout.match(/[M|A]\s*(static\/\w+\/.*)/g);
      let filtertxt = '';
      if (txtmat) {
        filtertxt = txtmat.join('\n').replace(/[M|A]\s*/g, '');
        fs.writeFile(config.publish_files, filtertxt, (err) => {
          if (err) {
            console.log('err:', err)
            reject(new Error(err));
          } else {
            console.log(`\n发布信息文件:${config.publish_files} 生成成功`)
            resolve();
            process.exit();
          }
        })
      } else {
        reject(new Error('未找到需要发布的文件!'));
      }
    });
  })
}


module.exports = function (dir) {
  mkStaticDir(config.dist_dir)
  .then(clone)
  .then(cleanStaticDir)
  .then(copy)
  .then(copyTmpl)
  .then(cleanMap)
  .then(commit)
  .then(pubText)
  .catch((error) => {
    bu.clear();
    process.exit();
  })
};

if (process.argv && process.argv[1].indexOf('publish') > -1) {
  module.exports();
}


var log            = console.log;
var fs             = require('fs');
var writeLine      = require('lei-stream').writeLine;
var path           = require('path');
var spawn          = require('child_process').spawn;
var inquirer       = require("inquirer");
var ENTRY_TEMPLATE = require("./entry_template.js");
var VUE_TEMPLATE   = require("./vue_template.js");
const JSX_TEMPLATE = require('./jsx_template.js')
var glob           = require("glob");
var publish = require('../build/publish');

const EXTS = ['js', 'jsx'];
var funs = {
	// 新建路由
	createRouter:function(){

    const selectType = () => new Promise((resolve, reject) => {
      inquirer.prompt([{
        type: 'list',
        name: 'selectType',
        message: '请选择使用的框架',
        choices: ['1. vue', '2. react']
      }]).then(ans => {
        resolve(+ans.selectType.substring(0, 1) - 1);
      })
    });
	 	const getPath = selectTypeIndex => new Promise((resolve, reject) => {
      var questions = [{
        type: 'input',
        name: 'path',
        message: '请输入入口文件路径，如：/user/add  (1.以 "/" 开头 2.不能以 "/" 或者 .html 结尾)\n',
        validate: function (value) {
          if(!/^\//gi.test(value)){
          return '请以 / 开头';
          }
          if(/\/$/gi.test(value)){
          return '不能以 / 结尾';
          }
          if(/\.html$/gi.test(value)){
          return '不能以 .html 结尾';
          }
          return true;
        }
        }
      ];
      inquirer.prompt(questions).then(function (answers) {
        resolve({
          path: answers.path,
          selectTypeIndex
        });
      });
    });

		const checkExis = paths => new Promise((resolve, reject) => {
      const type = EXTS[paths.selectTypeIndex];
      const path = paths.path;
      const entryPath = `./src/pages${path}.entry.${type}`;
      const pathInfo = {
        type,
        entryPath,
        path,
      };
      if(fs.existsSync(entryPath)){
        reject(`${entryPath} 文件已存在`);
      }
      if (type === 'js') {
        const vuePath = `./src/pages${path}.vue`;
        if(fs.existsSync(vuePath)){
          reject(`${vuePath} 文件已存在`);
        }
        pathInfo.vuePath = vuePath;
      }
      resolve(pathInfo);
    });


		const confirm = pathsConfig => new Promise((resolve, reject) => {
      const entryPath = pathsConfig.entryPath;
      const vuePath   = pathsConfig.vuePath;

      var message = [
        '系统将创建以下文件：',
        '    (1)  ' + entryPath,
        vuePath ? '    (2)  ' + vuePath : '',
        '',
        '是否继续 ？'
      ].join('\n');
      var questions = [{
          type: 'confirm',
          name: 'isDo',
          message:message
        }
      ];
      inquirer.prompt(questions).then(function (answers) {
        if(answers.isDo){
          resolve(pathsConfig);
        }else{
          reject('文件创建终止 ！')
        }
      });
    });



		function create(pathsConfig){
      const type = pathsConfig.type;
			return new Promise((resolve, reject) => {
				var parents =  pathsConfig.entryPath.replace('./src/pages','').substr(1).split('/').length - 1;
				if(!parents){
					parents = './';
				}else{
					parents = '../'.repeat(parents);
				}

				var entryPath       = pathsConfig.entryPath;
				var vuePath         = pathsConfig.vuePath;
				var dir             = entryPath.substring(0,entryPath.lastIndexOf('/'))
				var entryName       = entryPath.substr(entryPath.lastIndexOf('/')+1);
				entryName           = entryName.substring(0,entryName.indexOf('.'));
        entryName = type === 'jsx' ? entryName.replace(/^(\w)(\w*)$/, (all, first, tail) => {
          return first.toUpperCase() + tail;
        }) : entryName;
        const entryTemplate = type === 'js' ? ENTRY_TEMPLATE : JSX_TEMPLATE
				var entryFileConten = entryTemplate
					.replace(/{name}/gi,entryName)
					.replace(/{parents}/gi,parents);
				var vueFileConten   = vuePath ? VUE_TEMPLATE
					.replace(/{path}/gi,vuePath)
					.replace(/{parents}/gi,parents) : '';

				spawn('mkdir', ['-p',dir]).on('exit',function(){
					try{
						fs.writeFileSync(entryPath,entryFileConten);
						vuePath && fs.writeFileSync(vuePath,vueFileConten);
            var paths = pathsConfig.path.split('/');
						resolve(paths[paths.length - 1]);
					}catch(e){
						reject(e.toString())
					}
				});
			});
		}

    function setTitle(path) {
      return new Promise((resolve, reject) => {
        var questions = [{
          type: 'input',
          name: 'title',
          message: `请输入生成${path}.html的title标签内容`
        }];
        inquirer.prompt(questions).then(function (answers) {
          var data = 'module.exports.' + path + ' = "' + answers.title + '"';
          resolve({data, path});
        });
      })
    }
      selectType()
      .then(getPath)
			.then(checkExis)
			.then(confirm)
			.then(create)
      .then(setTitle)
			.then((res) => {
        fs.appendFileSync(path.join(__dirname, '../config/title.js'), '\n' + res.data);
				var questions = [{
				    type: 'confirm',
				    name: 'startDev',
				    message:'是否启动开发服务器'
				  }
				];
				inquirer.prompt(questions).then(function (answers) {
					if(answers.startDev){
						funs.startDev(res.path);
					}
				});
			})
			.catch(e=>log(e))
	},


	// 启动开发服务器
	startDev:function(htmlPath){
		// spawn('webpack-dev-server', { stdio:'inherit' });
    spawn('node', ['build/dev-server.js', htmlPath + '.html'], {stdio: 'inherit'})
  },
	// 编译
	build:function(){
		spawn('node', ['build/build.js'], {stdio: 'inherit'}).on('exit',function(){
			var questions = [{
			    type: 'confirm',
			    name: 'startDev',
			    message:'是否要提交代码'
			  }
			];
			inquirer.prompt(questions).then(function (answers) {
				if(answers.startDev){
					funs.submit();
				}else{
					process.exit();
				}
			});
		});
	},

	// 重建全部入口文件, 有问题，暂时不改
	reCreateEntry(){
		var entrys          = glob.sync("./src/pages/**/*.entry.js");
		var entryName       = '';
		var entryFileConten = '';
		var parents         = '';

		entrys.forEach(entryPath=>{
			parents         = entryPath.replace('./src/pages','').substr(1).split('/').length-1;
			parents         = parents?'../'.repeat(parents):'./';
			entryName       = entryPath.substr(entryPath.lastIndexOf('/')+1);
			entryName       = entryName.substring(0,entryName.indexOf('.'));
			entryFileConten = ENTRY_TEMPLATE.replace(/{name}/gi,entryName).replace(/{parents}/gi,parents);
			fs.writeFileSync(entryPath,entryFileConten);
		});
		log('重建完成 ！ ')
		var questions = [{
		    type: 'confirm',
		    name: 'startDev',
		    message:'是否启动开发服务器'
		  }
		];
		inquirer.prompt(questions).then(function (answers) {
			if(answers.startDev){
				funs.startDev();
			}
		});
	},

	// 提交代码
	submit(){
		var free  = spawn('git',['status'],{ stdio:'inherit' });
		free.on('exit',function(){
			var questions = [{
				    type: 'confirm',
				    name: 'isDo',
				    message:'\n确定提交以上文件吗？'
				  }
				];
				inquirer.prompt(questions).then(function (answers) {
					if(answers.isDo){
						questions = [{
						    type: 'input',
						    name: 'des',
						    message:'请输入 commit 信息: ',
	    				    validate: function (value) {
						    	if(!value.trim()){
									return 'commit 信息不能为空';
						    	}
							    return true;
						    }
						  }
						];
						inquirer.prompt(questions).then(function (answers) {
							require('child_process').exec(`git add -A . ; git commit -m '${answers.des}' ; git push;`).on('exit',function(){
								log('提交完成！')
							});
						});
					}
				});
		});
	},

  selectEntry (type = '编译') {
    return new Promise((resolve, reject) => {
      function search(path){
        var list = fs.readdirSync(`./src/pages/${path}`).filter(i=>/^[a-z0-9\-_]*$|\.entry\.js$/gi.test(i))
        if(!list.length){
          reject('此目录空空如也~~~~');
          return ;
        }
        inquirer.prompt([{
          type: 'list',
          name: 'entry',
          message: `请选择要${type}的文件，或进入子目录`,
          choices: list.map((i,index)=>`${++index}. ${i}`)
        }]).then((answers) => {
          answers.entry = answers.entry.substr(answers.entry.indexOf('.')+2);
          if(/\.entry\.js$/gi.test(answers.entry)){
            resolve('./src/pages/'+ path + answers.entry);
          }else{
            search(path + answers.entry + '/')
          }
        });
      }
      search('');
    });
  },

  buildEntry (entry) {
    return new Promise((resolve, reject) => {
      var loader = [
        '/ building .',
        '| building ..',
        '\\ building ...',
        '- building ....'
      ];
      var i = 4;
      var ui = new inquirer.ui.BottomBar({bottomBar: loader[i % 4]});
      var timer = setInterval(function () {
        ui.updateBottomBar(loader[i++ % 4]);
      }, 200);
      var entrymatch = entry.match(/\.\/.*\/(.*).entry.js/)[1];
      var s = spawn('node',['build/build.js',`"${entrymatch}"`]);
      s.stdout.on('data', data => {log(data.toString()); });
      s.on('exit', () => {
        log(`${entrymatch}模块编译完成！\n`);
        resolve(entrymatch);
        clearTimeout(timer);
      });
    });
  },
  selectPubModules () {
    return new Promise((resolve, reject) => {
      inquirer.prompt([{
        type: 'list',
        name: 'selectModules',
        message: '请选择发布类型',
        choices: ['1.发布全部模块', '2.发布单个模块']
      }]).then(ans => {
        resolve(+ans.selectModules.substring(0, 1) - 1);
      })
    })
  },

  selectModOpts (type) {
    return new Promise((resolve, reject) => {
      if (type) {
        resolve('发布');
      } else {
        funs.pubAllEntry().then(() => {
          console.log('全部模块发布成功');
        });
      }
    });
  },

  pubEntry (entry) {
    publish();
  },

  pubAllEntry () {
    publish();
  },

  //项目发布
  pub () {
    inquirer.prompt([{
      type: 'confirm',
      name: 'isbuild',
      message: '是否已编译新修改的代码',
    }]).then(ans => {
      if (ans.isbuild) {
        funs.selectPubModules()
        .then(funs.selectModOpts)
        .then(funs.selectEntry)
        .then(funs.pubEntry)
      } else {
        inquirer.prompt([{
          type: 'list',
          name: 'buildAllOrOne',
          message: '请选择编译类型',
          choices: ['1.编译全部模块', '2.编译单个模块']
        }]).then(ans => {
          if (+ans.buildAllOrOne.substring(0, 1) - 1) {
            funs.selectEntry()
            .then(funs.buildEntry)
            // .then(funs.selectPubModules)
            // .then(funs.selectModOpts)
            // .then(funs.selectEntry)
            .then(funs.pubEntry)
          } else {
            spawn('node', ['build/build.js'], {stdio: 'inherit'}).on('exit',() => {
              console.log('全部模块编译成功');
              funs.pubAllEntry()
            });
          }
        })
      }
    })
  },

	// 编译单文件
	buildOne(){
		function selectEntry(){
			return new Promise((resolve, reject) => {
				function search(path){
					var list = fs.readdirSync(`./src/pages/${path}`).filter(i=>/^[a-z0-9\-_]*$|\.entry\.js$/gi.test(i));
					if(!list.length){
						reject('此目录空空如也~~~~');
						return ;
					}
					inquirer.prompt([{
						type: 'list',
						name: 'entry',
						message: '请选择要编译的文件，或进入子目录',
						choices: list.map((i,index)=>`${++index}. ${i}`)
					}]).then(function(answers) {
						answers.entry = answers.entry.substr(answers.entry.indexOf('.')+2);
						if(/\.entry\.js$/gi.test(answers.entry)){
							resolve('./src/pages/'+ path + answers.entry);
						}else{
							search(path + answers.entry + '/')
						}
					});
				}
				search('');
			});
		}
		selectEntry()
			.then(entry=>{
				var loader = [
				  '/ building .',
				  '| building ..',
				  '\\ building ...',
				  '- building ....'
				];
				var i = 4;
				var ui = new inquirer.ui.BottomBar({bottomBar: loader[i % 4]});
				var timer = setInterval(function () {
					ui.updateBottomBar(loader[i++ % 4]);
				}, 200);
        var entrymatch = entry.match(/\.\/.*\/(.*).entry.js/)[1];
				var s = spawn('node',['build/build.js',`"${entrymatch}"`]);
        s.stdout.on('data', function (data) {log(data.toString()); });
        s.on('exit',function(){
          clearTimeout(timer);
          log('编译完成 ！');
          process.exit();
        });
			})
			.catch(e=>{
				log(e)
			});
	},

}

console.log('\n\n\n\n');
var menus = [
	{text:'1. 启动开发服务器', fun: funs.startDev},
	{text:'2. 新建入口文件', fun: funs.createRouter},
	{text:'3. 编译单个文件', fun: funs.buildOne},
	{text:'4. 全库编译', fun: funs.build},
	{text:'5. 提交代码', fun: funs.submit},
  {text:'6. 项目发布', fun: funs.pub}
];

inquirer.prompt([{
	type: 'list',
	name: 'menu',
	message: 'CRM 命令行工具。',
	choices: menus.map(i=>i.text)
}]).then(function(answers) {
	var fun = menus.find(i=>i.text==answers.menu).fun;
	if(fun){
		fun();
	}else{
		log('功能还未实现 ')
	}
});

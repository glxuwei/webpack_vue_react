
// 每次构建 CLI 自动生成，切勿修改（修改后，构建时也将重写此文件）。
import TripPage from './post.vue';
import Ready from 'static/js/ready';
import {getStatus} from 'static/js/Utils';
const isApp = document.domain.indexOf('qyer.com')==-1;
const KEY = {
	'HYBRID_PICTRIP_HYBRIDAPPINFO':'HYBRID_PICTRIP_HYBRIDAPPINFO',
	'HYBRID_PICTRIP_USERINFO':'HYBRID_PICTRIP_USERINFO'
}


const init = () => {
	new Vue({
		el: '#js_container',
		components: {
			TripPage
		}
	})
}

Ready(() => {
  if (isApp) {
  		// 首页会 webview 主动启动，其他页面自启动
  		if(!/index\.html$/gi.test(location.href)){
			window.startPage();
  		}
  } else {
    getStatus().then(() => {
      init();
    });
  }
})

// app 打开 webview 主动调用
window.startPage = function(initData){

	// app 主动调用
	if(initData){
		window.hybridAppInfo = initData;

		sessionStorage.setItem(KEY.HYBRID_PICTRIP_HYBRIDAPPINFO,JSON.stringify(initData));


		var url = '//pictrip.qyer.com/bbs/user/auth_cookie?oauth_token='+initData.oauth_token;
		Vue.http.get(url, {oauth_token:window.hybridAppInfo.oauth_token}).then(function(response){
			var  result = response.json();
			if (result.error_code === 0) {
				window.UserInfo = result.data.userInfo;
				sessionStorage.setItem(KEY.HYBRID_PICTRIP_USERINFO,JSON.stringify(window.UserInfo));
				init();
			} else {
				console.log( 'error : ' + result.info);
				init();
			}
		},function(response){
			console.log( 'error : ' + response.status);
			init();
		});
	}else{
		// 自启动
		window.hybridAppInfo = sessionStorage.getItem(KEY.HYBRID_PICTRIP_HYBRIDAPPINFO);
		window.hybridAppInfo = JSON.parse(window.hybridAppInfo);

		window.UserInfo = sessionStorage.getItem(KEY.HYBRID_PICTRIP_USERINFO);
		window.UserInfo = JSON.parse(window.UserInfo);

		init();
	}


}

// test code
// window.startPage({
// 	oauth_token:'a4a0dde6a80b14a7dc52f43b790d37d0',
// });
// test code;


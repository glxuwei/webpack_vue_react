// vue异步插件
import VueResource from 'vue-resource';

// 首页
export const indexLink = tagid => '//pictrip.qyer.com/bbs/index' + (typeof tagid !== 'undefined' ? `?tagid=${tagid}` : '');
// 登录连接
export const loginLink = (refer = window.location.href) => `//m.qyer.com/login/login.php?refer=${refer}`;
// 用户中心
export const userLink = uid => `//m.qyer.com/u/${uid}`;
// 图片列表
export const photoLink = uid => `//pictrip.qyer.com/bbs/index/piclist?uid=${uid}`;
// 目的地图片列表
export const placeLink = tagid => `//pictrip.qyer.com/bbs/index/placepiclist?tagid=${tagid}`;
// 图片详情
export const detailLink = pid => `//pictrip.qyer.com/bbs/index/detail?pid=${pid}`;
// 赞过的人列表
export const likepeoplesLink = pid => `//pictrip.qyer.com/bbs/index/likepeoples?pid=${pid}`;

// 解析URL
export const parseURL = url => {
    const a = document.createElement('a');
    a.href = url;
    return {
        source: url,
        protocol: a.protocol.replace(':', ''),
        host: a.hostname,
        port: a.port,
        query: a.search,
        params: (function() {
            let ret = {},
                seg = a.search.replace(/^\?/, '').split('&'),
                len = seg.length,
                i = 0,
                s;
            for (; i < len; i++) {
                if (!seg[i]) {
                    continue;
                }
                s = seg[i].split('=');
                ret[s[0]] = s[1];
            }
            return ret;
        })(),
        file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
        hash: a.hash.replace('#', ''),
        path: a.pathname.replace(/^([^\/])/, '/$1'),
        relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
        segments: a.pathname.replace(/^\//, '').split('/')
    };
}

// 解析当前地址
export const locationUrl = () => parseURL(window.location.href);

// css单位 px 转换为 rem
export const pixelToREM = pixelVal => pixelVal * 2 / 100;

// ajax方法
export const ajax = {
    get(url, params = {}) {
        params.timer = Date.now();
        if(window.hybridAppInfo){
            params.oauth_token = window.hybridAppInfo.oauth_token;
        }
        return new Promise((resolve, reject) => {
            Vue.http.get(url, {params: params}).then(response => {
                const result = response.json();
                if (result.error_code === 0) {
                    resolve(result.data);
                } else {
                    reject(result);
                    throw new Error(`${result.data.msg}, error_code: ${result.error_code}`)
                }
            }, response => {
                throw new Error(response.status);
            });
        });
    },
    post(url, params = {}) {
        if(window.hybridAppInfo){
            params.oauth_token = window.hybridAppInfo.oauth_token;
        }
        return new Promise((resolve, reject) => {
            Vue.http.post(url, params, {emulateJSON: true}).then(response => {
                const result = response.json();
                if (result.error_code === 0) {
                    resolve(result.data);
                } else {
                    reject(result);
                    throw new Error(`${result.data.msg}, error_code: ${result.error_code}`)
                }
            }, response => {
                throw new Error(response.status);
            });
        });
    }
}
// 获取用户信息，存到全局变量__USER中
// 每次操作需要用到用户信息是首先调用:
// getStatus().then(userData => {
//      userData（用户信息）
// })
export const getStatus = () => {
    const _ajaxGetStatus = () => {
        return ajax.get('//pictrip.qyer.com/bbs/user/current').then(userData => {
            userData.uid != 0 && (userData.photoLink = photoLink(userData.uid));
            window.UserInfo = userData;
        });
    }
    return new Promise((resolve, reject) => {
        if (window.UserInfo) {
            resolve(window.UserInfo);
        } else {
            _ajaxGetStatus().then(() => {
                resolve(window.UserInfo);
            }).catch(e => {
              window.UserInfo = {};
              resolve();
            });
        }
    });
}

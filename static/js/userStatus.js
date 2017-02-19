import {ajax} from 'static/js/Utils.js';

export default {
    // 获取用户信息，存到全局变量__USER中
    // 每次操作需要用到用户信息是首先调用:
    // getStatus().then(userData => {
    //      userData（用户信息）
    // })
    getStatus() {
        const _ajaxGetStatus = () => {
            return ajax.get('//pictrip.qyer.com/bbs/user/current').then(userData => {
                userData.uid != 0 && (userData.photoLink = `//pictrip.qyer.com/bbs/index/piclist?uid=${userData.uid}`);
                console.log(userData);
                window.__USER = userData;
            });
        }
        return new Promise((resolve, reject) => {
            if (window.__USER) {
                resolve(window.__USER);
            } else {
                _ajaxGetStatus().then(() => {
                    resolve(window.__USER);
                });
            }
        });
    }
}

let cusFetch = null;
const reWriteUrl = url => {
  if(window.hybridAppInfo){
    let split = '?';
    if (url.match(/\?\w+=/)) {
      split = '&';
    }
    url = `${url}${split}oauth_token=${window.hybridAppInfo.oauth_token}`;
  }
  return url;
}
if (typeof fetch === 'function') {
	cusFetch = (url, ...args) => {
    return fetch(reWriteUrl(url), ...args);
  };
} else {
	cusFetch = (url, init) => {

		init = Object.assign({
			method: 'GET',
			mode: 'no-cors',
			body: null,
			credentials: 'include',
			timeout: 0
		}, init);

		const xhr = new XMLHttpRequest();
		xhr.open(init.method, reWriteUrl(url), true);
    const headers = init.headers;
		if (headers) {
			for (let key in headers) {
				xhr.setRequestHeader(key, headers[key]);
			}
		};
		xhr.timeout = init.timeout;
		xhr.withCredentials = init.credentials;

		return new Promise((resolve, reject) => {
			try {
				xhr.send(init.body);
				xhr.onload = () => {

					if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {

						let res = xhr.response;
						resolve({
							json () {
								return new Promise((resolve, reject) => {
									try {
										resolve(JSON.parse(res));
									} catch(e){
										reesolve(res);
									}
								})
							},
							text () {
								return new Promise((resolve, reject) => {
									resolve(res);
								})
							},
							headers: {
								get (key) {
									try {
										return xhr.getResponseHeader(key);
									} catch(e){

									}
								}
							},
							status: xhr.status

						})
					} else {
						reject(new Error(xhr.statusText));
					}
				};
				xhr.onerror = (e) => {
					reject(new Error(e));
				};
				xhr.ontimeout = (e) => {
					reject(new Error(e));
				}
			} catch(e){
				reject(new Error(e));
			}
		})

	}

}

export default cusFetch;

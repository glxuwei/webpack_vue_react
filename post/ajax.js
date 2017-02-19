import Fetch from './fetch';
import {PREAJAXURL} from './constant'
const getCurrentPosition => pos {
  let str = '';
  if (typeof pos === 'string') {
    str = `&keyword=${pos}`;
  } else {
    str = `&latlng=${pos.nowLatitude},${pos.nowLongitude}`;
  }
  return Fetch(`${PREAJAXURL}/photo.php?action=location${str}`).then(response => response.json());
};

const publish = data => {
  if (publish.pubStatus) {
    publish.pubStatus = 0;
    const postData = {
      method: 'POST',
      credentials: false,
      body: data,
      headers: {'content-type': 'application/x-www-form-urlencoded'}
    };
    return Fetch(`${PREAJAXURL}/photo.php?action=post`, postData).then(response => {
      publish.pubStatus = 1;
      return response.json();
    });
  } else {
    return new Promise((resolve, reject) => {
      reject(1);
    })
  }
};
publish.pubStatus = 1;

const getToken = () => Fetch(`${PREAJAXURL}/user/qiniutoken`, {credentials: false})
  .then(response => response.json()).then(res => new Promise((resolve, reject) => {
      if (res && res.result === 'ok') {
        resolve(res.data.tk);
      } else {
        reject();
      }
    })
  );

export {getCurrentPosition, publish, getToken}

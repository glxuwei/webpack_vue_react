module.exports = (value='', type='_', ra='') => {
  let res = '';
  //添加分隔符
  if (Object.prototype.toString.call(value) === '[object Array]') {
    res = value.join(type);
  //替换或者去除分隔符
  } else {
    res = value.split(type).join(ra);
  }
  return res;
}

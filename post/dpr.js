const dpr = () => {
  const docEl = document.documentElement;
  const fontEl = document.createElement('style');
  const docElWidth = docEl.clientWidth;
  const metaEl = document.querySelector('meta[name=viewport]');
  const dpr = window.devicePixelRatio || 1;
  const datum = docElWidth * dpr / 10;
  const scale = 1 / dpr;
  //给js调用的，某一dpr下rem和px之间的转换函数
  const rem2px = (v) => parseFloat(v) * datum;
  const px2rem = (v) => (parseFloat(v) / datum).toFixed(2);
  // 设置viewport，进行缩放，达到高清效果
  metaEl.setAttribute('content', 'width=' + dpr * docElWidth + ',initial-scale=' + scale + ',maximum-scale=' + scale + ', minimum-scale=' + scale + ',user-scalable=no');

  // 设置data-dpr属性，留作的css hack之用
  docEl.setAttribute('data-dpr', dpr);

  // 动态写入样式
  docEl.firstElementChild.appendChild(fontEl);
  fontEl.innerHTML = 'html{font-size:' + datum + 'px!important;} body{max-width: '+ px2rem(1984) +'rem!important; background: #f5f5f5;}';

  return {
    rem2px,
    px2rem,
    dpr,
    datum
  }
}
module.exports = dpr;


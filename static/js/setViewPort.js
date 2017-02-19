// 设置字体控制rem
const setPageFontSize = function(html, width, fn) {
    html.style.fontSize = fn.call(null, width, 750) + 'px';
};

const getFontSize = function(width, defaultWidth) {
    return parseInt((width / (defaultWidth / 2)) * 50);
};

setPageFontSize(document.querySelector('html'), document.body.offsetWidth, getFontSize);

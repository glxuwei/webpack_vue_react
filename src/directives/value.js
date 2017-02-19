/* module.exports = { */
  // twoWay: true,
  // bind: function () {
    // this.handler = function () {
        // this.set(this.el.innerText)
    // }.bind(this)
    // this.el.addEventListener('keyup', this.handler)
  // },
  // update: function (newValue, oldValue) {
    // this.el.innerHTML = newValue || ''
  // },
  // unbind: function () {
    // this.el.removeEventListener('keyup', this.handler)
  // }
/* } */
module.exports = {
  twoWay: true,
  bind: function () {
    this.handler = function () {
      // 将数据写回 vm
      // 如果指令这样绑定 v-example="a.b.c"
      // 它将用给定值设置 `vm.a.b.c`
      this.set(this.el.innerText)
    }.bind(this)
    this.el.addEventListener('input', this.handler)
  },
  update: function (val, oldval) {
    this.el.innerText = val || '';
  },
  unbind: function () {
    this.el.removeEventListener('input', this.handler)
  }
}

<template>
  <div class="up-mask" v-show="isShow">
    <div class="upm-wrap">
      <div class="upm-inner" :style="{width: width + '%'}"></div>
    </div>
  </div>
</template>
<style lang="less">
  .up-mask{
    position: fixed;
    z-index: 99;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.5);
    .upm-wrap{
      position:absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      overflow: hidden;
      border-radius: 8px;
      width: 80%;
      height: 8px;
      text-align: left;
    }
    .upm-inner{
      background: #11bf79;
      height: 8px;
    }
    .upm-text{
      font-size: 20px;
      color: #fff;
    }
  }
  .pic-content.blur{
    -webkit-filter: blur(3px);
  }

</style>
<script>
  export default {

    data () {
      return {
        width: 0,
        isShow: 0
      }
    },
    ready () {
      VueEmitter.$on('UPLOAD_PROGRESS', (width) => {
        document.querySelector('.pic-content').classList.add('blur');
        this.isShow = 1;
        this.width = width;
      });
      VueEmitter.$on('UPLOAD_PROGRESS_MASK', (msg) => {
        this.isShow = +msg;
        !msg && document.querySelector('.pic-content').classList.remove('blur');
      });
    }
  }

</script>

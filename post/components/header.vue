<template>
  <header class="post-header">
    <i class="iconfont iconfont-close" @click="close" v-show="status"></i>
    <i class="iconfont iconfont-back" v-show="!status" @click="back"></i>
    <h3 class="post-title">{{title}}</h3>
    <i class="iconfont iconfont-success" :class="{'disabled': dispub}" v-show="status" @click="doPost"></i>
  </header>
</template>
<style lang="less">
  @import '../post';
  .post-header{
    position: relative;
    background:#11BF79;
    .px2rem(line-height, 88);
    color: #fff;
    .iconfont {
      position: absolute;
      .px2px(font-size, 46);
    }
    .iconfont-close, .iconfont-back{
      .px2rem(left, 30);
      top: 0;
      bottom: 0;
    }
    .iconfont-success{
      top: 0;
      bottom: 0;
      .px2rem(right, 30);
      &.disabled{
        color: rgba(255, 255, 255, 0.5);
      }
    }
  }
  .post-title{
    text-align: center;
    .px2px(font-size, 32);
  }
</style>
<script>
  import {COMINFO} from '../constant'

  export default {
    props: ['curview', 'selectedLocid'],
    computed: {
      title () {
        return COMINFO[this.curview].title
      },
      status () {
        return COMINFO[this.curview].status
      },
      dispub () {
        return this.selectedLocid !== '' ? false : true;
      }
    },
    data() {
      return {
        dispub: true
      }
    },
    methods: {
      back () {
        this.curview = 'PostEditor'
      },
      close () {
        history.go(-1);
      },
      doPost () {
        if (!this.dispub) {
          this.$dispatch('post-pic');
        }
      }
    }
  }
</script>


<template>
  <section class="post-addr__wrapper" @click="selAddr">
    <span class="post-addr__title">
      <i class="iconfont iconfont-position2"></i>
      <span class="post-addr--ms">位置</span>
    </span>
    <div class="post-addr__addr">
      {{selectedLoc.location | split}}
    </div>
    <i class="iconfont iconfont-arrow-right"></i>
  </section>

</template>

<style lang="less">
  @import '../post';

  .post-addr__wrapper{
    position: relative;
    background: #fff;
    border: 1px solid #d7d7d7;
    border-radius: 8px;
    .px2rem(margin, 30);
    .px2rem(line-height, 90);
    .px2rem(height, 90);
    color: @dark;
    .px2px(font-size, 26);
    .iconfont{
      position: absolute;
      top: 0;
      bottom: 0;
      .px2px(font-size, 28);
    }
    .iconfont-position2 {
      .px2rem(left, 30);
      color: @l1dark;
    }
    .iconfont-arrow-right{
      .px2rem(right, 30);
      color: @dmdark;
    }
  }
  .post-addr__title {
    float: left;
  }
  .post-addr--ms{
    .px2rem(margin-left, 76);
  }
  .post-addr__addr{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .px2rem(margin-left, 146);
    .px2rem(margin-right, 56);
    color: @green;
  }
</style>

<script>
  let info = {
  };
  export default {
    props: ['selectedLoc'],
    data () {
      return info;
    },
    ready () {
    },
    methods: {
      selAddr () {
        this.$dispatch('post-seladdr');
      }
    },
    events: {
    }
  }
</script>

<template>
  <div class="upload-manager">
    <span v-show="!isLogin" @click="login" class="u-temp">
      <i class="iconfont iconfont-camera"></i>
    </span>
    <span v-show="isLogin">
      <pic-upload :tag-id.sync="tagId"></pic-upload>
    </span>
  </div>
</template>
<style lang="less">
  .upload-manager{
    position: fixed;
    z-index: 100;
    width: 50px;
    height: 50px;
    line-height: 50px;
    right: 0.3rem;
    bottom: 0.3rem;
    overflow:hidden;
    background: #11BF79;
    border-radius: 50%;
    text-align: center;
    color: #fff;
    .iconfont-camera{
      font-size: 28px;
    }
  }
</style>
<script>
  import PicUpload from './upload'
  let uploadMan = {
    isLogin: false
  };
  export default {
    props: {
      tagId: {
        type: Number,
        required: true
      }
    },
    data () {
      return uploadMan
    },
    ready () {
      uploadMan.isLogin = +window.UserInfo.uid ? true : false;
    },
    methods: {
      login () {
        window.location.href = `//m.qyer.com/login/login.php?refer=${window.location.href}`;
      }
    },
    components: {
      PicUpload
    }
  }
</script>

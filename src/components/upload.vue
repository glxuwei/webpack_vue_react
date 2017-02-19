<template lang="jade">
  vue-file-upload#upload__btn(url='http://upload.qiniu.com/',
    v-bind:files.sync = 'files',
    :label = 'label',
    :icon = 'icon',
    v-bind:filters = "filters",
    v-bind:events = 'cbEvents',
    v-bind:request-options = "reqopts")
  post-tip(:show.sync="showtip")
    div {{tip}}
</template>
<style lang="less">
  #upload__btn{
    border-radius: 50%;
    padding: 0;
    display:inline;
    line-height: 50px;
    background: transparent;
    &.hover{
      background: #07AE6B;
    }
    input{
      width: 50px;
      height: 50px;
      top: -22px;
      right: -10px;
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
</style>
<script>
import VueFileUpload from 'vue-file-upload';
import PostTip from 'components/tips'
import getToken from '../pages/post/ajax';

let uploadData = {
  files:[],
  label: '',
  icon: 'iconfont iconfont-camera',
  autoUpload: true,
  //文件过滤器，只能上传图片
  filters:[
    {
      name:"imageFilter",
      fn(file){
          var type = '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
          return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    }
  ],
  //回调函数绑定
  cbEvents:{
    onProgressUpload (file, progress) {
      VueEmitter.$emit('UPLOAD_PROGRESS', progress);
    },
    onCompleteUpload (file,response,status,header) {
      VueEmitter.$emit('UPLOAD_PROGRESS_MASK', 0);
      const url = response ? response.url : '//common1.qyerstatic.compictrip/static/images/icon-empty.png';
      window.location.href = `@post@?tag=${uploadData.tagId}&url=${url}&key=${response.key}`;
    },
    onAddFileFail (error) {
      uploadData.showtip = true;
    }
  },
  //xhr请求附带参数
  reqopts:{
    formData:{
    },
    responseType:'json',
    withCredentials:false
  },
  tip: '上传图片失败!',
  showtip: false
}

getToken().then(token => {
  uploadData.reqopts.formData.token = token;
}).catch(() => {
  console.log('获取token失败');
});

export default {
  props: {
    tagId: {
      type: Number,
      required: true
    }
  },
  data(){
    return uploadData
  },
  ready () {
    uploadData.tagId = this.tagId;
    this.$watch('files', (ary) => {
      ary[0].upload();
    });
  },
  methods:{
    onStatus(file){
      if(file.isSuccess){
        return "上传成功";
      }else if(file.isError){
        return "上传失败";
      }else if(file.isUploading){
        return "正在上传";
      }else{
        return "待上传";
      }
    }
  },
  components:{
    VueFileUpload,
    PostTip
  }
}
</script>


<template>
  <post-header :curview.sync="curView" :selected-locid="selectedlocation.place_tag_id" v-on:post-pic="postpic"></post-header>
  <component :is="curView" :curview.sync="curView" :associate-loc="associatelocation" :current-loc="currentlocation" :selected-loc.sync="selectedlocation" keep-alive transition="fade" transition-mode="out-in"></component>
  <post-tip :show.sync="showtip">
    <div>{{tip}}</div>
  </post-tip>
</template>

<style lang="less">
  .fade-transition {
    transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave {
    opacity: 0;
  }
</style>

<script>
import PostHeader from './components/header'
import PostEditor from './components/editor'
import AddrSel from './components/addrsel'
import {COMINFO} from './constant'
import promisePos from './position'
import {getCurrentPosition, publish} from './ajax'
import PostTip from 'components/tips'
Vue.directive('value', require('../../directives/value'));
Vue.filter('split', require('../../filter/split'));
const Dpr = require('./dpr')();
let info = {
  title: '发布照片',
  currentlocation: {},
  selectedlocation: {place_tag_id: '', location: ''},
  associatelocation: [],
  curView: 'PostEditor',
  tip: '图片保存失败!',
  showtip: false
  /* curView: 'AddrSel' */
};
promisePos.then(getCurrentPosition).then(suc => {
  if (suc.result === 'ok') {
    const data = suc.data;
    info.currentlocation = info.selectedlocation = {location: data.location, place_tag_id: data.place_tag_id};
    info.associatelocation = data.poi || [];
  } else {
    return new Promsie((resolve, reject) => {reject()});
  }
}).catch(err => {
  info.currentlocation = {place_tag_id: '', location: ''};
  info.selectedlocation = {place_tag_id: '', location: '请选择目的地'};
});
export default Vue.extend({
	ready(){
	},
	data(){
    return info
  },
  computed: {
    title () {
      return COMINFO[this.curView].title;
    }
  },
  methods:{
    postpic () {
      let postOnly = 0;
      let location = '';
      let place_tag_id = 0;
      const queryStr = window.location.search;
      const url = queryStr.match(/&url=(.*)&/) ? queryStr.match(/&url=(.*)&/)[1] : '';
      const tagid = queryStr.match(/tag=(\d+)&?/) ? queryStr.match(/tag=(\d+)&?/)[1] : '';
      const key = queryStr.match(/key=(.*)&?/) ? queryStr.match(/key=(.*)&?/)[1] : '';
      if (info.selectedlocation.place_tag_id) {
        place_tag_id = info.selectedlocation.place_tag_id;
      } else {
        location = info.selectedlocation.location;
      }
      if (!postOnly) {
        postOnly = 1;
        publish(`url=${url}&tagid=${tagid}&location=${location}&place_tag_id=${place_tag_id}&intro=${document.querySelector('.post-editor__text').innerText}&key=${key}`)
        .then(suc => {
          postOnly = 0;
          if (suc.result === 'ok') {
            info.tip = '图片发布成功！';
            info.showtip = true;
            const timer = setTimeout(() => {
              const tags = `&tagid=${tagid}`;
              window.location.href = `@index@/?type=new${tags}`;
              clearTimeout(timer);
            }, 1000);
          } else {
            return new Promise((resolve, reject) => {
              reject();
            });
          }
        }).catch(err => {
          postOnly = 0;
          info.showtip = true;
          if (err !== 1) {
            publish.pubStatus = 1;
          }
        });
      }
    }
  },
  events: {
    'post-seladdr': () => {
      info.curView = 'AddrSel'
    }
  },
	components:{
    PostHeader,
    PostEditor,
    AddrSel,
    PostTip
  }
});

</script>

<template>
  <section>
    <div class="addrsel__search">
      <i class="iconfont iconfont-search"></i>
      <input class="addrsel__input" v-model="postxt" @keyup.13="selectAddr({'place_tag_id': 0, 'location': postxt })" type="text" placeholder="搜索旅行目的地"/>
    </div>
    <ul class="addrsel__result">
      <li class="addrsel__item addrsel__item--cur" @click="selectAddr(0)"><span v-show="!addCus">我在</span><span v-show="addCus">添加</span><i class="iconfont iconfont-position2"></i><span v-show="!addCus">{{currentLoc.location | split}}</span><span v-show="addCus">目的地“{{postxt}}”</span></li>
      <li class="addrsel__item" v-for="item in associateLoc | filterBy postxt in 'location'" track-by="place_tag_id" transition="fade" transition-mode="out-in" @click="selectAddr(item)">{{item.location | split}}</li>
    </ul>
  </section>
</template>

<style lang="less">
  @import '../post';
  .fade-transition {
  transition: opacity .3s ease;
  }
  .fade-enter, .fade-leave {
  opacity: 0;
  }
  .addrsel__item--cur{
    &.hide{
      display: none;
    }
  }
  .addrsel__search{
    position: relative;
    .px2rem(margin, 30);
    background: #fff;
    border: 1px solid @l1dark;
    .px2px(border-radius, 54);
    .px2px(font-size, 24);
    .px2px(line-height, 60);
    .px2px(height, 60);
  }
  .iconfont-search{
    position: absolute;
    top: 0;
    bottom: 0;
    .px2rem(left, 20);
    .px2px(font-size, 34);
    color: @l1dark;
  }
  .addrsel__input{
    .tapnobg;
    .px2rem(width, 568);
    .px2rem(margin-left, 63);
    border: none;
  }
  .addrsel__result{
    .px2rem(padding-left, 30);
    border-top: 1px solid @d7;
    .iconfont-position2{
      .px2rem(margin-left, 20);
      .px2rem(margin-right, 4);
      .px2px(font-size, 26);
      color: @green;
    }
  }
  .addrsel__item{
    .px2px(font-size, 28);
    .px2rem(line-height, 100);
    color: @dark;
    border-bottom: 1px solid @d7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:last-child{
      border-bottom: none;
    }
  }

</style>

<script>
  function byteLength(str) {
    let byteLen = 0;
    let len = str.length;
    if( !str ) return 0;
    for( let i=0; i<len; i++ )
      byteLen += str.charCodeAt(i) > 255 ? 2 : 1;
    return byteLen;
  };
  import {getCurrentPosition} from '../ajax';
  let info = {
    postxt: '',
    keywords: ''
  };
  export default {
    props: ['currentLoc', 'selectedLoc', 'curview','associateLoc'],
    data () {
      return info
    },
    computed: {
      addCus () {
        return this.postxt ? true : false;
      }
    },
    ready () {
      let $ads = document.querySelector('.addrsel__input');
      let post = 1;
      this.$watch('postxt', (val) => {
        const bytelen = byteLength(val);
        if ( bytelen >= 40) {
          $ads.setAttribute('maxlength', info.keywords.length);
          if (bytelen > 40) {
            post = 0;
          }
        } else {
          post = 1;
          $ads.removeAttribute('maxlength');
          info.keywords = val;
        }
        if (post) {
          getCurrentPosition(val).then(suc => {
            if (suc.result === 'ok') {
              this.associateLoc = (suc.data || []).slice(0, 30);
            }
          });
        }
      });
    },
    methods: {
      selectAddr (item) {
        item = item ? item : this.postxt ? {place_tag_id: 0, location: this.postxt} : this.currentLoc;
        this.selectedLoc = item;
        this.curview = 'PostEditor';
        this.postxt = '';
      }
    }
  }
</script>

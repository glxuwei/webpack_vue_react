<style lang="less">
.qui-popup-share {
    position: fixed;
    z-index: 999999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(245, 245, 245, .9);
}
.qui-popup-shareContent {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 50px;
}
.qui-popup-shareList{
    width: 140px;
    margin: 0 auto;

    a {
        display: block;
        float: none;
        margin: 20px auto;
        padding: 0px;
        width: auto;
        height: 40px;
        line-height: 40px;
        font-size: 18px;
        text-indent: 55px;
        color: #323232;
        background-image: url('//common1.qyerstatic.com/pictrip/static/images/icons-share.png');
        background-size: 40px auto;
        background-repeat: no-repeat;
        cursor: pointer;

        &.jiathis_button_tsina { background-position: 0px 0px;}
        &.jiathis_button_qzone { background-position: 0px -60px;}
        &.jiathis_button_renren { background-position: 0px -120px;}
        &.jiathis_button_fb { background-position: 0px -180px;}
    }

    span {
        display: block !important;
        margin: 0 !important;
        padding: 0 !important;
        height: auto !important;
        background: none !important;
        font-size: inherit !important;
        line-height: inherit !important;
    }
}
.qui-popup-shareCancel {
    margin: 15px;
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    text-align: center;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    border-radius: 4px;
    color: #333;
}
.share-transition {
    transition: all .3s ease;
    opacity: 1;
}
.share-enter, .share-leave {
    opacity: 0;
}
</style>
<template lang="jade">
.qui-popup-share(v-show='show', transition="share")
    .qui-popup-shareContent
        .qui-popup-shareList
            a.jiathis_button_tsina 新浪微博
            a.jiathis_button_qzone QQ空间
            a.jiathis_button_renren 人人网
            a.jiathis_button_fb facebook
        .qui-popup-shareCancel(@click="close") 取消
</template>
<script>
export default Vue.extend({
    ready() {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "http://v3.jiathis.com/code/jia.js";
        document.body.appendChild(script);
        window.jiathis_config = {
            url : this.shareUrl,
            title : this.shareTitle,
            summary : this.shareSummary,
            pic : this.sharePic
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false,
            twoWay: true
        },
        shareConfig: {
            type: Object,
            default: {
                title: '',
                summary: '',
                pic: '',
                url: window.location.href
            }
        }
        // shareUrl: {
        //     type: String,
        //     default: window.location.href
        // },
        // shareTitle: {
        //     type: String,
        //     default: ''
        // },
        // shareSummary: {
        //     type: String,
        //     default: ''
        // },
        // sharePic: {
        //     type: String,
        //     default: ''
        // }
    },
    watch: {
        shareConfig() {
            window.jiathis_config = this.shareConfig;
        }
    },
    // data() {
    //     return {
    //         show: false
    //     }
    // },
    methods: {
        share() {
            this.show = true;
        },
        close() {
            this.show = false;
        }
    }
});
</script>

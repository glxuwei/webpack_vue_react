<style lang="less" scoped>
    .modal-tips {
        position: fixed;
        z-index: 999999;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 1rem;
        padding: .15rem .35rem;
        font-size: .3rem;
        background: rgba(0,0,0,.5);
        color: #FFF;
    }
    .tips-transition {
        transition: all .3s ease;
        opacity: 1;
    }
    .tips-enter, .tips-leave {
        opacity: 0;
    }
</style>
<template>
    <div v-show="show" class="modal-tips" transition="tips">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            twoWay: true,
            default: false
        },
        duration: {
            type: Number,
            default: 1500
        },
        isCallback: {
            type: Boolean,
            default: false
        },
        // 回调函数会回传type，tips被调用多次的时候用type来区分回调
        callbackType: {
            type: String,
            default: ''
        }
    },
    watch: {
        show(value) {
            if (value) {
                setTimeout(() => {
                    this.show = false;
                    if (this.isCallback){
                        this.$dispatch('callback', this.callbackType);
                    }
                }, this.duration);
            }
        }
    }
};
</script>

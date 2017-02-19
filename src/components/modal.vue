<style lang="less" scoped>
    .flexBox() {
        display: -webkit-box;
        display: -webkit-flex;
        display: flex;
        -webkit-box-pack: center;
        -webkit-justify-content: center;
        justify-content: center;
    }
    .modal {
        position: fixed;
        z-index: 999999;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        .modal-dialog {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border: .01rem solid #959595;
            border-radius: .08rem;
            text-align: center;
            background: #F8F8F8;
            width: 5.4rem;
            font-size: .32rem;
            .modal-content {
                padding: .35rem;
                line-height: .45rem;
                font-weight: bold;
            }
            .modal-buttons {
                border-top: .01rem solid #959595;
                .flexBox;
                > .button {
                    -webkit-flex-box: 1;
                    flex-box: 1;
                    -webkit-flex-grow: 1;
                    flex-grow: 1;
                    background: transparent;
                    border: 0;
                    border-right: .01rem solid #959595;
                    height: .9rem;
                    line-height: .9rem;
                    color: #11BF79;
                    &:last-child {
                        border-right: 0;
                    }
                }
            }
        }
    }
    .modal-transition {
        transition: all .3s ease;
        opacity: 1;
        .modal-dialog {
            transition: all .3s ease;
            transform: translate(-50%, -50%);
        }
    }
    .modal-enter, .modal-leave {
        opacity: 0;
        .modal-dialog {
            transform: translate(-50%, -60%);
        }
    }
</style>
<template lang="jade">
    div.modal(v-show='show', transition="modal")
        .modal-dialog
            .modal-content
                slot
            .modal-buttons
                button.button(@click='onOk', :style="okStyle") {{okText}}
                button.button(v-if='showCancelBtn', @click='onCancel', :style="cancelStyle") {{cancelText}}
</template>
<script>
export default Vue.extend({
    props: {
        show: {
            type: Boolean,
            default: false,
            twoWay: true
        },
        showCancelBtn: {
            type: Boolean,
            default: true
        },
        okText: {
            type: String,
            default: '确定'
        },
        cancelText: {
            type: String,
            default: '取消'
        },
        okStyle: {
            type: Object
        },
        cancelStyle: {
            type: Object
        }
    },
    methods: {
        onOk() {
            this.$emit('ok', 'ok');
            this.hideModal();
        },
        onCancel() {
            this.$emit('cancel', 'cancel');
            this.hideModal();
        },
        hideModal() {
            this.show = false;
        }
    }
});
</script>

<style lang="less">
    .loading-wrap {
        padding: .1rem;
        font-size: 0;
        line-height: 0;
        text-align: center;
        span.load-dot {
            display: inline-block;
            margin: .08rem;
            background: #D8D8D8;
            opacity: .5;
            border-radius: .08rem;
            width: .16rem;
            height: .16rem;
            -webkit-animation: anim_load 1.4s infinite ease-in-out;
            animation: anim_load 1.4s infinite ease-in-out;

            &:nth-child(1) {
                -webkit-animation-delay: -0.32s;
                animation-delay: -0.32s;
            }

            &:nth-child(2) {
                -webkit-animation-delay: -0.16s;
                animation-delay: -0.16s;
            }
        }

        @-webkit-keyframes anim_load {
            0%, 80%, 100%{
                opacity: .5;
            }
            40% {
                opacity: 1;
            }
        }
        @keyframes anim_load {
            0%, 80%, 100%{
                opacity: .5;
            }
            40% {
                opacity: 1;
            }
        }
    }
</style>
<template>
    <div class="loading-wrap">
        <span class="load-dot"></span>
        <span class="load-dot"></span>
        <span class="load-dot"></span>
    </div>
</template>

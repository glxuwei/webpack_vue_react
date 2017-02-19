
<!--<template>
    <div v-if="list.length">

        <ul class="a-list">
            <li v-for="item in list" :key="item.id">
                {{item.name}}
            </li>
        </ul>

    </div>
    <p v-else>not found</p>
</template>-->

<template lang="jade">
    div(v-if="list.length")
        ul.a-list
            li(v-for="item in list", :key="item.id") {{item.name}}
    p(v-else) not found

</template>

<style lang="less" scoped>

</style>

<script>
const log = console.log.bind(console)
import list from 'data/list'
log(typeof list)
export default {

	ready(){
	},

	data(){
    return {
        list
    }
  },

  methods:{

  },

  computed:{},

	components:{},

  filters:{},

  events:{},

  watch:{}

};
</script>

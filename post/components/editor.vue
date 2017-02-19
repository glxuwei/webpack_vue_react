<template>
  <div>
    <post-textarea></post-textarea>
    <post-addr :selected-loc.sync="selectedLoc"></post-addr>
  </div>
</template>
<style>

</style>

<script>
  import  PostTextarea from './textarea'
  import  PostAddr from './addr'

  export default {
    props: ['selectedLoc'],
    components: {
      PostTextarea,
      PostAddr
    },
    methods: {

    }
  }
</script>

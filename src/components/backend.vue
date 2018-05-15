<template>
  <div>
    <app-header/>
    <section class="main">
      <router-view class="inner" />
    </section>
  </div>
</template>

<script>
  import appHeader from './header';

  export default {
    name      : "backend",
    components: {
      'app-header': appHeader
    },
    methods   : {
    }
  }
</script>

<style scoped>

</style>


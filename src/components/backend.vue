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
    },
    // watch: {
    //   '$route' (to, from) {
    //     // 对路由变化作出响应...
    //     console.log(to);
    //     console.log(from);
    //     console.log(from.params.categoryId);
    //     console.log(to.params.categoryId);
    //   }
    // }
  }
</script>

<style scoped>

</style>


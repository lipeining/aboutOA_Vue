<template>
  <div class="pointer-up">
    <i class="el-icon-caret-top" @click="goTop()"></i>
  </div>
</template>

<script>
  export default {
    name: "go-top",
    methods:{
      goTop() {
        //             * t: current time（当前时间）；
        //             * b: beginning value（初始值）；
        //             * c: change in value（变化量）；
        //             * d: duration（持续时间）。
        // var Tween    = {
        //   Linear: function (t, b, c, d) {
        //     //匀速运动，想要实现其他的效果可以使用tween的其他方法
        //     return c * t / d + b;
        //   }
        // };
        // Math.tween   = Tween;
        // var t        = 1;
        // const b      = document.documentElement.scrollTop;
        // const c      = 50;
        // const d      = 5;
        // const setInt = setInterval(() => {
        //   t--;
        //   if (document.documentElement.scrollTop === 0) {
        //     clearInterval(setInt)
        //   }
        //   const backTop                      = Tween.Linear(t, b, c, d);
        //   document.documentElement.scrollTop = backTop;
        // }, 20)
        document.documentElement.scrollTop = 0;
      }
    }
  }
</script>

<style scoped>
  .pointer-up {
    background-color: #FFF;
    position: fixed;
    font-size: 30px;
    width: 50px;
    height: 50px;
    right: 30px;
    bottom: 100px;
    border-radius: 30px;
    cursor: pointer;
    transition: .3s;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    z-index: 5;
  }

  .pointer-up :hover {
    opacity: 1;
  }
</style>

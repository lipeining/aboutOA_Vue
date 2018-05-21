<template>
  <div>
    <app-header/>
    <section class="main">
      <div class="fluid container">
        <el-row class="search-project">
          <el-col :span="6">
            <el-input v-model="searchProject" placeholder="search project"
                      type="text" clearable></el-input>
          </el-col>
        </el-row>
        <el-collapse v-model="activeName">
          <el-collapse-item v-for="category in categories" :name="category.id">
            <template slot="title">
              <el-tooltip effect="dark" :content="category.intro"
                          placement="right-start">
                <span class="category-name">{{category.name}}</span>
                <!--<i class="header-icon el-icon-info"></i>-->
              </el-tooltip>
            </template>
            <el-row :gutter="20" class="project-content">
              <el-col :span="3" v-for="project in category.Projects" :key="project.id"
                      class="project-content ">
                <div class="grid-content">
                  <el-popover
                    placement="top-start"
                    :title="project.name"
                    width="400"
                    trigger="hover">
                    <el-row>
                      <el-tag v-if="project.segment.inner">inner</el-tag>
                      <el-tag v-if="project.segment.middle" type="warning">middle</el-tag>
                      <el-tag v-if="project.segment.outer" type="success">outer</el-tag>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12" class="project-intro">
                        <p>{{project.intro}}</p>
                      </el-col>
                      <el-col :span="8" class="project-intro">
                        <img v-if="project.logo"
                             :src="project.logo" :alt="project.logo"
                             class="logo">
                      </el-col>
                    </el-row>
                    <el-row :gutter="20">
                      <el-col :span="12">
                        <p><strong class="hint">*hint:</strong>{{project.hint}}</p>
                      </el-col>
                      <el-col :span="8">
                        <div v-if="project.url">
                          <!--<a :href="'http://vue-loader.vuejs.org/'" target="_blank">进入网站</a>-->
                          <a :href="project.url" target="_blank">进入网站</a>
                        </div>
                        <div v-else-if="project.QRCode">
                          <el-popover
                            placement="right"
                            width="200"
                            trigger="click">
                            <img v-if="project.QRCode"
                                 :src="project.QRCode" :alt="project.QRCode"
                                 class="QRCode">
                            <el-button slot="reference">点击下载</el-button>
                          </el-popover>
                        </div>
                        <div v-else>
                          <p>no url and no QR code</p>
                        </div>
                      </el-col>
                    </el-row>
                    <img v-if="project.logo" slot="reference"
                         :src="project.logo" :alt="project.logo"
                         class="logo">
                  </el-popover>
                </div>
              </el-col>
            </el-row>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div class="pointer-up">
        <i class="el-icon-caret-top" @click="backTop()"></i>
      </div>
    </section>
  </div>
</template>

<script>
  import appHeader from './header';
  import {getCategories} from '../api/category';
  import {number2segment} from "../utils/project";
  import _ from 'lodash';

  export default {
    name      : "home",
    components: {
      'app-header': appHeader
    },
    data() {
      return {
        categories   : [],
        activeName   : [],
        searchProject: ''
      }
    },
    created() {
      this.getCategories();
    },
    methods   : {
      getCategories: _.debounce(function () {
        return getCategories({
          search: this.searchProject
        })
          .then(result => {
            this.categories = result.categories.map((category) => {
              category.Projects = category.Projects.map((project) => {
                let [inner, middle, outer] = number2segment(project.segment);
                project['segment']         = {
                  inner : inner,
                  middle: middle,
                  outer : outer
                };
                return project;
              });
              return category;
            });
            this.activeName = this.categories.map((category) => {
              return category.id;
            });
            this.$notify({
              type   : 'success',
              title  : 'success',
              message: 'get categories from server'
            });
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      }, 500),
      backTop() {
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
    },
    watch     : {
      searchProject: function () {
        this.getCategories();
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

  .search-project {
    margin: 1em;
  }

  .category {
    border: 1px solid paleturquoise;
    margin: 1em;
  }

  .category-name {
    float: left;
  }

  .project-content {
    min-height: 10px;
    margin-bottom: 1em;
  }

  .project-intro {
    min-height: 10px;
    margin: 1em;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 10px;
    margin: 1em;
  }

  .logo {
    width: 50px;
    height: 50px;
    /*display: block;*/
    display: inline;
  }

  .QRCode {
    width: 200px;
    height: 200px;
    /*display: block;*/
    display: block;
  }

  .hint {
    color: firebrick;
  }
</style>

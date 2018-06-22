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
          <el-collapse-item v-for="category in categories"
                            :name="category.id" :key="category.id">
            <template slot="title">
              <el-tooltip effect="dark" :content="category.intro"
                          placement="right-start">
                <router-link v-if="isAdmin"
                             :to="{name:'projects', params: { categoryId: category.id }}">
                  <span class="category-name">{{category.name}}</span>
                </router-link>
                <span v-else class="category-name">{{category.name}}</span>
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
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
      <go-top/>
    </section>
  </div>
</template>

<script>
  import AppHeader from './header';
  import GoTop from './go-top';
  import {getCategories} from '../api/category';
  import {number2segment} from "../utils/project";
  import _ from 'lodash';
  import {mapGetters} from 'vuex';

  export default {
    name      : "home",
    components: {
      'app-header': AppHeader,
      'go-top'    : GoTop
    },
    computed  : {
      ...mapGetters({
        isAdmin: 'isAdmin'
      })
    },
    data() {
      return {
        categories   : [],
        activeName   : [],
        pageIndex    : 1,
        total        : 1000,
        pageSize     : 20,
        searchProject: ''
      }
    },
    created() {
      this.getCategories();
    },
    methods   : {
      getCategories: _.debounce(function () {
        return getCategories({
          pageIndex : this.pageIndex,
          pageSize  : this.pageSize,
          getProject: 1,
          search    : this.searchProject
        })
          .then(result => {
            this.categories = result.categories.rows;
            this.total      = result.categories.count;
            for (let i = 0; i < this.categories.length; i++) {
              this.activeName.push(this.categories[i].id);
              for (let j = 0; j < this.categories[i].Projects.length; j++) {
                let [inner, middle, outer]             = number2segment(this.categories[i].Projects[j].segment);
                this.categories[i].Projects[j].segment = {
                  inner: inner, middle: middle, outer: outer
                };
              }
            }
            this.$notify({
              type   : 'success',
              title  : 'success',
              message: 'get categories from server'
            });
          })
          .catch(err => {
          });
      }, 500),
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getCategories();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'pageChange',
        //   message: val,
        // });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getCategories();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'sizeChange',
        //   message: val,
        // });
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

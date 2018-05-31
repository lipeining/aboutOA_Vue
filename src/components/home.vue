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
        <el-row>
          <el-select
            v-model="targetOrder"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="getCategories">
            <el-option
              v-for="item in categoryNames"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-row>
        <el-row :gutter="20" v-if="categories.length">
          <el-col :span="6" v-for="category in categories" :key="category.id">
            <el-tooltip effect="dark" :content="category.intro"
                        placement="right-start">
              <span class="category-name">{{category.name}}</span>
              <!--<i class="header-icon el-icon-info"></i>-->
            </el-tooltip>
          </el-col>
        </el-row>
        <el-row v-else>
          no categories
        </el-row>
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

  export default {
    name      : "home",
    components: {
      'app-header': AppHeader,
      'go-top'    : GoTop
    },
    data() {
      return {
        categories   : [],
        categoryNames: [],
        targetOrder  : '',
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
          pageIndex: this.pageIndex,
          pageSize : this.pageSize,
          search   : this.searchProject
        })
          .then(result => {
            this.categories = result.categories.rows;
            this.total      = result.categories.count;
            for (let i = 0; i <= this.categories.length; i++) {
              this.categoryNames.push({
                value: this.categories[i].order,
                label: i + 1
              });
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

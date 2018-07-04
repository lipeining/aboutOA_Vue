<template>
  <div>
    <section class="main">
      <div class="fluid container">
        <el-row class="search-project">
          <el-col :span="6">
            <el-input v-model="searchProject" placeholder="search project"
                      type="text" clearable></el-input>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="6" v-for="category in categories"
                  class="category" :key="category.id">
            <el-popover trigger="hover"
                        placement="top">
              <el-row class="category-intro">
                {{category.intro}}
              </el-row>
              <el-button-group>
                <router-link :to="{name:'projects', params: { categoryId: category.id }}">
                  <el-button type="primary" icon="el-icon-info"></el-button>
                </router-link>
                <el-button type="primary" icon="el-icon-edit"
                           @click="editCateForm(category)"></el-button>
                <el-button type="danger" icon="el-icon-delete"
                           @click="deleteCategory(category.id)"></el-button>
              </el-button-group>
              <el-button slot="reference">{{category.name}}</el-button>
            </el-popover>
          </el-col>
          <el-col :span="6" class="category">
            <el-tooltip class="item" effect="dark" content="new category" placement="right">
              <el-button type="success" @click="addCateForm()" icon="el-icon-plus" circle>
              </el-button>
            </el-tooltip>
          </el-col>
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
    <div>
      <el-dialog :title="getCateFormTitle(category.id)"
                 :visible.sync="categoryFormVisible"
                 :before-close="handleDialogClose">
        <div>
          <el-form auto-complete="on" :model="category" class="category-form"
                   label-width="60px" size="medium"
                   :rules="rules" :ref="setCateFormName(category.id)">
            <el-form-item prop="name" label="name">
              <el-input type="text"
                        v-model="category.name" placeholder="Please enter name">
              </el-input>
            </el-form-item>
            <el-form-item prop="intro" label="intro">
              <el-input type="textarea" v-model="category.intro"
                        :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please enter intro">
              </el-input>
            </el-form-item>
            <el-form-item prop="order" label="order" v-if="category.id">
              <el-select
                v-model="category.order"
                :filterable="true"
                :remote="true"
                :automatic-dropdown="true"
                placeholder="请输入关键词"
                :remote-method="getCategoryNames">
                <el-option
                  v-for="item in categoryNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelCateForm()">取 消</el-button>
          <el-button type="primary" @click="submitCateForm(setCateFormName(category.id))">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import GoTop from './go-top';
  import {getCategories, updateCate, createCate, getCategoryNames, delCate} from '../api/category';
  import _ from 'lodash';

  export default {
    name      : "categories",
    components: {
      'go-top': GoTop
    },
    data() {
      const rules = {
        name : [
          {required: true, message: '请输入类别名称'},
          {min: 5, max: 30, message: '长度在 5 到 30 个字符'}
        ],
        intro: [
          {required: true, message: '请输入类别描述'},
          {min: 10, max: 120, message: '长度在 10 到 120 个字符'}
        ],
        order: [
          {required: true, message: ''}
        ]
      };
      return {
        rules              : rules,
        categories         : [],
        categoryNames      : [],
        targetOrder        : '',
        pageIndex          : 1,
        total              : 1000,
        pageSize           : 20,
        category           : {
          id   : 0,
          name : '',
          intro: '',
          order: 0
        },
        categoryFormVisible: false,
        // editable           : true,
        searchProject      : ''
      }
    },
    created() {
      this.getCategories();
    },
    methods   : {
      setCateFormName(id) {
        return 'category' + id;
      },
      handleDialogClose(done) {
        this.cancelCateForm();
        done();
      },
      getCateFormTitle(id) {
        return id ? 'edit category' : 'add category';
      },
      addCateForm() {
        this.categoryFormVisible = true;
      },
      editCateForm(category) {
        // do we need to deep clone project?
        this.category            = _.cloneDeep(category);
        let index                = this.categories.findIndex((c) => {
          return category.id === c.id;
        });
        this.category.order      = (this.pageIndex - 1) * this.pageSize + index + 1;
        this.categoryFormVisible = true;
        this.getCategoryNames();
      },
      cancelCateForm() {
        // console.log(this.$refs);
        this.categoryFormVisible = false;
        this.category            = {
          id   : 0,
          name : '',
          intro: '',
          order: ''
        };
      },
      submitCateForm(formName) {
        // form validate
        console.log(this.$refs);
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            if (this.category.id) {
              // edit and then update
              // this.categoryFormVisible = false;
              updateCate({category: JSON.stringify(this.category)})
                .then(result => {
                  this.cancelCateForm();
                  this.getCategories();
                  this.$notify({
                    type   : 'success',
                    title  : 'success',
                    message: 'category update'
                  });
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'error',
                    message: err
                  })
                });
            } else {
              // new and add category
              createCate({
                name : this.category.name,
                intro: this.category.intro
              })
                .then(result => {
                  this.cancelCateForm();
                  this.getCategories();
                  this.$notify({
                    type   : 'success',
                    title  : 'success',
                    message: 'category update'
                  });
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'error',
                    message: err
                  })
                });
            }
          }
        })
      },
      getCategoryNames() {
        getCategoryNames()
          .then(result => {
            this.categoryNames = [];
            for (let i = 0; i < result.categoryNames.length; i++) {
              this.categoryNames.push({
                value: result.categoryNames[i].order,
                label: i + 1
              });
            }
            this.$notify({
              type : 'success',
              title: 'get category names'
            });
          })
          .catch(err => {
            this.$notify.error({
              title  : 'get category names',
              message: err
            })
          });
      },
      getCategories: _.debounce(function () {
        return getCategories({
          pageIndex : this.pageIndex,
          pageSize  : this.pageSize,
          getProject: 0,
          search    : this.searchProject
        })
          .then(result => {
            this.categories = result.categories.rows;
            this.total      = result.categories.count;
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
      },
      deleteCategory(id) {
        let confirmStr = '此操作将永久删除该类别及对应的项目, 是否继续?';
        this.$confirm(confirmStr, '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning',
          center           : true
        }).then(() => {
          delCate({
            id: id
          })
            .then(result => {
              let start = this.categories.findIndex((category) => {
                return category.id === id;
              });
              console.log('start:' + start);
              // delete head or tail or middle
              if (start === this.categories.length - 1) {
                this.categories.pop();
              } else if (start === 0) {
                this.categories.shift();
              } else {
                this.categories.splice(start, 1);
              }
              this.$notify({
                type   : 'success',
                title  : 'delete',
                message: 'category delete id' + id + '-start:' + start
              });
            })
            .catch(err => {
              this.$notify({
                type   : 'error',
                title  : 'delete',
                message: 'category delete' + id
              });
            });
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          });
        });
      },
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
    margin: 1em;
  }

  .category-form {
    margin: 1em;
  }

  .category-name {
    float: left;
  }

  .category-intro {
    margin-bottom: 1em;
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


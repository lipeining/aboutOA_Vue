<template>
  <div>
    <h1>categories</h1>
    <div class="cateWrap">
      <el-form auto-complete="on" :model="category" label-width="60px" size="medium"
               :inline="true" :rules="rules" ref="cateForm">
        <el-form-item label="name" prop="name">
          <el-input style="width:10em" type="text"
                    v-model="category.name" placeholder="Please enter name">
          </el-input>
        </el-form-item>
        <el-form-item label="intro" prop="intro">
          <el-input type="text" v-model="category.intro" placeholder="Please enter intro">
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="submit('cateForm')">
          new category
        </el-button>
      </el-form>
    </div>

    <div class="checkbox">
      <el-checkbox v-model="draggable">Enable drag and drop</el-checkbox>
      <el-checkbox v-model="editable">Enable edit categories</el-checkbox>
      <el-button type="success" size="mini" @click="updateCategoryOrder">
        update category order
      </el-button>
    </div>

    <div class="fluid container">
      <el-row :gutter="18">
        <draggable element="div" class="list-group" v-model="categories" :options="categoryOptions"
                   :move="onMove" @start="startDrag" @end="endDrag"
                   @change="handleCateChange">
          <transition-group type="transition">
            <div v-for="category in categories" :key="category.id" class="category">
              <el-form auto-complete="on" :model="category"
                       label-width="60px" size="medium" :disabled="!editable"
                       :inline="true" :rules="rules" :ref="setFormName(category.id)">
                <el-form-item prop="name">
                  <el-input style="width:10em" type="text"
                            v-model="category.name" placeholder="Please enter name">
                  </el-input>
                </el-form-item>
                <el-form-item prop="intro">
                  <el-input type="text" v-model="category.intro" placeholder="Please enter intro">
                  </el-input>
                </el-form-item>
                <el-button type="primary" icon="el-icon-success" circle
                           @click="updateCategory(setFormName(category.id), category.id)">
                </el-button>
                <el-button type="danger" icon="el-icon-delete" circle
                           @click="deleteCategory(category.id)">
                </el-button>
              </el-form>
              <!--<div v-if="category.projects.length">-->
              <!--<div class="col-md-3 project-drag-box">-->
              <!--<draggable class="list-group" element="span" v-model="category.projects"-->
              <!--:options="projectOptions" :move="onMove" @start="startDrag" @end="endDrag">-->
              <!--<transition-group type="transition" class="list-group">-->
              <!--<div v-for="project in category.projects" :key="project.id"-->
              <!--class="grid-content bg-purple-dark">-->
              <!--<div class="grid-content bg-purple-light">-->
              <!--<span class="badge">{{project.name}}</span>-->
              <!--</div>-->
              <!--<el-button type="danger" icon="el-icon-delete" circle></el-button>-->
              <!--</div>-->
              <!--</transition-group>-->
              <!--</draggable>-->
              <!--</div>-->
            </div>
            <!--</div>-->
          </transition-group>
        </draggable>
      </el-row>
    </div>
  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import {getCategories, createCate, updateCate, delCate} from '../api/category';
  import _ from 'lodash';

  export default {
    name      : "categories",
    components: {
      draggable,
    },
    data() {
      // form validate rules
      const rules = {
        name : [
          {required: false, message: '请输入类别名称'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        intro: [
          {required: false, message: '请输入类别描述'},
          {min: 20, max: 120, message: '长度在 20 到 120 个字符'}
        ]
      };
      return {
        category       : {
          name : '',
          intro: ''
        },
        rules          : rules,
        categories     : [],
        editable       : true,
        draggable      : true,
        isDragging     : false,
        delayedDragging: false
      }
    },
    created() {
      this.getCategories();
    },
    methods   : {
      setFormName(id) {
        return 'Form' + id;
      },
      deleteCategory(id) {
        delCate({
          id: id
        })
          .then(result => {
            let start = this.categories.findIndex((category) => {
              return category.id === id;
            });
            console.log('start:' + start);
            // handle the rest category's order let them --
            for (let i = start + 1; i < this.categories.length; i++) {
              this.categories[i].order -= 1;
              this.categories[i].changed = 1;
            }
            // delete head or tail or middle
            if (start === this.categories.length - 1) {
              this.categories.pop();
            } else if (start === 0) {
              this.categories.shift();
            } else {
              this.categories.splice(start, 1);
            }
            // in order to correct the order after start
            // we should update the order
            this.updateCategoryOrder();
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
      },
      getCategories() {
        getCategories()
          .then(result => {
            // add a property of this.categories
            let changed     = {
              changed: 0
            };
            this.categories = result.categories.map((category) => {
              // return _.extend(category, changed);
              category['changed'] = 0;
              return category;
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
      },
      updateCategoryOrder() {
        // check the this.categories and update the categories.
        //
        let categories = [];
        for (let i = 0; i < this.categories.length; i++) {
          let category = this.categories[i];
          if (category.changed) {
            categories.push({
              id   : category.id,
              order: category.order
            });
          }
        }
        updateCate({
          categories: JSON.stringify(categories)
        })
          .then(result => {
            this.getCategories();
            this.$notify({
              type   : 'success',
              title  : 'success',
              message: 'category order update'
            });
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      },
      updateCategory(formName, id) {
        // form validate
        // console.log(this.$refs);
        this.$refs[formName][0].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            // this.$notify({
            //   type   : 'success',
            //   title  : 'success',
            //   message: 'category update' + id + '-' + formName
            // });
            // return an array that only contain the exact category.id
            // changed how to solve this ?
            let list     = this.categories.filter((category) => {
              return category.id === id;
            });
            let category = [];
            // here we should not update the order !
            category.push(_.omit(list[0], ['changed', 'order']));
            console.log('in form update' + JSON.stringify(category));
            updateCate({categories: JSON.stringify(category)})
              .then(result => {
                this.$notify({
                  type   : 'success',
                  title  : 'success',
                  message: 'category update' + category
                });
              })
              .catch(err => {
                this.$notify.error({
                  title  : 'error',
                  message: err
                })
              });
          }
        })
      },
      submit(formName) {
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            createCate(this.category)
              .then(result => {
                this.category = {
                  name : '',
                  intro: ''
                };
                this.getCategories();
                this.$notify({
                  type   : 'success',
                  title  : 'success',
                  message: 'category create'
                });
              })
              .catch(err => {
                this.$notify.error({
                  title  : 'error',
                  message: err
                })
              });
          }
        })
      },
      // focus on change event and move event
      startDrag() {
        this.isDragging = true;
      },
      endDrag() {
        this.isDragging = false;
      },
      handleCateChange(evt) {
        // two result each of them should handle the circle element between new and old index
        // first newIndex > oldIndex :
        // the circle should --
        // first newIndex < oldIndex :
        // the circle should ++
        // console.log(evt.moved);
        if (evt.moved) {
          let newIndex = evt.moved.newIndex;
          let oldIndex = evt.moved.oldIndex;
          let element  = evt.moved.element;

          // set the drag element's order
          this.categories[newIndex].order += newIndex - oldIndex;
          this.categories[newIndex].changed = 1;
          // element.order += newIndex - oldIndex;
          if (newIndex > oldIndex) {
            for (let i = oldIndex; i < newIndex; i++) {
              this.categories[i].order -= 1;
              this.categories[i].changed = 1;
            }
          } else {
            for (let i = newIndex + 1; i <= oldIndex; i++) {
              this.categories[i].order += 1;
              this.categories[i].changed = 1;
            }
          }
        } else {
          // do nothing we should only handle moved event
        }
      },
      handleProChange(evt) {

      },
      orderList() {
        // this.list = this.list.sort((one, two) => {
        // return one.order - two.order;
        // })
      },
      onMove({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return true;
        // return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      }
    },
    computed  : {
      categoryOptions() {
        return {
          group     : 'category',
          disabled  : !this.draggable,
          ghostClass: 'ghost'
        };
      },
      projectOptions() {
        return {
          group     : 'project',
          disabled  : !this.draggable,
          ghostClass: 'ghost'
        };
      }
    },
    watch     : {
      isDragging(newValue) {
        if (newValue) {
          this.delayedDragging = true;
          return
        }
        this.$nextTick(() => {
          this.delayedDragging = false
        })
      }
    }
  }
</script>

<style scoped>
  .cateWrap {
    flex: 1;
    max-width: 45rem;
    font-size: .875rem;
  }

  .el-col {
    border-radius: 4px;
  }

  .ghost {
    opacity: .5;
    background: #C8EBFB;
  }

  .checkbox {
    margin: 10px;
  }

  .category {
    border: 1px;
  }

  .list-group {
    min-height: 20px;
  }

  .project-drag-box {
    min-height: 50px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
</style>

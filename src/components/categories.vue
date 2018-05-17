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
    </div>

    <div class="fluid container">
      <el-row :gutter="18">
        <draggable element="div" class="list-group" v-model="categories" :options="categoryOptions"
                   :move="onMove" @start="startDrag" @end="endDrag"
                   @update="handleCateUpdate" @change="handleCateChange">
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
  import {createCate, updateCate, delCate} from '../api/category';

  export default {
    name      : "categories",
    components: {
      draggable,
    },
    data() {
      // form validate rules
      const rules = {
        name : [
          {required: true, message: '请输入类别名称'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        intro: [
          {required: true, message: '请输入类别描述'},
          {min: 20, max: 120, message: '长度在 20 到 120 个字符'}
        ]
      };
      return {
        category       : {
          name : '',
          intro: ''
        },
        rules          : rules,
        categories     : [
          {
            id      : 1,
            name    : 'category-1',
            order   : 1,
            projects: [
              {
                id   : 10,
                name : 'project-10',
                order: 10
              },
              {
                id   : 11,
                name : 'project-11',
                order: 11
              },
              {
                id   : 12,
                name : 'project-12',
                order: 12
              }
            ]
          },
          {
            id      : 2,
            name    : 'category-2',
            order   : 2,
            projects: [
              {
                id   : 20,
                name : 'project-20',
                order: 20
              },
              {
                id   : 21,
                name : 'project-21',
                order: 21
              },
              {
                id   : 22,
                name : 'project-22',
                order: 22
              }
            ]
          },
          {
            id      : 3,
            name    : 'category-3',
            order   : 3,
            projects: []
          },
          {
            id      : 4,
            name    : 'category-4',
            order   : 4,
            projects: []
          }
        ],
        editable       : true,
        draggable      : true,
        isDragging     : false,
        delayedDragging: false
      }
    },
    created() {

    },
    methods   : {
      setFormName(id) {
        return 'Form' + id;
      },
      deleteCategory(id) {
        this.$notify({
          type   : 'error',
          title  : 'delete',
          message: 'category delete' + id
        });
      },
      updateCategory(formName, id) {
        // form validate
        // console.log(this.$refs);
        // this.$notify({
        //   type   : 'success',
        //   title  : 'success',
        //   message: 'this.$refs' + this.$refs + '-' + formName
        // });
        //
        this.$refs[formName][0].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            this.$notify({
              type   : 'success',
              title  : 'success',
              message: 'category update' + id + '-' + formName
            });
            // updateCate(this.categories[id])
            //   .then(result => {
            //     this.category = {};
            //     this.$notify({
            //       type   : 'success',
            //       title  : 'success',
            //       message: 'category create'
            //     });
            //   })
            //   .catch(err => {
            //     this.$notify.error({
            //       title  : 'error',
            //       message: err
            //     })
            //   });
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
                this.category = {};
                this.$notify({
                  type   : 'success',
                  title  : 'success',
                  message: 'category create'
                })
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
      handleCateChange(evt){
        console.log('change');
        console.log(evt.added);
        console.log(evt.removed);
        console.log(evt.moved);
      },
      handleCateUpdate(evt){
        console.log('update');
        console.log(evt);
        console.log(evt.item);
      },
      orderList() {
        // this.list = this.list.sort((one, two) => {
        // return one.order - two.order;
        // })
      },
      onMove({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      updateVal(evt) {
        // console.log('update evt' + evt.to);
        // console.log(JSON.stringify(evt));
        // console.log(evt);
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

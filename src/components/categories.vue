<template>
  <div class="margin-self">
    <h1>categories</h1>
    <div class="cateWrap">
      <el-form auto-complete="on" :model="category" label-width="60px"
               class="category-form" size="medium"
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
        <draggable element="div" class="category-group" v-model="categories" :options="categoryOptions"
                   :move="onMove" @start="startDrag" @end="endDrag"
                   @change="handleCateChange">
          <transition-group type="transition" class="list-group">
            <el-row v-for="category in categories" :key="category.id" class="category">
              <el-row class="category-form-row">
                <el-form auto-complete="on" :model="category" class="category-form"
                         label-width="60px" size="medium" :disabled="!editable"
                         :inline="true" :rules="rules" :ref="setCateFormName(category.id)">
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
                             @click="updateCategory(setCateFormName(category.id), category.id)">
                  </el-button>
                  <el-button type="danger" icon="el-icon-delete" circle
                             @click="deleteCategory(category.id)">
                  </el-button>
                </el-form>
              </el-row>
              <!--<div v-if="category.Projects.length">-->
              <!--<div class="project-drag-box fluid container">-->
              <!--<draggable class="list-group" element="div" v-model="category.Projects"-->
              <!--:options="projectOptions" :move="onMove" @start="startDrag" @end="endDrag">-->
              <!--<transition-group type="transition" class="project-group col-md-3 flex">-->
              <!--<div v-for="project in category.Projects" :key="project.id"-->
              <!--class="project-content ">-->
              <!--<div class="grid-content ">-->
              <!--<span class="badge">{{project.name}}</span>-->
              <!--</div>-->
              <!--<el-button type="danger" icon="el-icon-delete"></el-button>-->
              <!--</div>-->
              <!--</transition-group>-->
              <!--</draggable>-->
              <!--&lt;!&ndash;</div>&ndash;&gt;-->
              <!--<div class="project-group col-md-3 flex">-->
              <!--<el-button type="success" @click="">-->
              <!--<i class="el-icon-plus"></i> new project-->
              <!--</el-button>-->
              <!--</div>-->
              <!--</div>            -->
              <el-row :gutter="20" class="project-content">
                <draggable class="list-group" element="div" v-model="category.Projects"
                           :options="projectOptions" :move="onMove"
                           @change="handleProChange" @start="startDrag" @end="endDrag"
                           @add="handleProAdd" @remove="handleProRemove" @update="handleProUpdate">
                  <transition-group type="transition" class="project-group">
                    <el-col :span="6" v-for="project in category.Projects" :key="project.id"
                            class="project-content ">
                      <div class="grid-content">
                        <span class="badge">{{project.name}}</span>
                        <el-button type="danger" icon="el-icon-delete"></el-button>
                      </div>
                    </el-col>
                  </transition-group>
                </draggable>
                <!--</div>-->
                <el-col :span="6">
                  <el-button type="success" @click="">
                    <i class="el-icon-plus"></i> new project
                  </el-button>
                </el-col>
              </el-row>
              <!--</div>-->
            </el-row>
          </transition-group>
        </draggable>
      </el-row>
    </div>

    <!-- Form for new project-->
    <!--<div>-->
    <!--<el-button type="text" @click="projectFormVisible = true">-->
    <!--<i class="el-icon-plus"></i> new project-->
    <!--</el-button>-->

    <!--<el-dialog title="new project" :visible.sync="projectFormVisible">-->
    <!--<div slot="footer" class="dialog-footer">-->
    <!--<el-button @click="projectFormVisible = false">取 消</el-button>-->
    <!--<el-button type="primary" @click="projectFormVisible = false">确 定</el-button>-->
    <!--</div>-->
    <!--</el-dialog>-->
    <!--</div>-->
    <div>
      <el-form :model="project" label-width="70px" auto-complete="on"
               :rules="projectRules" :ref="setProFormName(1)">
        <!--'name', 'order', 'intro', 'url', 'hint', 'logo', 'categoryId', 'segment'-->
        <el-form-item label="name" prop="name">
          <el-input v-model="project.name" type="text"></el-input>
        </el-form-item>
        <el-form-item label="intro" prop="intro">
          <el-input v-model="project.intro" type="text"></el-input>
        </el-form-item>
        <el-form-item label="logo" prop="logo">
          <el-input v-model="project.logo" type="text"></el-input>
        </el-form-item>
        <el-form-item label="url" prop="url">
          <el-input v-model="project.url" type="text"></el-input>
        </el-form-item>
        <el-form-item label="hint" prop="hint">
          <el-input v-model="project.hint" type="text"></el-input>
        </el-form-item>
        <el-form-item label="segment" prop="segment">
          <el-input v-model="project.segment" type="text"></el-input>
        </el-form-item>
        <el-button @click="resetProjectForm(setProFormName(1))">取 消</el-button>
        <el-button type="primary" @click="createPro(setProFormName(1), categories[0].id)">确 定</el-button>
      </el-form>
    </div>

  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import {getCategories, createCate, updateCate, delCate} from '../api/category';
  import {createPro, updatePro} from '../api/project';
  import _ from 'lodash';

  export default {
    name      : "categories",
    components: {
      draggable,
    },
    data() {
      // form validate rules
      const rules        = {
        name : [
          {required: true, message: '请输入类别名称'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        intro: [
          {required: true, message: '请输入类别描述'},
          {min: 20, max: 120, message: '长度在 20 到 120 个字符'}
        ]
      };
      const projectRules = {};
      let project        = {
        name      : '',
        intro     : '',
        logo      : '',
        segment   : '',
        url       : '',
        hint      : '',
        categoryId: 0
      };
      return {
        category          : {
          name : '',
          intro: ''
        },
        project           : project,
        rules             : rules,
        projectRules      : projectRules,
        categories        : [],
        editable          : true,
        draggable         : true,
        isDragging        : false,
        projectFormVisible: false,
        // projectFormVisible: true,
        delayedDragging   : false
      }
    },
    created() {
      this.getCategories();
    },
    methods   : {
      setCateFormName(id) {
        return 'category' + id;
      },
      setProFormName(id) {
        this.projectFormVisible = true;
        return 'project' + id;
      },
      resetProjectForm(formName) {
        this.projectFormVisible = false;
        this.$refs[formName].resetFields();
      },
      createPro(formName, categoryId) {
        console.log(JSON.stringify(this.project));
        this.project.categoryId = categoryId;
        createPro(this.project)
          .then(result => {
            this.$refs[formName].resetFields();
            this.getCategories();
            this.$notify({
              type   : 'info',
              title  : 'create project',
              message: categoryId
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'create project',
              message: err
            });
          });
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
              // and then set the changed of projects too.
              category['changed'] = 0;
              category.Projects   = category.Projects.map((project) => {
                project['changed'] = 0;
                return project;
              });
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
            // this.getCategories();
            // we can just handle the changed no need to getCategories();
            for (let i = 0; i < this.categories.length; i++) {
              this.categories[i].changed = 0;
            }
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

      updateProjectOrder() {
        // check the this.categories and update the categories.
        // care for the name because of the clone is not deep clone
        let projects = [];
        for (let i = 0; i < this.categories.length; i++) {
          let Category = this.categories[i];
          let Projects = Category.Projects;
          for (let j = 0; j < Projects.length; j++) {
            let project = Projects[j];
            if (project.changed) {
              projects.push({
                id        : project.id,
                order     : project.order,
                categoryId: project.categoryId
              });
            }
          }
        }
        updatePro({
          projects: JSON.stringify(projects)
        })
          .then(result => {
            // this.getCategories();
            // we can just handle the changed no need to getCategories();
            for (let i = 0; i < this.categories.length; i++) {
              for (let j = 0; j < this.categories[i].Projects.length; j++) {
                this.categories[i].Projects[j].changed = 0;
              }
            }
            this.$notify({
              type   : 'success',
              title  : 'success',
              message: 'project order update'
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
                // this.category = {
                //   name : '',
                //   intro: ''
                // };
                this.$refs[formName].resetFields();
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
          // update order here
          this.updateCategoryOrder();
        } else {
          // do nothing we should only handle moved event
        }
      },
      handleProChange(evt) {
        // we can change the element here !
        // for example : element.categoryId = 100;
        if (evt.moved) {
          let newIndex = evt.moved.newIndex;
          let oldIndex = evt.moved.oldIndex;
          let element  = evt.moved.element;
          console.log(JSON.stringify(element));

          // set the drag element's order
          // first get the right project list
          let Index = this.categories.findIndex((category) => {
            return category.id === element.categoryId;
          });
          // let categories = [{
          //   id      : 1,
          //   projects: [{
          //     id: 1, order: 1, categoryId: 1
          //   }, {
          //     id: 2, order: 2, categoryId: 1
          //   }]
          // }];

          // set the moved project order and changed
          this.categories[Index].Projects[newIndex].order += newIndex - oldIndex;
          this.categories[Index].Projects[newIndex].changed = 1;
          // element.order += newIndex - oldIndex;
          // set the circle project order and changed
          if (newIndex > oldIndex) {
            for (let i = oldIndex; i < newIndex; i++) {
              this.categories[Index].Projects[i].order -= 1;
              this.categories[Index].Projects[i].changed = 1;
            }
          } else {
            for (let i = newIndex + 1; i <= oldIndex; i++) {
              this.categories[Index].Projects[i].order += 1;
              this.categories[Index].Projects[i].changed = 1;
            }
          }
          // update order here
          this.updateProjectOrder();
        } else if (evt.added) {
          console.log(evt.added);
          // do nothing we should only handle moved event
        } else if (evt.removed) {
          console.log(evt.removed);
        } else {

        }
      },
      handleProAdd(event) {
        // console.log('add');
        // console.log(event);
      },
      handleProRemove(event) {
        // console.log('remove');
        // console.log(event);
      },
      handleProUpdate(event) {
        // console.log('update');
        // console.log(event);
      },
      openProjectForm(categoryId) {
        this.projectFormVisible = true;
        this.project.categoryId = categoryId;
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
  .margin-self {
    margin: 1em;
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }

  .cateWrap {
    margin: 1em;
    max-width: 45rem;
    font-size: .875rem;
  }

  .checkbox {
    margin: 10px;
  }

  .category {
    border: 1px solid #2b3b49;
    margin: 1em;
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }

  .category-form-row {
    border: 1px solid paleturquoise;
    margin: 1em;
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }

  .category-form {
    margin: 1em;
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }

  .category-group {
    min-height: 20px;
    border: solid 1px palevioletred;
    margin: 1em;
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }

  .list-group {
    min-height: 20px;
  }

  .project-group {
    min-height: 20px;
    margin: 1em;
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }

  .project-content {
    min-height: 20px;
    margin: 1em;
    /*border: solid 1px palegoldenrod;*/
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }

  .project-drag-box {
    min-height: 50px;
    border: solid 1px lightyellow;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    margin: 1em;
    /*margin-bottom: 1em;*/
    /*margin-top: 1em;*/
    /*margin-left: 1em;*/
    /*margin-right: 1em;*/
  }
</style>

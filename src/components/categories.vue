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

    <el-row :gutter="20">
      <el-col :span="6" class="searchProject">
        <el-input v-model="searchProject" placeholder="search project"
                  type="text" clearable></el-input>
      </el-col>
      <el-col :span="7" class="checkbox">
        <el-checkbox v-model="editable">Enable edit categories</el-checkbox>
      </el-col>
      <el-col :span="7" class="checkbox">
        <el-checkbox v-model="draggable">Enable drag and drop</el-checkbox>
      </el-col>
    </el-row>

    <div class="fluid container">
      <el-row :gutter="22">
        <draggable element="div" class="category-group" v-model="categories" :options="categoryOptions"
                   :move="onMove" @start="startDrag" @end="endDrag"
                   @change="handleCateChange">
          <transition-group type="transition" class="list-group">
            <el-row v-for="category in categories" :key="category.id" class="category">
              <el-collapse class="collapse-self">
                <el-collapse-item-about :name="category.id">
                  <template slot="title">
                    <!--<el-row class="category-collapse-form-row">-->
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
                      <el-form-item>
                        <el-button type="primary" icon="el-icon-success"
                                   class="icon-size-36" circle
                                   @click="updateCategory(setCateFormName(category.id), category.id)">
                        </el-button>
                      </el-form-item>
                      <el-form-item>
                        <el-button type="danger" icon="el-icon-delete"
                                   class="icon-size-36" circle
                                   @click="deleteCategory(category.id)">
                        </el-button>
                      </el-form-item>
                    </el-form>
                    <!--</el-row>-->
                  </template>
                  <el-row :gutter="20" class="project-content">
                    <draggable class="list-group" element="div" v-model="category.Projects"
                               :options="projectOptions" :move="onMove"
                               @change="handleProChange" @start="startDrag" @end="endDrag"
                               @add="handleProAdd" @remove="handleProRemove" @update="handleProUpdate">
                      <transition-group type="transition" class="project-group">
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
                              <el-row>
                                <el-button type="success" icon="el-icon-edit-outline"
                                           @click="editProForm(project)">
                                </el-button>
                                <el-button type="danger" icon="el-icon-delete"
                                           @click="deleteProject(project.id, project.categoryId)">
                                </el-button>
                              </el-row>
                              <img v-if="project.logo" slot="reference"
                                   :src="project.logo" :alt="project.logo"
                                   class="logo">
                            </el-popover>
                          </div>
                        </el-col>
                      </transition-group>
                    </draggable>
                    <!--</div>-->
                    <el-col :span="6">
                      <el-tooltip class="item" effect="dark" content="new project" placement="right">
                        <el-button type="success" @click="addProForm(category.id)" icon="el-icon-plus" circle>
                        </el-button>
                      </el-tooltip>
                    </el-col>
                  </el-row>
                </el-collapse-item-about>
              </el-collapse>
              <!--</div>-->
            </el-row>
          </transition-group>
        </draggable>
      </el-row>
      <go-top/>
    </div>

    <!-- Form for new project-->
    <div>
      <el-dialog title="new project" :visible.sync="projectFormVisible" :before-close="handleDialogClose">
        <div>
          <el-form :model="project" label-width="70px" auto-complete="on"
                   :rules="projectRules" :ref="setProFormName(project.id)">
            <!--'name', 'order', 'intro', 'url', 'hint', 'logo', 'categoryId', 'segment'-->
            <el-form-item label="name" prop="name">
              <el-input v-model="project.name" type="text"></el-input>
            </el-form-item>
            <el-form-item label="hint" prop="hint">
              <el-input v-model="project.hint" type="text"></el-input>
            </el-form-item>
            <el-form-item label="intro" prop="intro">
              <el-input v-model="project.intro" type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"></el-input>
            </el-form-item>
            <el-form-item label="logo" prop="logo">
              <el-upload
                class="avatar-uploader"
                ref="uploadLogo"
                :multiple="false"
                :show-file-list="false"
                :data="setUploadData(0)"
                action="/api/v1/projectimage"
                :before-upload="beforeLogoUpload"
                :on-error="handleLogoError"
                :on-success="uploadLogo">
                <img v-if="project.logo" :src="project.logo" :alt="project.logo" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item>
              <el-switch v-model="urlType"
                         active-text="QR code"
                         inactive-text="web url">
              </el-switch>
            </el-form-item>

            <el-form-item v-if="isQRCode()" label="code" prop="QRCode">
              <el-upload
                class="avatar-uploader"
                ref="uploadQRCode"
                :multiple="false"
                :show-file-list="false"
                :data="setUploadData(1)"
                action="/api/v1/projectimage"
                :before-upload="beforeLogoUpload"
                :on-error="handleLogoError"
                :on-success="uploadQRCode">
                <img v-if="project.QRCode" :src="project.QRCode"
                     :alt="project.QRCode" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item label="url" prop="url" v-else>
              <el-input v-model="project.url" type="text"
                        placeholder="web url"></el-input>
            </el-form-item>
            <el-form-item label="segment" prop="segment">
              <el-checkbox v-model="project.segment.inner">inner</el-checkbox>
              <el-checkbox v-model="project.segment.middle">middle</el-checkbox>
              <el-checkbox v-model="project.segment.outer">outer</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelProForm(1, 1)">取 消</el-button>
          <el-button type="primary" @click="submitProForm(setProFormName(project.id))">确 定</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
  import draggable from 'vuedraggable';
  import GoTop from './go-top';
  import {getCategories, createCate, updateCate, delCate} from '../api/category';
  import {createPro, updatePro, updateProjects, delPro, removeImage} from '../api/project';
  import {number2segment, segment2number} from "../utils/project";
  import _ from 'lodash';

  export default {
    name      : "categories",
    components: {
      'draggable': draggable,
      'go-top'   : GoTop
    },
    data() {
      // form validate rules
      const rules        = {
        name : [
          {required: true, message: '请输入类别名称'},
          {min: 5, max: 30, message: '长度在 5 到 30 个字符'}
        ],
        intro: [
          {required: true, message: '请输入类别描述'},
          {min: 10, max: 120, message: '长度在 10 到 120 个字符'}
        ]
      };
      let validateUrl    = (rule, value, callback) => {
        if (value === '' && this.project.QRCode === '') {
          callback(new Error('url and QR code should not be empty at the same time!'));
        }
        callback();
      };
      let validateQRCode = (rule, value, callback) => {
        if (value === '' && this.project.url === '') {
          callback(new Error('url and QR code should not be empty at the same time!'));
        }
        callback();
      };
      const projectRules = {
        name  : [
          {required: true, message: '请输入项目名称'},
          {min: 5, max: 30, message: '长度在 5 到 30 个字符'}
        ],
        intro : [
          {required: true, message: '请输入项目描述'},
          {min: 10, max: 120, message: '长度在 10 到 120 个字符'}
        ],
        url   : [
          {required: false, type: 'url'},
          {validator: validateUrl, trigger: 'blur'}
        ],
        QRCode: [
          {required: false},
          {validator: validateQRCode, trigger: 'blur'}
        ],
        hint  : [
          {required: true, message: '请输入项目hint'},
          {min: 10, max: 100, message: '长度在 10 到 100 个字符'}
        ]
      };
      let project        = {
        changeOrder : 0,
        changeLogo  : 0,
        changeQRCode: 0,
        id          : 0,
        name        : '',
        intro       : '',
        logo        : '',
        segment     : {
          inner : 0,
          middle: 0,
          outer : 0
        },
        url         : '',
        QRCode      : '',
        hint        : '',
        categoryId  : 0
      };
      return {
        category          : {
          name : '',
          intro: ''
        },
        searchProject     : '',
        project           : project,
        urlType           : false,
        rules             : rules,
        projectRules      : projectRules,
        categories        : [],
        activeName        : [],
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
        return 'project' + id;
      },
      handleDialogClose(done) {
        this.cancelProForm(1, 1);
        done();
      },
      isQRCode() {
        return this.urlType;
      },
      cancelProForm(removeUrl, removeQRCode) {
        // console.log(this.$refs);
        this.projectFormVisible = false;
        // don't need to reset form , just reset the this.project!
        // this.$refs[formName].resetFields();
        let logoUrl   = this.project.logo;
        let QRCodeUrl = this.project.QRCode;
        // for cancel form and remove the unused logoUrl and QRCodeUrl
        if (removeUrl && logoUrl && this.project.changeLogo) {
          this.removeImage(logoUrl);
        }
        if (removeQRCode && QRCodeUrl && this.project.changeQRCode) {
          this.removeImage(QRCodeUrl);
        }
        this.project = {
          changeOrder : 0,
          changeLogo  : 0,
          changeQRCode: 0,
          id          : 0,
          name        : '',
          intro       : '',
          logo        : '',
          segment     : {
            inner : 0,
            middle: 0,
            outer : 0
          },
          url         : '',
          QRCode      : '',
          hint        : '',
          categoryId  : 0
        };
        // this.$notify({
        //   type   : 'info',
        //   title  : 'cancel project form',
        //   message: this.project
        // });
      },
      addProForm(categoryId) {
        this.project.categoryId = categoryId;
        this.projectFormVisible = true;
        this.$notify({
          type   : 'info',
          title  : 'add project form',
          message: this.project
        });
      },
      editProForm(project) {
        // do we need to deep clone project?
        this.project            = _.cloneDeep(project);
        this.urlType            = this.project.QRCode ? 1 : 0;
        this.projectFormVisible = true;
        this.$notify({
          type   : 'success',
          title  : 'add project form',
          message: this.project
        });
      },
      submitProForm(formName) {
        // use edit and this.project.id detect if we are create a project or edit a project
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // for create project
            if (this.project.id === 0) {
              // here we should not create the id !
              let project = _.omit(this.project,
                ['id', 'changeOrder', 'changeLogo', 'changeQRCode', 'order']
              );
              // reformat the project.segment!

              project.segment            = segment2number(project.segment);
              let [inner, middle, outer] = number2segment(project.segment);

              let removeQRCode = 0;
              if (this.urlType) {
                // should send QR code
                project['url'] = '';
              } else {
                // should send url
                project['QRCode'] = '';
                removeQRCode      = 1;
              }
              console.log(JSON.stringify(project));
              // this.$notify({
              //   type   : 'success',
              //   title  : 'create project',
              //   message: `segment:${project.segment}:${inner}-${middle}-${outer}`
              // });
              createPro(project)
                .then(result => {
                  this.cancelProForm(0, removeQRCode);
                  this.getCategories();
                  this.$notify({
                    type   : 'success',
                    title  : 'create project',
                    message: `segment:${project.segment}:${inner}-${middle}-${outer}`
                  });
                })
                .catch(err => {
                  this.$notify({
                    type   : 'error',
                    title  : 'create project',
                    message: err
                  });
                });
            } else {

              // here we should not update the order, changeOrder, categoryId!
              let project = _.omit(this.project,
                ['changeOrder', 'order', 'categoryId', 'changeLogo', 'changeQRCode']
              );

              project.segment = segment2number(project.segment);

              let removeQRCode = 0;
              if (this.urlType) {
                // should send QR code
                project['url'] = '';
              } else {
                // should send url
                project['QRCode'] = '';
                removeQRCode      = 1;
              }

              console.log('in form update project' + JSON.stringify(project));
              console.log('removeQRCode:' + removeQRCode);
              // this.cancelProForm(0, removeQRCode);
              updatePro({project:JSON.stringify(project)})
                .then(result => {
                  // success update the project!
                  this.cancelProForm(0, removeQRCode);
                  this.getCategories();
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'update project',
                    message: err
                  });
                });
            }
          }
        });
      },
      deleteProject(id, categoryId) {
        this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning',
          center           : true
        }).then(() => {
          delPro({
            id: id
          })
            .then(result => {
              // first find the category
              let cateIndex = this.categories.findIndex((category) => {
                return category.id === categoryId;
              });
              // first find the project
              let proIndex  = this.categories[cateIndex].Projects.findIndex((project) => {
                return project.id === id;
              });
              console.log('del project cateIndex-proIndex:' + cateIndex + '-' + proIndex);
              // handle the rest project's order let them --
              for (let i = proIndex + 1; i < this.categories[cateIndex].Projects.length; i++) {
                this.categories[cateIndex].Projects[i].order -= 1;
                this.categories[cateIndex].Projects[i].changeOrder = 1;
              }
              // delete head or tail or middle
              if (proIndex === this.categories[cateIndex].Projects.length - 1) {
                this.categories[cateIndex].Projects.pop();
              } else if (proIndex === 0) {
                this.categories[cateIndex].Projects.shift();
              } else {
                this.categories[cateIndex].Projects.splice(proIndex, 1);
              }
              // in order to correct the order after start
              // we should update the order
              this.updateProjectOrder();
              this.$notify({
                type   : 'success',
                title  : 'delete',
                message: 'project delete id-:cateIndex-proIndex:' + id + '-' + cateIndex + '-' + proIndex
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
      deleteCategory(id) {
        let cateIndex  = this.categories.findIndex((category) => {
          return category.id === id;
        });
        let numOfPro   = this.categories[cateIndex].Projects.length;
        let confirmStr = '此操作将永久删除该类别及对应的' + numOfPro + '个项目, 是否继续?';
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
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          });
        });
      },
      getCategories: _.debounce(function () {
        return getCategories({
          search: this.searchProject
        })
          .then(result => {
            // add a property of this.categories
            // update the project.segment!
            this.categories = result.categories.map((category) => {
              // return _.extend(category, changed);
              // and then set the changed of projects too.
              category['changed'] = 0;
              category.Projects   = category.Projects.map((project) => {
                let [inner, middle, outer] = number2segment(project.segment);
                project['changeOrder']     = 0;
                project['changeLogo']      = 0;
                project['changeQRCode']    = 0;
                project['segment']         = {
                  inner : inner,
                  middle: middle,
                  outer : outer
                };
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
      }, 500),
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
      updateProjectOrder(get) {
        // check the this.categories and update the categories.
        // care for the name because of the clone is not deep clone
        let projects = [];
        for (let i = 0; i < this.categories.length; i++) {
          let Category = this.categories[i];
          let Projects = Category.Projects;
          for (let j = 0; j < Projects.length; j++) {
            let project = Projects[j];
            // care for the categoryId
            if (project.changeOrder) {
              projects.push({
                id        : project.id,
                order     : project.order,
                categoryId: Category.id
              });
            }
          }
        }
        updateProjects({
          projects: JSON.stringify(projects)
        })
          .then(result => {

            if (get) {
              // for evt.removed .care for evt.added!
              // this.getCategories(); should update the project.categoryId;
              for (let i = 0; i < this.categories.length; i++) {
                for (let j = 0; j < this.categories[i].Projects.length; j++) {
                  this.categories[i].Projects[j].changeOrder = 0;
                  this.categories[i].Projects[j].categoryId  = this.categories[i].id;
                }
              }
            } else {
              // here is the evt.moved event!
              // we can just handle the changed no need to getCategories();
              for (let i = 0; i < this.categories.length; i++) {
                for (let j = 0; j < this.categories[i].Projects.length; j++) {
                  this.categories[i].Projects[j].changeOrder = 0;
                }
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
            let cateIndex  = this.categories.findIndex((category) => {
              return category.id === id;
            });
            // or we can use findIndex
            let categories = [];
            // here we should not update the order !
            categories.push(_.omit(this.categories[cateIndex], ['changed', 'order', 'Projects']));
            console.log('in form update category' + JSON.stringify(categories));
            updateCate({categories: JSON.stringify(categories)})
              .then(result => {
                this.$notify({
                  type   : 'success',
                  title  : 'success',
                  message: 'category update' + categories
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
          // console.log(JSON.stringify(element));

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
          this.categories[Index].Projects[newIndex].changeOrder = 1;
          // element.order += newIndex - oldIndex;
          // set the circle project order and changed
          if (newIndex > oldIndex) {
            for (let i = oldIndex; i < newIndex; i++) {
              this.categories[Index].Projects[i].order -= 1;
              this.categories[Index].Projects[i].changeOrder = 1;
            }
          } else {
            for (let i = newIndex + 1; i <= oldIndex; i++) {
              this.categories[Index].Projects[i].order += 1;
              this.categories[Index].Projects[i].changeOrder = 1;
            }
          }
          // update order here
          this.updateProjectOrder();
        } else if (evt.added) {
          // console.log(evt.added);
          let newIndex = evt.added.newIndex;
          let element  = evt.added.element;
          // first find the category
          let Index    = this.categories.findIndex((category) => {
            if (category.Projects[newIndex]) {
              return category.Projects[newIndex].id === element.id;
            }
            return false;
          });
          // there we get three type of added
          // added at head, tail, middle
          // careful no need to update the categoryId ,because it would set the element.categoryId
          // which is linked to removed.element
          // this.categories[Index].Projects[newIndex].categoryId = this.categories[Index].id;
          // if (newIndex === 0) {
          //   // added at head
          //   if (this.categories[Index].Projects.length === 1) {
          //     // the origin list is empty
          //     this.categories[Index].Projects[newIndex].order   = 1;
          //     this.categories[Index].Projects[newIndex].changed = 1;
          //   } else {
          //     this.categories[Index].Projects[newIndex].order   = this.categories[Index].Projects[newIndex + 1].order;
          //     this.categories[Index].Projects[newIndex].changed = 1;
          //   }
          //   // this.categories[Index].Projects[newIndex].categoryId = this.categories[Index].id;
          //   for (let i = newIndex + 1; i < this.categories[Index].Projects.length; i++) {
          //     this.categories[Index].Projects[i].order += 1;
          //     this.categories[Index].Projects[i].changed = 1;
          //   }
          // } else if (newIndex === this.categories[Index].Projects.length - 1) {
          //   // added at tail
          //   if (this.categories[Index].Projects.length === 1) {
          //     // the origin list is empty
          //     this.categories[Index].Projects[newIndex].order   = 1;
          //     this.categories[Index].Projects[newIndex].changed = 1;
          //   } else {
          //     this.categories[Index].Projects[newIndex].order   = this.categories[Index].Projects[newIndex - 1].order + 1;
          //     this.categories[Index].Projects[newIndex].changed = 1;
          //   }
          //   // this.categories[Index].Projects[newIndex].categoryId = this.categories[Index].id;
          // } else {
          //   // added at middle
          //   this.categories[Index].Projects[newIndex].order      = this.categories[Index].Projects[newIndex + 1].order;
          //   this.categories[Index].Projects[newIndex].changed    = 1;
          //   // this.categories[Index].Projects[newIndex].categoryId = this.categories[Index].id;
          //   for (let i = newIndex + 1; i < this.categories[Index].Projects.length; i++) {
          //     this.categories[Index].Projects[i].order += 1;
          //     this.categories[Index].Projects[i].changed = 1;
          //   }
          // }

          // or just two type of added : tail or not
          if (newIndex === this.categories[Index].Projects.length - 1) {
            if (this.categories[Index].Projects.length === 1) {
              // the origin list is empty
              this.categories[Index].Projects[newIndex].order       = 1;
              this.categories[Index].Projects[newIndex].changeOrder = 1;
            } else {
              this.categories[Index].Projects[newIndex].order       = this.categories[Index].Projects[newIndex - 1].order + 1;
              this.categories[Index].Projects[newIndex].changeOrder = 1;
            }
          } else {
            if (this.categories[Index].Projects.length === 1) {
              // the origin list is empty
              this.categories[Index].Projects[newIndex].order       = 1;
              this.categories[Index].Projects[newIndex].changeOrder = 1;
            } else {
              this.categories[Index].Projects[newIndex].order       = this.categories[Index].Projects[newIndex + 1].order;
              this.categories[Index].Projects[newIndex].changeOrder = 1;
            }
            for (let i = newIndex + 1; i < this.categories[Index].Projects.length; i++) {
              this.categories[Index].Projects[i].order += 1;
              this.categories[Index].Projects[i].changeOrder = 1;
            }
          }
          console.log('added Index:' + Index);
          // not sure ,is it really added event and then removed event?
        } else if (evt.removed) {
          // console.log(evt.removed);
          let oldIndex = evt.removed.oldIndex;
          let element  = evt.removed.element;
          // first find the category
          let Index    = this.categories.findIndex((category) => {
            return category.id === element.categoryId;
          });
          // set the order and changed after the oldIndex;
          for (let i = oldIndex; i < this.categories[Index].Projects.length; i++) {
            this.categories[Index].Projects[i].order -= 1;
            this.categories[Index].Projects[i].changeOrder = 1;
          }
          console.log('removed Index:' + Index);
          // update order here
          // set params 1 to get the data from sever !
          this.updateProjectOrder(1);
        } else {
          // do nothing
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
      onMove({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return true;
        // return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      setUploadData(num) {
        // num: 0:logo 1:QR code
        return {type: num};
      },
      handleLogoError(err, file, fileList) {
        console.log('logo error');
        // console.log(JSON.stringify(file), JSON.stringify(fileList));
        console.log(err);
      },
      uploadLogo(response, file, fileList) {
        console.log('after uploadLogo success');
        console.log(JSON.stringify(file), JSON.stringify(fileList));
        // first remove the old logoUrl picture if exists;
        let logoUrl = this.project.logo;
        if (logoUrl && this.project.changeLogo) {
          this.removeImage(logoUrl);
        }
        // use the response file name to set up logoUrl
        this.project.logo       = response.url;
        this.project.changeLogo = 1;
        // this.logoUrl = URL.createObjectURL(file.raw);
        this.$notify({
          type   : 'success',
          title  : 'logo response',
          message: response
        });
      },
      uploadQRCode(response, file, fileList) {
        console.log('after upload QR code success');
        // console.log(JSON.stringify(file), JSON.stringify(fileList));
        // first remove the old logoUrl picture if exists;
        let QRCodeUrl = this.project.QRCode;
        if (QRCodeUrl && this.project.changeQRCode) {
          this.removeImage(QRCodeUrl);
        }
        // use the response file name to set up logoUrl
        this.project.QRCode       = response.url;
        this.project.changeQRCode = 1;
        this.$notify({
          type   : 'success',
          title  : 'QRCode response',
          message: response
        });
      },
      beforeLogoUpload(file) {
        const isPic  = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isPic) {
          this.$message.error('上传头像图片只能是 JPG, PNG, GIF 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isPic && isLt2M;
      },
      removeImage(url) {
        removeImage({
          image: url
        })
          .then(result => {
            this.$notify({
              type : 'success',
              title: 'remove image'
            });
          })
          .catch(err => {
            this.$notify({
              type   : 'error',
              title  : 'remove image',
              message: err
            });
          });
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
      },
      searchProject: function () {
        this.getCategories();
      }
    }
  }
</script>

<style scoped>
  .margin-self {
    margin: 1em;
  }

  .cateWrap {
    margin: 1em;
    max-width: 45rem;
    font-size: .875rem;
  }

  .searchProject {
    margin-left: 5em;
  }

  .checkbox {
    margin-left: 3em;
  }

  .category {
    margin: 1em;
  }

  .collapse-self {
    /*margin: 1em;*/
    /*padding: 1em;*/
  }

  .category-collapse-form-row {
    margin: 1em;
  }

  .category-form-row {
    border: 1px solid paleturquoise;
    margin: 1em;
  }

  .category-form {
    margin: 1em;
  }

  .category-group {
    min-height: 10px;
    margin: 1em;
  }

  .icon-size-36 {
    /* just hold empty*/
    /*width: 36px;*/
    /*height: 36px;*/
  }

  .list-group {
    min-height: 10px;
  }

  .project-group {
    min-height: 10px;
    /*margin-bottom: 1em;*/
  }

  .project-content {
    min-height: 10px;
    margin-top: 1em;
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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    width: 178px;
    height: 178px;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
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

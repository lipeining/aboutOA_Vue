<template>
  <div>
    <section>
      <h1>projects</h1>
      <el-row :gutter="20">
        <el-col :span="6" class="searchProject">
          <el-input v-model="searchProject" placeholder="search project"
                    type="text" clearable></el-input>
        </el-col>
      </el-row>
      <el-row :gutter="22">
        <el-col :span="3" v-for="project in projects"
                :key="project.id" class="project-content">
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
                         @click="deleteProject(project.id)">
              </el-button>
            </el-row>
            <img v-if="project.logo" slot="reference"
                 :src="project.logo" :alt="project.logo"
                 class="logo">
          </el-popover>
        </el-col>
        <el-col :span="3">
          <el-tooltip class="item" effect="dark" content="new project" placement="right">
            <el-button type="success" @click="addProForm(categoryId)" icon="el-icon-plus" circle>
            </el-button>
          </el-tooltip>
        </el-col>
      </el-row>
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
    <!-- Form for edit project-->
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
            <el-form-item label="category" prop="categoryId" v-if="project.id">
              <el-select
                v-model="project.categoryId"
                filterable
                remote
                placeholder="请输入关键词"
                @change="handleCategoryChange"
                :remote-method="getCategoryNames">
                <el-option
                  v-for="item in categoryNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="order" label="order" v-if="project.id">
              <el-select
                v-model="project.order"
                filterable
                remote
                placeholder="请输入关键词"
                :remote-method="getProjectNames">
                <el-option
                  v-for="item in projectNames"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
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
  import GoTop from './go-top';
  import {getProjects, getProjectNames, updatePro, removeImage, createPro, delPro} from '../api/project';
  import {getCategoryNames} from "../api/category";
  import {number2segment, segment2number} from "../utils/project";
  import _ from 'lodash';

  export default {
    name      : "projects",
    components: {
      'go-top': GoTop
    },
    data() {
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
        projectRules      : projectRules,
        project           : project,
        originalCategoryId: 0,
        originalOrder     : 0,
        searchProject     : '',
        projects          : [],
        projectNames      : [],
        categoryNames     : [],
        total             : 1000,
        pageSize          : 20,
        pageIndex         : 1,
        categoryId        : 0,
        urlType           : false,
        projectFormVisible: false,
      }
    },
    created() {
      this.categoryId = this.$route.params.categoryId;
      this.getProjects();
    },
    beforeRouteUpdate(to, from, next) {
      // next();
    },
    watch     : {
      searchProject: function () {
        this.getProjects();
      }
    },
    methods   : {
      getCategoryNames() {
        getCategoryNames()
          .then(result => {
            this.categoryNames = [];
            for (let i = 0; i < result.categoryNames.length; i++) {
              this.categoryNames.push({
                value: result.categoryNames[i].id,
                label: result.categoryNames[i].name
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
      handleCategoryChange(val) {
        if (val !== this.originalCategoryId) {
          this.getProjectNames(1);
        } else {
          this.getProjectNames();
        }
      },
      getProjectNames(changeCategory) {
        getProjectNames({
          categoryId: this.project.categoryId
        })
          .then(result => {
            this.projectNames = [];
            let length        = result.projectNames.length;
            for (let i = 0; i < length; i++) {
              this.projectNames.push({
                value: result.projectNames[i].order,
                label: i + 1
              });
            }
            if (changeCategory) {
              if (this.projectNames.length === 0) {
                // happen only in change category!
                this.projectNames.push({
                  value: 1,
                  label: 1
                });
                this.project.order = 1;
              } else {
                // default the order should be the last one
                let order = result.projectNames[length - 1].order + 1;
                this.projectNames.push({
                  value: order,
                  label: length + 1
                });
                this.project.order = order;
              }
            } else {
              // if not change category set it to original order
              this.project.order = this.originalOrder;
            }
            this.$notify({
              type : 'success',
              title: 'get project names'
            })
          })
          .catch(err => {
            this.$notify.error({
              title  : 'get project names',
              message: err
            })
          });
      },
      setProFormName(id) {
        return 'project' + id;
      },
      isQRCode() {
        return this.urlType;
      },
      addProForm(categoryId) {
        this.project.categoryId = categoryId;
        this.projectFormVisible = true;
        // no need to get categoryNames and projectNames!
        this.$notify({
          type   : 'info',
          title  : 'add project form',
          message: this.project
        });
      },
      editProForm(project) {
        // do we need to deep clone project?
        this.project            = _.cloneDeep(project);
        this.urlType            = !!this.project.QRCode;
        this.projectFormVisible = true;
        this.originalCategoryId = this.project.categoryId;
        this.originalOrder      = this.project.order;
        this.getCategoryNames();
        this.getProjectNames(0);
        // this.$notify({
        //   type   : 'success',
        //   title  : 'add project form',
        //   message: this.project
        // });
      },
      handleDialogClose(done) {
        this.cancelProForm(1, 1);
        done();
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
        this.project            = {
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
        this.originalCategoryId = 0;
        this.originalOrder      = 0;
        this.urlType            = false;
        // this.$notify({
        //   type   : 'info',
        //   title  : 'cancel project form',
        //   message: this.project
        // });
      },
      submitProForm(formName) {
        // use edit and this.project.id detect if we are create a project or edit a project
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            if (this.project.id) {
              // here we should not update the order, changeOrder, categoryId!
              let project = _.omit(this.project,
                ['changeOrder', 'changeLogo', 'changeQRCode']
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
              updatePro({project: JSON.stringify(project)})
                .then(result => {
                  // success update the project!
                  this.cancelProForm(0, removeQRCode);
                  this.getProjects();
                })
                .catch(err => {
                  this.$notify.error({
                    title  : 'update project',
                    message: err
                  });
                });
            } else {
              // for create project

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
                  this.getProjects();
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
            }
          }
        });
      },
      getProjects: _.debounce(function () {
        return getProjects({
          categoryId: this.categoryId,
          pageIndex : this.pageIndex,
          pageSize  : this.pageSize,
          search    : this.searchProject
        })
          .then(result => {
            this.projects = result.projects.rows.map((project) => {
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
            this.total    = result.projects.count;
            this.$notify({
              type   : 'success',
              title  : 'success',
              message: 'get projects from server'
            });
          })
          .catch(err => {
          });
      }, 500),
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
        // console.log(JSON.stringify(file), JSON.stringify(fileList));
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
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getProjects();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'pageChange',
        //   message: val,
        // });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getProjects();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'sizeChange',
        //   message: val,
        // });
      },
      deleteProject(id) {
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

              // first find the project
              let proIndex = this.projects.findIndex((project) => {
                return project.id === id;
              });
              console.log('del project proIndex:' + proIndex);

              // delete head or tail or middle
              if (proIndex === this.projects.length - 1) {
                this.projects.pop();
              } else if (proIndex === 0) {
                this.projects.shift();
              } else {
                this.projects.splice(proIndex, 1);
              }
              this.$notify({
                type   : 'success',
                title  : 'delete',
                message: 'project delete id-proIndex:' + id + '-' + proIndex
              });
            })
            .catch(err => {
              this.$notify({
                type   : 'error',
                title  : 'delete',
                message: 'project delete' + id
              });
            });
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          });
        });
      },
    }
  }
</script>

<style scoped>

  .searchProject {
    margin-left: 5em;
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

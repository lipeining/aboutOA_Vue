<template>
  <el-row :gutter="18" class="main">
    <el-steps :active="active" :simple="true">
      <el-step title="input email" icon="el-icon-edit">
      </el-step>
      <el-step title="verify" icon="el-icon-view">
      </el-step>
    </el-steps>
    <el-row v-if="active===0" class="form">
      <el-form auto-complete="on" :model="user" label-width="75px"
               :rules="rules" ref="findPassForm">
        <!--<el-form-item>-->
        <!--<el-switch v-model="phone" :width="50"-->
        <!--active-text="phone"-->
        <!--inactive-text="Email">-->
        <!--</el-switch>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-if="phone" label="phone" prop="phone">-->
        <!--<el-input type="text" v-model="user.phone" placeholder="Please enter telephone">-->
        <!--</el-input>-->
        <!--</el-form-item>-->
        <!--<el-form-item v-else label="Email" prop="email">-->
        <!--<el-input type="text" v-model="user.email" placeholder="Please enter email">-->
        <!--</el-input>-->
        <!--</el-form-item>   -->
        <el-form-item label="name" prop="name">
          <el-input type="text" v-model="user.name" placeholder="Please enter name">
          </el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input type="text" v-model="user.email" placeholder="Please enter email">
          </el-input>
        </el-form-item>
        <el-form-item>
          <drag-verify :width="verify.width" :height="verify.height"
                       :text="verify.text" :success-text="verify.successText"
                       :background="verify.background" :progress-bar-bg="verify.progressBarBg"
                       :completed-bg="verify.completedBg" :handler-bg="verify.handlerBg"
                       :handler-icon="verify.handlerIcon" :text-size="verify.textSize"
                       :success-icon="verify.successIcon" :circle="verify.isCircle">
          </drag-verify>
        </el-form-item>
        <el-button type="primary" @click="submit('findPassForm')">
          find password
        </el-button>
      </el-form>
    </el-row>
    <el-row v-else-if="active===1">
      <p>the reset password email has been send to you email,go to verify!</p>
      <a :href="previewUrl" target="_blank">{{previewUrl}}</a>
    </el-row>
  </el-row>
</template>

<script>
  import dragVerify from 'vue-drag-verify';
  import {findPass} from '../api/user';

  export default {
    name      : "findPass",
    components: {
      dragVerify
    },
    data() {
      const verify = {
        handlerIcon  : 'fa fa-angle-double-right',
        successIcon  : 'fa fa-check',
        background   : '#cccccc',
        progressBarBg: '#FFFF99',
        completedBg  : '#66cc66',
        handlerBg    : '#fff',
        text         : 'swiping to the right side',
        successText  : 'success',
        width        : 220,
        height       : 40,
        textSize     : '20px',
        isCircle     : true
      };
      let user     = {
        name : '',
        email: '',
      };
      // form validate rules
      const rules  = {
        email: [
          {required: true, message: '请输入邮箱', type: 'email'}
        ],
        name : [
          {required: true, message: '请输入邮箱'}
        ]
      };
      return {
        user      : user,
        active    : 0,
        rules     : rules,
        verify    : verify,
        previewUrl: ''
      };
    },
    created() {
      // no need to check the step active!
    },
    methods   : {
      submit(formName) {
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            findPass({
              name : this.user.name,
              email: this.user.email
            })
              .then(res => {
                this.$notify({
                  type   : 'info',
                  title  : 'send find pass',
                  message: JSON.stringify(this.user)
                });
                this.previewUrl = res.previewUrl;
                this.active++;
              })
              .catch(err => {
                this.$notify.error({
                  title  : 'find password error',
                  message: err
                })
              });
          }
        })
      }
    }
  }
</script>

<style scoped>
  .main {
    margin: 1em;
  }

  .form {
    margin: 1em;
    width: 25%;
    /*float: left;*/
  }
</style>

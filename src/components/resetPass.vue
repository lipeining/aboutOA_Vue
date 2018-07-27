<template>
  <el-row class="main">
    <el-row v-if="success">
      reset password success go to login!
      <router-link to="/login">login</router-link>
    </el-row>
    <el-row v-else class="resetForm">
      <el-form auto-complete="on" :model="reset" label-width="75px"
               :rules="resetRules" ref="resetPassForm">
        <el-form-item label="password" prop="password">
          <el-input type="password" v-model="reset.password" placeholder="Please enter password">
          </el-input>
        </el-form-item>
        <el-form-item label="password" prop="passwordR">
          <el-input type="password" v-model="reset.passwordR" placeholder="Please enter password">
          </el-input>
        </el-form-item>
        <el-button type="primary" @click="resetPass('resetPassForm')">
          reset password
        </el-button>
      </el-form>
    </el-row>
  </el-row>
</template>

<script>
  import {findPassVerify, resetPass} from '../api/user';

  export default {
    name   : "resetPass",
    data() {
      let validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.reset.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      let reset        = {
        id       : 0,
        password : '',
        passwordR: ''
      };
      const resetRules = {
        password : [
          {required: true, message: '请输入密码'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        passwordR: [
          {validator: validatePass, trigger: 'blur'},
          {required: true, message: '请再次输入密码', trigger: 'blur'}
        ]
      };
      return {
        reset     : reset,
        verify    : '',
        success   : false,
        resetRules: resetRules
      };
    },
    created() {
      // here we'd better set the token and get the user info!
      this.verify = this.$route.query.verify;
      this.getUser();
    },
    methods: {
      getUser() {
        findPassVerify({
          verify: this.verify
        })
          .then(res => {
            this.reset.id = res.id;
            this.$notify({
              type   : 'success',
              title  : 'verify success',
              message: res.id
            });
          })
          .catch(err => {
            this.$notify.error({
              title  : 'verify error',
              message: err
            });
          })
      },
      resetPass(formName) {
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            resetPass({
              id      : this.reset.id,
              password: this.reset.password,
              verify  : this.verify
            })
              .then(res => {
                this.$notify({
                  type   : 'info',
                  title  : 'reset pass',
                  message: res.info
                });
                this.success = true;
              })
              .catch(err => {
                this.$notify({
                  type   : 'error',
                  title  : 'reset pass',
                  message: err
                });
                this.success = false;
              });
          }
        })
      },
    }
  }
</script>

<style scoped>
  .main {
    margin: 1em;
  }

  .resetForm {
    margin: 1em;
    width: 25%;
    /*float: left;*/
  }
</style>

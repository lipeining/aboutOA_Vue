<template>
  <section class="login">
    <header class="login-header">
      <h1 class="brand">
      </h1>
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
    </header>

    <el-form class="login-form" auto-complete="off" :model="user" label-width="75px"
             :rules="rules" ref="loginForm">
      <h2 class="heading">Login</h2>
      <el-form-item>
        <el-switch v-model="phone" :width="50"
                   active-text="phone"
                   inactive-text="Email">
        </el-switch>
      </el-form-item>
      <el-form-item v-if="phone" label="phone" prop="phone">
        <el-input type="text" v-model="user.phone" placeholder="Please enter telephone">
        </el-input>
      </el-form-item>
      <el-form-item v-else label="Email" prop="email">
        <el-input type="text" v-model="user.email" placeholder="Please enter email">
        </el-input>
      </el-form-item>
      <el-form-item label="password" prop="password">
        <el-input type="password" v-model="user.password" placeholder="Please enter password">
        </el-input>
      </el-form-item>
      <!--<el-form-item>-->
      <!--<drag-verify :width="verify.width" :height="verify.height"-->
      <!--:text="verify.text" :success-text="verify.successText"-->
      <!--:background="verify.background" :progress-bar-bg="verify.progressBarBg"-->
      <!--:completed-bg="verify.completedBg" :handler-bg="verify.handlerBg"-->
      <!--:handler-icon="verify.handlerIcon" :text-size="verify.textSize"-->
      <!--:success-icon="verify.successIcon" :circle="verify.isCircle">-->
      <!--</drag-verify>-->
      <!--</el-form-item>-->
      <el-form-item>
        <el-input type="text" v-model="code"></el-input>
        <!--<el-button @click="getCaptcha()">img</el-button>-->
        <el-tooltip  effect="dark" content="click to change captcha" placement="right-end">
          <img :src="captcha" :alt="code" class="captcha" @click="getCaptcha()">
        </el-tooltip>
      </el-form-item>
      <el-button type="primary" :loading="loading" @click="submit('loginForm')">
        {{ loading ? 'Loading...' : 'Login' }}
      </el-button>
    </el-form>
    <footer class="login-footer">
      Not a member go to
      <router-link to="/reg">register</router-link>
    </footer>
  </section>
</template>

<script>
  import {login, getCaptcha, delCaptcha} from '../api/user';
  import dragVerify from 'vue-drag-verify';
  import HmacSHA256 from 'crypto-js/hmac-sha256';
  import {mapGetters} from 'vuex';

  const request = require('superagent');

  export default {
    name      : 'login',
    components: {
      dragVerify
    },
    data() {
      let verify  = {
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
      const user  = {
        phone   : '',
        email   : '',
        password: ''
      };
      // form validate rules
      const rules = {
        phone   : [
          // { validator: validateMobile, trigger: 'blur' },
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码'}
        ],
        email   : [
          {required: true, message: '请输入邮箱', type: 'email'}
        ],
        password: [
          {required: true, message: '请输入密码'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ]
      };
      return {
        user   : user, rules: rules,
        error  : null, loading: false,
        phone  : true, verify: verify,
        captcha: '', code: ''
      };
    },
    computed: {
      // 使用对象展开运算符将 getter 混入 computed 对象中
      ...mapGetters([
        'isLogin'
      ])
    },
    created() {
      this.getCaptcha();
    },
    beforeDestroy(){
      // console.log(JSON.stringify(this.$store.state.userInfo));
      // get {} if exit without login
      // get object if login
      if(this.isLogin){
        // do nothing! while login
      } else {
        if(this.captcha){
          delCaptcha({
            url:this.captcha
          });
        }
      }
    },
    methods   : {
      getShape() {
        return this.verify.isCircle === 'true';
      },
      getCaptcha() {
        getCaptcha()
          .then(result => {
            this.captcha = result.captcha;
          });
      },
      submit(formName) {
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            this.error   = null;
            this.loading = true;
            let password = HmacSHA256(this.user.password, 'about oa').toString();
            // console.log(password);
            let user     = {password: password};
            if (this.phone) {
              user['phone'] = this.user.phone;
              user['email'] = '';
            } else {
              user['phone'] = '';
              user['email'] = this.user.email;
            }
            user['code'] = this.code;
            login(user)
              .then(result => {
                // console.log(result);
                this.$store.dispatch('setUserInfo', result.user)
                  .then(() => {
                    this.$router.replace({path: this.$route.query.redirect || '/home'});
                    this.loading = false;
                  });
              })
              .catch(err => {
                this.error   = {title: '发生错误', message: err};
                this.loading = false;
              });
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../assets/styles/variables';

  .captcha {

  }

  .login {
    flex: 1;
    width: 95%;
    max-width: 22rem;
    margin: 0 auto;
    font-size: .875rem;
    &-header {
      margin-bottom: 1rem;
      .brand {
        margin: 4.5rem 0 3.5rem;
        text-align: center;
        letter-spacing: .125rem;
        a {
          margin: 0;
          color: $brand-color;
          font: 300 3rem sans-serif;
          &:hover {
            color: $brand-hover-color;
            text-shadow: 0 0 1rem $brand-hover-color;
          }
        }
      }
    }
    &-form {
      margin-bottom: 2.5rem;
      padding: 1.875rem 1.25rem;
      background: $login-form-background;
      color: $login-form-color;
      .heading {
        margin: 0 0 1rem;
        font-weight: 400;
        font-size: 1.5rem;
      }
      .el-button {
        margin-top: .5rem;
        width: 100%;
      }
    }
    &-footer {
      margin-bottom: 1rem;
      padding: .625rem;
      border: .0625rem solid $brand-color;
      font-size: .75rem;
      text-align: center;
      a {
        color: $brand-color;
      }
    }
  }
</style>


<template>
  <section class="userWrap">
    <header>
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
    </header>
    <el-form auto-complete="on" :model="user" label-width="75px" size="mini"
             :rules="rules" ref="loginForm">
      <h2>Setting</h2>
      <el-form-item label="name" prop="name">
        <el-input type="text" v-model="user.name" placeholder="Please enter username">
        </el-input>
      </el-form-item>
      <el-form-item label="phone" prop="phone">
        <el-input type="text" v-model="user.phone" placeholder="Please enter telephone">
        </el-input>
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input type="text" v-model="user.email" placeholder="Please enter email">
        </el-input>
      </el-form-item>
      <el-form-item label="intro" prop="intro">
        <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}"
                  v-model="user.intro" placeholder="Please enter introduction">
        </el-input>
      </el-form-item>
      <el-button type="primary" :loading="loading" @click="submit('loginForm')">
        {{ loading ? 'Loading...' : 'Update' }}
      </el-button>
    </el-form>
  </section>
</template>

<script>
  import {update, getUser} from '../api/user';

  export default {
    name   : "profile",
    data() {
      // form validate rules
      let user    = {
        id: 0, name: '', permission: 0, intro: '', phone: '', email: ''
      };
      const rules = {
        name : [
          {required: true, message: '请输入用户名'},
          {min: 5, max: 16, message: '长度在 5 到 16 个字符'}
        ],
        phone: [
          // { validator: validateMobile, trigger: 'blur' },
          {required: true, message: '', trigger: 'blur'},
          {pattern: /^1[34578]\d{9}$/, message: '目前只支持中国大陆的手机号码'}
        ],
        email: [
          {required: true, message: '', type: 'email'}
        ],
        intro: [
          {required: false, message: ''},
          {min: 20, max: 120, message: '长度在 20 到 120 个字符'}
        ],
      };
      return {
        user : user, rules: rules,
        error: null, loading: false,
      };
    },
    created() {
      this.user = this.$store.getters.getUserInfo;
    },
    methods: {
      submit(formName) {
        // form validate
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          } else {
            // validated
            this.error   = null;
            this.loading = true;
            update(this.user)
              .then(result => {
                this.$store.dispatch('setUserInfo', this.user)
                  .then(() => {
                    this.loading = false;
                    this.$notify({
                      title  : 'success',
                      message: 'updated',
                      type   : 'success'
                    });
                  });
              })
              .catch(err => {
                this.error   = {title: '发生错误', message: err};
                this.loading = false;
              });
          }
        })
      },
      getUser() {
        getUser({
          id: this.user.id
        })
          .then(result => {
            this.user = result.user;
            this.$store.dispatch('setUserInfo', result.user);
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .userWrap {
    flex: 1;
    max-width: 34rem;
    font-size: .875rem;
  }
</style>



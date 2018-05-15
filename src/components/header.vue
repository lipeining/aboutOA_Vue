<template>
  <div>
    <span>
      <el-menu :router=true
               :default-active="$route.path"
               mode="horizontal"
               background-color="#545c64"
               text-color="#fff"
               active-text-color="#ffd04b">
        <el-menu-item index="/users"> Users</el-menu-item>
        <el-menu-item index="/projects"> Projects</el-menu-item>
        <el-menu-item index="/categories"> Categories</el-menu-item>
        <el-submenu index="/user">
          <template slot="title">{{curUser.name}}</template>
          <el-menu-item index="/profile">
            profile
          </el-menu-item>
          <el-menu-item index="">
                <i  @click="logout()">logout
              </i>
          </el-menu-item>
        </el-submenu>
      </el-menu>
   </span>

  </div>

</template>

<script>
  import {logout} from '../api/user';
  import {mapGetters} from 'vuex';

  export default {
    name    : 'app-header',
    computed: {
      ...mapGetters({
        curUser: 'getUserInfo'
      })
    },
    data() {
      return {
        menuIndex: '1'
      };
    },
    created() {
    },
    methods : {
      logout() {
        logout({
          id: this.curUser.id
        })
          .then(res => {
            this.$store.dispatch('delUserInfo');
            this.$router.push({path: '/login'});
          })
          .catch(err => {
            // todo
            this.$store.dispatch('delUserInfo');
            this.$router.push({path: '/login'});
          });
      }
    }
  }
</script>

<template>
  <el-header>
    <el-menu :router=true
             :default-active="$route.path"
             mode="horizontal"
             background-color="#545c64"
             text-color="#fff"
             active-text-color="#ffd04b">
      <el-menu-item index="/home"> Home</el-menu-item>
      <el-menu-item index="/backend/users" v-if="isAdmin"> Users</el-menu-item>
      <!--<el-menu-item index="/backend/projects"> Projects</el-menu-item>-->
      <el-menu-item index="/backend/categories" v-if="isAdmin"> Categories</el-menu-item>
      <el-menu-item index="/backend/projects" v-if="isAdmin"> Projects</el-menu-item>
      <el-menu-item index="/backend/logs" v-if="isAdmin"> Logs</el-menu-item>
      <el-submenu index="">
        <template slot="title">{{curUser.name}}</template>
        <el-menu-item index="/backend/profile">
          profile
        </el-menu-item>
        <el-menu-item index="">
          <i @click="logout()">logout
          </i>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-header>
</template>

<script>
  import {logout} from '../api/user';
  import {mapGetters} from 'vuex';

  export default {
    name    : 'app-header',
    computed: {
      ...mapGetters({
        curUser: 'getUserInfo',
        isAdmin: 'isAdmin'
      })
    },
    data() {
      return {
        menuIndex: '1'
      };
    },
    created() {
    },
    sockets : {
      connect  : function () {
        console.log('socket connected')
      },
      newLog   : function (val) {
        console.log('this method was fired by the socket server. eg: io.emit("newLog", data)');
        console.log(val);
        this.$notify({
          type   : 'success',
          title  : 'new log',
          message: val
        });
      },
      adminLog : function (val) {
        console.log('this method was fired by the socket server. eg: adminNamespace.emit("adminLog", data)');
        console.log(val);
        this.$notify({
          type   : 'success',
          title  : 'admin log',
          message: val
        });
      },
      diffLogin: function (data) {
        console.log('diffLogin');
        console.log(`${data.ip}-${data.sessionId}`);
        let user = data.user;
        this.$confirm('agree the different place user login?', 'warning', {
          confirmButtonText: 'yes',
          cancelButtonText : 'no',
          type             : 'warning',
          center           : true
        }).then(() => {
          this.$message({
            type   : 'success',
            message: 'agree!'
          });
          let sendData = {
            id       : user.id,
            name     : user.name,
            sessionId: data.sessionId,
            agree    : true
          };
          this.$socket.emit('agreeLogin', sendData);
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: 'do not agree'
          });
          let sendData = {
            id       : user.id,
            name     : user.name,
            sessionId: data.sessionId,
            agree    : false
          };
          this.$socket.emit('agreeLogin', sendData);
        });
      },
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

<style scoped>
  .menu-row {
    /*margin-top: -60px;*/
  }
</style>

<template>
  <div>
    <h1>users</h1>
    <div>
      <el-col :span="5">
        <el-input
          placeholder="搜索用户"
          v-model="search"
          size="medium"
          clearable>
        </el-input>
      </el-col>
    </div>
    <div>
      <el-table
        :data="users"
        border
        size="medium">
        <el-table-column
          prop="name"
          label="姓名"
        >
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
        >
        </el-table-column>
        <el-table-column
          prop="phone"
          label="电话"
        >
        </el-table-column>
        <el-table-column
          prop="intro"
          label="简介"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <!--<el-popover trigger="hover" placement="top">-->
            <!--<p>姓名: {{ scope.row.name }}</p>-->
            <!--<p>permission: {{ scope.row.permission }}</p>-->
            <!--<div slot="reference" class="name-wrapper">-->
            <!--<el-tag size="medium">{{ scope.row.name }}</el-tag>-->
            <!--</div>-->
            <!--</el-popover>-->
            <!--<el-tooltip :content="'on: admin,off: user'" placement="top">-->
            <!--<el-switch-->
            <!--v-model.lazy="scope.row.permission"-->
            <!--v-model.number="scope.row.permission"-->
            <!--:value="scope.row.permission"-->
            <!--@change="handleGrantUser(scope.$index, scope.row)"-->
            <!--active-color="#13ce66"-->
            <!--inactive-color="#ff4949"-->
            <!--active-value="90"-->
            <!--inactive-value="0">-->
            <!--</el-switch>-->
            <!--</el-tooltip>-->
            <el-button v-if="scope.row.permission===90"
                       size="mini"
                       type="info"
                       @click="handleGrantUser(scope.$index, scope.row, 0)">grant user
            </el-button>
            <el-button v-else-if="scope.row.permission===0"
                       size="mini"
                       type="success"
                       @click="handleGrantUser(scope.$index, scope.row, 90)">grant amdin
            </el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelUser(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {getUsers, grantUser, delUser} from '../api/user';
  import {debounce} from 'lodash';

  export default {
    name   : "users",
    data() {
      let users     = [];
      let pageSize  = 10;
      let pageIndex = 1;
      let total     = 100;
      let search    = '';
      return {
        users    : users,
        total    : total,
        search   : search,
        pageIndex: pageIndex,
        pageSize : pageSize
      }
    },
    created() {
      this.getUsers();
    },
    watch  : {
      search: function () {
        this.getUsers();
      }
    },
    methods: {
      getUsers: debounce(function () {
        return getUsers({
          pageIndex: this.pageIndex,
          pageSize : this.pageSize,
          search   : this.search
        })
          .then(result => {
            this.users = result.users.rows;
            this.total = result.users.count;
            // console.log(JSON.stringify(this.users));
            // return '1';
            // debug of el-switch why does it change the permission value
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          });
      }, 500),
      handleGrantUser(index, row, val) {
        grantUser({
          id        : row.id,
          permission: val
        })
          .then(() => {
            this.$notify({
              type   : 'success',
              title  : 'grantUser',
              message: `${row.id}:${row.name} permission: ${row.permission}->${val}`
            });
            row.permission = val;
          })
          .catch((err) => {
            this.$notify({
              type   : 'error',
              title  : 'grantUser',
              message: err
            });
          });
      },
      handleDelUser(index, row) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText : '取消',
          type             : 'warning',
          center           : true
        }).then(() => {
          delUser({
            id: row.id
          })
            .then(() => {
              this.users.splice(index, 1);
              this.$message({
                type   : 'success',
                message: '删除成功!' + index
              });
            });
        }).catch(() => {
          this.$message({
            type   : 'info',
            message: '已取消删除'
          });
        });
        // this.$notify({
        //   type   : 'success',
        //   title  : 'delUser',
        //   message: row.id + row.name,
        // });
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getUsers();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'pageChange',
        //   message: val,
        // });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getUsers();
        // this.$notify({
        //   type   : 'success',
        //   title  : 'sizeChange',
        //   message: val,
        // });
      }
    }
  }
</script>

<style scoped>

</style>

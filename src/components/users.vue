<template>
  <div>
    <h1>users</h1>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="date"
        label="日期"
        width="150">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="120">
      </el-table-column>
      <el-table-column
        prop="province"
        label="省份"
        width="120">
      </el-table-column>
      <el-table-column
        prop="city"
        label="市区"
        width="120">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址"
        width="300">
      </el-table-column>
      <el-table-column
        prop="zip"
        label="邮编"
        width="120">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" size="small">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  import {getUsers} from '../api/user';

  export default {
    name   : "users",
    data() {
      let users     = [];
      let pageSize  = 5;
      let pageIndex = 1;
      let total     = 100;
      return {
        users    : users,
        total    : total,
        pageIndex: pageIndex,
        pageSize : pageSize
      }
    },
    created() {
      this.getUsers();
    },
    methods: {
      getUsers() {
        getUsers({
          pageIndex: this.pageIndex,
          pageSize : this.pageSize
        })
          .then(result => {
            this.users = result.users.rows;
            this.total = result.users.count;
          })
          .catch(err => {
            this.$notify.error({
              title  : 'error',
              message: err
            });
          })
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getUsers();
        this.$notify({
          type   : 'success',
          title  : 'pageChange',
          message: val,
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.$notify({
          type   : 'success',
          title  : 'sizeChange',
          message: val,
        });
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div>
    <el-row :gutter="20" class="datePicker">
      <el-col :span="5" class="search">
        <el-input type="text" v-model="search"
                  :clearable="true" placeholder="search logs">
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-date-picker
          v-model="timeZone"
          type="daterange"
          align="center"
          @change="handleDatePicker"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions">
        </el-date-picker>
      </el-col>
    </el-row>
    <el-row :gutter="18">
      <el-table
        :data="logs"
        class="logs-table"
        size="medium"
        border
        stripe>
        <el-table-column
          prop="content"
          header-align="center"
          align="left"
          label="content">
        </el-table-column>
        <el-table-column
          prop="createTime"
          header-align="center"
          align="left"
          label="time"
          :sortable="true"
          :sort-by="'createTime'"
          :formatter="formatTime"
          width="180">
        </el-table-column>
      </el-table>
    </el-row>
    <el-row class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageIndex"
        :page-sizes="[10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import {getLogs} from '../api/log';
  import {debounce} from 'lodash';

  export default {
    name   : "logs",
    data() {
      let logs      = [];
      let pageSize  = 10;
      let pageIndex = 1;
      let total     = 100;
      let search    = '';
      // let today     = Date().now();
      let timeZone  = '';
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end   = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end   = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end   = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeZone     : timeZone,
        logs         : logs,
        total        : total,
        search       : search,
        pageIndex    : pageIndex,
        pageSize     : pageSize
      };
    },
    created() {
      this.getLogs();
    },
    filters: {
      timestampsFilter: function (value) {
        if (!value) {
          return '';
        }
        return new Date(value).toLocaleDateString();
      }
    },
    watch  : {
      search: function () {
        this.getLogs();
      }
    },
    methods: {
      getLogs: debounce(function () {
        let start = this.timeZone[0] || '';
        let end   = this.timeZone[1] || '';
        console.log(start);
        console.log(end);
        return getLogs({
          pageIndex: this.pageIndex,
          pageSize : this.pageSize,
          search   : this.search,
          start    : start,
          end      : end,
        })
          .then(result => {
            this.logs  = result.logs.rows;
            this.total = result.logs.count;
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
      handleDatePicker() {
        this.getLogs();
      },
      handleCurrentChange(val) {
        this.pageIndex = val;
        this.getLogs();
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.getLogs();
      },
      formatTime(row, column, cellValue, index) {
        if (!cellValue) {
          return '';
        }
        // return new Date(cellValue).toLocaleDateString();
        return new Date(cellValue).toLocaleString();
      }
      // sortLogs(a, b) {
      //   return a.createTime < b.createTime;
      // }
    }
  }
</script>

<style scoped>

  .datePicker {
    margin: 1em;
  }

  .search {
    margin-left: 2em;
  }

  .logs-table {
  }

  .page {
    margin: 2em;
  }
</style>

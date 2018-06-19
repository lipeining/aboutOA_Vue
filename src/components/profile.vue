<template>
  <section class="userWrap">
    <header>
      <el-alert v-if="error" :title="error.title" type="warning" :description="error.message" show-icon/>
    </header>
    <el-row>
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
    </el-row>
    <qriously value="https://www.baidu.com" :size="200"/>
    <!--<el-row>-->
    <!--&lt;!&ndash;<h1>{{currentPage}} / {{pageCount}}</h1>&ndash;&gt;-->
    <!--&lt;!&ndash;<pdf src="/images/pdf/test.pdf"&ndash;&gt;-->
    <!--&lt;!&ndash;@num-pages="pageCount = $event"&ndash;&gt;-->
    <!--&lt;!&ndash;@page-loaded="currentPage = $event"&ndash;&gt;-->
    <!--&lt;!&ndash;&gt;</pdf>&ndash;&gt;-->
    <!--<h1>{{currentPage}} / {{pageCount}}</h1>-->
    <!--<pdf src="/images/pdf/cbook.pdf"-->
    <!--@num-pages="pageCount = $event"-->
    <!--@page-loaded="currentPage = $event"-->
    <!--&gt;</pdf>-->
    <!--</el-row>-->
    <!--<el-row>-->
      <!--<pdf-->
        <!--v-for="i in numPages"-->
        <!--:key="i"-->
        <!--:src="src"-->
        <!--:page="i"-->
        <!--style="display: inline-block; width: 25%"-->
      <!--&gt;</pdf>-->
    <!--</el-row>-->

    <!--<button @click="$refs.myPdfComponent.print(100, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14])">print</button>-->
    <!--<pdf ref="myPdfComponent" src="/images/pdf/cbook.pdf"></pdf>-->
    <!---->

    <!--<div>-->
      <!--<input type="checkbox" v-model="show">-->
      <!--<select v-model="src" style="width: 30em">-->
        <!--<option v-for="item in pdfList" :value="item" v-text="item"></option>-->
      <!--</select>-->
      <!--<input v-model.number="page" type="number" style="width: 5em"> /{{numPages}}-->
      <!--<button @click="rotate += 90">&#x27F3;</button>-->
      <!--<button @click="rotate -= 90">&#x27F2;</button>-->
      <!--<button @click="$refs.pdf.print()">print</button>-->
      <!--<div style="width: 50%">-->
        <!--<div v-if="loadedRatio > 0 && loadedRatio < 1"-->
             <!--style="background-color: green; color: white; text-align: center"-->
             <!--:style="{ width: loadedRatio * 100 + '%' }">-->
          <!--{{ Math.floor(loadedRatio * 100) }}%-->
        <!--</div>-->
        <!--<pdf v-if="show" ref="pdf" style="border: 1px solid red"-->
             <!--:src="src" :page="page"-->
             <!--:rotate="rotate" @password="password"-->
             <!--@progress="loadedRatio = $event" @error="error"-->
             <!--@num-pages="numPages = $event"-->
             <!--@link-clicked="page = $event"></pdf>-->
      <!--</div>-->
    <!--</div>-->

    <!--<qrcode-reader @decode="onDecode"></qrcode-reader>-->
    <!--<el-row>-->
    <!--<vue-q-art :config="config"></vue-q-art>-->
    <!--</el-row>-->
    <!--<vue-q-art :config="config"></vue-q-art>-->
  </section>
</template>

<script>
  import {update, getUser} from '../api/user';
  import VueQArt from 'vue-qart';
  import pdf from 'vue-pdf';

  // var loadingTask = pdf.createLoadingTask('/images/pdf/cbook.pdf');
  export default {
    name      : "profile",
    components: {
      'vue-q-art': VueQArt,
      'pdf'      : pdf
    },
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
      let config  = {
        value    : 'https://www.baidu.com',
        imagePath: './examples/assets/logo.png',
        filter   : 'color'
      };
      return {
        user       : user, rules: rules,
        error      : null, loading: false,
        config     : {
          value    : 'https://www.baidu.com',
          imagePath: './examples/assets/logo.png',
          filter   : 'color'
        },
        // currentPage: 0, pageCount: 0,
        // src        : loadingTask, numPages: undefined,
        show: true,
        pdfList: [
          '',
          'https://cdn.mozilla.net/pdfjs/tracemonkey.pdf',
          'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/freeculture.pdf',
          'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/annotation-link-text-popup.pdf',
          'https://cdn.rawgit.com/mozilla/pdf.js/c6e8ca86/test/pdfs/calrgb.pdf',
          'https://cdn.rawgit.com/sayanee/angularjs-pdf/68066e85/example/pdf/relativity.protected.pdf',
          'data:application/pdf;base64,JVBERi0xLjUKJbXtrvsKMyAwIG9iago8PCAvTGVuZ3RoIDQgMCBSCiAgIC9GaWx0ZXIgL0ZsYXRlRGVjb2RlCj4+CnN0cmVhbQp4nE2NuwoCQQxF+/mK+wMbk5lkHl+wIFislmIhPhYEi10Lf9/MVgZCAufmZAkMppJ6+ZLUuFWsM3ZXxvzpFNaMYjEriqpCtbZSBOsDzw0zjqPHZYtTrEmz4eto7/0K54t7GfegOGCBbBdDH3+y2zsMsVERc9SoRkXORqKGJupS6/9OmMIUfgypJL4KZW5kc3RyZWFtCmVuZG9iago0IDAgb2JqCiAgIDEzOAplbmRvYmoKMiAwIG9iago8PAogICAvRXh0R1N0YXRlIDw8CiAgICAgIC9hMCA8PCAvQ0EgMC42MTE5ODcgL2NhIDAuNjExOTg3ID4+CiAgICAgIC9hMSA8PCAvQ0EgMSAvY2EgMSA+PgogICA+Pgo+PgplbmRvYmoKNSAwIG9iago8PCAvVHlwZSAvUGFnZQogICAvUGFyZW50IDEgMCBSCiAgIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NTc0IDg0MS44ODk3NzEgXQogICAvQ29udGVudHMgMyAwIFIKICAgL0dyb3VwIDw8CiAgICAgIC9UeXBlIC9Hcm91cAogICAgICAvUyAvVHJhbnNwYXJlbmN5CiAgICAgIC9DUyAvRGV2aWNlUkdCCiAgID4+CiAgIC9SZXNvdXJjZXMgMiAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwgL1R5cGUgL1BhZ2VzCiAgIC9LaWRzIFsgNSAwIFIgXQogICAvQ291bnQgMQo+PgplbmRvYmoKNiAwIG9iago8PCAvQ3JlYXRvciAoY2Fpcm8gMS4xMS4yIChodHRwOi8vY2Fpcm9ncmFwaGljcy5vcmcpKQogICAvUHJvZHVjZXIgKGNhaXJvIDEuMTEuMiAoaHR0cDovL2NhaXJvZ3JhcGhpY3Mub3JnKSkKPj4KZW5kb2JqCjcgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cKICAgL1BhZ2VzIDEgMCBSCj4+CmVuZG9iagp4cmVmCjAgOAowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDA1ODAgMDAwMDAgbiAKMDAwMDAwMDI1MiAwMDAwMCBuIAowMDAwMDAwMDE1IDAwMDAwIG4gCjAwMDAwMDAyMzAgMDAwMDAgbiAKMDAwMDAwMDM2NiAwMDAwMCBuIAowMDAwMDAwNjQ1IDAwMDAwIG4gCjAwMDAwMDA3NzIgMDAwMDAgbiAKdHJhaWxlcgo8PCAvU2l6ZSA4CiAgIC9Sb290IDcgMCBSCiAgIC9JbmZvIDYgMCBSCj4+CnN0YXJ0eHJlZgo4MjQKJSVFT0YK',
        ],
        src:'',
        loadedRatio: 0,
        page: 1,
        numPages: 0,
        rotate: 0,
      };
    },
    created() {
      this.user = this.$store.getters.getUserInfo;
    },
    mounted() {
      // this.src.then(pdf => {
      //   this.numPages = pdf.numPages;
      // });
    },
    methods   : {
      // password: function(updatePassword, reason) {
      //
      //   updatePassword(prompt('password is "test"'));
      // },
      // error: function(err) {
      //
      //   console.log(err);
      // },
      // onDecode(decodedString) {
      //   // ...
      //   this.$message(decodedString);
      // },
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



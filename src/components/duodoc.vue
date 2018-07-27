<template>
  <div>
    <app-header/>
    <section>
      <el-row>
      <el-input v-model="text" type="textarea" clearable>
      </el-input>
      </el-row>
      <el-row>
        <el-button @click="emitClientReady(1)">
          chrome clientReady
        </el-button>
        <el-button @click="emitClientReady(0)">
          friefox clientReady
        </el-button>
        <el-button @click="sendUserChange(1)">
          chrome userChange
        </el-button>
        <el-button @click="sendUserChange(0)">
          firefox userChange
        </el-button>
      </el-row>
      <el-row>
          <el-button @click="sendNews()">
          send news
        </el-button>         
        {{log}}
      </el-row>
      <el-row>
          <el-button @click="kickUser1()">
          kick user1
        </el-button>         
         <el-button @click="kickUser2()">
          kick user2
        </el-button>
        {{log}}
      </el-row>
    </section>
  </div>
</template>

<script>
  import AppHeader from './header';
  import {kickUser} from '../api/doc';

  export default {
    name      : "home",
    components: {
      'app-header': AppHeader,
    },
    computed  : {
    },
    sockets : {
      connect  : function () {
        console.log('socket connected');
      },
      message   : function (obj) {
        console.log('this method was fired by the socket server. eg: io.emit("message", obj)');
        console.log(JSON.stringify(obj));
        this.$notify({
          type   : 'success',
          title  : 'new message from server',
          message: obj
        });
        if(!this.receivedClientVars && obj.accessStatus){
          if(obj.accessStatus == "deny") {
               
          }else if(obj.accessStatus == "needPassword"){
            
          }else if(obj.accessStatus == "wrongPassword"){

          }
        } //if we haven't recieved the clientVars yet, then this message should it be
          else if (!this.receivedClientVars){
              //log the message
              if (window.console) console.log(obj);

              this.receivedClientVars = true;

              //set some client vars
              this.clientVars = obj.data;
              this.clientVars.userAgent = "Anonymous";
              this.clientVars.collab_client_vars.clientAgent = "Anonymous";
        
              //initalize the pad
              // pad._afterHandshake();
              // initalized = true;
       }//This handles every Message after the clientVars
         else{
              //this message advices the client to disconnect
            if (obj.disconnect){
                console.warn("FORCED TO DISCONNECT");
                console.warn(obj);
                // padconnectionstatus.disconnected(obj.disconnect);
                socket.disconnect();
                return;
            }else{
                // pad.collabClient.handleMessageFromServer(obj);
            }
        }
      },
      kickuser:function(data){
        console.log(data);
      },
      kickoutuser:function(data){
        console.log(data);
      },
      news: function(data){
        console.log(JSON.stringify(data));
      }
    },
    data() {
      let client_vars = {};
      let receivedClientVars = false;
      return {
        text: '',
        log:'',
        baseRev:0,
        client_vars:client_vars,
        receivedClientVars:receivedClientVars,
      }
    },
    created() {
      // 42["post","1531465488909={\"type\":\"COLLABROOM\",
      // \"data\":{\"type\":\"CLIENT_READY\",\"roomType\":\"padpage\",\"roomName\":\"padpage/144115210748575764$p5b0b69a6168474af9404727d2ed2365d\",\"upid\":\"BqI21X2yZIht14eMpv0YpYIY2aq3pD1nNc4B1H6teN0eqpST2IQmKC2Cjyb92VtPX42P0nm71emDyB12piJ31\",\"gid\":\"144115210748575764$p5b0b69a6168474af9404727d2ed2365d\",\"sid\":\"140638850736\",\"tid\":1531465484641,\"sig\":\"95194ad5b816d37f55c6417b0ed7a7603d90ccef\",\"data\":{\"lastRev\":23,
      // \"userInfo\":{\"userId\":\"p.144115210748575764\",\"name\":\"said\",\"ip\":\"\",\"colorId\":0,\"status\":\"connected\",\"userLink\":\"\",\"userPic\":\"https://wx.qlogo.cn/mmopen/vi_32/UkGwuw17E6OyvQD0mc5Qv3AZjV6ibXooF8vUapFrYKhiaBGExniaDBb3PIpXcuYvgvT18vxe448sokibQmvmu0Nicyg/132\",\"uin\":\"144115210748575764\",\"openTime\":1531465486203},\"stats\":{\"screen\":\"1520,351,1535,876,1600,900\"},\"cookie\":\"uuid=34m55fatbz6u; pgv_info=ssid=s7758149445; pgv_pvid=8746689050; qv_swfrfh=www.ifanr.com; qv_swfrfc=v20; qv_swfrfu=http://www.ifanr.com/675122; pgv_pvi=1846390784; pgv_si=s8694018048; ptui_loginuin=827154031@qq.com;
      //  ptisp=ctc; RK=FXxcNKPQaX; ptcz=63c74a6b4e733b322f3ffe604513d344044fbd69d4d4a6ad8fe2773f4bdf4abb; uin=o0827154031; skey=@yaUHHVmiy; pt2gguin=o0827154031; uid=144115210748575764; uid_key=Jvpvi2849dcId6bJx%252FfW7crEXHPpWQb6e%252Fs67cW7CJnNzKDPP%252FFpTBKaIrdHkTHHNlskCYsVLnPIT1Z87wwemO9bZjBoG35Q; utype=wx; ES2=6bd7e1d05217ba47; localnum=83; isBrandGuideShow={\\\"\\\":true}; platform=1; _qpsvr_localtk=1531465488123; TOK=aaa46cee8ee6fcd0\"}}}"]

    },
    methods   : {
      sendNews(){
        let data_news = {
          msg: 'dddddddd'
        };
        this.$socket.emit('news', data_news);
      },
      kickUser1(){
        let query ={
          userId: 1,
          status: 4
        };
        kickUser(query)
        .then((res)=>{
          console.log(res);
        });
      },      
      kickUser2(){
        let query ={
          userId: 2,
          status: 4
        };
        kickUser(query)
        .then((res)=>{
          console.log(res);
        });
      },
      emitClientReady(chrome){
      let data_chrome = {
        type: "CLIENT_READY",
        padId:'aaa',
        token:'t.4SKc82gdiaMsbzbUfX0W',
        sessionID:'',
        protocolVersion:2,
      };
      let data_firefox = {
        type: "CLIENT_READY",
        padId:'aaa',
        token:'t.gN4N6WxXwUdwnZWe2j0D',
        sessionID:'',
        protocolVersion:2,
      };
      let data = chrome?data_chrome:data_firefox;
      this.$socket.emit('message', data);
      },
      sendUserChange(chrome){
        let data_chrome = {
          type: 'COLLABROOM',
          data:{
            type:'USER_CHANGES',
            apool:{
              numToAttrib:{
                0:["author", "a.4C4nbYEOikGY3Aqd"]
              },
              nextNum:1,
            },
            changeset: "Z:1>1*0+1$1",
            baseRev: 2,
          },
        };
        let data_firefox = {
          type: 'COLLABROOM',
          data:{
            type:'USER_CHANGES',
            apool:{
              numToAttrib:{
                0:["author", "a.INSigM3DaqsU0rSE"]
              },
              nextNum:1,
            },
            changeset: "Z:1>1*0+1$2",
            baseRev: 2,
            // changeset: "Z:2>1*0+1$2",
            // baseRev: 3,
          },
        };
        let data = chrome?data_chrome:data_firefox;
        this.$socket.emit('message', data);
      }
    },
    watch     : {
    }
  }
</script>

<style scoped>
</style>

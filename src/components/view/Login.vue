<template>
  <el-row class="LoginWrapper">
    <div class="blue-bg-silver"></div>
    <div class="LoginContainer">
        <h3>AnyChat远程双录系统</h3>
        <el-form :label-position="'top'" :model="LoginForm"  ref="LoginForm" label-width="100px" class="LoginForm">
        <el-form-item label="账号:" prop="username" class="labelDispay">
          <el-input v-model="LoginForm.username" class="inputBorder username" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password" class="labelDispay">
          <el-input type="password" v-model="LoginForm.password" class="inputBorder password" placeholder="密码可为空" @keyup.native="show($event)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="LoginButton" type="primary" @click="SubmitForm('LoginForm')">登录</el-button>
        </el-form-item>
      </el-form>

    </div>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      LoginForm: {
        username: '',
        password: '',
      }
    };
  },
  mounted(){

  },
  methods: {
    SubmitForm(formName) {
      var that=this;
      sessionStorage.setItem("content",JSON.stringify(that.LoginForm));
      this.$router.push({ path: '/Home/Overview' });
    },
    show: function (ev) {
          if(ev.keyCode==13){
              console.info('你按了回车');
              this.SubmitForm('LoginForm');
          }
      }

  }
}
</script>

<style>
    .LoginWrapper .inputBorder input{
        border: 1px solid #e5e5e5;
        box-shadow: none;
        font-weight: normal;
        font-size: 12px;
        height: 37px;
        line-height: 26px;
        border-radius: 0px;
        color: #555;
        font-family: inherit;

    }

    .LoginWrapper .inputBorder.username input{
        background: url("../../assets/img/username.png") no-repeat;
        background-position: 95% 50%;
    }
    .LoginWrapper .inputBorder.password input{
        background: url("../../assets/img/password.png") no-repeat;
        background-position: 95% 50%;
    }
    .LoginWrapper .labelDispay label{
        display: block !important;
    }
    .LoginWrapper .labelDispay label:before{
        content: '' !important;
    }
    .LoginWrapper .imgcode{
        position: absolute;
        cursor: pointer;
        right: 0px;
        top: 0px;
        height: 37px;
        width: 106px;
        background: #FAFAFA;
    }
    .LoginWrapper .checkbox{
        text-align: left;
        width: 100%;
        margin: 2px 0px;
    }
    .LoginWrapper .marginBottom{
        margin-bottom: 0px;
    }
    .LoginWrapper .inputBorder input::-webkit-input-placeholder { /* WebKit browsers */
        color:    #CBCBCB;
    }
    .LoginWrapper .inputBorder input::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
        color:    #CBCBCB;
    }
    .LoginWrapper .inputBorder input::-moz-placeholder { /* Mozilla Firefox 19+ */
        color:    #CBCBCB;
    }
    .LoginWrapper .inputBorder input:-ms-input-placeholder { /* Internet Explorer 10+ */
        color:    #CBCBCB;
    }
    .checkbox>span>span{
        border: 1px solid #DADADA;
        border-radius:0px;
    }
    .LoginButton{
        border-radius: 0px;
    }
    .el-notification{
        right: 50%;
        margin-right: -165px;
        font-family: 微软雅黑;
    }
</style>
<style scoped>
    *{
        font-family: 微软雅黑 !important;
    }
    body{
        overflow-x: hidden;
        font-family: 微软雅黑 !important;
    }
    .LoginWrapper {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .LoginContainer {
        background: #fff;
        -webkit-box-shadow: 0px 1px 10px #CFCFCF;
        box-shadow: 0px 1px 10px #CFCFCF;
        padding: 2% 5%;
        /* display: table-cell; */
        min-width: 100px;
        min-height: 100px;
        text-align: center;
        vertical-align: middle;
        position: absolute;
        left: 50%;
        top:50%;
        margin-left:-200px;
        margin-top:-200px;
    }
    .LoginContainer h3{
        margin: 0 0px 25px;
        padding: 0px;
        text-align: center;
        margin-bottom: 15px;
        font-size: 22px;
    }
    .LoginButton {
        width: 100%;
    }
    .blue-bg-silver {
        position: absolute;
        top: 0;
        z-index: -1;
        width: 100vw;
        height: 50vh;
        background-color: #004790;
        left: 0;
    }

</style>

<template>
    <div class="container-login">
        <div class="wrap-login">
            <div class="logo">
                <img src="../assets/icons/Logo.svg" alt="">
            </div>
            <div class="content-login">
                <div class="welcome">Welcome!!</div>
                <div class="txt">Don’t have an account? <a href="#" class="register">註冊帳號</a></div>
                <div style="position: relative">
                    <div class="email">
                        <input v-model="account" type="email" placeholder="Email Address" @input="errorLogin=false">
                        <img src="../assets/icons/email.svg" alt="">
                    </div>
                    <div class="password">
                        <input v-model="password" id="pw-input" type="password" placeholder="Password" @keyup.enter="login()" @input="errorLogin=false">
                        <img v-if="psVisible" src="../assets/icons/eye-open.svg" @click="pwShow()" alt="">
                        <img v-else src="../assets/icons/eye-off.svg" @click="pwShow()" alt="">
                    </div>
                    <span v-if="errorLogin" style="color: #da3333; position: absolute; bottom: -25px;left: 20px">※ 帳號或密碼輸入錯誤</span>
                </div>

                <div class="login" @click="login()">Log in / 登入</div>
                <a href="#" class="forget">忘記密碼?</a>
            </div>
        </div>
        <div class="privacy">童綜合醫院＠2021 版權所有 隱私權宣告</div>
    </div>
</template>

<script>
    import {loginUser} from '../api/index.js'

    export default {
        name: 'LoginPage',
        data() {
            return {
                account: '',
                password: '',
                psVisible: false,
                errorLogin: false
            }
        },
        methods: {
            async login() {
                this.errorLogin = false
                let paramObj = {
                    username: this.account,
                    password: this.password
                }
                let result = await loginUser(paramObj)
                console.log("登入使用者=>",result)
                if (result.result) {
                    this.$store.commit('setLoginInfo', result)
                    this.$router.push({
                        name: 'Index'
                    })
                } else {
                    this.errorLogin = true
                }
            },
            pwShow() {
                this.psVisible = !this.psVisible
                let x = document.getElementById('pw-input')
                if (x.type == 'password') {
                    x.type = 'text'
                } else {
                    x.type = 'password'
                }
            }
        }
    }
</script>

<style scoped>
    .container-login {
        width: 100%;
        height: 100vh;
        background-image: url('../assets/images/Labeling-bg-login.png');
        background-repeat: no-repeat;
        background-position: center;
        color: #EEF1F6;
    }

    .wrap-login {
        padding: 50px 150px 0px;
        display: flex;
        flex-direction: column;
        height: calc(100% - 180px);
    }

    .logo img {
        vertical-align: middle;
    }

    .content-login {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: auto;
        flex-grow: 1;
        justify-content: center;
    }

    .welcome {
        font: normal normal bold 35px/42px Arial;
        margin-bottom: 15px;
    }

    .txt {
        font: normal normal normal 16px/26px Arial;
        margin-bottom: 38px;
    }

    .register {
        font: normal normal normal 16px/24px Noto Sans TC;
        color: #587FFF;
        text-decoration: none;
    }

    .email, .password {
        box-sizing: border-box;
        border: 1px solid #EEF1F6;
        width: 328px;
        background: #1B2534;
        padding: 15px 16px;
    }

    input {
        border: none;
        background: #1B2534;
        color: #EEF1F6;
        font: normal normal normal 16px/16px Arial;
        width: 90%;
    }

    input:focus {
        outline: none;
    }

    .email {
        border-radius: 5px 5px 0px 0px;
        border-bottom: none;
    }

    .password {
        border-radius: 0px 0px 5px 5px;
    }

    .email img, .password img {
        vertical-align: bottom;
    }

    .password img {
        cursor: pointer;
    }

    .email:hover {
        border: #587FFF 1px solid;
        border-bottom: none;
    }

    .email:hover + .password {
        border-top: #587FFF 1px solid;
    }

    .password:hover {
        border: #587FFF 1px solid;
    }

    .login {
        width: 328px;
        height: 50px;
        background: transparent linear-gradient(90deg, #007ADF 0%, #00ECBC 100%) 0% 0% no-repeat padding-box;
        box-shadow: 0px 3px 6px #23304480;
        border-radius: 5px;
        font: normal normal bold 16px/50px Arial;
        color: #FFFFFF;
        margin-top: 40px;
        margin-bottom: 25px;
        cursor: pointer;
        position: relative;
        transition: 3s;
    }

    .login:after {
        content: '';
        background: url('../assets/icons/arrow-right.svg') no-repeat;
        width: 26px;
        height: 20px;
        position: absolute;
        right: 14px;
        top: 15px;
    }

    .login:hover {
        background: linear-gradient(90deg, #183BC3 0%, #45D98C 100%);
    }

    .forget {
        font: normal normal normal 16px/24px Noto Sans TC;
        color: #EEF1F6;
        text-decoration: none;
    }

    .privacy {
        font: normal normal normal 12px/18px Noto Sans TC;
        text-align: center;
        margin-top: 100px;
    }

</style>

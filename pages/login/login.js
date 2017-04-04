var pathname = require("../../utils/url");
var {showToastError}=require('../../utils/wx');

Page({
    data: {
        username: "",
        password: "",
        loading: false,
        errors: {
            username: false,
            password: false
        }
    },
    onLoad(){
    },
    handleChange(e) {
        var { value } = e.detail;
        var { name } = e.target.dataset;
        this.setData({
            [name]: value
        });
    },
    handleBlur() {
        this.validation();
    },
    handleFocus(e) {
        var { name } = e.target.dataset;
        var { errors } = this.data;
        errors[name] = false;
        this.setData({
            errors
        });
    },
    handleSubmit(){
        var _this = this;
        var { username, password } = this.data;
        var thirdSession=wx.getStorageSync('3rd_session');
        console.log("发送验证绑定urp请求");
        wx.request({
            url: pathname + '/api/urpLogin',
            method: "POST",
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                username,
                urppassword: password,
                thirdSession
            },
            success(res) {
                var { data, err } = res.data;
                var {urpPass,bindWxApp,userInfo}=data;
                if(err&&!data){
                    showToastError("网络错误");
                }else if (!urpPass) {
                    showToastError("账号密码错误");
                    _this.validation(true);
                } else {
                    if(bindWxApp){
                        console.log("绑定urp成功，跳转到首页");
                        wx.redirectTo({
                            url: '../index/index'
                        });
                    }else{
                        showToastError("没有微信登录授权，请重新授权");
                    }
                }
            },
            fail() {
                showToastError("网络错误");
            },
            complete() {
                _this.setData({
                    loading: false
                });
            }
        });
    },
    //清空form
    cleanForm() {
        this.setData({
            username: "",
            password: "",
            loading: false,
            errors: {
                username: false,
                password: false
            }
        })
    },
    //验证器
    validation(submitErr) {
        if(submitErr){
            this.setData({
                errors:{
                    username:" ",
                    password:" "
                }
            });
            return false;
        }
        var { username, password } = this.data;
        var errors = {
            username: false,
            password: false
        };
        if (!username) {
            errors.username = "用户名不能为空";
        } else if (/[^0-9]/.test(username)) {
            errors.username = "用户名为纯数字"
        }
        if (!password) {
            errors.password = "密码不能为空";
        }
        this.setData({
            errors
        });
        return !username && !password;
    }
})
var pathname = require("../../utils/url");
var {login}=require('../../utils/wx');

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
        this.checkSession(function(){
            console.log("未过期1");
        })
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
    formSubmit(){
        this.checkSession(this.fetchSubmit);
    },
    //检验登陆状态
    checkSession(reslove,reject){
        wx.checkSession({
            success: function(){
                reslove()
            },
            fail: function(){
                reject();
                login(wx);     
            },
        });
    },
    //登录 请求
    fetchSubmit() {
        if (this.validation()) {
            return null;
        }
        this.setData({
            loading: true
        });
        var _this = this;
        var { username, password } = this.data;
        var thirdSession=wx.getStorageSync('3rd_session')
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
                    _this.showError("网络错误");
                }else if (!urpPass) {
                    _this.showError("账号密码错误");
                    _this.validation(true);
                } else {
                    if(bindWxApp){
                        wx.setStorage({
                            key: 'userInfo',
                            data: JSON.stringify(userInfo)
                        })
                    }else{
                        _this.showError("没有微信登录授权，请重新授权");
                        login(wx);
                    }
                }
            },
            fail() {
                _this.showError("网络错误");
            },
            complete() {
                _this.setData({
                    loading: false
                });
            }
        });

    },
    //toast error
    showError(title) {
        wx.showToast({
            title,
            icon: 'loading',
            duration: 2000
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
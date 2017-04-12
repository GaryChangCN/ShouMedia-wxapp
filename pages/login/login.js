var { showToastError } = require('../../utils/wxApp');
var {bindUrp}=require('../../utils/service');

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
    onLoad() {},
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
    handleSubmit() {
        var _this = this;
        var { username, password } = this.data;
        console.log("发送验证绑定urp请求");
        bindUrp(username,password).then((data)=>{
            var {pass}=data;
            if(pass){
                console.log("绑定成功，跳转到首页");
                wx.redirectTo({
                    url: '../index/index'
                });
            }else{
                showToastError("密码错误");
            }
        }).catch((err)=>{
            console.log(err);
            showToastError(err);
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
        if (submitErr) {
            this.setData({
                errors: {
                    username: " ",
                    password: " "
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
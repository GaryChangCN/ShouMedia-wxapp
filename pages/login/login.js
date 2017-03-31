var pathname=require("../../utils/url");
Page({
    data: {
        username:"",
        password:"",
        loading:false,
        errors:{
            username:false,
            password:false
        }
    },
    handleChange(e){
        var {value}=e.detail;
        var {name}=e.target.dataset;
        this.setData({
            [name]:value
        });
    },
    formSubmit(){
        this.setData({
            loading:true
        });
        var _this=this;
        var {username,password}=this.data;
        wx.request({
            url: pathname+'/api/urpLogin',
            method:"POST",
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{
                username,
                urppassword:password
            },
            success(res) {
                console.log(res.data);
            },
            fail(){

            },
            complete() {
                _this.setData({
                    loading:false
                });
            }
        });

    },
    onLoad: function(options) {
    },
    validation(){
        var {username,password}=this.data;
        var errors={
            username:false,
            password:false
        };
        if(!username){
            errors.username="用户名不能为空";
        }else if(/[^0-9]/.test(username)){
            errors.username="用户名为纯数字"
        }
        if(!password){
            errors.password="密码不能为空";
        }
        this.setData({
            errors
        });
        return !username&&!password;
    }
})
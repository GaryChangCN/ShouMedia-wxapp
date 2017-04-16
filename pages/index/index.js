var {showToastError,wxAuth,navigateToLogin,checkMemoryBindUrp}=require('../../utils/wxApp');
var {fetchBindUrp,fetchInfoPlus,getAvatar}=require('../../utils/service');
var blockies=require("../../utils/blockies");
Page({
    data: {
        username:"学号",
        name:"姓名",
        bindUrp:true,
        onLoad:false
    },
    onLoad(){
        console.log("加载主页");
        var _this=this;
        showToastError("加载中",500);
        this.setData({onLoad:true})
        this.thisFetchBindUrp().then((data)=>{
            return _this.thisFetchUserInfo(data);
        }).catch((err)=>{
            console.error(err);
            showToastError(err);
        });
    },
    onShow(){
        console.log("显示主页");
        if(this.data.onLoad){
            console.log("已经加载中，不做show生命周期");
            return ;
        }
        console.log("show 时候检查");
        if(checkMemoryBindUrp()){
            this.updateFromMemory();
        }else{
            this.setData({bindUrp:false});
        }
    },
    updateFromMemory(){
        var {avatarSeed,userInfo}=getApp().globalData;
        this.updateIdenticon(avatarSeed);
        var {username,name}=userInfo;
        this.setData({
            username,name,
            bindUrp:true
        });
    },
    thisFetchBindUrp(){
        var {globalData}=getApp();
        var _this=this;
        return wxAuth().then(({wxAuth})=>{
            if(wxAuth){
                console.log("已经有微信登录授权");
                console.log("开始获取bindUrp");
                return fetchBindUrp();
            }else{
                throw "无微信授权";
            }
        }).then(({bindUrp})=>{
            if(bindUrp){
                console.log("已经绑定urp");
                globalData.memoryBindUrp=true;
                _this.setData({bindUrp:true});
                console.log("开始获取用户信息");
                return fetchInfoPlus("cache");
            }else{
                console.log("未绑定urp");
                _this.setData({bindUrp:false});
                return false;
            }
        });
    },
    thisFetchUserInfo(data){
        var {globalData}=getApp();
        var _this=this;
        if(!data){
            return false;
        }
        var {ret,pass}=data;
        console.log("获取用户信息成功");
        if(!pass){
            showToastError("urp密码错误");
            navigateToLogin();
            return false;
        }
        wx.setStorage({
            key: 'userInfo',
            data: JSON.stringify(ret)
        });
        globalData.userInfo=ret;
        var {username,name}=ret;
        _this.setData({
            username,
            name
        });
        console.log("储存用户信息到storage和globalData");
        console.log("开始获取头像");
        return getAvatar().then((data)=>{
            console.log(data);
            if(!data){
                return false;
            }
            console.log("获取头像成功");
            var {avatar}=data;
            globalData.avatarSeed=avatar;
            _this.updateIdenticon(avatar);
        });
    },
    onReady(){
        this.updateIdenticon("iconbygar");   
    },
    updateIdenticon(seed){
        var context=blockies(
            wx.createCanvasContext('avatar'),{
                seed,
                color: '#ffffff',
                size:8,
                scale:7
            }
        );
        context.draw();
    }
})
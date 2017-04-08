var {showToastError,fetchInfoPlus,checkHasThirdSession,fetchBindUrp}=require("../../utils/wx");
var blockies=require("../../utils/blockies");
Page({
    data: {
        username:"学号",
        name:"姓名",
        bindUrp:true
    },
    toLogin() {
        wx.navigateTo({
            url: '../login/login'
        })
    },
    onLoad() {
        console.log("显示主页");
        var {globalData}=getApp();
        var _this=this;
        checkHasThirdSession().then(({hasThirdSession,err})=>{
            if(err){
                console.log("储存登录信息失败");
                showToastError("储存登录信息失败");
            }else{
                console.log("已有储存的thirdSession");
                return fetchBindUrp().then(({bindUrp})=>{
                    if(bindUrp){
                        console.log("已经绑定urp");
                        globalData.bindUrp=true;
                        _this.setData({bindUrp:true});
                        return fetchInfoPlus("cache").then((userInfo)=>{
                            wx.setStorage({
                                key: 'userInfo',
                                data: JSON.stringify(userInfo)
                            });
                            globalData.userInfo=userInfo;
                            var {username,name}=userInfo;
                            _this.updateIdenticon(username);
                            _this.setData({
                                username,
                                name
                            });
                        });
                    }else{
                        console.log("未绑定urp，部分功能不可用");
                        _this.setData({bindUrp:false})
                        // wx.redirectTo({
                        //     url: '../login/login'
                        // });
                    }
                });
            }
        }).catch((err)=>{
            console.error(err);
            showToastError("网络错误");
        });
    },
    onReady(){     
        var context=blockies(
            wx.createCanvasContext('avatar'),{
                seed:"iconbygar",
                color: '#ffffff',
                size:8,
                scale:7
            }
        );
        context.draw();
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
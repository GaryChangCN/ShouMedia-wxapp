var {showToastError,fetchInfoPlus,checkHasThirdSession,fetchBindUrp}=require("../../utils/wx");
Page({
    data: {
        username:"学号",
        name:"姓名"
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
                showToastError("储存登录信息失败")
            }else{
                console.log("已有储存的thirdSession");
                return fetchBindUrp().then(({bindUrp})=>{
                    if(bindUrp){
                        console.log("已经绑定urp");
                        globalData.bindUrp=true;
                        return fetchInfoPlus("cache").then((userInfo)=>{
                            wx.setStorage({
                                key: 'userInfo',
                                data: JSON.stringify(userInfo)
                            });
                            globalData.userInfo=userInfo;
                            var {username,name}=userInfo;
                            _this.setData({
                                username,
                                name
                            });
                        });
                    }else{
                        console.log("未绑定urp，跳转到绑定页面");
                        wx.redirectTo({
                            url: '../login/login'
                        });
                    }
                });
            }
        }).catch((err)=>{
            console.error(err);
            showToastError("网络错误");
        });
    },
    onReady(){
        var {globalData}=getApp();        
        var context=require("../../utils/blockies")(
            wx.createCanvasContext('avatar'),{
                seed:globalData.userInfo.username||"iconbygary",
                color: '#ffffff',
                size:8,
                scale:7
            }
        );
        context.draw();
    },
})
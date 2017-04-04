var {showToastError,fetchInfoPlus}=require("../../utils/wx");
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
        fetchInfoPlus("cache").then((data)=>{
            wx.setStorage({
                key: 'userInfo',
                data: JSON.stringify(data)
            });
            var {username,name}=data;
            _this.setData({
                username,
                name
            });
        }).catch((err)=>{
            showToastError(err);
        })
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
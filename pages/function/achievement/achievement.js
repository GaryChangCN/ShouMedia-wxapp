var {showToastError,checkMemoryBindUrp,navigateToLogin}=require('../../../utils/wxApp');
var {fetchNewAchievement}=require('../../../utils/service');

Page({
    data: {
        achievementList: [],
        refreshDisabled: false,
        visible: false,
        animationData:"",
        rotate:0
    },
    onLoad: function(options) {
        if(checkMemoryBindUrp()){
            var _this=this;
            wx.getStorage({
                key: 'achievementVisible',
                success({data}){
                    _this.setData({
                        visible:data==="true"?true:false
                    });
                },
                fail() {
                    _this.setData({
                        visible:true
                    });
                }
            });
            this.fetch();
        }else{
            navigateToLogin();
        }
    },
    changeVisible(e) {
        var { visible } = this.data;
        visible=!visible;
        this.setData({ visible });
        wx.setStorage({
            key: 'achievementVisible',
            data: visible.toString()
        });
    },
    refresh() {
        var animation = wx.createAnimation({
            duration: 1000,
        });
        var { rotate } = this.data;
        rotate += 720;
        animation.rotate(rotate).step();
        this.setData({
            animationData: animation.export(),
            rotate
        });
        if (rotate === 720 || rotate === 3600 || rotate === 7200) {
            this.fetch("fresh");
        } else {
            this.fetch("cache");
        }
    },
    fetch(type) {
        var _this = this;
        this.setData({
            refreshDisabled: true
        });
        showToastError("获取中");        
        if(type=="cache"){
            //模拟请求
            return setTimeout(function() {
                _this.setData({
                    refreshDisabled:false
                });
                wx.hideToast();
            }, 1000);
        }
        fetchNewAchievement("cache").then(({ret,pass}) => {
            wx.hideToast();            
            if(pass){
                _this.setData({
                    achievementList:ret,
                    refreshDisabled:false
                });
            }else{
                navigateToLogin();
            }
        }).catch((err)=>{
            showToastError(err);
        });
    }
})
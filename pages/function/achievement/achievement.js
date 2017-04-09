var { showToastError, fetchAchievement ,checkBindUrp} = require("../../../utils/wx");

Page({
    data: {
        achievementList: [],
        refreshDisabled: false,
        visible: false,
        animationData:"",
        rotate:0
    },
    onLoad: function(options) {
        if(checkBindUrp()){
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
            wx.redirectTo({
                url: '../../login/login'
            });
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
        if(type=="cache"){
            //模拟请求
            return setTimeout(function() {
                _this.setData({
                    refreshDisabled:false
                });
            }, 1000);
        }
        fetchAchievement("cache").then((achievementList) => {
            _this.setData({
                achievementList,
                refreshDisabled:false
            });
        }).catch((err)=>{
            showToastError(err);
        });
    }
})
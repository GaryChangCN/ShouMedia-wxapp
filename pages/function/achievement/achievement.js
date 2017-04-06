var { showToastError, fetchAchievement } = require("../../../utils/wx");

Page({
    data: {
        //目前没有成绩模拟下
        achievementList: [],
        refreshDisabled: false,
        visible: false,
        animationData:"",
        rotate:0
    },
    onLoad: function(options) {
        var achievementList = wx.getStorageSync('achievementList');
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
        achievementList = JSON.parse(achievementList);
        if (achievementList.length) {
            var fetchAchievementTime=wx.getStorageSync('fetchAchievementTime');
            if(!fetchAchievementTime){
                this.fetch();
            }else{
                var now=new Date().getDate();
                if(now-parseInt(fetchAchievementTime)>86400000){
                    this.fetch();
                }else{
                    this.setData({
                        achievementList
                    });
                }
            }
        } else {
            this.fetch();
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
            wx.setStorage({
                key: 'achievementList',
                data: JSON.stringify(achievementList)
            });
            wx.setStorage({
                key: 'fetchAchievementTime',
                data: new Date().getTime().toString()
            });
        })
    }
})
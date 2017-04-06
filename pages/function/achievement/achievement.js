var { showToastError, fetchAchievement } = require("../../../utils/wx");

Page({
    data: {
        //目前没有成绩模拟下
        achievementList: [],
        refreshDisabled: false,
        visi: true
    },
    onLoad: function(options) {
        var achievementList = wx.getStorageSync('achievementList');
        achievementList = JSON.parse(achievementList);
        if (achievementList.length) {
            this.setData({
                achievementList
            });
        } else {
            this.fetch();
        }
    },
    changeVisible(e) {
        var { visi } = this.data;
        this.setData({ visi:!visi });
    },
    refresh() {
        console.log(1);
    },
    fetch() {
        var _this = this;
        fetchAchievement("cache").then((achievementList) => {
            _this.setData({ achievementList });
            wx.setStorage({
                key: 'achievementList',
                data: JSON.stringify(achievementList)
            })
            console.log(achievementList);
        })
    }
})
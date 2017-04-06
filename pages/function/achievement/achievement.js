var { showToastError, fetchAchievement } = require("../../../utils/wx");

Page({
    data: {
        //目前没有成绩模拟下
        achievementList: [{
            kch: "课程号",
            kxh: "课序号",
            kcm: "课程名",
            kcywm: "课程英文名",
            xf: "学分",
            kcsx: "课程属性",
            cj: "成绩"
        }],
        refreshDisabled: false,
        visible: true
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
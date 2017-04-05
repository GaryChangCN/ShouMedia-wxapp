var {showToastError,fetchAchievement}=require("../../../utils/wx");

Page({
    data: {
        achievementList:[]
    },
    onLoad: function(options) {
        var achievementList=wx.getStorageSync('achievementList');
        if(achievementList){
            this.setData({
                achievementList:JSON.parse(achievementList)
            });
        }else{
            this.fetch();
        }
    },
    fetch(){
        var _this=this;
        fetchAchievement("cache").then((achievementList)=>{
            _this.setData({achievementList});
            wx.setStorage({
                key: 'achievementList',
                data: JSON.stringify(achievementList)
            })
            console.log(achievementList);
        })
    }
})
var {showToastError,fetchCurriculum}=require("../../../utils/wx");

Page({
    data: {
        curriculumList:[[]],
        day:""
    },
    onLoad: function(options) {
        var _this=this;
        fetchCurriculum("cache").then((curriculumList)=>{
            _this.setData({
                curriculumList
            });
        }).catch((err)=>{
            showToastError(err);
        });
    },
    onReady: function() {
        var day=new Date().getDay();
        day=day===0?6:day-1;
        this.setData({
            day
        });
    }
})
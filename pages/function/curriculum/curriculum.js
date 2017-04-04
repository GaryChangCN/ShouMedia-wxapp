var {showToastError,fetchCurriculum}=require("../../../utils/wx");

Page({
    data: {
        curriculumList:[[]]
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
        //Do some when page ready.
        
    }
})
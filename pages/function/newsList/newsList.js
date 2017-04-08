var {fetchNewsList,showToastError}=require("../../../utils/wx");

Page({
    data: {
        tab:"tzgg"
    },
    onLoad: function(options) {
        this.fetch('tzgg',1);
    },
    fetch(type,pn){
        var _this=this;
        fetchNewsList(type,pn).then(({list})=>{
            _this.setData({
                [type]:list
            });
        }).catch((err)=>{
            showToastError(err);
        });
    }
})
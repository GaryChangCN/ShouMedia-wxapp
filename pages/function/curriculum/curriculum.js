var {fetchCurriculum}=require('../../../utils/service');
var {showToastError,checkMemoryBindUrp,navigateToLogin}=require('../../../utils/wxApp');

Page({
    data: {
        curriculumList: [
            []
        ],
        day: "",
        animationData: "",
        rotate: 0,
        refreshDisabled: false
    },
    onReady: function() {
        var day = new Date().getDay();
        day = day === 0 ? 6 : day - 1;
        this.setData({
            day
        });
    },
    onLoad: function(options) {
        if(checkMemoryBindUrp()){
            this.fetch("cache");
        }else{
            navigateToLogin();
        }
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
            rotate,
            refreshDisabled: true
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
        fetchCurriculum(type).then(({ret,pass}) => {
            wx.hideToast();
            if(pass){
                _this.setData({
                    curriculumList:ret,
                    refreshDisabled: false
                });
            }else{
                navigateToLogin();
            }
        }).catch((err) => {
            showToastError(err);
        });
    }
})
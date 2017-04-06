var { showToastError, fetchCurriculum } = require("../../../utils/wx");

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
        this.fetch("cache");
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
        if (rotate === 720 || rotate === 3600) {
            this.fetch("fresh");
        } else {
            this.fetch("cache");
        }
    },
    fetch(type) {
        var _this = this;
        this.setData({
            refreshDisabled: true
        })
        fetchCurriculum(type).then((curriculumList) => {
            _this.setData({
                curriculumList,
                refreshDisabled: false
            });
        }).catch((err) => {
            showToastError(err);
        });
    }
})
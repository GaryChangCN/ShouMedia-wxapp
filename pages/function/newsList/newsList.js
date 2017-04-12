var {showToastError}=require('../../../utils/wxApp');
var {fetchNewsList}=require('../../../utils/service');

Page({
    data: {
        tab: "tzgg",
        pn: 1,
        list: {
            tzgg: [],
            yw: [],
            mtjj: [],
            xsqy: [],
            xsjz: []
        },
        fetching: false
    },
    onLoad: function(options) {
        this.fetch();

    },
    changeTab(e) {
        var { type } = e.currentTarget.dataset
        this.setData({
            pn: 1,
            tab: type
        });
        this.fetch(type, 1);
    },
    fetchMore() {
        var { tab, pn, fetching } = this.data;
        wx.showNavigationBarLoading();
        if (!fetching) {
            this.setData({ fetching: true });
            this.fetch();
        }
    },
    fetch() {
        var _this = this;
        var { tab, pn, list } = this.data;
        fetchNewsList(tab, pn).then(function(data){
            var fetchList = data.list;
            if (fetchList.length == 0) {
                showToastError("没有更多了");
            }
            var preList = list[tab];
            list[tab] = preList.concat(fetchList);
            _this.setData({
                list,
                pn: pn + 1,
                fetching: false
            });
            wx.hideNavigationBarLoading();
        }).catch((err) => {
            showToastError("网络错误");
            wx.hideNavigationBarLoading();
        });
    }
})
Page({
    data: {

    },
    toLogin() {
        wx.navigateTo({
            url: '../login/login'
        })
    },
    onLoad: function(options) {
        // wx.navigateTo({
        //     url: '../login/login'
        // })
        console.log(options);
    },
    onReady: function() {
        //Do some when page ready.

    },
    onShow: function() {
        //Do some when page show.

    },
    onHide: function() {
        //Do some when page hide.

    },
    onUnload: function() {
        //Do some when page unload.

    },
    onPullDownRefresh: function() {
        //Do some when page pull down.

    }
})
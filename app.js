var url = require("./utils/url");
var { login ,showToastError,fetchBindUrp} = require('./utils/wx');

App({
    onLaunch: function() {
        wx.checkSession({
            success: function() {
                var { globalData } = getApp();
                fetchBindUrp().then(({ data, err }) => {
                    if (err) {
                        showToastError("网络错误");
                    } else {
                        var { bindUrp, username } = data;
                        if (bindUrp) {
                            console.log("已经绑定成功");
                            getApp().globalData.bindUrp = true;
                            getApp().globalData.userInfo.username = username;
                        } else {
                            wx.redirectTo({
                                url: 'pages/login/login'
                            });
                        }
                    }
                });
            },
            fail: function() {
                console.log("过期");
                login(wx);
            },
        });
    },
    onHide: function() {

    },
    globalData: {
        bindUrp: false,
        userInfo: {

        }
    }
})
var { showToastError, wxAuth, navigateToLogin, checkMemoryBindUrp } = require('../../utils/wxApp');
var { fetchBindUrp, fetchInfoPlus, getAvatar } = require('../../utils/service');
var blockies = require("../../utils/blockies");
Page({
    data: {
        username: "学号",
        name: "姓名",
        bindUrp: true
    },
    onLoad() {
        var _this = this;
        showToastError("加载中", 500);
        this.setData({ onLoad: true })
        this.sloveChain();
    },
    onShow() {
        if (checkMemoryBindUrp()) {
            var { avatarSeed, userInfo } = getApp().globalData;
            this.updateIdenticon(avatarSeed);
        } else {
            this.setData({ bindUrp: false });
        }
    },
    sloveChain() {
        var { globalData } = getApp();
        var _this = this;
        wxAuth().then(({ wxAuth }) => {
            if (wxAuth) {
                return fetchBindUrp();
            } else {
                throw "无微信授权";
            }
        }).then(({ bindUrp }) => {
            if (bindUrp) {
                globalData.memoryBindUrp = true;
                _this.setData({ bindUrp: true });
                return fetchInfoPlus("cache");
            } else {
                _this.setData({ bindUrp: false });
                return false;
            }
        }).then((data) => {
            if (!data) {
                return false;
            }
            var { ret, pass } = data;
            if (!pass) {
                showToastError("urp密码错误");
                navigateToLogin();
                return false;
            }
            wx.setStorage({
                key: 'userInfo',
                data: JSON.stringify(ret)
            });
            globalData.userInfo = ret;
            var { username, name } = ret;
            _this.setData({
                username,
                name
            });
            return getAvatar().then((data) => {
                wx.hideToast();
                if (!data) {
                    return false;
                }
                var { avatar } = data;
                globalData.avatarSeed = avatar;
                _this.updateIdenticon(avatar);
            });
        }).catch((err)=>{
            showToastError(err);
        })
    },
    onReady() {
        this.updateIdenticon("iconbygar");
    },
    updateIdenticon(seed) {
        var context = blockies(
            wx.createCanvasContext('avatar'), {
                seed,
                color: '#ffffff',
                size: 8,
                scale: 7
            }
        );
        context.draw();
    }
})
var { url } = require("./config");

module.exports = {
    checkHasThirdSession,
    checkBindUrp,
    fetchBindUrp,
    showToastError,
    fetchInfoPlus,
    fetchCurriculum,
    fetchAchievement,
    fetchNewsList,
    fetchNewsDetail,
    searchAddress,
    fetchWx,
    updateAvatar,
    feedback
}

//发送反馈

function feedback(content,email,username){
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/feedback`,
            method:"POST",
            header: {
                'Content-Type': 'application/json'
            },
            data:{
                content,email,username
            },
            success: function(res) {
                var {data,err}=res.data;
                if(err){
                    reject(err);
                }else{
                    resolve(data);
                }
            },
            fail(){
                reject("网络错误");
            }
        })
    });
}

//更新头像seed

function updateAvatar(avatar){
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/updatewx`,
            method:"PUT",
            header: {
                'Content-Type': 'application/json'
            },
            data:{
                type:"avatar",
                data:avatar,
                thirdSession:getThirdSession()
            },
            success(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}

//搜索通讯录
function searchAddress(value) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/address`,
            method:"POST",
            header:{
                'Content-Type':'application/json'
            },
            data:{
                keywords:value
            },
            success(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}
//获取新闻详情
function fetchNewsDetail(path) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/getnewsdetail`,
            header: {
                'Content-Type': 'x-www-form-urlencoded'
            },
            data: {
                url: path
            },
            success(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}
// 获取新闻流列表
function fetchNewsList(type, pn = 1) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/getnewslist`,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                type,
                pn
            },
            success(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}

//获取成绩单
function fetchAchievement(type = "cache") {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/fetchachievement?thirdSession=${getThirdSession()}&type=${type}`,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    resolve(data)
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}

//获取课程表
function fetchCurriculum(type = "cache") {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/fetchcurriculum?thirdSession=${getThirdSession()}&type=${type}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    resolve(data)
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}

//获取小程序设置

function fetchWx(type){
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/fetchwx?thirdSession=${getThirdSession()}&type=${type}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    resolve(data)
                }
            },
            fail() {
                reject("网络错误");
            }
        })
    })
}

//获取详细信息
function fetchInfoPlus(type = "cache") {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/fetchinfoplus?thirdSession=${getThirdSession()}&type=${type}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    resolve(data)
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    })
}

//check 是否绑定了urp
function checkBindUrp() {
    var { bindUrp } = getApp().globalData;
    return bindUrp;
}

//获取微信登录授权以及  保存   3rd_session
//首先献策否有thirdSession 如果有返回true，没有的话会重新发起获取getThirdSession请求
function checkHasThirdSession() {
    return checkSession().then(({ checkSession }) => {

        //这里是开发时期的问题，这里checkSession提示成功，但是并没有！！！！
        var thirdSession = getThirdSession();
        if (thirdSession && checkSession) {
            console.log("有thirdSession");
            return {
                hasThirdSession: true
            }
        } else {
            console.log("无thirdSession，开始获取并且存贮");
            return fetchThirdSession().then(({ err, thirdSession }) => {
                if (err) {
                    throw err;
                } else {
                    return new Promise((resolve, reject) => {
                        wx.setStorage({
                            key: '3rd_session',
                            data: thirdSession,
                            success() {
                                console.log("获取thirdSession成功，已存贮");
                                resolve({
                                    hasThirdSession: true
                                });
                            },
                            fail() {
                                resolve({
                                    err: true
                                });
                            }
                        });
                    });
                }
            });
        }
    });
}

//从服务区获取thirdSession
function fetchThirdSession() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: function({ code, errMsg }) {
                if (code) {
                    wx.request({
                        url: `${url}/api/wxapp/fetchthirdsession`,
                        method: "POST",
                        header: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            code
                        },
                        success: function(res) {
                            var { data, err } = res.data;
                            if (err) {
                                resolve({ err: true });
                            } else {
                                var { thirdSession } = data;
                                resolve({ thirdSession });
                            }
                        }
                    });
                } else {
                    reject("未授权");
                }
            }
        });
    });
}

//微信 checksession方法
function checkSession() {
    return new Promise((resolve, reject) => {
        wx.checkSession({
            success: function() {
                resolve({
                    checkSession: true
                });
            },
            fail: function() {
                resolve({
                    checkSession: false
                });
            },
        })
    });
}

//检查是否绑定了urp
function fetchBindUrp() {
    var thirdSession = getThirdSession();
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/fetchbindurp?thirdSession=${thirdSession}`,
            data: {
                thirdSession
            },
            header: {
                'Content-Type': 'application/json'
            },
            success(res) {
                var data = res.data;
                console.log(data);
                var { data, err } = data;
                if (err) {
                    reject("网络错误");
                } else {
                    resolve(data);
                    console.log("获取绑定urp状态信息成功");
                    console.log(data);
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}

// show toast error
function showToastError(title) {
    wx.showToast({
        title,
        icon: 'loading',
        duration: 2000
    });
}

//get thirdSession

function getThirdSession() {
    return wx.getStorageSync('3rd_session');
}
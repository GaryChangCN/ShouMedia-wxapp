var {url,netError}=require('./config');

module.exports={
	wxAuth,
    showToastError,
    getLocalThirdSession,
    checkMemoryBindUrp,
    navigateToLogin
}

function fetchThirdSession() {
    return new Promise((resolve, reject) => {
        wx.login({
            success: function({ code, errMsg }) {
                if (code) {
                    wx.request({
                        url: `${url}/api/wxapp/thirdSession`,
                        method: "POST",
                        header: {
                            'Content-Type': 'application/json'
                        },
                        data: {
                            code
                        },
                        success: function(res) {
                            console.log("获取thirdsession成功，如果没有对应行，则在集合创建");
                            var { data, err } = res.data;
                            if (err) {
                                resolve(netError);
                            } else {
                                resolve(data);
                            }
                        },
                        fail(){
                            reject(netError);
                        }
                    });
                } else {
                    reject("未授权");
                }
            }
        });
    });
}


//获取微信登录授权以及  保存   3rd_session
//首先献策否有thirdSession 如果有返回true，没有的话会重新发起获取getLocalThirdSession请求
function wxAuth() {
    return checkSession().then(({ checkSession }) => {
        //这里是开发时期的问题，这里checkSession提示成功，但是并没有！！！！
        var thirdSession = getLocalThirdSession();
        if (thirdSession && checkSession) {
            console.log("有thirdSession");
            return {
                wxAuth: true
            }
        } else {
            console.log("无thirdSession，开始获取并且存贮");
            return fetchThirdSession().then((data) => {
                var {thirdSession}=data;
                return new Promise((resolve, reject) => {
                    wx.setStorage({
                        key: '3rd_session',
                        data: thirdSession,
                        success() {
                            console.log("获取thirdSession成功，已存贮");
                            resolve({
                                wxAuth: true
                            });
                        },
                        fail() {
                            resolve("存储授权失败");
                        }
                    });
                });
            });
        }
    });
}

//微信 checksession方法  是否需要重新调起 微信授权页面
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

// show toast error
function showToastError(title) {
    wx.showToast({
        title,
        icon: 'loading',
        duration: 1000
    });
}

// getLocalthirdSession
function getLocalThirdSession() {
    return wx.getStorageSync('3rd_session');
}

//检查本地是否有绑定了urp信息
function checkMemoryBindUrp() {
    var { memoryBindUrp } = getApp().globalData;
    return memoryBindUrp;
}

//跳转到login页面
function navigateToLogin() {
    wx.navigateTo({
        url: '/pages/login/login'
    });
}

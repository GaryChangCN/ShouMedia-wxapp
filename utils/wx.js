var url = require("./url");

module.exports = {
    login,
    fetchBindUrp,
    showToastError,
    fetchInfoPlus
}


function fetchInfoPlus(type){
    return new Promise((reslove,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/fetchinfoplus?thirdSession=${getThirdSession()}&type=${type}`,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var {data,err}=res.data;
                if(err){
                    reject(err.message);
                }else{
                    reslove(data)
                }
            },
            fail(){
                reject("网络错误");
            }
        })
    })
}

//获取微信登录授权以及返回3rd_session
function login() {
    return wx.login({
        success: function({ code, errMsg }) {
            if (code) {
                wx.request({
                    url: `${url}/api/wxapp/getthirdsession`,
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
                            wx.showToast({
                                title: err.message,
                                icon: 'loading'
                            });
                        } else {
                            var { thirdSession } = data;
                            wx.setStorage({
                                key: '3rd_session',
                                data: thirdSession
                            })
                        }
                    }
                });
            } else {
                console.log(errMsg);
                //暂时不做不允许获取身份的处理
            }
        }
    });
}

//检查是否绑定了urp
function fetchBindUrp() {
    var thirdSession = getThirdSession();
    return new Promise((reslove, reject) => {
        wx.request({
            url: `${url}/api/wxapp/fetchbindurp?thirdSession=${thirdSession}`,
            data: {
                thirdSession
            },
            header: {
                'Content-Type': 'application/json'
            },
            success(res) {
                reslove(res.data);
            },
            fail() {
                reject({
                    err: true
                })
            }
        });
    });
}

// show toast error
function showToastError(title){
    wx.showToast({
        title,
        icon: 'loading',
        duration: 2000
    });
}

//get thirdSession

function getThirdSession(){
    return wx.getStorageSync('3rd_session');
}
var {url} = require("./config");

module.exports = {
    checkHasThirdSession,
    fetchBindUrp,
    showToastError,
    fetchInfoPlus,
    fetchCurriculum,
    fetchAchievement,
    fetchNewsList
}

function fetchNewsList(type,pn=1){
    return new Promise((reslove,reject)=>{
        wx.request({
            url: `${url}/api/getnewslist`,
            header: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{
                type,pn
            },
            success(res) {
                var {data,err}=res.data;
                if(err){
                    reject(err.message);
                }else{
                    reslove(data);
                }
            },
            fail(){
                reject("网络错误");
            }
        });
    });
}

//获取成绩单
function fetchAchievement(type="cache"){
    return new Promise((reslove, reject) => {
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
                    reslove(data)
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
    return new Promise((reslove, reject) => {
        wx.request({
            url: `${url}/api/wxapp/fetchcurriculum?thirdSession=${getThirdSession()}&type=${type}`,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    reslove(data)
                }
            },
            fail() {
                reject("网络错误");
            }
        });
    });
}

//获取详细信息
function fetchInfoPlus(type = "cache") {
    return new Promise((reslove, reject) => {
        wx.request({
            url: `${url}/api/wxapp/fetchinfoplus?thirdSession=${getThirdSession()}&type=${type}`,
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(err.message);
                } else {
                    reslove(data)
                }
            },
            fail() {
                reject("网络错误");
            }
        })
    })
}


//获取微信登录授权以及  保存   3rd_session
//首先献策否有thirdSession 如果有返回true，没有的话会重新发起获取getThirdSession请求
function checkHasThirdSession() {
    return checkSession().then(({checkSession})=>{

        //这里是开发时期的问题，这里checkSession提示成功，但是并没有！！！！
        var thirdSession=getThirdSession();
        if(thirdSession&&checkSession){
            console.log("有thirdSession");
            return {
                hasThirdSession:true
            }
        }else{
            console.log("无thirdSession，开始获取并且存贮");
            return fetchThirdSession().then(({err,thirdSession})=>{
                if(err){
                    throw err;
                }else{
                    return new Promise((reslove,reject)=>{
                        wx.setStorage({
                            key: '3rd_session',
                            data: thirdSession,
                            success(){
                                console.log("获取thirdSession成功，已存贮");
                                reslove({
                                    hasThirdSession:true
                                });
                            },
                            fail(){
                                reslove({
                                    err:true
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
    return new Promise((reslove, reject) => {
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
                                reslove({ err: true });
                            } else {
                                var { thirdSession } = data;
                                reslove({ thirdSession });
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
    return new Promise((reslove, reject) => {
        wx.checkSession({
            success: function() {
                reslove({
                    checkSession:true
                });
            },
            fail: function() {
                reslove({
                    checkSession:false
                });
            },
        })
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
                var data=res.data;
                console.log(data);
                var {data,err}=data;
                if(err){
                    reject("网络错误");
                }else{
                    reslove(data);
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
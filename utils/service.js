var { url,netError } = require("./config");
var {getLocalThirdSession}=require('./wxApp');

module.exports = {
    feedback,
    updateAvatar,
    getAvatar,
    searchAddress,
    fetchNewsList,
    fetchNewsDetail,
    fetchNewAchievement,
    fetchOldAchievement,
    fetchCurriculum,
    fetchInfoPlus,
    fetchBindUrp,
    // fetchThirdSession
}

//发送反馈
function feedback(content,email,username){
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/feedback`,
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
                    reject(netError);
                }else{
                    resolve(data);
                }
            },
            fail(){
                reject(netError);
            }
        })
    });
}

//更新头像seed
function updateAvatar(avatar){
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/avatar?thirdSession=${getLocalThirdSession()}`,
            method:"PUT",
            header: {
                'Content-Type': 'application/json'
            },
            data:{
                data:avatar
            },
            success(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}

// 获取头像
function getAvatar(){
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/avatar?thirdSession=${getLocalThirdSession()}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    resolve(data)
                }
            },
            fail() {
                reject(netError);
            }
        })
    })
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
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}
//获取新闻详情
function fetchNewsDetail(path) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/ewsdetail`,
            header: {
                'Content-Type': 'x-www-form-urlencoded'
            },
            data: {
                url: path
            },
            success(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}
// 获取新闻流列表
function fetchNewsList(type, pn = 1) {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/newslist`,
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
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}

//获取最新成绩
function fetchNewAchievement() {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/newAchi?thirdSession=${getLocalThirdSession()}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}

//获取以前成绩
function fetchOldAchievement(type="cache") {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/oldAchi?thirdSession=${getLocalThirdSession()}&type=${type}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}

//获取课程表
function fetchCurriculum(type = "cache") {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/curri?thirdSession=${getLocalThirdSession()}&type=${type}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}


//获取详细信息
function fetchInfoPlus(type = "cache") {
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/infoPlus?thirdSession=${getLocalThirdSession()}&type=${type}`,
            success: function(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    })
}


//检查是否绑定了urp
function fetchBindUrp() {
    var thirdSession = getLocalThirdSession();
    return new Promise((resolve, reject) => {
        wx.request({
            url: `${url}/api/wxapp/checkBindUrp`,
            data: {
                thirdSession
            },
            header: {
                'Content-Type': 'x-www-form-urlencoded'
            },
            success(res) {
                var { data, err } = res.data;
                if (err) {
                    reject(netError);
                } else {
                    console.log("获取绑定urp状态信息成功");
                    console.log(data);
                    resolve(data);
                }
            },
            fail() {
                reject(netError);
            }
        });
    });
}

//从服务器获取thirdSession
// function fetchThirdSession() {
//     return new Promise((resolve, reject) => {
//         wx.login({
//             success: function({ code, errMsg }) {
//                 if (code) {
//                     wx.request({
//                         url: `${url}/api/wxapp/thirdSession`,
//                         method: "POST",
//                         header: {
//                             'Content-Type': 'application/json'
//                         },
//                         data: {
//                             code
//                         },
//                         success: function(res) {
//                             var { data, err } = res.data;
//                             if (err) {
//                                 resolve(netError);
//                             } else {
//                                 resolve(data);
//                             }
//                         },
//                         fail(){
//                             reject(netError);
//                         }
//                     });
//                 } else {
//                     reject("未授权");
//                 }
//             }
//         });
//     });
// }

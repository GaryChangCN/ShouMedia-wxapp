var { url,netError } = require("./config");
var {getLocalThirdSession}=require('./wxApp');

module.exports = {
    searchProject,
    feedback,
    updateAvatar,
    getAvatar,
    searchAddress,
    fetchExamDate,
    fetchNewsList,
    fetchNewsDetail,
    fetchNewAchievement,
    fetchOldAchievement,
    fetchCurriculum,
    fetchOldAchi,
    fetchInfoPlus,
    fetchBindUrp,
    fetchSchoolDate,
    bindUrp,
    unBindUrp,
    fetchMsg,
    fetchMsgDetail
}

function fetchMsgDetail(msgId){
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/msgDetail?&msgId=${msgId}`,
            success(res) {
                var {err,data}=res.data;
                if(err){
                    reject(netError);
                }else{
                    resolve(data);
                }
            },
            fail(){
                reject(netError)
            }
        });
    });
}

//获取消息通知
function fetchMsg(method="GET",msgId="") {
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/msg?thirdSession=${getLocalThirdSession()}&msgId=${msgId}`,
            method:method,
            success(res) {
                var {err,data}=res.data;
                if(err){
                    reject(netError);
                }else{
                    resolve(data);
                }
            },
            fail(){
                reject(netError)
            }
        });
    });
}

//获取历史成绩
function fetchOldAchi(type="cache") {
    return new Promise ((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/oldAchi`,
            header: {
                'Content-Type': 'x-www-form-urlencoded'
            },
            data:{
                type,
                thirdSession:getLocalThirdSession()
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
        });
    });
}

//获取考试安排
function fetchExamDate() {
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/wxapp/examDate`,
            header: {
                'Content-Type': 'x-www-form-urlencoded'
            },
            data:{
                thirdSession:getLocalThirdSession()
            },
            success: function(res) {
                var {err,data}=res.data;
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

//获取校历
function fetchSchoolDate() {
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/schoolDate`,
            success(res){
                var {err,data}=res.data;
                if(err){
                    reject(netError);
                }else{
                    resolve(data);
                }
            },
            fail(){
                reject(netError)
            }
        });
    });
}

//解除绑定urp
function unBindUrp() {
    return new Promise((resolve,reject)=>{
        wx.request({
            url:`${url}/api/wxapp/unBindUrp`,
            method:"DELETE",
            header:{
                'Content-Type':'application/json'
            },
            data:{
                thirdSession:getLocalThirdSession()
            },
            success(res){
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
        });
    });
}

// 搜索课程
function searchProject(keywords) {
    return new Promise((resolve,reject)=>{
        wx.request({
            url: `${url}/api/searchClass`,
            method:"POST",
            header: {
                'Content-Type': 'application/json'
            },
            data:{
                keywords
            },
            success: function(res) {
                var {data,err}=res.data;
                if(err){
                    reject(netError);
                }else{
                    resolve(data);
                }
            }
        });
    });
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
                avatar
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
            url: `${url}/api/newsdetail`,
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


//绑定urp
function bindUrp(username,urppassword){
    return new Promise((resolve,reject)=>{
        wx.request({
            url:`${url}/api/wxapp/bindUrp`,
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            data:{
                username,
                urppassword,
                thirdSession:getLocalThirdSession()
            },
            success(res){
                var {err,data}=res.data;
                if(err){
                    reject(netError);
                }else{
                    resolve(data);
                }
            },
            fail(){
                reject(netError);
            }
        });
    });
}

var {showToastError,checkMemoryBindUrp,navigateToLogin}=require('../../../utils/wxApp');
var {fetchExamDate}=require('../../../utils/service');

Page({
	data: {
		examDate:[],
		animationData: "",
        rotate: 0,
        refreshDisabled: false
	},
	onLoad(){
		var _this=this;
		if(checkMemoryBindUrp()){
			var {examDate}=getApp().globalData;
			if(examDate.length>0){
				this.setData({examDate});
			}else{
				this.fetch();
			}
		}else{
			navigateToLogin();
		}
	},
	refresh() {
        var animation = wx.createAnimation({
            duration: 1000,
        });
        var { rotate } = this.data;
        rotate += 720;
        animation.rotate(rotate).step();
        this.setData({
            animationData: animation.export(),
            rotate,
            refreshDisabled: true
        });
        if (rotate === 720 || rotate === 3600 || rotate === 7200) {
            this.fetch("fresh");
        } else {
            this.fetch("cache");
        }
    },
	fetch(type){
		var _this=this;
		showToastError("获取中");
		if(type=="cache"){
			setTimeout(function () {
				_this.setData({refreshDisabled:false});
				wx.hideToast();
			}, 1000);
		}else{
			fetchExamDate().then(({ret,pass})=>{
				wx.hideToast();
				if(pass){
					_this.setData({
						examDate:ret,
						refreshDisabled: false
					});
					getApp().globalData.examDate=ret;
				}else{
					navigateToLogin()
				}
			}).catch((err)=>{
				showToastError(err);
			});
		}
	}
})
var {showToastError,checkMemoryBindUrp,navigateToLogin,showToastSuccess}=require("../../../utils/wxApp");
var {getAvatar,updateAvatar,unBindUrp}=require('../../../utils/service');
var blockies=require("../../../utils/blockies");
Page({
	data: {
		seed:"",
		seedValue:"",
		seedDisabled:true
	},
	onLoad(){
		if(checkMemoryBindUrp()){
			try {
				var userInfo=JSON.parse(wx.getStorageSync('userInfo'));
				this.setData({userInfo});
			} catch (error) {
				showToastError("获取个人信息失败");
				wx.redirectTo({
					url: '../index/index'
				});
			}
		}else{
			navigateToLogin();
		}
	},
	onReady(){
		this.fetchAvatar()
	},
	handleLogout(){
		var _this=this;
		wx.showModal({
			title: '提示',
			content: '确定要解除绑定嘛，不绑定URP则只可用部分功能,解除后可以重新绑定',
			confirmText:'解除',
			confirmColor:'#d98e92',
			success({confirm,cancel}){
				if(confirm){
					_this.fetchUnbindUrp();
				}
			}
		});
	},
	handleChangeSeed(e){
		var {value}=e.detail;
		this.setData({seedValue:value});
		this.updateIdenticon(value);
	},
	switchChangeSeed(e){
		var {value}=e.detail;
		this.setData({seedDisabled:!value});
		if(!value){
			var {seed,seedValue}=this.data;
			if(seed!==seedValue){
				this.fetchUpdateAvatar();
			}
		}
	},
	fetchAvatar(){
		var _this=this;
		getAvatar().then(({avatar})=>{
			var seed=avatar;
			_this.setData({
				seed,
				seedValue:seed
			});
			_this.updateIdenticon(seed);
		});
	},
	fetchUpdateAvatar(){
		var {seedValue}=this.data;
		wx.showNavigationBarLoading();
		var _this=this;
		updateAvatar(seedValue).then(()=>{
			wx.hideNavigationBarLoading();
			_this.setData({seed:seedValue});
			getApp().globalData.avatarSeed=seedValue;
			showToastSuccess("修改成功");
		}).catch((err)=>{
			wx.hideNavigationBarLoading();
			showToastError(err);
		});
	},
	fetchUnbindUrp(){
		unBindUrp().then(({pass})=>{
			if(!pass){
				showToastSuccess("解除成功");
				wx.navigateTo({
					url: '../../index/index'
				});
				getApp().globalData.memoryBindUrp=false;
			}else{
				showToastError("解除失败");
			}
		}).catch((err)=>{
			showToastError(err);
		})
	},
	updateIdenticon(seed){
        var context=blockies(
            wx.createCanvasContext('avatarPersonal'),{
                seed,
                color: '#ffffff',
                size:8,
                scale:7
            }
        );
        context.draw();
    }
})
var {showToastError,checkMemoryBindUrp,navigateToLogin}=require("../../../utils/wxApp");
var {fetchInfoPlus}=require('../../../utils/service');
Page({
	data: {
        refreshDisabled: false,
		userInfo:{},
		visible:true,
		animationData:"",
        rotate:0
	},
	onLoad(){
		if(checkMemoryBindUrp()){
			try {
				var userInfo=JSON.parse(wx.getStorageSync('userInfo'));
				this.setData({userInfo});
			} catch (error) {
				this.fetch();
			}
			var _this=this;
			wx.getStorage({
				key: 'userInfoVisible',
				success({data}){
					_this.setData({
						visible:data==="true"?true:false
					});
				},
				fail() {
					_this.setData({
						visible:true
					});
				}
			});
		}else{
			navigateToLogin();
		}
	},
	changeVisible(){
		var {visible}=this.data;
		visible=!visible;
		this.setData({visible});
		wx.setStorage({
            key: 'userInfoVisible',
            data: visible.toString()
        });
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
            rotate
        });
        if (rotate === 720 || rotate === 3600 || rotate === 7200) {
            this.fetch("fresh");
        } else {
            this.fetch("cache");
        }
    },
	fetch(type){
		var _this=this;
		fetchInfoPlus(type).then(({ret,pass})=>{
			if(pass){
				_this.setData({
					userInfo:data
				});
				wx.setStorage({
					key: 'userInfo',
					data: JSON.stringify(data)
				});
			}else{
				navigateToLogin();
			}
		}).catch((err)=>{
			showToastError(err);
		});
	}
})
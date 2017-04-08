var {showToastError,searchAddress}=require("../../../utils/wx");

Page({
	data: {
		disabled:false,
		value:"",
		list:[],
		firstTime:true
	},
	onLoad(query){
		var {value}=query;
		if(value){
			this.setData({value});
			this.handleSearch();
		}
	},
	handleChange(e){
		var {value}=e.detail;
		this.setData({value});
	},
	handleSearch(){
		var _this=this;
		this.setData({
			disabled:true,
			firstTime:false
		});
		var {value}=this.data;
		searchAddress(value).then((data)=>{
			_this.setData({
				disabled:false,
				list:data
			});
			console.log(data);
		}).catch((err)=>{
			showToastError(err);
		});
	},
	makeCall(e){
		var {mobile}=e.currentTarget.dataset;
		if(/[0-9]{11}/.test(mobile)){
			wx.makePhoneCall({
				phoneNumber: mobile
			});
		}
	},
	onShareAppMessage(){
		return {
			title:"上海海洋大学通讯录查询",
			path:"/pages/function/address/address?value="+this.data.value
		}
	}
})
var {fetchMsg}=require('../../../utils/service');
var {showToastError,showToastSuccess,checkMemoryBindUrp,navigateToLogin}=require('../../../utils/wxApp');
Page({
	data: {
		msgList:[],
		editIndex:"",
		
	},
	onLoad(){
		this.fetch();
	},
	handleSlide(e){
		var {index}=e.currentTarget.dataset;
		console.log(e);
	},
	fetch(method="GET",msgId){
		var _this=this;
		fetchMsg(method,msgId).then(({pass,msgList,modify})=>{
			if(pass){
				if(method=="GET"){
					_this.setData({msgList});
				}else if(method=="DELETE"){
					showToastSuccess("已删除");
				}
			}else{
				navigateToLogin();
			}
		}).catch((err)=>{
			showToastError(err);
		})
	}
})
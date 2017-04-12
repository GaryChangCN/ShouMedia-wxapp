var {showToastError}=require("../../../utils/wxApp");
var {searchProject}=require('../../../utils/service');

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
		var {value}=this.data;
		if(!value){
			_this.setData({
				disabled:false
			});
			return ;
		}
		this.setData({
			disabled:true,
			firstTime:false
		});
		searchProject(value).then((data)=>{
			_this.setData({
				disabled:false,
				list:data.list
			});
		}).catch((err)=>{
			showToastError(err);
		});
	},
	onShareAppMessage(){
		return {
			title:"上海海洋大学课程查询",
			path:"/pages/function/project/project?value="+this.data.value
		}
	}
})
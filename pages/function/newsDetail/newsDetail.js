var {showToastError}=require("../../../utils/wxApp");
var {fetchNewsDetail}=require('../../..//utils/service');

Page({
	data: {
		data:null,
		url:null
	},
	onLoad: function(query) {
		var {url}=query;
		this.setData({url});
		var _this=this;
		fetchNewsDetail(url).then((data)=>{
			_this.setData({
				data
			});
		}).catch((err)=>{
			showToastError(err)
		});
	},
	onShareAppMessage(){
		return {
			title:this.data.data.title,
			path:"/pages/function/newsDetail/newsDetail?url="+this.data.url
		}
	}
})
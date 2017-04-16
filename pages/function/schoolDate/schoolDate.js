var {showToastError}=require('../../../utils/wxApp');
var {fetchSchoolDate}=require('../../../utils/service');

Page({
	data: {
		schoolDate:[],
		tab:"",
		pic:[]
	},
	onLoad(){
		var _this=this;
		wx.getStorage({
			key: 'schoolDate',
			success({data}){
				var schoolDate=JSON.parse(data);
				var firstItem=schoolDate[0];
				_this.setData({
					schoolDate,
					tab:firstItem.title,
					pic:firstItem.pic
				});
			},
			fail(){
				_this.fetch();
			}
		});
	},
	previewPic(e){
		var {index}=e.target.dataset;
		this.preview(index);
	},
	handlePickerChange(e){
		var {value}=e.detail;
		var {schoolDate}=this.data;
		var thisItem=schoolDate[value];
		this.setData({
			tab:thisItem.title,
			pic:thisItem.pic
		});
	},
	fetch(){
		var _this=this;
		showToastError("获取中");
		fetchSchoolDate().then(({schoolDate})=>{
			wx.hideToast();
			var firstItem=schoolDate[0];
			_this.setData({
				schoolDate,
				tab:firstItem.title,
				pic:firstItem.pic
			});
			wx.setStorage({
				key: 'schoolDate',
				data: JSON.stringify(schoolDate)
			});
		});
	},
	preview(index){
		var urls=this.data.pic;
		var current=urls[index];
		wx.previewImage({
			current,
			urls,
			fail(){
				showToastError("预览失败")
			}
		});
	}
})
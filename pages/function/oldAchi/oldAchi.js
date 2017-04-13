var {showToastError,checkMemoryBindUrp,navigateToLogin}=require('../../../utils/wxApp');
var {fetchOldAchi}=require('../../../utils/service');

Page({
	data: {
		list:[],
		achievementList: [],
		tab:"",
        refreshDisabled: false,
        visible: false,
        animationData:"",
        rotate:0
	},
	onLoad(){
		this.fetch("cache")
	},
	fetch(type,index=0){
		var _this=this;
		fetchOldAchi(type).then(({pass,ret})=>{
			if(pass){
				var list=_this.convert(ret);
				var selectList=list[index];
				_this.setData({
					list,
					achievementList:selectList.achievementList,
					tab:selectList.title
				});
			}else{
				navigateToLogin();
			}
		})
	},
	convert(ret){
		return ret.map((item)=>{
			var {title,content}=item;
			var achievementList=content.map((e)=>{
				return {
					kch:e[0],
					kxh:e[1],
					kcm:e[2],
					kcywm:e[3],
					xf:e[4],
					kcsx:e[6],
					cj:e[6]
				}
			})
			return {
				title,
				achievementList
			}
		});
	}
})
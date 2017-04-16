var {fetchNewAchievement}=require('../../../utils/service');
var {showToastError,checkMemoryBindUrp,navigateToLogin}=require('../../../utils/wxApp');
Page({
	data: {
		achievementList:[],
		averageGpa:0,
	},
	onLoad(){
		
	},
	importAchi(){
		if(checkMemoryBindUrp()){
			this.fetch();
		}else{
			navigateToLogin();
		}
	},
	handleChange(e){
		var {index,item}=e.currentTarget.dataset;
		var {value}=e.detail;
		var {achievementList}=this.data;
		value=value.replace(/[^\d.]*/g,"");
		if(item==0){
			achievementList[index].xf=value;
		}else{
			achievementList[index].cj=value;
			var gpa=this.Cj2Gpa(value);
			achievementList[index].gpa=gpa;
		}
		this.setData({achievementList});
		this.figureAverageGpa();
	},
	addItem(){
		var {achievementList}=this.data;
		achievementList.push({
			kcm:"0",
			xf:"0",
			cj:"0",
			gpa:"0",
			active:[false,false]
		});
		this.setData({achievementList});
	},
	deleteItem(e){
		var {index}=e.currentTarget.dataset;
		var {achievementList}=this.data;
		achievementList.splice(index,1);
		this.setData({achievementList});
	},
	handleFocus(e){
		var {index,item}=e.currentTarget.dataset;
		item=~~item;
		var {achievementList}=this.data;
		achievementList[index].active[item]=true;
		this.setData({achievementList});
	},
	handleBlur(e){
		var {index,item}=e.currentTarget.dataset;
		item=~~item;
		var {achievementList}=this.data;
		achievementList[index].active[item]=false;
		this.setData({achievementList});
	},
	fetch(){
		var _this=this;
		showToastError("载入中");
		fetchNewAchievement("cache").then(({ret,pass}) => {
            wx.hideToast();
			ret=ret.map((item)=>{
				item.cj=item.cj||0;
				item.gpa=_this.Cj2Gpa(item.cj);
				item.active=[false,false];
				return item;
			});
			var {achievementList}=this.data;      
            if(pass){
                _this.setData({
                    achievementList:ret.concat(achievementList)
                });
				_this.figureAverageGpa();
            }else{
                navigateToLogin();
            }
        }).catch((err)=>{
            showToastError(err);
        });
	},
	figureAverageGpa(){
		var {achievementList}=this.data;
		var sumXf=0;
		var sum=0
		achievementList.forEach((item)=>{
			var xf=item.xf||0;
			var gpa=item.gpa||0
			xf=parseFloat(xf);
			gpa=parseFloat(gpa);
			sumXf+=xf;
			sum+=(xf*gpa);
		});
		var averageGpa=0;
		if(sumXf>0){
			averageGpa=(sum/sumXf).toFixed(2);
		}
		this.setData({averageGpa});
	},
	Cj2Gpa(value){
		var gpa=0;
		value=value?value:0;
		if(value>=90){
			gpa="4.0";
		}else if(value>=68){
			if(value>=85){
				gpa="3.7";
			}else if(value>=82){
				gpa="3.2";
			}else if(value>=78){
				gpa="3.0";
			}else if(value>=75){
				gpa="2.7";
			}else if(value>=72){
				gpa="2.3";
			}else{
				gpa="2.0";
			}
		}else if(value>=60){
			if(value>=66){
				gpa="1.7";
			}else if(value>=64){
				gpa="1.6";
			}else{
				gpa="1.0"
			}
		}
		return gpa;
	},
})
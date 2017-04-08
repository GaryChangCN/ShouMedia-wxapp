var {fetchNewsList,showToastError}=require("../../../utils/wx");

Page({
    data: {
        tab:"tzgg",
        pn:1,
        list:{
            tzgg:[],
            yw:[],
            mtjj:[],
            xsqy:[],
            xsjz:[]
        },
        fetching:false
    },
    onLoad: function(options) {
        this.fetch();
        
    },
    changeTab(e){
        var {type}=e.currentTarget.dataset
        this.setData({
            pn:1,
            tab:type
        });
        this.fetch(type,1);
    },
    fetchMore(){
        var {tab,pn,fetching}=this.data;
        wx.showLoading({
            title: '加载中',
        });
        if(!fetching){
            this.setData({fetching:true});
            this.fetch();
        }
    },
    fetch(){
        var _this=this;
        var {tab,pn,list}=this.data;
        fetchNewsList(tab,pn).then((data)=>{
            wx.hideLoading();
            var fetchList=data.list;
            if(fetchList.length==0){
                showToastError("没有更多了");
            }
            var preList=list[tab];
            list[tab]=preList.concat(fetchList);
            _this.setData({
                list,
                pn:pn+1,
                fetching:false
            });
        }).catch((err)=>{
            showToastError(err);
            wx.hideLoading();            
        });
    }
})
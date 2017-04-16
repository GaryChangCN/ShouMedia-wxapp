var { fetchMsg ,fetchMsgDetail} = require('../../../utils/service');
var { showToastError, showToastSuccess, checkMemoryBindUrp, navigateToLogin } = require('../../../utils/wxApp');
Page({
    data: {
        msgList: [],
        editIndex: "",
        startX: "",
		move:[]
    },
    onShow() {
        this.fetch();
    },
    handleControl(e){
        var { index,method } = e.currentTarget.dataset;
        var {msgList,move}=this.data;
        var {msgId}=msgList[index];
        move[index]=false;
        this.setData({move});
        this.fetch(method,msgId);
    },
    handleOpen(e){
        var { index,method } = e.currentTarget.dataset;
        var {msgList,move}=this.data;
        var {msgId,detail}=msgList[index];
        if(move[index]){
            move[index]=false;
            this.setData({move});
        }else{
            this.fetch("PUT",msgId);
            if(detail){
                this.fetchDetail(msgId);
            }
        }
    },
    handleTouchStart(e) {
        var { index } = e.currentTarget.dataset;
        if (e.touches.length == 1) {
            var touches = e.touches[0];
            var { pageX } = touches;
            this.setData({ startX: pageX, editIndex: index })
        }
    },
    handleTouchEnd(e) {
        this.setData({startX:""})
    },
    handleTouchMove(e) {
        var { index } = e.currentTarget.dataset;
		if(e.changedTouches.length==1){
			var touches=e.changedTouches[0];
			var {pageX}=touches;
			var {startX}=this.data;
			if(startX-pageX>60){
				var {move}=this.data;
				move[index]=true;
				this.setData({move});
			}else if(pageX-startX>60){
				var {move}=this.data;
				move[index]=false;
				this.setData({move});
			}
		}
    },
    fetchDetail(msgId){
        var _this=this;
        fetchMsgDetail(msgId).then(({title,content,tag})=>{
            wx.showModal({
                title,
                content,
                showCancel:false,
                confirmColor:"#66cccc"
            })
		}).catch((err)=>{
			showToastError(err);
		})
    },
    fetch(method = "GET", msgId) {
        var _this = this;
        fetchMsg(method, msgId).then(({ pass, msgList, modify }) => {
            if (pass) {
                if (method == "GET") {
                    _this.setData({ msgList });
                } else if (method == "DELETE") {
                    showToastSuccess("已删除");
                    _this.fetch("GET");                    
                }else if(method=="PUT"){
                    _this.fetch("GET");
                }
            } else {
                navigateToLogin();
            }
        }).catch((err) => {
            showToastError(err);
        });
    }
})
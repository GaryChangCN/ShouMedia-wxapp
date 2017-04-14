var { fetchMsg } = require('../../../utils/service');
var { showToastError, showToastSuccess, checkMemoryBindUrp, navigateToLogin } = require('../../../utils/wxApp');
Page({
    data: {
        msgList: [],
        editIndex: "",
        startX: "",
		move:[]
    },
    onLoad() {
        this.fetch();
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
    fetch(method = "GET", msgId) {
        var _this = this;
        fetchMsg(method, msgId).then(({ pass, msgList, modify }) => {
            if (pass) {
                if (method == "GET") {
                    _this.setData({ msgList });
                } else if (method == "DELETE") {
                    showToastSuccess("已删除");
                }
            } else {
                navigateToLogin();
            }
        }).catch((err) => {
            showToastError(err);
        })
    }
})
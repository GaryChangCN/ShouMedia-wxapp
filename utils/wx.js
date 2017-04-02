var url=require("./url");

module.exports={
    login:function(wx){
        return wx.login({
            success: function({code,errMsg}) {
                if(code) {
                    wx.request({
                        url: `${url}/api/wxapp`,
                        method:"POST",
                        header: {
                            'Content-Type': 'application/json'
                        },
                        data:{
                            code
                        },
                        success: function(res) {
                            var {data,err}=res.data;
                            if(err){
                                wx.showToast({
                                    title: err.message,
                                    icon: 'loading'
                                });
                            }else{
                                var {thirdSession}=data;
                                wx.setStorage({
                                    key: '3rd_session',
                                    data: thirdSession
                                })
                            }
                        }
                    });
                } else {
                    console.log(errMsg);
                    //暂时不做不允许获取身份的处理
                }
            }
        });
    }
}
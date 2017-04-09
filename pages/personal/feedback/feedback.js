var { showToastError,feedback } = require('../../../utils/wx');

Page({
    data: {
        email: "",
        content: "",
        loading: false,
        errors: {
            email: false,
            content: false
        }
    },
    onLoad() {},
    handleChange(e) {
        var { value } = e.detail;
        var { name } = e.target.dataset;
        this.setData({
            [name]: value
        });
    },
    handleBlur() {
        this.validation();
    },
    handleFocus(e) {
        var { name } = e.target.dataset;
        var { errors } = this.data;
        errors[name] = false;
        this.setData({
            errors
        });
    },
    handleSubmit() {
        var _this = this;
        var { email, content } = this.data;
		var {username}=getApp().globalData.userInfo||"";
		feedback(content,email,username).then((data)=>{
			showToastError("提交成功");
			_this.cleanForm();
		}).catch((err)=>{
			showToastError(err);
		});
    },
    //清空form
    cleanForm() {
        this.setData({
            email: "",
            content: "",
            loading: false,
            errors: {
                email: false,
                content: false
            }
        })
    },
    //验证器
    validation(submitErr) {
        if (submitErr) {
            this.setData({
                errors: {
                    email: " ",
                    content: " "
                }
            });
            return false;
        }
        var { email, content } = this.data;
        var errors = {
            email: false,
            content: false
        };
        if (!email) {
            errors.email = "联系方式必填";
        }
        if (!content) {
            errors.content = "反馈内容不为空";
        }
        this.setData({
            errors
        });
        return !email && !content;
    }
})
	var saveBtn = document.getElementById("saveBtn");

	mui.init();
	
	/**
	 * 修改密码
	 */
	function changePassword(newPwd, oldPwd) {
		var args = {
			oldPwd: oldPwd,
			newPwd: newPwd
		};
		
		var success = function(rtnData) {

			console.log("--------------------------------------");
			console.log("密码修改结果: " + JSON.stringify(rtnData));

			if(rtnData.result == "error") {
				mui.toast("密码错误 !");
			} else {
				mui.toast("修改成功 !");
				mui.back();
			}
		}
		
		sendRequest(changePasswordUrl, args, success);
	}
	
	// 设置保存按钮点击监听
	saveBtn.addEventListener('tap', function(event) {
		var oldPwd = oldPassword.value;
		var newPwd1 = newPassword1.value;
		var newPwd2 = newPassword2.value;
		
		if(oldPwd == "" || newPwd1 == "" || newPwd2 == ""){
			mui.toast("请完整输入旧密码和新密码！");
			return;
		}else{
			if(newPwd1 != newPwd2){
				mui.toast("两次输入的密码不正确 !");
				return;
			}else{
				changePassword(newPwd1,oldPwd);
			}
		}
	});	
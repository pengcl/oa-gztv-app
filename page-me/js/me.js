
	var wvId; // 界面id
	
	var userId = ""; // 存储用户id
	var userDepart = ""; // 用户部门
	var userNameValue = ""; // 用户姓名
	var usersHeadPicUrl; // 定义用户头像url
	
	var headPicObj = document.getElementById("headPicObj"); // 头像对象
	
	mui.init({});
	
	mui.plusReady(function() {
		
		wvId = plus.webview.currentWebview().id;
		
		userNameValue = plus.storage.getItem("uname"); // 获取用户姓名
		userId = plus.storage.getItem("lastId"); // 获取用户id
		userDepart = plus.storage.getItem("userDepart"); // 获取用户id
		usersHeadPicUrl = topUrl+downloadHeadPic+"?account="+userId + '&token=' + token; // 拼接用户头像url
		console.log(usersHeadPicUrl);
		initData();
		downHeadPic();
	});
	
	function initData(){
		document.getElementById("userNameObj").innerHTML = userNameValue;
		document.getElementById("userDepartObj").innerHTML = userDepart;
		console.log(userId);
		document.getElementById("userIdObj").innerHTML = "帐号: "+userId;
		document.getElementById("version").innerHTML = "V" + plus.runtime.version;
		
		// 获取应用名称
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
		    document.getElementById("about-label").innerHTML = "关于" + inf.name;
		});				
		
	}
	
	/**
	 * 下载图片
	 */
	function downHeadPic() {
		headPicObj.src = usersHeadPicUrl;
	}
	
	mui(".mui-table-view").on('tap', '.mui-table-view-cell', function() {
		
		var clickId = this.getAttribute("id");
		
		switch(clickId) {
			case 'personalPic':
				openNewPage("me-personalInfo.html","me-personalInfo");
				break; // 设置头像
			case 'userInfo':
				openNewPage("me-personalInfo.html","me-personalInfo");
				break; // 设置头像				
			case 'personalInfo':
				break; // 个人信息
			case 'changePwd':
				openNewPage("me-changePwd.html","me-changePwd");
				break; // 修改密码
			case 'about':
				openNewPage("me-about.html","me-about");
				break; // 关于
			case 'share':
				shareHref();
				break; // 分享链接
			case 'setting':
				openNewPage("me-notifications.html","me-notifications");
				break; // 设置界面
			case 'logout':
				mui.confirm("确认退出当前账号 ?","确认",["确定","取消"],function(result){
					
					// 清除cookie保存的密码
					plus.storage.setItem("lastPwd", "");
					
					if (result.index == 0) {
						var main = plus.webview.getWebviewById("main");
						main.evalJS("mui.doAction('backs');");
					}
					
				});
				
				break; // 退出登录
		}
		
	});
	
	/*
	mui.back = function() {
		var mainPage = plus.webview.getWebviewById('main');
		mainPage.evalJS("changeTab(0, 1);");
	};
	*/
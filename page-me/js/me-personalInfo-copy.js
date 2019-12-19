	var w = null;
	var wvId;
	var userInfo;
	var usersHeadPicUrl = ""; // 定义用户头像url
	var userNameValue = ""; // 用户姓名
	var userDepart = ""; // 用户部门
	var userId = ""; // 用户账号
	
	var userNameObj = document.getElementById("unameObj").children[1];
	var deptNameObj = document.getElementById("deptNameObj").children[1];
	var userMobileObj = document.getElementById("umobileObj").children[1];
	var userEmail = document.getElementById("uemailObj").children[1];
	var accountObj = document.getElementById("accountObj").children[1];
	var headPicObj = document.getElementById("headPicObj"); // 头像对象
	var saveBtn = document.getElementById("saveBtn");
	
	mui.init();
	mui.plusReady(function() {

		getInfoData();
		
		wvId = plus.webview.currentWebview().id;
		userNameValue = plus.storage.getItem("uname"); // 获取用户姓名
		userId = plus.storage.getItem("lastId"); // 获取用户id
		userDepart = plus.storage.getItem("userDepart"); // 获取用户id
		usersHeadPicUrl = topUrl+downloadHeadPic+"?account="+userId; // 拼接用户头像url
		downHeadPic();
	});
	
	// 设置个人信息
	function getInfoData() {
		sendRequest(getUserInfoUrl,"",function(rtnData){
			console.log("--------------------------------------");
			console.log("个人信息数据: " + JSON.stringify(rtnData));
			userInfo = rtnData;
			initData();
		});
	}
	
	// 初始化数据
	function initData(){
		userNameObj.innerHTML = userInfo["uname"];
		deptNameObj.innerHTML = plus.storage.getItem("deptName");
		userMobileObj.innerHTML = userInfo["umobile"];
		userEmail.innerHTML = userInfo["uemail"];
		accountObj.innerHTML = userId;
	}
	
	// 编辑成功的回调函数
	function editCallback(objId, newValue){
//				var temp = document.getElementById(objId).children[1];
//				temp.innerHTML = newValue;
		userInfo[objId] = newValue;
		uploadInfoData();
	}
	
	/**
	 * 选择图片
	 */
	function setPersonalPic() {
		plus.gallery.pick( function(path){
			
			createUpload(path);
			
		}, function (e){}, {filter:"image"});
	}
	
	/**
	 * 下载图片
	 */
	function downHeadPic() {
		headPicObj.src = usersHeadPicUrl;
	}
	
	/**
	 * 上传图片
	 * @param {String} filePath 图片路径
	 */
	function createUpload(filePath) {
		var task = plus.uploader.createUpload( topUrl+uploadHeadPic, 
			{ method:"POST",blocksize:204800,priority:100 },
			function ( t, status ) {
				// 上传完成
				if ( status == 200 ) { // 请求成功的操作
					console.log(JSON.stringify(t));
					
					var responseText = JSON.parse(t.responseText); // 获取返回的数据
					if (responseText.code == 0) { // 上传成功时操作
						mui.toast(responseText.message);
						downHeadPic();
					} else { // 上传失败
						console.log("上传失败: "+responseText.message);
					}
					
				} else { // 请求失败的操作
					console.log( "Upload failed: " + status );
				}
			}
		);
		task.addFile( filePath, {key:"upLoadFile"} );
		task.addData( "account", userId ); // 设置账号
		//task.addEventListener( "statechanged", onStateChanged, false );
		task.start();
	}
	
	/**
	 * 上传信息数据
	 */
	function uploadInfoData(){
		// 发送保存用户信息
		var args = {
			uname : userInfo["uname"],
			umobile : userInfo["umobile"],
			uemail : userInfo["uemail"]
		};
		sendRequest(upDateUserInfoUrl,args,function(rtnData){
			console.log("--------------------------------------");
			console.log("信息保存结果: " + JSON.stringify(rtnData));
			if(rtnData.code == "1"){
				mui.toast(rtnData.msg);
				getInfoData();
			}else{
				mui.toast(rtnData.msg);
			}
		});
	}
	
	/**
	 * 选择回调
	 * @param {String} textStr 选中选项的名称
	 * @param {String} idStr <p选中选项的id
	 * @param {String} controlId <p控件的id
	 */
	function SelectOneCallback(textStr,idStr,controlId){
		
		switch (textStr) {
			case "选择照片" : setTimeout(setPersonalPic,300); break;
			case "拍照上传" : setTimeout(takePhoto,300); break;
			case "查看图片" : setTimeout(showPic,300); break;
		}
	}
	
	// 拍照
	function takePhoto() {
		var cmr = plus.camera.getCamera();
		path = "_doc/camera/"+plus.storage.getItem('uid')+".jpg"; // 设置路径与文件名称
		cmr.captureImage( function ( p ) { // 成功返回图片保存路径
			plus.io.resolveLocalFileSystemURL(p,function (entry){
				createUpload(path);
			},function (){
				console.log("失败了");
			});
		}, function ( e ) {
			console.log( "失败："+e.message );
		}, {filename:path,index:1} );
	}
	
	// 查看图片
	function showPic() {
		displayFile(document.getElementById("headPicObj"));
	}
	
	// 创建悬浮窗口
	var floatw=null;
	function floatWebview(){
		if(floatw != null){ // 避免快速多次点击创建多个窗口
			return;
		}
		dialogHeight = 102 + 2 * 43;
		var styleArgs = {
			width:'300px',
			height: dialogHeight+'px',
			margin:"auto",
			background:"rgba(0,0,0,0.5)",
			scrollIndicator:'none',
			scalable:false,
			popGesture:'none'
		};
		var args = {
			pageTitle : "请选择上传方式", // 设置选择页面的标题
			dataFlag : RADIO_CAMERA, // 设置需要选择的数据类型
			initialPageId : wvId, // 设置发起请求的页面id
			controlId : "", // 设置发起请请求的控件id
			callbackFun : "SelectOneCallback" // 回调函数名
		}
		floatw=plus.webview.create("selectOneDialog.html","selectOneDialog",styleArgs,args);
		floatw.addEventListener("loaded",function(){
			floatw.show('fade-in',300);
			floatw=null;
		},false);
	}
	
	// 设置条目击事件(控件组点击方式)
	mui(".form").on('tap', '.mui-table-view-cell', function() {
		var clickId = this.getAttribute("id");
		var clickName = this.getAttribute("name");
		
		switch (clickId) {
			case 'personalPic':
			case 'unameObj':
			case 'deptNameObj':
			case 'accountObj':
				return;
		}
		
		var openUrl = "../page-common/editPage.html";
		var openId = "editPage";
		
		var args = {
			titleText : "修改"+this.children[0].innerHTML,
			oldValue : userInfo[clickName],
			objId : clickName,
			wvId : wvId,
			callbackName : "editCallback"
		};
		openNewPage(openUrl,openId,args);
	});
	
	// 添加保存按钮点击监听
	saveBtn.addEventListener('tap', function(event) {
		
	});
	
//	mui.back = function() {
//		var tempPage = plus.webview.getWebviewById("setting");
//		tempPage.evalJS("downHeadPic();");
//		mui.doAction("backs");
//	}
	
	// 上传照片事件
	mui(".head").on('tap','#personalPicL', function() {
		floatWebview();
	});
	
	// 查看照片全图事件
	mui(".head").on('tap','#headPicObj', function() {
		showPic();
	});			
	
	// 显示文件
	function displayFile(img){
		if(w) {
			mui.toast('重复点击！');
			return;
		}
		
		if(!img || !img.src){
			mui.toast('无效的媒体文件');
			return;
		}
		
		var src = img.src;
		var suffix = src.substr(src.lastIndexOf('.'));
		var url = '';
		if(suffix=='.mov' || suffix=='.3gp' || suffix=='.mp4' || suffix=='.avi'){
			url = '../plus/camera_video.html';
		} else {
			url = '../plus/camera_image.html';
		}
		w = plus.webview.create(url,url,{hardwareAccelerated:true,scrollIndicator:'none',scalable:true,bounce:'all'});
		w.addEventListener('loaded', function(){
			w.evalJS('loadMedia("'+ src +'")');
		}, false );
		w.addEventListener('close', function(){
			w = null;
		}, false);
		w.show('pop-in');
	}	
	var titleText;		// 标题栏内容
	var oldValue;		// 原来的数据
	var objId;			// 显示编辑后数据的控件id
	var wvId;			// 目标页面id
	var callbackName;	// 目标页面的编辑回调函数名
	var listName;		// 下拉列表的描述
	var listData;		// 下拉列表的数据数组
	
	var title = document.getElementById("title");
	var editContent = document.getElementById("editContent");
	var saveBtn = document.getElementById("saveBtn");
	var selectList = document.getElementById("selectList");
	
	mui.init();
	mui.plusReady(function(){
		var self = plus.webview.currentWebview();
		titleText = self.titleText;// 标题文字
		oldValue = self.oldValue;// 旧数据
		objId = self.objId;// 显示内容的空间id
		wvId = self.wvId;// 需要编辑的页面id
		callbackName = self.callbackName;// 编辑成功的回调函数名
		listName = self.listName;// 下拉列表的标题
		
		if(listName != undefined && listName != ""){// 若没有下拉列表标题或标题为空, 则不加载下拉列表
			listData = self.listData;// 获取下拉列表的数组数据
			initAccordion();
		}
		
		initData();
		
		// 强制打开键盘
		showKeyBoard('editContent');
	});
	
	
	/***
	 * 初始化数据
	 */
	function initData(){
		title.innerHTML = titleText;
		editContent.value = oldValue;
	}
	
	
	/**
	 * 强制打开键盘
	 * @param {String} objId <p需要获取焦点的控件
	 */
	function showKeyBoard(objId) {
		
		if (objId) {
			document.getElementById(objId).focus();
		}
		
		var osName = plus.os.name;
		
		if (osName == "Android") {
			var Context = plus.android.importClass("android.content.Context");
		    var InputMethodManager = plus.android.importClass("android.view.inputmethod.InputMethodManager");
		    var main = plus.android.runtimeMainActivity();
		    var imm = main.getSystemService(Context.INPUT_METHOD_SERVICE);
		    imm.toggleSoftInput(0,InputMethodManager.SHOW_FORCED);mui.toast();
		} else if (osName == "iOS") {
			var webView = plus.webview.currentWebview().nativeInstanceObject();
			webView.plusCallMethod({"setKeyboardDisplayRequiresUserAction":false});
		}
	}
	
	
	/***
	 * 初始化下拉列表
	 */
	function initAccordion(){
		var groupName = document.getElementById("groupName");
		var selectContentList = document.getElementById("selectContentList");
		selectList.hidden = false;
		groupName.innerHTML = listName;
		for(var i = 0; i < listData.length; i++){
			var li = document.createElement("div");
			li.classList.add("mui-input-row");
			li.innerHTML = "<label>"+listData[i]+"</label>";
			selectContentList.appendChild(li);
		}
	}
	
	
	/***
	 * 设置常用语列表item点击事件
	 */
	mui("#selectContentList").on('tap','.mui-input-row',function(){
		var phrase = this.children[0].innerHTML;// 获取点击项的内容
		editContent.value = phrase;
		groupName.parentElement.classList.remove("mui-active");// 收起下拉列表
	});
	
	
	/***
	 * 添加确认按钮点击事件
	 */
	saveBtn.addEventListener('tap', function(event) {
		try{
			var page = plus.webview.getWebviewById(wvId);
			page.evalJS(callbackName+"('"+objId+"','"+editContent.value+"');");	
		} catch(e){}
		
		mui.back();
	});
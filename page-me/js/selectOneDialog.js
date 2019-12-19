	var dataFlag; // 记录需要显示的数据类型
	var controlId; // 需要显示控件id
	var initialPageId; // 发起请求的页面id
	var callbackFun; // 成功回调函数名
	
	// 交通工具数据
	var transportData = [{"title":"地铁","dataId":"地铁"},{"title":"公交","dataId":"公交"},{"title":"汽车","dataId":"汽车"},{"title":"火车","dataId":"火车"},{"title":"高铁","dataId":"高铁"},{"title":"飞机","dataId":"飞机"},{"title":"其他","dataId":"其他"}];
	// 照相选项
	var cameraData = [{"title":"拍照上传","dataId":"拍照上传"},{"title":"选择照片","dataId":"选择照片"}];
	var projectData = [{"pmName":"项目1","pmNo":"pro001"},{"pmName":"项目2","pmNo":"pro002"},{"pmName":"项目3","pmNo":"pro003"},{"pmName":"项目4","pmNo":"pro004"}];
	var normalIndex = {"title":"title","dataId":"dataId"}; // 交通工具数据的下标, 用于通用通用性加载数据列表
	var projectIndex = {"title":"pmName","dataId":"pmNo"}; // 项目数据下标
	var index = normalIndex; // 默认下标为交通工具的下标
	
	var pageTitle = document.getElementById("pageTitle"); // 页面标题
	var tableListObj = document.getElementById("tableListObj"); // 列表对象
	
	mui.plusReady(function() {
		var self = plus.webview.currentWebview();
		pageTitle.innerHTML = self.pageTitle; // 设置标题
		dataFlag = self.dataFlag; // 获取需要显示的数据类型
		controlId = self.controlId; // 获取需要显示的控件id
		initialPageId = self.initialPageId; // 获取请求页面的id
		callbackFun = self.callbackFun; // 获取需要显示的数据类型
		initData(dataFlag);
		
	});
	
	function initData(dataFlag) {
		
		var listData;
		
		switch(dataFlag) {
			case RADIO_PROJECT: // 项目
				index = projectIndex;
				var requestUrl = topUrl+projectApi+PM_API_CMD_202;
				sendRequest(requestUrl,{},function(rtnData){
					console.log("--------------------------------------");
					console.log("项目列表数 : " + JSON.stringify(rtnData));
					listData = rtnData;
					createList(listData);
				});
				break;
			case RADIO_TRANSPORT: // 交通工具
				listData = transportData;
				index = normalIndex;
				createList(listData);
				break;
			case RADIO_CAMERA: // 拍照选项
				listData = cameraData;
				index = normalIndex;
				createList(listData);
				break;
		}
	}
	
	function createList(listData) {
		if (listData.length != 0) {
			for (var i=0; i<listData.length; i++) {
				var itemData = listData[i];
				var li = document.createElement("li");
				li.className = "mui-table-view-cell";
				li.itemData = itemData;
				li.id = itemData[index.dataId];
				li.innerHTML = itemData[index.title];
				tableListObj.appendChild(li);
			}
		} else {
			mui.toast("没有可选项");
		}
	}
	
	mui('.mui-table-view').on('tap','li',function(){
		var textStr = this.innerHTML;
		var idStr = this.getAttribute("id");
		var tempPage = plus.webview.getWebviewById(initialPageId);
		tempPage.evalJS(callbackFun+"('"+textStr+"','"+idStr+"','"+controlId+"');");
		mui.back();
	});
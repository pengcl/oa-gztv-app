	var listData = null;
	var maxCount = 0;
	var pageCount = 0;
	var searchValue = "";
	var wvId = "main-beDone"; // 已办
	var homePage;// 主页页面

	var centontList = document.body.querySelector('#itemList');

	mui.init({
		pullRefresh: {
			container: '#pullrefresh',
			up: {
				contentrefresh:'正在加载中...',
				callback: pullupRefresh
			}
		}
	});
	
	mui.plusReady(function(){
		
		homePage = plus.webview.getWebviewById("page-main/main-home.html");
		
		// 加载列表数据
		getListData(1,"");
		
		// 初始化控件
		initView();
	});
		
	// 获取列表数据
	function getListData(pageNum,seacrhCentent) {
		
		pageCount = pageNum;
		
		// 根据不同的界面加载不同的内容
		var args = {
			page: pageNum,
			pageSize: "15",
			searchTxt:seacrhCentent
		};
		var success = function(rtnData){
			
			console.log("--------------------------------------");
			console.log("公文列表数据: " + JSON.stringify(rtnData));
			
			if(listData == null)listData = rtnData.rows;
			else listData = listData.concat(rtnData.rows);// 合并数据数组
			maxCount = rtnData.total;
			
			// 创建已办列表
			createItemList(rtnData.rows, wvId);
			
		}
		sendRequest(beDoneList, args, success);
	}
	
	/**
	 * 上拉加载更多数据
	 */
	function pullupRefresh() {
		setTimeout(function() {
			//参数为true代表没有更多数据了。
			mui('#pullrefresh').pullRefresh().endPullupToRefresh((itemCount == maxCount)); 
			if(itemCount < maxCount)
				getListData(parseInt(pageCount)+1,searchValue);
		}, 1000);
	}
	
	// 初始化设置
	function initView(){
		
		// 隐藏滚动条
		plus.webview.currentWebview().setStyle({
			scrollIndicator: 'none'
		});
	}
	
	// 清空界面, 重新加载数据
	function searchFunction(){
		centontList.innerHTML = "";
		itemCount = 0;
		listData = null;
		// 重置上拉加载
		mui('#pullrefresh').pullRefresh().refresh(true);
		searchValue = searchInput.value.trim();
		getListData(1,searchValue);
	}
	
	// 刷新列表
	function refreshList() {
		homePage.evalJS("refreshData(true);");
	}

	// 设置列表item点击事件
	mui("#itemList").on('tap', '.mui-table-view-cell', function() {
		
		var id = this.getAttribute("id");
		if ( id == 0 ) return;
		
		console.log("--------------------------------------");
		console.log("被点击的条目id: " + id);
		
		var openUrl = '../page-beDone/beDone-main.html';
		var openId = 'beDone-main';
		
		openItemPage(id, listData, openUrl, openId, wvId);
		
		// 刷新界面
		setTimeout(searchFunction,500);
		
	});
	
	// 标题搜索键监听
	var searchButton = document.getElementById("searchButton");
	searchButton.addEventListener('tap', function(event){
		searchFunction();
	});
	
	// 返回
	var back = document.getElementById("toBack");
	back.addEventListener('tap', function(event) {
		var mainPage = plus.webview.getWebviewById("main");
		mainPage.evalJS("changeTab(0,1);");
	});	

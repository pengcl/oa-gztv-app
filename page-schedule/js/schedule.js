var homePage;

// 获取控件对象
var back = document.getElementById("toBack"); // 获取回退按钮对象(回退到首页)
var hideSearchBtn = document.getElementById("hideSearchBtn"); // 获取隐藏搜索栏按钮对象(隐藏搜索栏)
var searchBtn = document.getElementById("searchButton"); // 获取搜索按钮对象(获取数据)
var showSearchBtn = document.getElementById("showSearchBtn"); // 获取显示搜索栏按钮对象(显示)
var titleGroup = document.getElementById("titleGroup"); // 获取标题栏控件组
var searchGroup = document.getElementById("searchGroup"); // 获取搜索栏控件组

// mui初始化
mui.init({
	beforeback: function(){
		try{
			var list = plus.webview.getWebviewById('main');
		    mui.fire(list,'refreshPage');
		}catch(e){
			//TODO handle the exception
		}
		return true;
	}
});

var subpages = ['schedule-calendar.html', 'schedule-list.html'];
var subpage_style = {
	top: subpageTop, //90px
	bottom: '0px'
};

var aniShow = {};
var title = document.getElementById("title");

//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	
	homePage = plus.webview.getWebviewById("page-main/main-home.html");
	
	var self = plus.webview.currentWebview();
	var wvId=self.id;
	var extrasArr=[];
	
	for (var i = 0; i < subpages.length; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style,extrasArr[i]);
		if (i > 0) {
			sub.hide();
		}else{
			temp[subpages[i]] = "true";
			mui.extend(aniShow,temp);
		}
		self.append(sub);
	}	
});

// 当前激活选项
var activeTab = subpages[0];

// 搜索框事件
/*
mui(".mui-input-speech")[0].addEventListener('input',function(){
	doSearch();
})
*/

// 搜索框点击事件
/*
mui(".mui-input-speech")[0].addEventListener('tap',function(){
    doSearch();
});
*/

/***
 * 按关键字查询
 */
function doSearch() {
	
	var topPage = plus.webview.getWebviewById('notice-list.html');	
	var searchInput = document.getElementById("searchInput");
	var returnJSON = {};
	returnJSON.keyword = searchInput.value;
	var jsonStr = JSON.stringify(returnJSON);
	mui.fire(topPage,'doSearchList',{
        targetJSON: jsonStr
   });
	
}



// 标题搜索键监听
searchBtn.addEventListener('tap', function(event) {
	
	/*
	// 重置上拉加载
	mui('#pullrefresh').pullRefresh().refresh(true);
	searchValue = searchInput.value.trim();
	refreshData();

	homePage.evalJS("refreshData('y');");
	*/
	doSearch();
	
});

// 显示搜索栏按钮点击事件
showSearchBtn.addEventListener('tap', function(event) {
	setTimeout(function() {
		titleGroup.hidden = true;
		searchGroup.style.display = "-webkit-flex"; // 用 -webkit-flex 代替 flex, 使flex属性在旧设备上也生效
		searchInput.focus();
	}, 400);// 设置延时, 保证显示搜索栏时弹出软键盘
});

// 隐藏搜索栏按钮点击事件
hideSearchBtn.addEventListener('tap', function(event) {
	searchGroup.style.display = "none";
	titleGroup.hidden = false;
	searchInput.blur(); // 隐藏搜索栏时让输入框失去焦点
});
			
// 标题栏返回键监听
var back = document.getElementById("toBack");
back.addEventListener('tap', function(event){
	var mainPage = plus.webview.getWebviewById("main");
	mainPage.evalJS("changeTab(0,3);");
});

var addTask = document.getElementById("addTask");
addTask.addEventListener("tap", function(){
	var url = 'schedule-detail.html';
	openNewPage(url, ' ');
})
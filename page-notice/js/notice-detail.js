mui.init();

var bulletinId;

var uname;
var token = plus.storage.getItem("token");
mui.plusReady(function() {
	uname = plus.storage.getItem("uname");
	console.log("detail");
	var self = plus.webview.currentWebview();
	bulletinId = self.bulletinId;
	showNoticDetail();
	getFileInfo();
	
	initVueApp();
});

var vm;
function initVueApp(){
	vm = new Vue({
	  el: '#app',
	  data: {
	  	uname:'',
	  	subject:'',
	  	auditUserName:'',
	  	auditTime:'',
	  	html:''
	  }
	})
}

function showNoticDetail(){
	var args = {
		token:token,
		id:bulletinId
	};
	console.log(args);
	var _url = "bulletinMgr/getView";
	sendRequest(_url, args, function(rtnData) {
		console.log("请求的结果: " + JSON.stringify(rtnData));
		vm.subject = rtnData.subject;
		vm.auditUserName = rtnData.auditUserName;
		vm.auditTime = rtnData.auditTime;
		vm.html = rtnData.html;
		vm.uname = uname;
		$("#html").html(rtnData.htmlPure);
	});
}

function getFileInfo(){
	var _url = "wfFileProxy/queryAllFile";
	var params = {};
	params.tableName = 'oa_bulletin';
    params.tableId = bulletinId;
	params.token = token,
	sendRequest(_url, params, function(rtnData) {
		console.log("请求的结果: " + JSON.stringify(rtnData));
	});
}

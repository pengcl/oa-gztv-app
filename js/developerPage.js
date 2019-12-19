
/* 主页返回按钮 */

var toHome = document.getElementById("toHome");
toHome.addEventListener('tap',function(){
	plus.webview.getWebviewById("setting").evalJS("mui.back();");
});

// 设置沉浸式标题栏

var subpageTop = 44;

(function(w){

	document.addEventListener('plusready',function(){
//		console.log("Immersed-UserAgent: "+navigator.userAgent);
	},false);
	
	var immersed = 0;
	var ms=(/Html5Plus\/.+\s\(.*(Immersed\/(\d+\.?\d*).*)\)/gi).exec(navigator.userAgent);
	if(ms&&ms.length>=3){
		immersed=parseFloat(ms[2]);
	}
	
	w.immersed=immersed;
	
	// 若不支持沉浸式, 这退出该方法, 不再向下执行
	if(!immersed){
		return;
	}
	
	subpageTop = subpageTop + immersed;
	
	var t=document.getElementById('header');
	t&&(t.style.paddingTop=immersed+'px',t.style.height=subpageTop+'px');
	
	t=document.getElementById('content');
	t&&(t.style.marginTop=immersed+'px');
	
	t=document.getElementById('pageContent');
	t&&(t.style.marginTop=(immersed+42)+'px');
	
	t=document.getElementById('titleTabContent');
	t&&(t.style.marginTop=(immersed+88)+'px');

})(window);
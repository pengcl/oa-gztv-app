
//mui.doAction("backs");// 返回上一个页面

// 标题栏返回键监听
try{
	var back = document.getElementById("toBack");
	back.addEventListener('tap', function(event) {
		mui.back();
	});	
}catch(e){}

// 右滑回退
window.addEventListener("swiperight", function(e) {
	//默认滑动角度在-45度到45度之间，都会触发右滑菜单，为避免误操作，可自定义限制滑动角度；
	
	var angle = event.detail.angle; // 获取滑动角度
	var distance = event.detail.distance; // 获取滑动距离(像素)
	angle = Math.abs(angle);
//  alert(angle+","+distance);
	/**
	 * 控制滑动的角度，为避免误操作，可自定义限制滑动角度；
     */
	if(angle < 20) { // 若滑动角度大于20, 则不启用滑动退出
		if (distance > 200){ // 若滑动距离没有200个像素, 则不启用滑动退出
			mui.back();
		}
	}

});

/**
 * 显示等待框
 * @param {Object} waitingText 等待时提示的文字
 */
function showWaiting ( waitingText ) {
	
	// 设置等待框的属性
	var waitingStyle = {
		loading : { display:"inline" },// 进度圈与文字同行
//		back : "none"// 不响应返回键
	}
	
	plus.nativeUI.showWaiting( waitingText , waitingStyle);
}

// 关闭等待框
function closeWaiting () {
	try{
		plus.nativeUI.closeWaiting();
	}catch(e){
		//TODO handle the exception
	}
}

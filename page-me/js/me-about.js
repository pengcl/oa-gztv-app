
	var versionObj = document.getElementById("versionObj"); // 版本显示
	
	mui.init();
	
	mui.plusReady(function() {
		
		initData();
		
		checkNewVersion();
		
	});
	
	function initData() {
		
		// 版本号
		versionObj.innerHTML = CONST_VER_PRE + plus.runtime.version;
		
		// 版权声明
		document.getElementById("copyright-chn").innerHTML = CONST_COPYRIGHT_CHN;
		document.getElementById("copyright-en").innerHTML = CONST_COPYRIGHT_EN;
		
		// 获取应用名称
		plus.runtime.getProperty(plus.runtime.appid, function(inf) {
		    document.getElementById("header-title").innerHTML += inf.name;
		    document.getElementById("app-name").innerHTML = inf.name;
		    document.getElementById("app-name-label").innerHTML = inf.name;
		    document.getElementById("app-des").innerHTML = inf.description;
		});
		
	}
	
	versionObj.addEventListener('tap',function(){
		checkNewVersion();
	});
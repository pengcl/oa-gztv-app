var wgtVer=null;
function plusReady(){ // 获取本地应用资源版本号
    plus.runtime.getProperty(plus.runtime.appid,function(inf){
        wgtVer=inf.version;
    });
}
//休眠方法
var ver;
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

mui.plusReady(function(){    
     plus.runtime.getProperty(plus.runtime.appid, function(inf) {
            ver = inf.version;
            var url= topUrl+'VersionCheck!checkVersion.action';
            var client;
            var ua = navigator.userAgent.toLowerCase();
            if(/iphone|ipad|ipod/.test(ua)) {    //苹果手机      
	            	mui.ajax(url,{
	                data:{
	                	type:'ipa',
	                    version: ver
	                },
	                dataType:'json',
	                type:'POST',
	                timeout:10000,
	                success:function(data){  
	                    if(data.success){  
	                        mui.toast("发现新版本:V"+data.version);
	                        document.location.href=data.url;
	                    }else{
	           				console.log('当前版本号已是最新');
	                        return;
	                    }
	                },
	                error: function(xhr, type, errerThrown) {
	                    //mui.toast('检查新版本失败，请稍候再试');
	                }
	            });
            }else if(/android/.test(ua)) { 
	                mui.ajax(url,{
		                data:{
		                	type:'apk',
		                    version: ver
		                },
		                dataType:'json',
		                type:'POST',
		                timeout:10000,
		                success:function(data){  
		                    if(data.success){  
		                        mui.toast("发现新版本:V"+data.version);//获取远程数据库中上新andriod版本号                       
		                        var dtask = plus.downloader.createDownload(data.url, {}, function(d, status) {
		                            if (status == 200) {                                        
		                                plus.nativeUI.toast("正在准备环境，请稍后！");
		                                sleep(1000);
		                                var path = d.filename;//下载apk
		                                plus.runtime.install(path); // 自动安装apk文件
		                            }else {
		                                alert('版本更新失败:' + status);
		                            }
		                        });
		                        dtask.start(); 
		                    }else{
		           				console.log('当前版本号已是最新');
		                        return;
		                    }
		                },
		                error: function(xhr, type, errerThrown) {
		                    //mui.toast('检查新版本失败，请稍候再试');
		                }
		          });
        }
    });
     
});
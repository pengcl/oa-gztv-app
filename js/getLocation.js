
/**
 * 通过定位模块获取位置信息
 * @param {Object} success 获取数据成功的回调方法, 方法参数为position
 */
function getLocation( success ){
	
	plus.geolocation.getCurrentPosition( success, function ( e ) {
		try{
			closeWaiting();
		}catch(e){}
		mui.toast( "获取位置信息失败："+e.message );
	},{geocode:true,provider:'amap'});
}


// 获取位置信息成功后的模板
/*function success( position ) {
	var str = "";
	str += "地址："+position.addresses+"<br>";//获取地址信息
	str += "坐标类型："+position.coordsType+"<br>";
	var timeflag = position.timestamp;//获取到地理位置信息的时间戳；一个毫秒数；
	str += "时间戳："+timeflag+"<br>";
	var codns = position.coords;//获取地理坐标信息；
	
	
	var lat = codns.latitude;//获取到当前位置的纬度；
	str += "纬度："+lat+"<br>";
	var longt = codns.longitude;//获取到当前位置的经度
	str += "经度："+longt+"<br>";
	
//				onClick01(codns.latitude,codns.longitude);
	
	var alt = codns.altitude;//获取到当前位置的海拔信息；
	str += "海拔："+alt+"<br>";
	var accu = codns.accuracy;//地理坐标信息精确度信息；
	str += "精确度："+accu+"<br>";
	var altAcc = codns.altitudeAccuracy;//获取海拔信息的精确度；
	str += "海拔精确度："+altAcc+"<br>";
	var head = codns.heading;//获取设备的移动方向；
	str += "移动方向："+head+"<br>";
	var sped = codns.speed;//获取设备的移动速度；
	str += "移动速度："+sped;
//				console.log(JSON.stringify(position));
	test.innerHTML = JSON.stringify(str);
}*/
			
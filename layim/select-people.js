var addPeopleHtml='<div class="addPeopleFun" style="background-color: white;;height: 80px;border-bottom: 1px solid #d9d8da;border-top: 1px solid #d9d8da;margin:10px 0">'+
'<p style="text-align: center;font-size: 55px;color: #51aa38;">'+
'<i class="fa fa-mobile-phone"></i></p>'+
'<p style="text-align: center;margin: 0px;font-size: 13px;">添加手机联系人</p></div>';

//var selectPeopleHtml='<ul style="list-style: none;padding: 0 15px;background-color: white;">'+
//'{{#  layui.each(d.data.test, function(index, item){ }}'+
//'<li  style="height: 60px;line-height: 60px;">'+
//'<img style="height: 30px;vertical-align: middle;" src="../img/slider/touxiang@2x.png">'+
//'<span style="margin-left: 5px;">{{ item.fromUserName }}&nbsp&nbsp{{item.content}}</span>'+
//'<span  style="float: right;"><a class="confirmFriend" id="{{item.id}}" style="background-color: mediumblue;color: #e5e5e5;padding:2px;border-radius: 2px;">接收</a>'+
//'<a class="rejectFriend" id="{{item.id}}" style="margin-left:10px;background-color: red;color: #e5e5e5;padding:2px;border-radius: 2px;">拒绝</a></span>'+
//'<div style="clear: both;"></div></li>'+
//'  {{#  }); }}'+'</ul>';

var selectPeopleHtml='<ul style="list-style: none;padding-left: 15px;background-color: white;">'+
'{{#  layui.each(d.data.test, function(index, item){ }}'+
'<li  style="height: 78px;line-height: 78px;border-bottom: 1px solid #d9d8d9;">'+
'<img style="height: 36px;float: left;margin-top: 21px;" src="../img/slider/touxiang@2x.png">'+
'<ul class="ul-friend"><li style="color: #2d2d2d;font-size: 14px;">{{ item.fromUserName }}</li>'+
'<li style="font-size: 13px;color: #888888;">{{item.content}}</li></ul>'+
'<span  style="float: right;"><a class="confirmFriend jieshou" id="{{item.id}}">接收</a>'+
'<div style="clear: both;"></div></li>'+
'  {{#  }); }}' + '</ul>';

//寻找朋友窗口
mui("#muiChat").on('tap', '.addPeopleFun', function(event) {
	var url = 'address-book.html';
	openNewPage(url, username);
})

//添加朋友
mui("#muiChat").on('tap', '.confirmFriend', function(event) {
	var homePage = plus.webview.getWebviewById(' '+username);
	var messageId = this.getAttribute("id")
	var url = JpImConstant.baseUrl + 'layim/confirmFriend';
	mui.ajax(url, {
		data:{
			messageId:messageId,
			userId:username,
		},
		success: function(data) {
			if(data.success){
				alert("添加好友成功");
				homePage.reload();
			}else{
				alert(data.errorMsg);
			}
		},
	});
})

//拒绝朋友
mui("#muiChat").on('tap', '.rejectFriend', function(event) {
	var messageId = this.getAttribute("id")
	var url = JpImConstant.baseUrl + 'layim/confirmFriend'
	mui.ajax(url, {
		data: {
			messageId: messageId,
			userId: username,
		},
		success: function(data) {
			if(data.success) {
				alert("拒绝好友成功");
			} else {
				alert(data.errorMsg);
			}
		},
	});
})
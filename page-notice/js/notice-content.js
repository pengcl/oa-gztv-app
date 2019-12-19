var homePage;
// mui初始化
mui.init({
	
});
var token;
//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	//获取通知公告内容
	token = plus.storage.getItem("token");
	console.log(token);
	getNoticeTest();
	//获取评论内容
	getNoticeComment();
});

function getNoticeTest(){
	console.log('getNoticeTest');
	var noticeInfoId = plus.webview.currentWebview().id;
	var noticeInfo = document.getElementById("noticeInfo");
    var url = topUrl + 'noticeInfo/get';
    var path = topUrl+'SysAttachment!download.action?fileNo=';
	console.log('noticeInfo');
    mui.ajax(url, {
		dataType: 'json', //服务器返回json格式数据
		data: {
			token:token,
			id: noticeInfoId,
		},
		success: function(data) {
			console.log(data);
			var html = '<div style="text-align: center;">'+data.text+'</div>';
			html+='<p noticeId='+noticeInfoId+' id="noticePraise"  class="noticePraise" style="text-align: center;font-size:1.4em;margin-top: 20px;margin-bottom:10px">点赞</p>';
			html+='<p><span style="text-align: left;margin-left: 0.4em;">评论</span>';
			html+='<span style="float: right;margin-right: 0.4em;">'+data.commentQuantity+'条评论/'+data.partakeQuantity+'人参与</span></p>';
			noticeInfo.innerHTML=html;
			//获取点赞信息
			noticePraise(noticeInfoId);
		},
	});
}


// 标题栏返回键监听
var back = document.getElementById("toBack");
back.addEventListener('tap', function(event){
	mui.back();
});
var noticeInfo = document.getElementById("noticeInfo");
//点赞
mui("#noticeInfo").on('tap', '.noticePraise', function() {
	var userId = plus.storage.getItem("sysUsersId");
	var noticeInfoId = this.getAttribute("noticeId");
	var url = topUrl + 'noticePraise/favor'
	var dataTitle = "点赞成功";
	if(isNoticePraise) {
		url = topUrl + 'noticePraise/unFavor';
		dataTitle = "取消点赞成功";
	}
	var noticePraise = document.getElementById("noticePraise");
	mui.ajax(url, {
		data: {
			token:token,
				noticeInfoId:noticeInfoId,
			},
			type: 'post', //HTTP请求类型
		success: function(_rst) {
				alert(dataTitle);
				var url = topUrl + 'noticePraise/noticePraise'
				var noticePraise = document.getElementById("noticePraise");
				mui.ajax(url, {
					data: {
						token:token,
						noticeInfoId: noticeInfoId,
					},
					dataType: 'json', //服务器返回json格式数据
					async: true,
					success: function(data) {
						for(var i = 0; i < data.length; i++) {
							if(userId == data[i].userId) {
								noticePraise.style.color = "red";
								isNoticePraise = true;
								return false;
							}
						}
						noticePraise.style.color = "darkblue";
						isNoticePraise = false;
					},
				});
		}
	});
})

//获取点赞信息
function noticePraise(noticeInfoId){
	var url = topUrl + 'noticePraise/noticePraise'
	var noticePraise =document.getElementById("noticePraise");
	var userId = plus.storage.getItem("sysUsersId");
	mui.ajax(url, {
		data: {
			token:token,
			noticeInfoId: noticeInfoId,
		},
		dataType: 'json', //服务器返回json格式数据
		async: true,
		success: function(data) {
			for(var i = 0; i < data.length; i++) {
				if(userId == data[i].userId) {
					noticePraise.style.color="red";
					isNoticePraise=true;
					return false;
				}
			}
			noticePraise.style.color="darkblue";
			isNoticePraise=false;
		},
	});
}

var isNoticePraise=false;

var saveFun = document.getElementById("saveFun");
saveFun.addEventListener("tap", function() {
	var noticeInfoId = plus.webview.currentWebview().id;
	var content = document.getElementById("content").value;
	var url = topUrl + 'noticeComment/create';
	mui.ajax(url, {
		data: {
			token:token,
				noticeInfoId: noticeInfoId,
				content:content,
			},
			type: 'post', //HTTP请求类型
		success: function(data) {
			if(data.success){
				alert("回复成功");
				getNoticeComment();
			}else{
				alert(data.errorMsg);
			}
		},
	});
});

function getNoticeComment(){
	var url = topUrl + 'noticeComment/byNoticeInfoId';
	var noticeInfoId = plus.webview.currentWebview().id;
	var token = plus.storage.getItem("token");
	console.log('...getNoticeComment...');
	mui.ajax(url, {
		data: {
			token:token,
			noticeInfoId: noticeInfoId,
		},
		success: function(data) {
			console.log('data',data);
			htmlNoticeComment(data);
			////查询我的点赞内容
			myFavorNoticeComment();
		},
	});
}

function htmlNoticeComment(data) {
	var contentList = document.getElementById('contentList');
	var dataHtml='';
	for(var i = 0; i < data.length; i++) {
		if(data[i].pid == -1) {
			var html = '<div style="border-bottom:1px dashed #e5e5e5;margin-bottom:10px" class="noticeComment" id="'+data[i].id+'"><p style="margin-left: 5px;color:"black">'+data[i].userName+ '</p>';
			html += '<p style="margin-left: 5px;">'+data[i].content+'</p>';
			html += '<p style="margin-left: 5px;"><div><span>'+data[i].commentTime+'</span>';
			html += '<span id="'+data[i].id+'" class="noticeUpCell">点赞'+data[i].upQuantity+'</span>';
			html += '<span id="'+data[i].id+'" class="replyCell" style="float: right;color: #06c;">回复/</span>';
			html += '<div id="'+data[i].id+'" class="replyClass"><textarea id="'+data[i].id+'" class="replyTextarea"></textarea>';
			html += '<div style="border: 1px solid #c4c4c4;">';
			html += '<button id="'+data[i].id+'" type="button"  style="float: right;" class="mui-btn mui-btn-danger replyChildren">发表评论</button>';
			html += '<div style="clear: both;"></div></div></div></div></div>';
			dataHtml=dataHtml+html;
		}
		contentList.innerHTML=dataHtml;
	}
	//查看子回复
	getNoticeCommentChild(data);
}

//查看子回复
function getNoticeCommentChild(data){
	for(var i=0;i<data.length;i++){
		$('.noticeComment').each(function() {
			var id = $(this).attr('id');
			if(id == data[i].pid) {
				var self = $(this);
				var html='<div style="margin-left: 1.3rem;color:"black""><p>'+data[i].userName+'</p>';
					html+='<p style="margin-left: 5px;">'+data[i].content+'</p>';
					html+='<p>'+data[i].commentTime+'</p></div>';
				self.append(html);
			}
		})
	}
}

//点击通知公告详情页面
mui("#contentList").on('tap', '.noticeUpCell', function() {
	var commentId = this.getAttribute("id");
	var noticeClassName;
	$(".noticeUpCell").each(function() {
		if(commentId == $(this).attr("id")) {
			noticeClassName = $(this).attr('class');
		}
	});
	if("noticeUpCell active" == noticeClassName) {
		var url = topUrl + 'noticeUp/unFavor';
			mui.ajax(url, {
				data: {
					token:token,
					commentId: commentId,
				},
				type:'post',
				success: function(data) {
					if(data.success) {
						alert("取消点赞成功");
						getNoticeComment();
					}
				},
			});
	}else{
		var url = topUrl + 'noticeUp/favor';
		mui.ajax(url, {
			data: {
				token:token,
				commentId: commentId,
			},
			type: 'post',
			success: function(data) {
				if(data.success) {
					alert("点赞成功");
					getNoticeComment();
				}
			},
		});
	}
})

////查询我的点赞内容
function myFavorNoticeComment(){
	var noticeInfoId = plus.webview.currentWebview().id;
	var url = topUrl + 'noticeUp/myFavorNoticeComment'
	mui.ajax(url, {
		data: {
			token:token,
			noticeInfoId: noticeInfoId,
		},
		success: function(data) {
			for(var i = 0; i < data.length; i++) {
				$(".noticeUpCell").each(function() {
					var id = $(this).attr("id");
					if(id == data[i].commentId) {
                        $(this).addClass("active");
					}
				});
			}
		},
	});
};
	
//子回复
mui("#contentList").on('tap', '.replyCell', function() {
	var commentId = this.getAttribute("id");
	var noticeInfoId = plus.webview.currentWebview().id;
	$(".replyClass").each(function() {
		if(commentId == $(this).attr("id")) {
			$(this).toggle();
		}
	});
})

//子回复回复
mui("#contentList").on('tap', '.replyChildren', function() {
	var pid = this.getAttribute("id");
	var noticeInfoId = plus.webview.currentWebview().id;
	var content;
	$(".replyTextarea").each(function() {
		if(pid == $(this).attr("id")) {
			content=$(this).val()
		}
	});
	var url = topUrl + 'noticeComment/create'
	mui.ajax(url, {
		data: {
			token:token,
			pid: pid,
			noticeInfoId:noticeInfoId,
			content:content
		},
		type:'post',
		success: function(data) {
			if(data.success){
				alert('回复成功');
				getNoticeComment();
			}else{
				alert(data.errorMsg);
			}
		},
	});
})


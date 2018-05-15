
$(function() {

    $('#loginWindow').window('open');
    var topHeight=$('#loginWindow').window('options').top;
   // alert(topHeight);
    if(topHeight>150){
		topHeight -=100;
    }
    $('#loginWindow').window("move",{
			left:$('#loginWindow').window('options').left,
			top:topHeight
	});
	refreshCode();

    if ($.cookie("rmbUser") == "true") {  
        $("#rmbUser").attr("checked", "checked");  
       // $("input[name='userName']").val($.cookie("userName"));  
       // $("input[name='password']").val($.cookie("password"));  
       $("#userName").textbox("setValue",$.cookie("userName"));
       $("#password").passwordbox("setValue",$.cookie("password"));
    }  

    //回车事件
	$('#checkCode').textbox('textbox').keydown(function (e) {
        if(e.keyCode == 13) {
           login();
        }
    });	
});


function refreshCode(img){
	var now = new Date().getTime();
	$("input[name='checkId']").val(now);
	$("#checkCodeImg").attr("src","/home/checkCode?checkId="+now);
}
function login(){
	var userName = $("#userName").textbox("getValue"); //$("#login_form").find("input[name='userName']").val();
    var password = $("#password").passwordbox("getValue"); //$("#login_form").find("input[name='password']").val();
    var checkCode = $("#login_form").find("input[name='checkCode']").val();
    if(userName.length == 0){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("请输入用户名");
    	return;
    }
    if(userName.length > 30){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("用户名长度超过限制");
    	return;
    }  

    if(password.length == 0){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("请输入密码");
    	return;
    }
    if(password.length > 30){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("密码长度超过限制");
    	return;
    }  

    if(checkCode.length != 6){
    	$("#errMsgBar").show();
    	$("#errMsgBar").html("请输入6位长度验证码");
    	return;
    }    
    var param = {
        "userName":userName,
        "password":password,
		"checkCode":checkCode,
		"checkId":$("input[name='checkId']").val()
    };

	remenberMe();
    ///alert(JSON.stringify(param));

    $("#loginBtn").linkbutton('disable');
    $.ajax({
       // headers: {
        //    app: 'PLATFORM',
        //    platform: 'PC',
        //    imei: ''
       // },
        type:"POST",
        url:"/user/login",
        contentType:"application/json;charset=utf-8",
        data:JSON.stringify(param),
        dataType:'json',
        success:function(ret){
        	if(ret.code == 0){ //成功
        	   $.cookie('token',ret.data,{expires:30, path:'/'})
               window.location.href = "/home/index";
			}else{
              //alert(ret.msg);
                $("#errMsgBar").show();
    	  		$("#errMsgBar").html(ret.msg);
			}
        },
        error:function(ret) {
            alert(JSON.stringify(ret));
        },
        complete:function () {
            $("#loginBtn").linkbutton('enable');
        }
    });

    function remenberMe(){
     if ($("#rmbUser").attr("checked") == "checked") {  
			var userName = $("#userName").textbox("getValue");
    		var password = $("#password").passwordbox("getValue");
            $.cookie("rmbUser", "true", {expires:7, path:'/'}); // 存储一个带7天期限的 cookie  
            $.cookie("userName", userName, {expires:7, path:'/'}); 
            $.cookie("password", password, {expires:7, path:'/'}); 
        } else {  
            $.cookie("rmbUser", "false", {expires:-1, path:'/'});
            $.cookie("userName", "", {expires:-1, path:'/'});
            $.cookie("password", "", {expires:-1, path:'/'});  
        } 
    }
}
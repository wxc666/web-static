
$(function() {
	$("#register_btn").click(function() {
		$("#register_form").css("display", "block");
		$("#login_form").css("display", "none");
	});
	$("#back_btn").click(function() {
		$("#register_form").css("display", "none");
		$("#login_form").css("display", "block");
	});

	$("#login_form").validate({
		rules: {
			username: "required",
			password: {
				required: true,
				minlength: 5
			},
		},
		messages: {
			username: "请输入姓名",
			password: {
				required: "请输入密码",
				minlength: $.validator.format("密码不能小于{0}个字符")
			},
		}
		//errorPlacement: function(error, element) {
			//element.attr("data-content","密码不能小于");
        //error.appendTo( element.parent("td").next("td") );
        //}
		,
		submitHandler: function() {
            login();
		
		}
	});
	$("#register_form").validate({
		rules: {
			username: "required",
			password: {
				required: true,
				minlength: 5
			},
			rpassword: {
				equalTo: "#register_password"
			},
			email: {
				required: true,
				email: true
			}
		},
		messages: {
			username: "请输入姓名",
			password: {
				required: "请输入密码",
				minlength: $.validator.format("密码不能小于{0}个字符")
			},
			rpassword: {
				required: "请再次输入密码",
				equalTo: "两次密码不一样"
			},
			email: {
				required: "请输入邮箱",
				email: "请输入有效邮箱"
			}
		},
		submitHandler: function() {
				alert("submitted!");
		
		}
	});

});



function login(){
	var username = $("#login_form").find("input[name='username']").val();
    var password = $("#login_form").find("input[name='password']").val();
    var param = {
        "username":username,
        "password":password
    };
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
              alert(ret.msg);
			}
        },
        error:function(ret) {
            alert(JSON.stringify(ret));
        }
    });
}
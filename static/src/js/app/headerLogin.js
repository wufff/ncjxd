
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2019-02-22 15:01:00
 * @version $Id$
 */
 
define(["layui","api","boot-dropdown"],function(layui,api){
     var $ = jQuery = layui.jquery; 
     var layer = layui.layer;
     var dialog;
     var my = { 
         login:login
     }
  //登录tab切换
   $(".white_black .h4").click(function() {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        if($(this).attr("id") == "manageLogin"){
          $(".manageLogin").show();
          $(".teacherLogin").hide();
        }else{
          $(".manageLogin").hide();
          $(".teacherLogin").show();
        }
  });
    
 //登录样式  
  $("#user_name").focus(function(){
    $("#errInfo").html("");
  })
  $("#user_pwd").focus(function(){
     $("#errInfo").html("");
  })

//登录按钮
  $("#loginBt").click(function(){
     var user_name = $("#user_name").val();
     var password = $("#user_pwd").val();
     var autologin = $("#autologin").is(':checked')? 1 : 0
    if(user_name && password) {
    api.ajaxPost("/Login/loginPost",{
        user_name:user_name,
        user_pwd:password,
        autologin:autologin
     },function(res){
        if(res.type == 'success'){
          window.location.reload();
        }else{
          $("#errInfo").html(res.message);
        }
     })
    }
  });

//拦截a
$("a").click(function(){
   if($(this).hasClass('noLogin')){
      return true;
   }else{
      var length = $("#header_loginBt").length; 
      //console.log(length);
       if (length > 0) {
          login();
          return false;
       }
   }
})

//登录弹框显示
$("#header_loginBt").click(function(){
	  login();
})


 
 function login(){
       dialog = layer.open({
            type: 1,
            title:"<span style='color:#1b6bb1;'>欢迎登录</span>",
            content: $('#login_dialog'),
            area:["365px","416px"]
      });
    }

  return my;
})

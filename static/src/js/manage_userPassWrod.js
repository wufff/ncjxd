require(["layui", "api","path"], function(layui,api,path) {
    var layer = layui.layer;
    var upload = layui.upload;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    //修改密码:/AccountManage/ajaxUpdatePasswd  post  old_user_pwd  new_user_pwd   comfirm_user_pwd 
    
  
   $("#sureBt").click(function(){
        var old_user_pwd = $("#old_user_pwd").val();
        var new_user_pwd = $("#new_user_pwd").val();
        var comfirm_user_pwd = $("#comfirm_user_pwd").val();
        var postData = {
           old_user_pwd:old_user_pwd,
           new_user_pwd:new_user_pwd,
           comfirm_user_pwd:comfirm_user_pwd
        }
       
     if(old_user_pwd && new_user_pwd && comfirm_user_pwd){
        var url = "/AccountManage/ajaxUpdatePasswd";
        var postData = {
           old_user_pwd:old_user_pwd,
           new_user_pwd:new_user_pwd,
           comfirm_user_pwd:comfirm_user_pwd
        }
        api.ajaxPost(url,postData,function(res){
            if(res.type == "error"){
               layer.msg(res.message,{time:800})
            }else{
                 layer.msg("修改成功",{time:800})
                 $("#old_user_pwd").val("");
                 $("#new_user_pwd").val("");
                 $("#comfirm_user_pwd").val("");
            }
        }) 
      }
      return false;
    })
   
  
   
})




require(["layui", "path","api","boot-dropdown"], function(layui, path,api) {
    var layer = layui.layer;
    var upload = layui.upload;
    var form = layui.form;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    var uploadInst = upload.render({
    elem: '#upImg'
    ,url: '/AccountManage/updateAvatar'
    ,method:'post'
    ,before: function(obj){
      //预读本地文件示例，不支持ie8
      // obj.preview(function(index, file, result){
      //   $('#demo1').attr('src', result); //图片链接（base64）
      // });
    }
    ,done: function(res){
       if(res.type == "success"){
          $("#layui-upload-img").attr("src",res.message);
          $("#imgPath").val(res.message);
       }else{
          layer.msg("上失败请检查网络",{icon:5})
       }
    




      // if(res.code > 0){
      //   return layer.msg('上传失败');

      // }
      // if(res.code == 0){
          
      // }
      //上传成功
    }
    ,error: function(){
      //演示失败状态，并实现重传
      var demoText = $('#demoText');
      demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload" style="background-color: #1E9FFF;color:#fff;">重试</a>');
      demoText.find('.demo-reload').on('click', function(){
        uploadInst.upload();
      });
    }
  });





    $("#sureBt").click(function(){

      // 上传图片:/AccountManage/updateAvatar post     
      //更新基本信息:/AccountManage/ajaxUpdateBaseInfo  post   user_realname  user_mobile  user_email  user_idcard  user_avatar
      var user_realname = $("input[name=user_realname]").val();
      var user_mobile = $("input[name=user_mobile]").val();
      var user_email = $("input[name=user_email]").val();
      var user_idcard = $("input[name=user_idcard]").val();
      var user_avatar = $("#imgPath").val();
      if (!user_realname && !user_mobile && !user_email && !user_idcard && !user_avatar) {
           return false;
      }
      var postData = {
          user_realname:user_realname,
          user_mobile:user_mobile,
          user_email:user_email,
          user_idcard:user_idcard,
          user_avatar:user_avatar
      }
      // console.log(postData);
      if(user_email){
         if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(user_email)){
            layer.msg("邮箱格式不正确！",{icon:5});
            return false;
       }
      }

      var url = "/AccountManage/ajaxUpdateBaseInfo";

      api.ajaxPost(url,postData,function(res){
           ;
           if(res.type == "success"){
              layer.msg("修改成功",{time:500});
              setTimeout(function(){
                 window.location.reload();
              },300)
           }else{
              layer.msg(res.message,{time:500});
           }
      })
      return false;
    })
})




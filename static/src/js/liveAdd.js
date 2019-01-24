require(["jquery", "layui", "path", "upLoad", "tools","boot-dropdown"], function($, layui, path, upLoad, tools) {
  var layer = layui.layer;
  var upload = layui.upload;
  var form = layui.form;
  var laydate = layui.laydate;
  var upLoad = upLoad.img('upImgBt','previewImage');
 
  //返回提交
  laydate.render({
    elem: '#start_time'
    ,type: 'datetime'
  });
   laydate.render({
    elem: '#end_time'
    ,type: 'datetime'
  });

 

  //删除待上传的pm4

  $("#goBack").click(function(){

      window.history.go(-1);
      return false;
  })



  //提交

  form.on('submit(form)', function(data) {
      var getData = data.field;
      if (getData.cover_img == ""){
         layer.msg("未上传封面",{icon:5});
         return false;;
      }
      var url = path.api + "/api/addManageActivity";
      console.log(url)
      api.ajaxGet(url,getData,function(res){
         if(res.type == "success"){
            layer.msg("操作成功",{time:500});
            setTimeout(function(){
               window.history.go(-1);
            },400)
         }else{
            layer.msg(res.message,{time:500});
         }
         return false;
      })
      return false;
  });



 





})

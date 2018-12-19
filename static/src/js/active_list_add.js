require(["jquery","layui","path","upLoad"], function($,layui, path,upLoad) {
    var layer = layui.layer;
    var upload = layui.upload;
    var form = layui.form;
     upLoad.img('upImg','previewImage');
     upLoad.videos('upVideos');
   //返回上页面
    $("#goback").click(function(){
       window.history.go(-1);
    })

   //返回提交
   $("#publishBt").click(function(){
       $("#submit").click();
   })

  //删除待上传的pm4


 //提交
  form.on('submit(form)', function(data){
       var fieldData = data.field;
       console.log(fieldData);
       return false;
  });



   

  $("#mp4list").on("click",".del",function(){
     $(this).parent().remove();
  })


//上传视频




//上传文档
   







  

    
})
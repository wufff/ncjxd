require(["jquery","layui","path","upLoad"], function($,layui, path,upLoad) {
    var layer = layui.layer;
    var upload = layui.upload;
    var form = layui.form;
    var laydate = layui.laydate;
    var layer = layui.layer;
    var off = true;
    laydate.render({ 
        elem: '#dataInput' //或 elem: document.getElementById('test')、elem: lay('#test') 等
      });
     upLoad.img('upImg','previewImage');
     upLoad.videos('upVideos',4);
     var uploader_doc = upLoad.doc('upfiles',4);
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
       var getData = data.field;  
       var mp4_paths = [];
       var mp4_names = [];
       var doc_paths = [];
       var doc_names = [];
       if($(".vidoePath").length == 0 ){
          layer.msg("未上传活动视频",{icon:5});
          return false;
       }

       if(!$("#img_file_path").val()){
          layer.msg("未上活动封面图片",{icon:5});
          return false;
       } 
     
        $(".vidoePath").each(function(index, el) {
           if($(el).val() == ""){
                layer.alert("还有未上传完的视频，请等待上传完毕，或者删除未上传完的视频再提交",{icon:3});
                off = false;
                return false;
           }else{
              mp4_paths.push($(el).val());
              off = true;
           }
        });
        $(".mp4Name").each(function(index, el) {
            mp4_names.push($(el).text());
        });
        
        if($(".doc_item").length != 0)  {
             $(".fileName").each(function(index, el) {
             doc_names.push($(el).text());


             $(".docPath").each(function(index, el) {
                  doc_paths.push($(el).val())
             });
             getData.doc_paths = doc_paths.join(",");
             getData.doc_names = doc_names.join(",");
        });
  
        } 
        getData.mp4_paths = mp4_paths.join(",");
        getData.mp4_names = mp4_names.join(",");
        if(off == true){
          layer.load(3);
        $.get("/api/addManageActivity",getData,function(res){
          if(res.type == "success") {
             window.history.go(-1);
          }else{
             alert("err");
          }
        }) 
        }
        return false;
  });

   
   

  $("#mp4list").on("click",".del",function(){
     $(this).parent().remove();
  })

  $("#doclist").on("click",".del",function(){
     $(this).parent().remove();
  })



//上传视频




//上传文档
   







  

    
})
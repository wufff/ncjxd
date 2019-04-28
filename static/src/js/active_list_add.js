require(["layui","path","ZeroClipboard","upLoad","tools","api","boot-dropdown"], function(layui,path,ZeroClipboard,upLoad,tools,api) {
    window['ZeroClipboard'] = ZeroClipboard;
    var layer = layui.layer;
    var form = layui.form;
    var $ = jQuery = layui.jquery; 
    var laydate = layui.laydate;
    var layer = layui.layer;
    var loading;
    var off = true;
    var type = 0;
    var del_ids = [];
    var ue = UE.getEditor('editor');
    var activity_id = tools.request("id");

    if (activity_id){
         type = 1; 
         $("#publishBt").html("确认修改");
         var url = path.api + "/api/getManageActivityInfo"
         api.ajaxGet(url,{activity_id:activity_id},function(res){
              if(res.type == "success"){
                console.log(res);
                 var list = res.data.data;
                 var timeValue = list.ai_start_time.slice(0,10);
                  //console.log(res);
                 var dos =  list.list[0]
                 var medias =  list.list[1]
                 var medias_html = "";
                 var dos_html = ""
                 $("input[name=title]").val(list.ai_title);
                 $("input[name=name]").val(list.ai_teacher_name);
                 $("#previewImage").attr("src",list.ai_cover_url);
                    laydate.render({
                       elem: '#dataInput',
                       value:timeValue
                    });  

                       setTimeout(function(){   
                          ue.setContent(list.ai_describe);
                    },200)  
                 for(var i=0;i<medias.length;i++){
                  
                   medias_html +=       '<div class="vidoe_item">'
                   medias_html +=       '<span>'+ medias[i].ar_file_name+'</span> <b>100%</b>' 
                   medias_html +=       '<a href="javascript:void(0)" class="isdel" data-id="'+medias[i].ar_encrypt_id +'">删除</a>'
                   medias_html +=       '</div>'
                 
                 }
                for(var i=0;i<dos.length;i++){
                 
                   dos_html +=       '<div class="doc_item">'
                   dos_html +=       '<span>'+ dos[i].ar_file_name+'</span> <b>100%</b>' 
                   dos_html +=       '<a href="javascript:void(0)" class="isdel" data-id="'+dos[i].ar_encrypt_id +'">删除</a>'
                   dos_html +=       '</div>'
                  
                 }
                 // //console.log(dos);
                $("#mp4list").html(medias_html);
                $("#doclist").html(dos_html);
              }
         })
    }else{
       type = 0;
       $("#publishBt").html("确认发布");
       laydate.render({ 
        elem: '#dataInput' 
      });
    }


    laydate.render({ 
        elem: '#dataInput' //或 elem: document.getElementById('test')、elem: lay('#test') 等
      });
     upLoad.img('upImg','previewImage');
     var uploader_mp4 =  upLoad.videos('upVideos',4);
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
  $("body").on("click",".isdel",function(){
      var id = $(this).attr("data-id");
       del_ids.push(id);
       $(this).parent().remove();
  })




  
 //提交
  form.on('submit(form)', function(data){
      if(type == 0){
       var getData = data.field;  
       var mp4_paths = [];
       var mp4_names = [];
       var doc_paths = [];
       var doc_names = [];
       var html = ue.getContent();
       getData.describe = html;
       if($(".vidoePath").length == 0 ){
          layer.msg("未上传活动视频！",{icon:5});
          return false;
       }

       if(!$("#img_file_path").val()){
          layer.msg("未上活动封面图片！",{icon:5});
          return false;
       } 
     
       if(!getData.describe){
          layer.msg("请填写活动简介！",{icon:5});
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
           });
            $(".docPath").each(function(index, el) {
                  doc_paths.push($(el).val())
             });
             getData.doc_paths = doc_paths.join(",");
             getData.doc_names = doc_names.join(",");
        } 
        getData.mp4_paths = mp4_paths.join(",");
        getData.mp4_names = mp4_names.join(",");
        if(off == true){
          loading = layer.load(3);
          api.ajaxGet("/api/addManageActivity",getData,function(res){
            if(res.type == "success") {
              layer.close(loading);
              layer.msg("发布成功");
              setTimeout(function(){
                 window.history.go(-1);
              },500) 
            }
          }) 
         }
      };

      if(type == 1) {
         var getData = data.field;  
         getData.teacher_name =  getData.name;
         getData.start_time = getData.time;
         getData.activity_id = activity_id;
         var mp4_paths = [];
         var mp4_names = [];
         var doc_paths = [];
         var doc_names = [];
         if($(".vidoe_item").length == 0 ){
            layer.msg("未上传活动视频",{icon:5});
            return false;
         }

         if($(".vidoePath").length > 0){
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


            getData.mp4_paths = mp4_paths.join(",");
            getData.mp4_names = mp4_names.join(",");
         }
        
     


        if($(".doc_item").length != 0)  {
             $(".fileName").each(function(index, el) {
             doc_names.push($(el).text());
           });
            $(".docPath").each(function(index, el) {
                  doc_paths.push($(el).val())
             });
             getData.doc_paths = doc_paths.join(",");
             getData.doc_names = doc_names.join(",");
        } 

       
        getData.del_ids = del_ids.join(",");
        //console.log(getData);
        if(off == true){
          loading = layer.load(3);
          var url = path.api + "/api/modifyManageActivityData";
        api.ajaxGet(url,getData,function(res){
          //console.log(res);
          if(res.type == "success") {
              layer.close(loading);
              layer.msg("修改成功");
              setTimeout(function(){
                 window.history.go(-1);
              },500) 
          }else{
             alert("err");
          }
        }) 
      }

  }



        return false;
  });

   
   

  $("#mp4list").on("click",".del",function(){
     var id = $(this).parent(".vidoe_item").attr("id");
      var file  =  uploader_mp4.getFile(id);
      uploader_mp4.removeFile(file)
      $(this).parent().remove();
  })

  $("#doclist").on("click",".del",function(){
     $(this).parent().remove();
  })



//上传视频




//上传文档
   







  

    
})
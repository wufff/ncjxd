
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-12-31 15:36:02
 * @version $Id$
 */
 
require(["jquery","layui","path","tools"],function($,layui,path,tools){
   var form = layui.form;
   $(".areaTab").click(function(){
   	  $(this).siblings().removeClass('active');
   	  $(this).addClass('active');
   	  $(".area").show();
   	  $(".brane").hide();
   })
    $(".braneTab").click(function(){
   	  $(this).siblings().removeClass('active');
   	  $(this).addClass('active');
   	  $(".area").hide();
   	  $(".brane").show();
   })





$.get("/api/getAnalyticsAreaList",{start_time:"",end_time:""},function(res){
    console.log(res);
})





form.on('select(city)', function(data){
     console.log(data.value)
     var getData = {
      area_id:data.value,
      type:3
     }
     var url = "/api/getAreaList";
     if(data.value){
      $.get(url,getData,function(res){
         // console.log(res);
        if(res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">请选择</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
          }
         $("select[name=area]").html(html);
         $("select[name=area]").val("");
          form.render('select');
       }
     })
     }else{
       $("select[name=area]").html('<option value="">请选择</option>');
          form.render('select');
     }
});  

form.on('select(area)', function(data){
    intInfo();
     $("select[name=school]").val("");
     var getData = {
        area_id:data.value
     }
     var url = "/api/getSchoolListByAreaId"
     if(data.value){
      $.get(url,getData,function(res){
        // console.log(res);
        if(res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">请选择</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].school_encrypt_id +'">'+ list[i].school_name+'</option>'
          }
         $("select[name=school]").html(html);
         $("select[name=school]").val("");
          form.render('select');
       }else{
         $("select[name=school]").html('<option value="">此地区无数据</option>');
          form.render('select');
       }
     })
     }else{
       $("select[name=school]").html('<option value="">请先选择地区</option>');
          form.render('select');
     }
});


})

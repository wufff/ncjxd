
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-14 15:55:46
 * @version $Id$
 */
 
require(["jquery","layui"],function($,layui){
   var layer = layui.layer;
   var form =  layui.form;
   alert(123);
   form.on('select(city)', function(data){
     $("select[name=school]").html('<option value="">请先选地区</option>');
     $("select[name=school]").val("");
     var getData = {
     	area_id:data.value,
     	type:3
     }
     var url = "/api/getAreaList"
     if(data.value){
     	$.get(url,getData,function(res){
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
     // console.log(data.value);
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





 form.on('select(school)', function(data){
     // console.log(data.value);
     var getData = {
      school_id:2790183
     }
     var url = "/api/getRoomListBySchoolId"
     if(data.value){
      $.get(url,getData,function(res){
        console.log(res);
        if(res.type == "success") {
            console.log(res.data.data.list);
            var list = res.data.data.list;
            var html = "";
            for(var i =0;i<list.length;i++){
              if(i == 0){
                 html += '<span class="active" data-id="'+list[i].sr_school_encrypt_id+'">'+list[i].sr_name+'</span>'
              }else {
                 html += '<span  data-id="'+ list[i].sr_school_encrypt_id +'">'+list[i].sr_name+'</span>'
              }
            }
             $(".classRoom").html(html);
       }else{
           var html = '<label style="font-weight: normal">无教室</label>';           
           $(".classRoom").html(html);
       }
     })
     }
 
});  







})

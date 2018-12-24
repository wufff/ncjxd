
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-14 15:55:46
 * @version $Id$
 */
 
require(["jquery","layui","path","num"],function($,layui,path,num){
   var layer = layui.layer;
   var form =  layui.form;
   var weekOff = false;
   form.on('select(city)', function(data){
     $("select[name=school]").html('<option value="">请先选地区</option>');
     $("select[name=school]").val("");
     intInfo();
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



 var WeeKurl1 =  path.api+"/api/getSchoolCourseTimeNode";
 var getData1 = {
      school_id:2790183,
      date:'2018-12-17'
     }








 form.on('select(school)', function(data){
     // console.log(data.value);
     var getData = {
      school_id:2790183,
      date:'2018-12-17'
     }
     var url = "/api/getRoomListBySchoolId";
     var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";
     var titlesUrl = path.api+"/api/getWeekHoliday";
     if(data.value){
     //获取教室
      $.get(url,getData,function(res){
        if(res.type == "success") {
            var list = res.data.data.list;
            // console.log(list);
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

     //获取当前周
     $.get(WeeKurl,getData,function(res){
     	 if(res.type == "success") {
     	 	 var data = res.data.data;
         console.log(res);
     	 	 $("#schoolTerm").html(data.year);
     	 	 $("#week_time").html(data.week_time);
     	 	 $("#week").text(data.term_week);
     	 }
     })
  
    //获取当前日期
   $.get(titlesUrl,getData,function(res){
        // console.log(res);
       if(res.type == "success") {
         var data = res.data.data;
         var html = "<th>午别</th><th>节次</th>";
         for(var i = 0;i<data.length;i++){
               var str = i+1
               var weeks =  num.Hanzi(str) == '七' ? '日' : num.Hanzi(str) 
               html += '<th position="0,'+(i+1)+'">星期'+weeks+'<br/>'+data[i].date_time+'</th>'
         }

         $("#theadtr").html(html);
       }
     })

     }

   $("#tbody").html("");
 $.get(WeeKurl,getData,function(res){
       console.log(res);
       if(res.type == "success") {
        var data = res.data.data;
        var times = res.data.data.course_time_node;
         var down = data.noon_count.down;
         var up = data.noon_count.up;
         // console.log(up);
         // console.log(down);
         // console.log(times);
         if(times.length == 0){
          $("#tbody").html('<tr><td colspan="9">此学校暂无课表信息~！</td></td>');
          $("#table_header").hide();
          $("#table_header_none").show();
           return;
         }
         $("#schoolTerm").html(data.year);
         $("#week_time").html(data.week_time);
         $("#week").text(data.term_week);
          $("#table_header").show();
          $("#table_header_none").hide();
         var uphtml;
         var downHtml;
         for(var i = 0;i<up;i++){
             if(i == 0){
                uphtml += '<td rowspan="'+ up+'" class="Bold">上午</td>';     
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }
              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         }
        
        for(var i = up;i<down+up;i++){
             if(i == up){
                uphtml += '<td rowspan="'+ down+'" class="Bold">下午</td>';     
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }
              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         }
        
       }
     })


});  




	 function intInfo(){
	 	$(".classRoom").html(" ");
	 	$("#schoolTerm").html(" ");
     	$("#week_time").html(" ");
     	$("#week").text(" ");
	 }





})

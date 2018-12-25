
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-14 15:55:46
 * @version $Id$
 */
 
require(["jquery","layui","path","num","tools"],function($,layui,path,num,tools){
   var layer = layui.layer;
   var form =  layui.form;
   var weekOff = false;
   var school_id = "";
   var room_id;
   var term_id;
   var week;
   var now =(new Date()).toLocaleDateString();
   var weekData = now.replace(/\//g,'-');
   var totWeek;
   var type = 0;
 
form.on('select(city)', function(data){
     $("select[name=school]").html('<option value="">请先选区县</option>');
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

form.on('select(school)', function(data){
       if(data.value == school_id){
         return;
       }
       school_id = data.value;
      renderClassRoom (school_id,weekData);
      studyTime (school_id,weekData);
      formHeadtime(school_id,weekData);
      renderClassTd(school_id,weekData);
  
});  



   //切换周
$("body").on("click",".Add",function(){
        
})
  
$("body").on("click",".sub",function(){
      weekData = tools.prevWeek(weekData);
      studyTime (school_id,weekData);
      formHeadtime(school_id,weekData);
      renderClassTd(school_id,weekData);
})







//表头日期
 function formHeadtime(school_id,weekData){
    var titlesUrl = path.api+"/api/getWeekHoliday";
    var getData = {
          school_id:school_id,
          date:weekData
        }
    $.get(titlesUrl,getData,function(res){
       // console.log(res);
       if(res.type == "success") {
         var data = res.data.data;
         if(data.length > 0) {
            var html = "<th>午别</th><th>节次</th>";
             for(var i = 0;i<data.length;i++){
                   var str = i+1
                   var weeks =  num.Hanzi(str) == '七' ? '日' : num.Hanzi(str) 
                   html += '<th position="0,'+(i+1)+'">星期'+weeks+'<br/>'+data[i].date_time+'</th>'
             }
             $("#theadtr").html(html);
         }
       }
     })
 }




//渲染教室
   function renderClassRoom (school_id,weekData){
      var getData = {
          school_id:school_id,
          date:weekData
        }
       var url = "/api/getRoomListBySchoolId";
      $.get(url,getData,function(res){
         // console.log(res);
        if(res.type == "success") {
            var list = res.data.data.list;
            // console.log(list);
            var html = "";
            for(var i =0;i<list.length;i++){
              if(i == 0){
                 html += '<span class="active" data-id="'+list[i].sr_school_encrypt_id+'">'+list[i].sr_name+'</span>'
                 room_id = list[i].sr_school_encrypt_id;
              }else {
                 html += '<span  data-id="'+ list[i].sr_school_encrypt_id +'">'+list[i].sr_name+'</span>'
              }
            }
             $(".classRoom").html(html);
             $(".classType").html('<span class="active" data-tpye="0">发起</span><span data-tpye="1">接收</span>')
             type = 0;
       }else{
           var html = '<label style="font-weight: normal"></label>';  
           $("#tbody").html('<tr><td colspan="9" class="noneTd">暂无课表信息~！</td></td>'); 
           $(".classRoom").html(html);
           $(".classType").html(html);
       }
     })
   }


//渲染学期和周
   function studyTime (school_id,weekData) {
    var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";
    var getData = {
          school_id:school_id,
          date:weekData
     }  
    $.get(WeeKurl,getData,function(res){
       // console.log(res);
       if(res.type == "success") {
         var data = res.data.data;
         term_id = data.term_id;
         week = data.term_week;
         $("#schoolTerm").html(data.year);
         $("#week_time").html(data.week_time);
         $("#week").text(data.term_week);
       }
     })
   }





//渲染上午下午管关联渲染课程
function renderClassTd(school_id,weekData){
   var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";
    var getData = {
      school_id:school_id,
      date:weekData
     }
  $.get(WeeKurl,getData,function(res){
       // console.log(res);
       if(res.type == "success") {
         $("#tbody").html("");
         var data = res.data.data;
         var times = res.data.data.course_time_node;
         var down = data.noon_count.down;
         var up = data.noon_count.up;
         var uphtml;
         var downHtml;
         // console.log(up);
         // console.log(down);
         // console.log(times);
         if(times.length == 0){
          $("#tbody").html('<tr><td colspan="9" class="noneTd">此学校暂无课表信息~！</td></td>');
          $("#table_header").hide();
          $("#table_header_none").show();
           return;
         }
         $("#schoolTerm").html(data.year);
         $("#week_time").html(data.week_time);
         $("#week").text(data.term_week);
          $("#table_header").show();
          $("#table_header_none").hide();
         
         for(var i = 0;i<up;i++){
             if(i == 0){
                uphtml += '<td rowspan="'+ up+'" class="Bold">上午</td>';     
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =0; j<7 ;j++ ){
                 uphtml += '<td positon="'+(i)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i)+','+j+'"></td>'
               }
             }
              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         }
        
        for(var i = up;i<down+up;i++){
             if(i == up){
                uphtml += '<td rowspan="'+ down+'" class="Bold">下午</td>';     
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =0; j<7 ;j++ ){
                 uphtml += '<td positon="'+(i)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +'-'+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i)+','+j+'"></td>'
               }
             }
              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         }

         renderClass(school_id,room_id,term_id,type,week);
       }

     })
    
}








//渲染课程
    function renderClass  (school_id,room_id,term_id,type,week){
        var classUrl = path.api +"/api/getSchoolRoomCourcePlan";
        // var getClassDate = {
        //      school_id:2790183,
        //      room_id:1490493,
        //      term_id:1,
        //      week:23
        //   }
       var getClassDate = {
             school_id:school_id,
             room_id:room_id,
             term_id:term_id,
             week:week,
             type:type
          }
         $.get(classUrl,getClassDate,function(res){
              console.log(res);
              if(res.type == "success"){
                if ( res.data.length == 0 ){
                   return;
                }
                 var list =  res.data.data.list;
                 for(var i = 0;i<list.length;i++){
                    var tr = list[i][0];        
                    if(tr){
                      for(var k = 0;k< tr.length;k++){
                         if(JSON.stringify(tr[k]) != "{}"){
                         var grade = num.Hanzi(tr[k].cn_grade)
                         var html = tr[k].cn_subject + '</br>'
                             html += '( '+ tr[k].cn_sponsor_teacher_name +' )'
                             html +='<div class="info" data-id="'+ tr[k].cp_encrypt_id+'">'
                             html += '<div class="title">'
                             html +=      grade +'年级 '+ tr[k].cn_subject
                             html +=      '</div>'
                             html +=      '<h5>主讲教室</h5>'
                             html +=     '<p>'+ tr[k].cn_sponsor_school_name+'</p>'
                             html +=     '<p>'+ tr[k].cn_sponsor_room_name +'</p>'
                             html +=     '<p>'+ tr[k].cn_sponsor_teacher_name+'</p>'
                             html +=      '<h5>接收教室</h5>' 
                             html +=     '<p>'+ tr[k].cn_receive_school+'</p>'
                             html +=     '<p>'+ tr[k].cn_receive_teacher+'</p>'
                             html +=     '<p>'+ tr[k].cn_receive_room+'</p>'
                             html +=      '<h5>状态</h5>' 
                             html +=      '<p>'+ tr[k].cn_status+'</p>' 
                             html +=     '<i></i>'
                             html +=     '</div>'
                             $("td[positon='"+i+","+k+"']").html(html);
                             ui();
                         }
                       }
                    }
                   
                 }
              }
         })
    }













	 function intInfo(){
	 	 $(".classRoom").html(" ");
     $(".classType").html(" ");
	 	 $("#schoolTerm").html(" ");
     $("#week_time").html(" ");
     $("#week").text(" ");
     $("#tbody").html('<tr><td colspan="9" class="noneTd">请选择学校查询对应课表~！</td></td>'); 
	 }



  

  function ui(){
      $("td").hover(function() {
         var info = $(this).find(".info");
         if(info.length == 1) {
            $(this).css("background","#fff4e6")
            info.show();
         }
      }, function() {
        var info = $(this).find(".info");
         if(info.length == 1) {
            $(this).css("background","#fff")
            info.hide();
         }
      });

      // 周切换
   }



})

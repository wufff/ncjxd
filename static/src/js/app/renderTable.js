define(["jquery","num","path"],function($,num,path) {
	return {
	   formHeadtime:function (school_id,weekData){
	    var titlesUrl = path.api+"/api/getWeekHoliday";
	    var getData = {
	          school_id:school_id,
	          date:weekData
	        }
	    api.ajaxGet(titlesUrl,getData,function(res){
	       // console.log(res);
	       if(res.type == "success") {
	         var data = res.data.data;
	         // console.log(data);
	         holidays = [];
	         if(data.length > 0) {
	            var html = "<th>午别</th><th>节次</th>";
	             for(var i = 0;i<data.length;i++){
	                   var str = i+1
	                   var className = "";
	                   if(data[i].is_holiday) {
	                      holidays.push(str);
	                      className ="holiday";
	                   }
	                   var weeks =  num.Hanzi(str) == '七' ? '日' : num.Hanzi(str) 
	                   html += '<th class="'+ className +'" position="0,'+(i+1)+'">星期'+weeks+'<br/>'+data[i].date_time+'</th>'
	             }
	             $("#theadtr").html(html);
	             // console.log(holidays);
	         }
	       }
	     })
       },
       //渲染学期和周关联渲染表头 表头时间渲染 课程
	   studyTime: function (school_id,weekData) {
	    var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";
	    var getData = {
	          school_id:school_id,
	          date:weekData
	     }  
	    api.ajaxGet(WeeKurl,getData,function(res){
	       console.log(res);
	       if(res.type == "success") {
	         var data = res.data.data;
	         term_id = data.term_id;
	         week = data.term_week;
	         totWeek = data.total_week;
	         // console.log("studyTime"+week);
	         $("#schoolTerm").html(data.year);
	         $("#week_time").html(data.week_time);
	         $("#totalweek").html(data.total_week);
	         $("#week").text(data.term_week);
	         renderClassTd(school_id,weekData)
	       }
	     })
	   }
	}


 function renderClassTd(school_id,weekData){
   var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";
    var getData = {
      school_id:school_id,
      date:weekData
     }
  api.ajaxGet(WeeKurl,getData,function(res){
       console.log(res);
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
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +' - '+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +' - '+times[i].st_end_time +'</td>';
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
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +' - '+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ times[i].st_start_time +' - '+times[i].st_end_time +'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }
              $("#tbody").append('<tr>'+ uphtml +'</tr>');
              uphtml = "";
         }
          
        //渲染假期效果
          ui_holiday();  


        //添加课程
         renderClass(school_id,room_id,term_id,type,week);
       }
     })
}

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
         api.ajaxGet(classUrl,getClassDate,function(res){
              // console.log(res);
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
                         var html = tr[k].cn_subject_chs + '</br>'
                             html += '( '+ tr[k].cn_sponsor_teacher_name +' )'
                             html +='<div class="info" data-id="'+ tr[k].cp_encrypt_id+'">'
                             html += '<div class="title">'
                             html +=      grade +'年级 '+ tr[k].cn_subject_chs
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
                             $("td[positon='"+(i+1)+","+(k+1)+"']").html(html);
                             
                         }
                       }
                    }
                   
                 }
                  ui();
              }
             
         })
    }




})
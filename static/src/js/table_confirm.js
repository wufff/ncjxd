require(["layui","path","tools","num","api","cTable","checkTab","boot-dropdown"],function(layui,path,tools,num,api,cTable,checkTab){
       var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      var $ = jquery = layui.jquery;
      var loading;
      // 课表渲染
      cTable.school_id = tools.queryString("school_id");
      cTable.room_id = tools.queryString("room_id");
      cTable.term_id = tools.queryString("term_id");
      cTable.week = tools.queryString("week");
      cTable.weekData = tools.queryString("weekData");
      cTable.room_name = tools.request("room_name");
      cTable.school_name = tools.request("school_name");
      cTable.tpye_class = tools.request("type");
      cTable.usrsfor = 2
      cTable.panel_on = false;


      checkTab.school_id = tools.queryString("school_id");
      checkTab.usefor = 1;
      checkTab.panel_on = false;
      var city_id = tools.queryString("city_id");
      var area_id = tools.queryString("area_id");
          
 
      // console.log(school_name);
      $(".schoolName").html(cTable.school_name);
      $(".roomName").html(cTable.room_name);
      cTable.studyTime(cTable.school_id,cTable.weekData);
     
     

    //切换周
$("body").on("click",".Add",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == totWeek){
         return;
      }
      loading = layer.load(3);
      weekData = tools.nextWeek(weekData);
      studyTime (school_id,weekData);
})
  
$("body").on("click",".sub",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == 1){
         return;
      }
      loading = layer.load(3);
      weekData = tools.prevWeek(weekData);
      studyTime (school_id,weekData);
})

$("#goToEdite").click(function(){
    var url = "/course/edit?school_id=" + cTable.school_id + "&room_id=" + cTable.room_id + "&weekData=" + cTable.weekData + "&term_id=" + cTable.term_id + "&week=" + cTable.week + "&room_name=" + cTable.room_name + "&school_name=" + cTable.school_name + "&type=" + cTable.tpye_class
    url += "&city_id=" + city_id;
    url += "&area_id=" + area_id;
    window.location.href = url;
})



// //面板开启关闭
// $("#timeforopen").click(function(){
//     if($(".filter").hasClass('hidde')){
//          $(".filter").removeClass('hidde');
//          $("#timeforopen").text("收起 临时开课")
//          cTable.panel_on = true;
//          $(".addTitle").show();
//     }else{
//         $(".filter").addClass('hidde');
//         $("#timeforopen").text("添加 临时开课")
//         cTable.panel_on = false;   
//         $(".addTitle").hide();
//     }
// })














//表头日期
 function formHeadtime(school_id,weekData){
    var titlesUrl = path.api+"/api/getWeekHoliday";
    var getData = {
          school_id:school_id,
          date:weekData,
          v:new Date().getTime()
        }
    api.ajaxGet(titlesUrl,getData,function(res){
       // console.log(res);
       if(res.type == "success") {
         var data = res.data.data;
         // console.log(data);
         holidays = [];
         isTodayStr = "";
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
                   html += '<th class="'+ className +'" position="0,'+(i+1)+'">星期'+weeks+'<br/>'+ '<span class="date_time">'+data[i].date_time+'</span>'+'</th>'
             }
             $("#theadtr").html(html);
             // console.log(holidays);
         }
       }
     })
 }





//渲染学期和周
   function studyTime (school_id,weekData) {
    var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";

    var getData = {
          school_id:school_id,
          date:weekData,
          v:new Date().getTime()
     }  
    api.ajaxGet(WeeKurl,getData,function(res){

       if(res.type == "success") {
         var data = res.data.data;
         term_id = data.term_id;
         week = data.term_week;
         // console.log(data.term_week);
         totWeek = data.total_week;
         //渲染弹框里面内容
         var html = ""

         for(var i = week;i<totWeek+1;i++){
             var str = i
             html += '<span class="tag" data-id="'+ str +'">第'+ num.Hanzi(str) +'周</span>'
         }

         $("#tagWeekWrap").html(html);
         
         // console.log("studyTime"+week);
         $("#schoolTerm").html(data.year);
         $("#week_time").html(data.week_time);
         $("#totalweek").html(data.total_week);
         $("#week").text(data.term_week);
         formHeadtime(school_id,weekData);
         renderClassTd(school_id,weekData);
       }
     })
   }

  



//渲染上午下午管关联渲染课程
function renderClassTd(school_id,weekData){
   var WeeKurl =  path.api+"/api/getSchoolCourseTimeNode";
    var getData = {
      school_id:school_id,
      date:weekData,
      v:new Date().getTime()
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
         is_over = res.data.data.is_over;
         console.log(is_over);
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
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time  +'</span>'+'</td>';
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
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+'<span class="start_time">'+times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
                for(var j =1; j<8 ;j++ ){
                 uphtml += '<td positon="'+(i+1)+','+j+'"></td>'
               }
             }else{
                uphtml += '<td>'+ num.Hanzi(i+1)+'</br>'+ '<span class="start_time">'+ times[i].st_start_time +'-'+times[i].st_end_time +'</span>'+'</td>';
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


//渲染课程
    function renderClass  (school_id,room_id,term_id,type,week){
        var classUrl = path.api +"/api/getSchoolRoomCourcePlan";
       var getClassDate = {
             school_id:school_id,
             room_id:room_id,
             term_id:term_id,
             week:week,
             type:type,
             v:new Date().getTime()
          }
         api.ajaxGet(classUrl,getClassDate,function(res){
              // console.log(res);
              if(res.type == "success"){
                if ( res.data.length == 0 ){
                   layer.close(loading);
                   return;
                }
                 var list =  res.data.data.list;
                 for(var i = 0;i<list.length;i++){
                    var tr = list[i][0];        
                    if(tr){
                      for(var k = 0;k< tr.length;k++){
                         if(JSON.stringify(tr[k]) != "{}"){
                         var grade = num.Hanzi(tr[k].cn_grade)
                         var html =  '<div class="content">'+tr[k].cn_subject_chs + '</br>'
                             html += '( '+ tr[k].cn_sponsor_teacher_name +' )'+ '</br></div>'
                             html += '<span class="makeClassStatus_'+tr[k].cn_status +'">'+ num.makeClassStatus(tr[k].cn_status) +'</span>'
                             html +='<div class="info topInfo" data-id="'+ tr[k].cp_encrypt_id+'">'
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
                             html +=      '<h5 style="color:green">'+ num.makeClassStatus(tr[k].cn_status)+'</h5>' 
                             // 判断时间是否可以设置
                             if( is_over == 0){
                               html +=      '<div class="confirMitem" cp_encrypt_id ="'+tr[k].cp_encrypt_id +'" day ="'+ (k+1) +'"><span class="yes">确认已开 <i class="fa fa-check"></i></span><span class="no">确认未开 <i class="fa fa-times"></i></span></div>' 
                             }
                             if(is_over == 1) {
                                html +=      '<div class="confirMitem" cp_encrypt_id ="'+tr[k].cp_encrypt_id +'" day ="'+ (k+1) +'">开课确认时间未到</div>' 
                             }
                             html +=     '<i class="i"></i>'
                             html +=     '</div>'
                             $("td[positon='"+(i+1)+","+(k+1)+"']").html(html);
                             
                         }
                       }
                    }
                   
                 }
                 hoverUi();
                 confirmBtcongfig();
                 layer.close(loading);
              }
             
         })
    }



//删除按钮
  // function  confirmBtcongfig(){
  //       if($(".yes").length > 0){
  //          $(".confirMitem .yes").click(function(){
  //            var plan_id = $(this).parents(".confirMitem").attr("cp_encrypt_id");
  //            var geturl = path.api + "/api/confirmCoursePlan";
  //            var day = $(this).parents(".confirMitem").attr("day");
  //            console.log(geturl);
  //            api.ajaxGet(geturl,{plan_id:plan_id,day:day},function(res){
  //               if(res.type == "success") {
  //                  layer.msg("操作成功",{time:600});
  //                  studyTime (school_id,weekData);
  //                  formHeadtime(school_id,weekData);
  //               }
  //            })
  //            return false;
  //          })
  //       }
  //       if($(".confirMitem .no").length > 0){
  //          $(".confirMitem .no").click(function(){
  //            var plan_id = $(this).parents(".confirMitem").attr("cp_encrypt_id");
  //            var day = $(this).parents(".confirMitem").attr("day");
  //            var geturl = path.api + "/api/cancelCoursePlan";
  //            api.ajaxGet(geturl,{plan_id:plan_id,day:day},function(res){
  //               if(res.type == "success") {
  //                  layer.msg("操作成功",{time:600});
  //                  studyTime (school_id,weekData);
  //                  formHeadtime(school_id,weekData);
  //               }
  //            })
  //            return false;
  //          })
  //       }
  //     };





   

})

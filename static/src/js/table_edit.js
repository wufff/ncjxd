/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-14 15:55:46
 * @version $Id$
 */
 
require(["layui","path","tools","num"],function(layui,path,tools,num){
      var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      var $ = jquery = layui.jquery;
      var school_id = tools.queryString("school_id");
      var room_id = tools.queryString("room_id");
      var term_id = tools.queryString("term_id");
      var week = tools.queryString("week");
      var weekData = tools.queryString("weekData");
      var room_name = tools.queryString("room_name");
      var type = 0;
      var holidays = [];
      var totWeek;
      TagUi();
      studyTime(school_id,weekData);
      formHeadtime(school_id,weekData);
      renderClassTd(school_id,weekData);
     // $("#classroomName").text(room_name)

     // console.log(tools.queryString("room_id"));

      // console.log(school_id);
      //  console.log(room_id);
      //  console.log(term_id);
      //  console.log(week);
      //  console.log(weekData);
  



    //切换周
$("body").on("click",".Add",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == totWeek){
         return;
      }
      weekData = tools.nextWeek(weekData);
      studyTime (school_id,weekData);
      formHeadtime(school_id,weekData);
      renderClassTd(school_id,weekData);
   
})
  
$("body").on("click",".sub",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == 1){
         return;
      }
      weekData = tools.prevWeek(weekData);
      studyTime (school_id,weekData);
      formHeadtime(school_id,weekData);
      renderClassTd(school_id,weekData);
})




$("#classTagBt").click(function() {
      layer.open({
        type: 1,
        title:"设置课程",
        content: $('#classTagControl'),
        area:["800px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          layer.close(index); 
        }
      });
    })




  $("body").on("click","#classTagControl .tag",
    function(){
        var oder = $(this).parent().data("oder");
        if( oder == 0 ){
              var id = $(this).attr("data-id");
              $.get("/api/getSubjectCodeList", {
                grade_id: id
              }, function(res) {
                if (res.type == "success") {
                  $(".tagTabContentWrap").each(function(index, item) {
                    if (index > 0) {
                      element.tabDelete('classTagTab',index)
                    }
                  }) 
                  var list = res.data.data.list;
                  var html = '';
                  for (var i = 0; i < list.length; i++) {
                    if(i == 0 ){
                        html += '<span class="tag active" data-id="' + list[i].ss_id + '"  data-grade="' + id + '">' + list[i].ss_name + '</span>'
                    }else {
                         html += '<span class="tag" data-id="' + list[i].ss_id + '">' + list[i].ss_name + '</span>'
                    }
                  }
                  element.tabAdd('classTagTab', {
                    title: '学科',
                    content: '<div data-oder="1" class="tagTabContentWrap">'+html+'</div>',
                    id: 1
                  })
                  element.tabChange('classTagTab', 1);
                } else {
                  alert(res.type);
                }
              })
           }
       if (oder == 1)   {
           var id = $(this).attr("data-id");
           var grade = $(this).attr("data-grade");
       } 
      










       
   })



//周选择自定义
  form.on('radio(week)', function(data){
      if(data.value == "cum"){
         $(".controlWeek").show();
         $("#weekTagbox").show();
      }else{
         $(".controlWeek").hide();
         $("#weekTagbox").hide();
         $("#weekTagbox").html("");
      }
    });  



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
                 html += '<span class="active" data-id="'+list[i].sr_encrypt_id+'">'+list[i].sr_name+'</span>'
                 room_id = list[i].sr_encrypt_id;
              }else {
                 html += '<span  data-id="'+ list[i].sr_encrypt_id +'">'+list[i].sr_name+'</span>'
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
         totWeek = data.total_week;
         // console.log("studyTime"+week);
         $("#schoolTerm").html(data.year);
         $("#week_time").html(data.week_time);
         $("#totalweek").html(data.total_week);
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
                             $("td[positon='"+(i+1)+","+(k+1)+"']").html(html);
                             
                         }
                       }
                    }
                   
                 }
                  ui();
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


 function ui_holiday(){
    if(holidays.length>0){
     for(var i = 0;i<holidays.length;i++){
        $("td[positon$=',"+holidays[i]+"']").removeClass().addClass("holidayTd");
     }
    }
   

    // $("td[position$=',9']").removeClass().addClass(dayClass);
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
   }

 function TagUi(){
     $("body").on("click","#classTagControl .tag",function(){
            $(this).siblings().removeClass('active');
            $(this).addClass('active');
     })
 }

})

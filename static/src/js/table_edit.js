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
      studyTime(school_id,weekData);
      formHeadtime(school_id,weekData);
      renderClassTd(school_id,weekData);

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
      //外面没选中的就清空弹窗
       var tags =  $("#classTag").find(".tag-selected");
       if(tags.length == 0){
          $(".tagTabContentWrap").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classTagTab',index)
               }
          });
          $("#teachersTag").html("");   
          $("#classTagControl .tag").removeClass('active');
       }
      layer.open({
        type: 1,
        title:"设置课程",
        content: $('#classTagControl'),
        area:["800px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          var html = $("#teachersTag").html();
          $("#classTag").html(html);
          verify();
          layer.close(index); 
        }
      });
    })


//删除课程Tag
$("#classTag").on("click",".del",function(){
    $(this).parent().remove();
    //清空弹窗
    $(".tagTabContentWrap").each(function(index, item) {
        if (index > 0 ){
          element.tabDelete('classTagTab',index)
         }
    });
    $("#teachersTag").html("");   
    $("#classTagControl .tag").removeClass('active');
})

$("#teachersTag").on("click",".del",function(){
    $(this).parent().remove();
    //清空弹窗
    $(".tagTeacher").removeClass('active');
})


//老师关联选择
  $("body").on("click","#classTagControl .tag",
    function(){
       if ($(this).hasClass('active')){
         return;
       }
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
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
                      html += '<span class="tag" data-subject="' + list[i].ss_id + '" data-grade="' + id + '">' + list[i].ss_name + '</span>'
                  }
                  element.tabAdd('classTagTab', {
                    title: '学科',
                    content: '<div data-oder="1" class="tagTabContentWrap">'+html+'</div>',
                    id: 1
                  })
                  element.tabChange('classTagTab', 1);
                } else {
                  layer.msg("此年级下无学科",{icon:5})
                }
              })
           }
       if (oder == 1)   {
           var id = $(this).attr("data-id");
           var grade = $(this).attr("data-grade");
           var subject = $(this).attr("data-subject");
           var zh = $(this).text();
           var url = path.api + "/api/getSchoolTeacherList";
           $.get(url,{school_id:school_id,grade:grade,subject:subject},function(res){
                 console.log(res);
                if(res.type == "success"){
                    $(".tagTabContentWrap").each(function(index, item) {

                    if (index > 1) {
                      element.tabDelete('classTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag tagTeacher" data-zh="' + zh + '" data-subject="' + subject + '" data-grade="' + grade + '" data-tecacher="' + list[i].st_encrypt_uid + '">' 
                      html += list[i].st_realname + '</span>'
                  }
                   element.tabAdd('classTagTab', {
                    title: '老师',
                    content: '<div data-oder="2" class="tagTabContentWrap">'+html+'</div>',
                    id: 2
                  })
                   element.tabChange('classTagTab', 2);
                }else{
                   layer.msg("此科目下无老师",{icon:5,time:500})
                }
           })
       } 
       if (oder == 2)   {
           var id = $(this).attr("data-tecacher");
           var grade = $(this).attr("data-grade");
           var subject = $(this).attr("data-subject");
           var zh = $(this).attr("data-zh");
           var text = $(this).text();
           var html = '<span class="tag-selected" data-grade="' + grade + '" data-subject="' + subject + '">'
               html +=   '<span class="inner">'+ num.Hanzi(grade) +'年级-'+zh +'-'+text+'</span>'     
               html +=       '<span class="del">×</span>'
               html +=   '</span>'
           $("#teachersTag").html(html);
       } 
   })

// ==========================教室弹窗===========================
$("#roomTagBt").click(function() {
     //外面没选中的就清空弹窗
       var tags =  $("#roomTag").find(".tag-selected");
       // console.log(tags.length)
       if(tags.length == 0){
          $(".tagTabContentWrap_room").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classRoomTagTab',index)
               }
          });
          $("#roomsTag").html("");   
          $("#classRoomTagControl .tag").removeClass('active');
       }

      layer.open({
        type: 1,
        title:"接受教室",
        content: $('#classRoomTagControl'),
        area:["800px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          var html = $("#roomsTag").html();
          $("#roomTag").html(html);
          verify();
          layer.close(index); 
          
        }
      });
    })

//教室关联选择
  $("body").on("click","#classRoomTagControl .tag",
    function(){
       var _this = this;
       if ($(this).hasClass('active')){
         return;
       }
      
        var oder = $(this).parent().data("oder");
        if( oder == 0 ){
              var id = $(this).attr("data-id");
              // console.log(id);
              $.get("/api/getAreaList", {
                area_id:id,
                type:3
              }, function(res) {
                if (res.type == "success") {
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                  $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 0) {
                      element.tabDelete('classRoomTagTab',index)
                    }
                  }) 
                  var list = res.data.data.list;
                  var html = '';
                  // console.log(list);
                  for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag" data-area="' + id + '" data-area2="' + list[i].node_encrypt_id + '">' + list[i].node_name + '</span>'
                  }
                  element.tabAdd('classRoomTagTab', {
                    title: '县区',
                    content: '<div data-oder="1" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 1
                  })
                  element.tabChange('classRoomTagTab', 1);
                } else {
                  layer.msg("此地区下无数据",{icon:5});

                }
              })
           }
       if (oder == 1)   {
           var area2 = $(this).attr("data-area2");
           // var area = $(this).attr("data-grade");
           var url = "/api/getSchoolListByAreaId";
           $.get(url,{area_id:area2},function(res){
                 // console.log(res);
                if(res.type == "success"){
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                    $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 1) {
                      element.tabDelete('classRoomTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    console.log(list);
                    for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag" data-school="' + list[i].school_encrypt_id + '">' 
                      html += list[i].school_name + '</span>'
                  }
                   element.tabAdd('classRoomTagTab', {
                    title: '学校',
                    content: '<div data-oder="2" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 2
                  })
                   element.tabChange('classRoomTagTab', 2);
                }else{
                   layer.msg("此地区下无学校",{icon:5,time:500})

                }
           })
       } 
      if (oder == 2)   {
           var school_id = $(this).attr("data-school");
           var school_name = $(this).text();
           var url = "/api/getRoomListBySchoolId";
          $.get(url,{school_id:school_id,date:weekData},function(res){
                 // console.log(res);
                if(res.type == "success"){
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                    $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 2) {
                      element.tabDelete('classRoomTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    // console.log(list);
                    for (var i = 0; i < list.length; i++) {
                      html += '<span class="tag" data-class="' + list[i].sr_encrypt_id + '" data-school="' + school_id + '" data-schoolZb="' + school_name + '">' 
                      html += list[i].sr_name + '</span>'
                  }
                   element.tabAdd('classRoomTagTab', {
                    title: '教室',
                    content: '<div data-oder="3" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 3
                  })
                   element.tabChange('classRoomTagTab', 3);
                }else{
                   layer.msg("此学校下无教室",{icon:5,time:500})
                }
           })
       } 

       if (oder == 3)   {
         var school_id = $(this).attr("data-school");
         var school_name = $(this).attr("data-schoolZb");
         var class_name = $(this).text();
          var url = "/api/getSchoolTeacherList";
          $.get(url,{school_id:school_id},function(res){
                 // console.log(res);
                if(res.type == "success"){
                    $(_this).siblings().removeClass('active');
                    $(_this).addClass('active');
                    $(".tagTabContentWrap_room").each(function(index, item) {
                    if (index > 3) {
                      element.tabDelete('classRoomTagTab',index)
                     }
                   }) 
                    var list = res.data.data.list;
                    var html = "";
                    // console.log(list);
                  for (var i = 0; i < list.length; i++) {
                       var roomsTags =$("#roomsTag").find(".del");
                       if(roomsTags.length > 0){
                         roomsTags.each(function(index, el) {
                           var teacherid =  $(el).attr("data-teacher");
                           console.log(teacherid);
                           if( teacherid &&teacherid == list[i].st_encrypt_uid){
                           }else {
                               html += '<span class="tag lastRoomTag" data-zn="' + list[i].st_realname + '" data-teacher="'+ list[i].st_encrypt_uid+'" data-schoolZb="' + school_name + '" data-classZb="' + class_name + '">' 
                               html += list[i].st_realname + '</span>'
                           }
                        });
                       }else{
                           html += '<span class="tag lastRoomTag" data-zn="' + list[i].st_realname + '" data-teacher="'+ list[i].st_encrypt_uid+'" data-schoolZb="' + school_name + '" data-classZb="' + class_name + '">' 
                           html += list[i].st_realname + '</span>'
                       }
                  }
                   element.tabAdd('classRoomTagTab', {
                    title: '老师',
                    content: '<div data-oder="4" class="tagTabContentWrap_room">'+html+'</div>',
                    id: 4
                  })
                   element.tabChange('classRoomTagTab',4);
                }else{
                   layer.msg("该学校无老师信息",{icon:5,time:500})
                }
           })
       } 
       if (oder == 4)   {
          if($(_this).hasClass('active')){
            return;
          }
          $(_this).addClass('active');
          var teacher = $(this).text();
          var teacher_id = $(this).attr("data-teacher");
          var school = $(this).attr('data-schoolzb');
          var room = $(this).attr('data-classzb');
          var html = '<span class="tag-selected">'
              html +=        '<span class="inner">'+school+'-'+room +'-'+ teacher +'</span>'
              html +=            '<span class="del" data-teacher="'+teacher_id+'">×</span>'
              html +=      '</span>'
          // console.log(html)    
         var selected = $("#roomsTag").find('.tag-selected');
         //最多选中3个;
         if(selected.length<3){
           $("#roomsTag").append(html); 
         }else{
            layer.msg("最多选择3个",{icon:5})
         }
       } 
   })

//里面的tag
$("#roomsTag").on("click",".del",function(){
    $(this).parent().remove();
    var thisTeacherId = $(this).attr("data-teacher");
    console.log(thisTeacherId);
    //去掉弹窗里面active
    $(".lastRoomTag").each(function(index, el) {
       if($(el).attr("data-teacher") == thisTeacherId){
         $(el).removeClass('active');
       }
    });
    verify();
})

//外面的tag
$("#roomTag").on("click",".del",function(){
    var tags = $("#roomTag").find(".del");
    var tagsIncontrol = $("#roomsTag").find(".tag-selected");
    var index = tags.index($(this));
    tagsIncontrol.eq(index).remove();
    $(this).parent().remove();
     console.log(tags.length)
    if(tags.length == 1){
        $(".tagTabContentWrap_room").each(function(index, item) {
            if (index > 0 ){
              element.tabDelete('classRoomTagTab',index)
             }
        });
        $("#roomsTag").html("");   
        $("#classRoomTagControl .tag").removeClass('active');
    }
   verify();
})




// ==========================自定义周===========================


//周选择自定义
  form.on('radio(week)', function(data){
      if(data.value == "cum"){
         $(".controlWeek").show();
         $("#weekTagbox").show();
      }else{
         $(".controlWeek").hide();
         $("#weekTagbox").hide();
         $("#weekTagbox").html("");
         //弹窗内的
         $("#tagWeekWrap .tag").removeClass('active');
      }
    });  



 $("#weekTagBt").click(function(){
     layer.open({
        type: 1,
        title:"设置周",
        content: $('#classWeekTagControl'),
        area:["550px","500px"],
        btn: ['确定', '取消'],
        yes: function(index, layero){
          var actives = $("#tagWeekWrap").find(".active");
          if(actives.length > 0 ){
              var html = "";
              actives.each(function(index, el) {
                  var weekid =  $(el).attr("data-id");
                  html += '<span class="tag-selected">'
                  html +=       '<span class="inner" >第'+ num.Hanzi(weekid) +'周</span>'
                  html +=           '<span class="del" data-id="'+ weekid +'">×</span>'
                  html +=  '</span>'
              });
              $("#weekTagbox").html(html);
              layer.close(index); 
              verify ()
          }else{
             layer.close(index); 
          } 
        }
      });
 })


// 周tag删除
  $("#weekTagbox").on("click",".del",function(){
       $(this).parent().remove();
       var id = $(this).attr("data-id");
       $("#tagWeekWrap .tag").each(function(index, el) {
           var tagId = $(el).attr("data-id");
           // console.log(tagId);
           // console.log(id);
           if(id ==  tagId){
              $(el).removeClass('active');
           }
       });
  })

//清空
 $("#clearConfigBt").click(function(){
     console.log(1);
     clearTag1();
     clearTag2();
     clearTag3();
 })







//添加课程

  $("body").on("click","td",function(){
      if($(this).attr("positon")){
         alert(123);
      }
  }) 






















// ==================================================================================



//验证是否可以添加课程
  function verify () {
    var  tags1 = $("#classTag").find(".tag-selected").length;
    var tags2 = $("#roomTag").find(".tag-selected").length;
    // var tags3 = $("#weekTagbox").find(".tag-selected").length;
    if(tags1 && tags2) {
       
    }
  }








//清空3个tag
   function clearTag1() {
         $(".tagTabContentWrap").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classTagTab',index)
               }
          });
          $("#teachersTag").html("");   
          $("#classTag").html("");
          $("#classTagControl .tag").removeClass('active');
   }

    function clearTag2() {
         $(".tagTabContentWrap_room").each(function(index, item) {
              if (index > 0 ){
                element.tabDelete('classRoomTagTab',index)
               }
          });
          $("#roomsTag").html("");   
          $("#roomTag").html("");
          $("#classRoomTagControl .tag").removeClass('active');
   }

  function clearTag3() {
         $("#tagWeekWrap .tag").removeClass('active');
         $("#weekTagbox").html("");
         $("input[value=all]").prop("checked",true);
         form.render("radio"); 
         $(".controlWeek").hide();
   }








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
      
       if(res.type == "success") {
         var data = res.data.data;
         term_id = data.term_id;
         week = data.term_week;
         totWeek = data.total_week;
         //渲染弹框里面内容
         var html = ""
         for(var i = 0;i<totWeek;i++){
             var str = i+1
             html += '<span class="tag" data-id="'+ str +'">第'+ num.Hanzi(str) +'周</span>'
         }
          $("#tagWeekWrap").html(html);
          TagWeekUi(true);
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
       var getClassDate = {
             school_id:school_id,
             room_id:room_id,
             term_id:term_id,
             week:week,
             type:type
          }
         $.get(classUrl,getClassDate,function(res){
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

 function TagWeekUi(boolean){
   if(boolean){
     $("body").on("click","#tagWeekWrap .tag",function(){
           if(!$(this).hasClass('active')){
             $(this).addClass('active');
           }else{
              $(this).removeClass('active');
           }
           
     })
   }else {
     $("#tagWeekWrap .tag").removeClass('active');
    }
 }
})

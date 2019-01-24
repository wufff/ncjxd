
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-14 15:55:46
 * @version $Id$
 */
 
require(["jquery","layui","path","num","tools","api","boot-dropdown"],function($,layui,path,num,tools,api){
   var layer = layui.layer;
   var form =  layui.form;
   var $ = jQuery = layui.jquery; 
   var school_id = "";
   var room_id;
   var term_id;
   var room_name;
   var week;
   var now =(new Date()).toLocaleDateString();
   var weekData = now.replace(/\//g,'-');
   var totWeek;
   var school_name;
   var type = 0;
   var holidays = [];
   var isTodayStr = "";
   var laydate = layui.laydate;
   //是否可以修改时间
   var st_is_modify; 
   var loading; 
   var  city_id;
   var  town_id;
   var  school_id;
   //权限控制 0省 1市 2县 3学校
   var city_id_authority = $("#city_id").val();
   var town_id_authority = $("#town_id").val();
   var school_id_authority = $("#school_id").val();
   var is_center_school = $("#is_center_school").val();
   var authority = 0;
  //权限控制 显示开课
   var c20c30 = $("#c20c30").val();
//设置权限 ==============================================
  

   if(school_id_authority && school_id_authority != 0){

       authority = 3;
    }else if(town_id_authority && town_id_authority != 0){

       authority = 2;
    }else if(city_id_authority && city_id_authority != 0){

       authority = 1;
    }

   console.log("权限"+authority)
    switch(authority)
        {
        case 1:
              city_id = city_id_authority;
              var url = "/api/getAreaList";
              var  getData = {
                   area_id:city_id_authority,
                   type:3,

              }
              api.ajaxGet(url, getData,function(res){
                   console.log(res);
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
          break;
        case 2:
              town_id = town_id_authority;
              city_id = city_id_authority;
              var url = "/api/getAreaList";
              var  getData = {
                   area_id:city_id_authority,
                   type:3,
                   node_id:town_id_authority
              }
              api.ajaxGet(url, getData,function(res){
                   console.log(res);
                  if(res.type == "success") {
                    var list = res.data.data.list;
                    var html = '';
                    for(var i=0;i<list.length;i++){
                       html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
                    }
                   $("select[name=area]").html(html);
                    form.render('select');
                 }
               }) 

                 var getData2 = {
                      area_id:town_id_authority,
                      is_all:is_center_school  
                   }
              
               var url2 = path.api+"/api/getSchoolListByAreaId";
            api.ajaxGet(url2,getData2,function(res){
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
          break;
         case 3:
             school_id = school_id_authority;
             city_id = city_id_authority;
             town_id = town_id_authority;

             var url = "/api/getAreaList";
              var  getData = {
                   area_id:city_id_authority,
                   type:3,
                   node_id:town_id_authority
              }
              api.ajaxGet(url, getData,function(res){
                   console.log(res);
                  if(res.type == "success") {
                    var list = res.data.data.list;
                    var html = '';
                    for(var i=0;i<list.length;i++){
                       html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
                    }
                   $("select[name=area]").html(html);
                    form.render('select');
                 }
               }) 

                 var getData2 = {
                      area_id:town_id_authority,
                      school_id:school_id,
                      is_all:is_center_school  
                   }
              
               var url2 = path.api+"/api/getSchoolListByAreaId";
            api.ajaxGet(url2,getData2,function(res){
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
             
          break;
        default:
          break;
   } 


   if (c20c30 == 0){
       $(".editeFormWrap").css("visibility","hidden");
    }

//设置权限 结束==============================================
  

form.on('select(city)', function(data){
    if(data.value == city_id && data.value != "") {
           return;
     }
     else if (data.value == "" ) {
          intInfo();
       $("select[name=area]").html('<option value="">请先选择市</option>');
          form.render('select');
          city_id = data.value; 
          $("#inputText").val("");
     }else {
         intInfo();
         renderArea(data.value);
         city_id = data.value; 
         $("#inputText").val("");
     }
      
});  

form.on('select(area)', function(data){
     if(data.value == town_id && data.value != "") {
          return;
     }
     else if (data.value == "" ) {
          intInfo();
       $("select[name=school]").html('<option value="">请先选择地区</option>');
          form.render('select');
          town_id = data.value;
          $("#inputText").val("");
     }else {
        town_id = data.value;
        renderShool(data.value);
     }
    $("#inputText").val("");
});  


form.on('select(school)', function(data){
       if(data.value == school_id){
        
       }
      weekData = now;
      var ele = data.elem;
      $("#inputText").val("");
      var text = $(ele).find("option:selected").text();
       school_name = text;
       school_id = data.value;
       if(data.value != ""){
           $(".schoolName").text(school_name);
       }else{
           $(".schoolName").text("");
       }


       //现有教室才有教室id;
      renderClassRoom (school_id,weekData,function(){
           studyTime (school_id,weekData);
      });
});  




//快速搜索
$("#searchBt").click(function(){
    var keyword = $("#inputText").val();
    if(keyword){
        var  url = path.api+"/api/getSchoolAreaData";
        api.ajaxGet(url,{keyword:keyword},function(res){
                console.log(res);
               if(res.type == "success") {
                  var list = res.data.data;
                  console.log(list);
                  var length = list.length;
                  var html = '<option value="">'+length+'条 搜索结果</option>';
                  for(var i=0;i<list.length;i++){
                     html += '<option value="'+ list[i].city_id +'|'+ list[i].county_id +'|'+list[i].school_encrypt_id+'">'+ list[i].school_name+'</option>'
                  }
                   
                 $("select[name=ssrez]").html(html);
                 $("select[name=ssrez]").val("");
                  form.render('select');
               }else{
                  $("select[name=ssrez]").html('<option value="">0 条搜索结果</option>');
                  form.render('select');
               }
              $("#rebox").show();
        })
    }
    return false;
  })




form.on('select(ssrez)', function(data){
  console.log(data.value)
   if(data.value){
      var text = $("select[name=ssrez]").find("option:selected").text();
       school_name = text;
       $(".schoolName").text(school_name);
      $("#inputText").val(text);
      var arry = data.value.split('|');
      var cityId = arry[0];
      var area = arry[1];
      school_id = arry[2];
      $("select[name=city]").val(cityId);
      renderArea(cityId,area);
      renderShool(area,school_id);
      form.render('select');
      renderClassRoom (school_id,weekData,function(){
           studyTime (school_id,weekData);
      });
   }else{
      $("#inputText").val("");
   }
   $("#rebox").hide();
});   


function renderArea(cityId,value){
    var url = "/api/getAreaList";
    if(cityId != ""){
     var getData = {
        area_id:cityId,
        type:3
     }
      api.ajaxGet(url,getData,function(res){
        if(res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">选择区县</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
          }
           
         $("select[name=area]").html(html);
         if(value){
           $("select[name=area]").val(value);
         }else {
             $("select[name=area]").val("");
         }
          form.render('select');
       }
     })
     }else{
       $("select[name=area]").html('<option value="">此地区无数据</option>');
          form.render('select');
     }

  }


function renderShool(areId,value){
    var url = path.api+"/api/getSchoolListByAreaId"
    if(areId != ""){
     var getData = {
        area_id:areId,
        type:3
     }
      api.ajaxGet(url,getData,function(res){
        // console.log(res);
        if(res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">请选择</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].school_encrypt_id +'">'+ list[i].school_name+'</option>'
          }
         $("select[name=school]").html(html);
        if(value){
              $("select[name=school]").val(value);
         }else {
             $("select[name=school]").val("");
         }
          form.render('select');
       }else{
         $("select[name=school]").html('<option value="">此地区无数据</option>');
          form.render('select');
       }
     })
     }
}
   
       
  





   //切换周
$("body").on("click",".Add",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == totWeek){
         return;
      }
       loading = layer.load(3);
      weekData = tools.nextWeek(weekData);
      // studyTime (school_id,weekData);
      // formHeadtime(school_id,weekData);
      // renderClassTd(school_id,weekData);
       studyTime (school_id,weekData);
     
})
  










  
$("body").on("click",".sub",function(){
      var currtWeek = $("#week").text();
      if(currtWeek == 1){
         return;
      }
      loading = layer.load(3);
      weekData = tools.prevWeek(weekData);
      // studyTime (school_id,weekData);
      // formHeadtime(school_id,weekData);
      // renderClassTd(school_id,weekData);
       studyTime (school_id,weekData);
})



 //切换教室
$(".classRoom").on("click","span",function(){
    if($(this).hasClass("active")){
         return;
       }
     loading = layer.load(3);
     room_id = $(this).attr("data-id");
     room_name = $(this).text();
     $(this).siblings("span").removeClass('active');
     $(this).addClass('active');
     studyTime (school_id,weekData);
})

 //发起接受切换
$(".classType").on("click","span",function(){
     if($(this).hasClass("active")){
       return;
     }
     loading = layer.load(3);
     tpye = $(this).attr("data-tpye");
     if(tpye == 1){
         // $(".editeFormWrap").css("visibility","hidden");
         $(".editeFormWrap").hide();
     }else {
          // $(".editeFormWrap").css("visibility","visible");
           $(".editeFormWrap").show();
     }
     $(this).siblings("span").removeClass('active');
     $(this).addClass('active');
     studyTime (school_id,weekData);
})


//去编辑课表
$("#goToEdite").click(function(){
    window.location.href="/course/edit?school_id="+school_id+"&room_id="+room_id+"&weekData="+weekData+"&term_id="+term_id+"&week="+week+"&room_name="+room_name+"&school_name="+school_name+"&type="+type;
})
$("#goToConfirm").click(function(){
    window.location.href="/course/confirm?school_id="+school_id+"&room_id="+room_id+"&weekData="+weekData+"&term_id="+term_id+"&week="+week+"&room_name="+room_name+"&school_name="+school_name+"&type="+type;
})

//======================编辑上课时间弹窗===================

// 未设置时候给出默认框
 $(".uptimeInput").each(function(index, el) {
     if(index == 0){
        var value = "8:00 - 8:45"
     }
     if(index == 1){
        var value = "9:00 - 9:45"
     }
     if(index == 2){
        var value = "10:00 - 10:45"
     }
     if(index == 3){
       var value = "11:00 - 11:45"
     }

     laydate.render({
        elem: "#"+$(el).attr("id")
        ,type: 'time'
        ,format: 'HH:mm'
        ,btns: ['confirm']
        ,ready: formatminutesUp
        ,range: '-'
        ,value:value
    });

 });
$(".downtimeInput").each(function(index, el) {
     if(index == 0){
        var value = "14:00 - 14:45"
     }
     if(index == 1){
        var value = "15:00 - 15:45"
     }
     if(index == 2){
        var value = "16:00 - 16:45"
     }
    
     laydate.render({
        elem: "#"+$(el).attr("id")
        ,type: 'time'
        ,format: 'HH:mm'
        ,btns: ['confirm']
        ,ready: formatminutesDown
        ,range: '-'
        ,value:value
    });

 });



$(".configClassTimeBt").click(function(){
   var url =  path.api+"/api/getLastTermSchoolCourseTime";
   api.ajaxGet(url,{school_id:school_id},function(res){
          console.log(res);
          if(res.type == "success"){
             var list = res.data.data.time_info;
              if(list.length == 0){
                  return;
              }
             var up = res.data.data.noon_count.up;
             var down = res.data.data.noon_count.down;
             st_is_modify = res.data.data.st_is_modify;
             var  tat = up + down;
             //渲染上午
             $(".up").html("");
             for (var i = 0; i<up;i++){
                var id = 'uptimebox_'+(i+1);
                var s = list[i].st_start_time;
                var l = list[i].st_end_time;
                var value =  s+" "+"-"+ " "+l 
                var html = '<div class="item">'
                html += '<span>节次：</span>'
                html += '<span sort ="'+ (i+1) +'">'+ num.Hanzi(i+1)+'</span>'
                html += '<span class="timebox">设置时间：'
                html +=   '<input type="text" name="sort1_start" class="layui-input timeInput" id="'+ id +'">' 
                html +=   '</span>'
                html +=  '</div>'
                $(".up").append(html);
                laydate.render({
                      elem: '#'+id
                      ,type: 'time'
                      ,format: 'HH:mm'
                        ,btns: ['clear', 'confirm']
                      ,ready: formatminutesUp
                      ,range: '-'
                      ,value:value
                  }); 
                    
             }
             //渲染下午
             $(".down").html("");
             for (var i = up; i<tat;i++){
                var id = 'downtimebox_'+(i+1-up);
                var s = list[i].st_start_time;
                var l = list[i].st_end_time;
                var value =  s+" "+"-"+ " "+l 
                var html = '<div class="item">'
                html += '<span>节次：</span>'
                html += '<span sort ="'+ (i+1-up) +'">'+ num.Hanzi(i+1-up)+'</span>'
                html += '<span class="timebox">设置时间：'
                html +=   '<input type="text" name="sort1_start" class="layui-input timeInput" id="'+ id +'">' 
                html +=   '</span>'
                html +=  '</div>'
                $(".down").append(html);
                laydate.render({
                      elem: '#'+id
                      ,type: 'time'
                      ,format: 'HH:mm'
                        ,btns: ['confirm']
                      ,ready: formatminutesDown
                      ,range: '-'
                      ,value:value
                  }); 
                    
             }
              if(st_is_modify == 0){

                $(".timeInput").attr("disabled",true);
                $("#titlePont").show();
                 $("#upAddbt").hide();
                    $("#downAddbt").hide();
             }else{
                $(".timeInput").attr("disabled",false);
                $("#titlePont").hide();
                 $("#upAddbt").show();
                    $("#downAddbt").show();
             }
          }else{
            layer.msg("未设置学期,请先设置学期",{icon:5}) 
          }
   })
   layer.open({
            type: 1,
            title:"设置上课时间",
            content: $('#controlstudyTime'),
            area:["500px","600px"],
            btn:["确认","取消"],
            yes: function(index, layero){

             if(st_is_modify == 0){
                 //不能设置直接return;
                 layer.close(index);
                 return;
              }
               var array = [];
               $(".timeInput").each(function(index,el) {
                    var value = $(el).val();
                    var str = value.replace(/\s*/g,"");
                    array.push(str);
               });      
               var url = path.api + "/api/setTermSchoolCourseTime";
               api.ajaxGet(url,{term_id:term_id,times:array.join(","),school_id:school_id},function(res){
                  console.log(res);
                  if(res.type == "success"){
                     layer.msg("设置成功",{time:600});
                     layer.close(index);
                  }
               })
            }
   });
})


$("#upAddbt").click(function(){
  var length = $(".up").find(".item").length;
  if (length == 5){
     layer.msg("已达上线",{icon:5});
     return;
  }
  var id = 'uptimebox_'+(length+1);
  var html = '<div class="item">'
      html += '<span>节次：</span>'
      html += '<span sort ="'+ (length+1) +'">'+ num.Hanzi(length+1)+'</span>'
      html += '<span class="timebox">设置时间：'
      html +=   '<input type="text" name="sort1_start" class="layui-input timeInput" id="'+ id +'">' 
      html +=   '</span>'
      html +=    '<span>'
      html +=        '<button class="layui-btn layui-btn-sm layui-btn-primary del">-</button>'
      html +=     '</span>'
      html +=  '</div>'
  $(".up").append(html);
  laydate.render({
        elem: '#'+id
        ,type: 'time'
        ,format: 'HH:mm'
          ,btns: ['confirm']
        ,ready: formatminutesUp
        ,range: '-'
        ,value:'12:00 - 12:45'
    });
})

$("#downAddbt").click(function(){
  var length = $(".down").find(".item").length;
  if (length == 9){
     layer.msg("已达上线",{icon:5});
     return;
  }
  var id = 'downtimebox_'+(length+1);
  var html = '<div class="item">'
      html += '<span>节次：</span>'
      html += '<span sort ="'+ (length+1) +'">'+ num.Hanzi(length+1)+'</span>'
      html += '<span class="timebox">设置时间：'
      html +=   '<input type="text" name="sort1_start" class="layui-input timeInput" id="'+ id +'">' 
      html +=   '</span>'
      html +=    '<span>'
      html +=        '<button class="layui-btn layui-btn-sm layui-btn-primary del">-</button>'
      html +=     '</span>'
      html +=  '</div>'
  $(".down").append(html);
  laydate.render({
        elem: '#'+id
        ,type: 'time'
        ,format: 'HH:mm'
          ,btns: ['confirm']
        ,ready: formatminutesDown
        ,range: '-'
        ,value:'16:00 - 16:45'
    });
})




$("#controlstudyTime").on("click",".del",function(){
   $(this).parents(".item").remove();
})




//======================编辑学期弹窗===================

$(".configStudeyTimeBt").click(function(){
    initstudyTimelang();
    layer.open({
            type: 1,
            title:"设置学期",
            content: $('#controlstudyTimelang'),
            area:["900px","600px"],
            btn:["确认","取消"],
            yes: function(index, layero){
               layer.close(index);
            }
   });
})

function initstudyTimelang() {
  laydate.render({
    elem: '#holidayStart_time'
    ,calendar: true
  });
  laydate.render({
    elem: '#holidayEnd_time'
    ,calendar: true
  });
   // 初始化学期弹窗
   var url = path.api + "/api/getSchoolTermWeek";
   api.ajaxGet(url,{school_id:school_id},function(res){
         console.log(res);
         if(res.type == "success") {
              var list = res.data.data;
              $("#studyTime_title").html(list.title); 
             
              var start_time = list.term_time.start_time.slice(0, 10);
              var end_time = list.term_time.end_time.slice(0, 10);
               laydate.render({
                  elem: '#studyStart_time',
                  value:start_time
                });

                laydate.render({
                  elem: '#studyEnd_time',
                  value:end_time
                });
         }else {
            layer.mag(res.message);
         }
   })
}



//设置学校学期
$("#addtimedaysbt").click(function(){
    var Start_time = $("#studyStart_time").val();
    var  End_time  = $("#studyEnd_time").val();
    console.log(123);
    if(Start_time && End_time){
       console.log(321);
       var url = "/api/setSchoolTerm";
       var getData = {
          start_time:Start_time,
          end_time:End_time,
          school_id:school_id
       }
       api.ajaxGet(url,getData,function(res){
           console.log(res);
           if(res.type == 'success'){
              layer.msg("设置成功",{time:800})
           }else{ 
               layer.msg(res.message,{icon:5})
            }
       })
    }
})



//学校设置假日
$("#addHolidaysbt").click(function() {
   var holiday = $("#holiday").val();
   var End_time = $("#holidayEnd_time").val();
   var Start_time =  $("#holidayStart_time").val();
   if(holiday && End_time && Start_time){
      var getData = {
        start_time:Start_time,
        end_time:End_time,
        holiday:holiday
      }
      var url = '/api/setSchoolHoliday'
      api.ajaxGet(url,getData,function(res){
         if(res.type == "success"){
            layer.msg("设置成功",{time:800});
            redenerHoildForm();
            holiday.val("");
            End_time.val("");
            Start_time.val("");
         }
      })
   }else{
     layer.msg("输入信息不完整！~",{icon:5})
   }
});

redenerHoildForm();
function redenerHoildForm(){
  $("#holidayTbody").html("");
  var url = path.api + "/api/getSchoolHolidayList?v="+new Date().getTime();
  api.ajaxGet(url,{school_id:school_id},function(res){
      if(res.type == "success") {
        var list  = res.data.data.list;
        // console.log(list);
        for(var i =0;i<list.length;i++){
            var html = "<tr>";
            html += "<td>"+ list[i].sh_name +"</td>";
            html += "<td>"+ list[i].sh_start_time_chs +"</td>";
            html += "<td>"+ list[i].sh_end_time_chs+"</td>"
            html += "<td><a style='color:#1E9FFF;cursor:pointer' class='del' id='"+ list[i].sh_id+"'>删除</a></td></tr>";
            $("#holidayTbody").append(html);
        }
      }
  })
}





//删除假期 
 $("#holidayTbody").on("click",".del",function(){
    var url = path.api + "/api/delSchoolHolidayData";
    var id = $(this).attr("id");
    var getData = {
       holiday_id:id,
       school_id:school_id
    }
    api.ajaxGet(url,getData,function(res){
          if(res.type == "success") {
              layer.msg("删除成功",{time:500});
              redenerHoildForm();
          }else{
              layer.msg(res.message,{icon:5})
          }
    })
 });



////======================编辑学期结束===================

//======================编辑计划确认时间===================


// controlTimeComfirm

$(".configConfirmTimeBt").click(function(){
    laydate.render({
         elem: '#ChirformStart_time'
         ,type: 'datetime'

    });
     laydate.render({
         elem: '#ChirformEnd_time'
         ,type: 'datetime'
    });
    layer.open({
            type: 1,
            title:"设置计划确认时间",
            content: $('#controlTimeComfirm'),
            area:["800px","500px"],
            btn:["确认","取消"],
            yes: function(index, layero){
               layer.close(index);
            }
   });
})








////======================编辑计划确认时间结束===================

//======================渲染课表===================

// 渲染教室
function renderClassRoom (school_id,weekData,callbcak){
      var getData = {
          school_id:school_id,
          date:weekData,
          v:new Date().getTime()
        }
       var url = path.api + "/api/getRoomListBySchoolId";
      api.ajaxGet(url,getData,function(res){
          var obj = {
             text:"渲染教室",
             res:res
          }
          
        // console.log(obj);
        if(res.type == "success") {
            var list = res.data.data.list;
            // console.log(list);
            var html = "";
            for(var i =0;i<list.length;i++){
              if(i == 0){
                 html += '<span class="active" data-id="'+list[i].sr_encrypt_id+'">'+list[i].sr_name+'</span>'
                 room_id = list[i].sr_encrypt_id;
                 room_name = list[i].sr_name;
                 // console.log(room_name);
              }else {
                 html += '<span  data-id="'+ list[i].sr_encrypt_id +'">'+list[i].sr_name+'</span>'
              }
            }
             $(".classRoom").html(html);
             $(".classType").html('<span class="active" data-tpye="0">发起</span><span data-tpye="1">接收</span>')
             type = 0;
             if(callbcak){
               callbcak();
             }
       }else{
           var html = '<label style="font-weight: normal"></label>';  
           $(".classRoom").html(html);
           $(".classType").html(html);
           haveClass(false);
       }
     })
   }


// 渲染表头日期
 function formHeadtime(school_id,weekData){
    var titlesUrl = path.api+"/api/getWeekHoliday";
    var getData = {
          school_id:school_id,
          date:weekData,
          v:new Date().getTime()
        }
    api.ajaxGet(titlesUrl,getData,function(res){
       var obj = {
         text:"表头日期",
         res:res
       }
       console.log(obj);
       if(res.type == "success") {
         var data = res.data.data;
         holidays = [];
         isTodayStr = "";
         if(data.length > 0) {
            var html = "<th>午别</th><th>节次</th>";
             for(var i = 0;i<data.length;i++){
                   var str = i+1
                   var className = "";
                   var isToday = "";
                   if(data[i].is_holiday) {
                      holidays.push(str);
                      className ="holiday";
                   }
                   
                   if(data[i].is_today) {
                      isToday ="today";
                      isTodayStr = str;
                   }

                   var weeks =  num.Hanzi(str) == '七' ? '日' : num.Hanzi(str) 
                   html += '<th id="'+ isToday +'" class="'+ className +'" position="0,'+(i+1)+'">星期'+weeks+'<br/>'+data[i].date_time+'</th>'
             }
             $("#theadtr").html(html);
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
       var obj = {
           text:"学期和周",
           content:res
       }
       console.log(obj);
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
         renderClassTd(school_id,weekData);
         formHeadtime(school_id,weekData);
         haveClass(true);
       }else if (res.type == "error"){
         haveClass(false);
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
       var obj = {
           text:"渲染上下午关联课程",
           res:res
       }
       console.log(obj);
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
        setTimeout(function(){
            ui_holiday();
        },150)
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
         api.ajaxGet(classUrl,getClassDate,function(res){
              // console.log(res);
              var obj = {
                  text:"渲染课程",
                  res:res
              }
              console.log(obj);
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
                         var html = '<div class="content">'+tr[k].cn_subject_chs + '</br>'
                             html += '( '+ tr[k].cn_sponsor_teacher_name +' )'+ '</br></div>'
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
                             html +=      '<h5 style="padding-bottom:15px;">'+ num.makeClassStatus(tr[k].cn_status)+'</h5>' 
                             // html +=      '<p>'+ tr[k].cn_status+'</p>' 
                             html +=     '<i class="i"></i>'
                             html +=     '</div>'
                             $("td[positon='"+(i+1)+","+(k+1)+"']").html(html);
                             
                         }
                       }
                    }
                   
                 }
                  hoverUi();
                 layer.close(loading);
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
     $("#table_header").hide(); 
     $(".schoolName").text("");
	 }

//节假日样式
 function ui_holiday(){
    console.log(holidays);
    if(holidays.length>0){
     for(var i = 0;i<holidays.length;i++){
        $("td[positon$=',"+holidays[i]+"']").removeClass().addClass("holidayTd");
     }
    }


     if(isTodayStr){
        $("td[positon$=',"+isTodayStr+"']").removeClass().addClass("todayTd");
     }
 }


  function hoverUi(){
      $("td").hover(function() {

         var info = $(this).find(".info");
         var positon = $(this).attr("positon");
         var _this = this
         if(positon && info.length == 1){
            var wz = positon.split(",");
            if(wz[0] > 5){
                info.addClass('bottomInfo');
                info.removeClass('topInfo');
            }else{
               info.addClass('topInfo');
               info.removeClass('bottomInfo');
            }
            $(this).find(".content").css("color","#000");
            info.show();
         }
      }, function() {
        var info = $(this).find(".info");
        var _this = this;
         if(info.length == 1) {
             setTimeout(function(){
                $(_this).find(".content").css("color","#666");
                info.hide();
             },150)
         }
      });
   }

   function haveClass(boonlean){
         if(boonlean){
             $("#table_header_none").hide();
             $("#table_header").show();
         }else{
            $("#table_header_none").show();
             $("#table_header").hide();
              $("#tbody").html('<tr><td colspan="9" class="noneTd">暂无课表信息~！</td></td>'); 
         }

   }


})



// 格式化时间框
  function  formatminutesUp(date) {
             $(".laydate-time-text").eq(0).html("上课时间");
             $(".laydate-time-text").eq(1).html("下课时间");
            $(".laydate-time-list").map(function(index,ele){
                var am = $(ele).find("ol").eq(0).find('li');
                for (var i = 0; i < am.length; i++) {
                var am00 = am[i].innerText;
                if (am00 != "08" && am00 != "09"  && am00 != "10" && am00 != "11" ) {
                    am[i].remove()
                  } 
                }  
             //    var showtime = $(ele).find("ol").eq(1).find('li');
             //    for (var i = 0; i < showtime.length; i++) {
             //    var t00 = showtime[i].innerText;
             //    if (t00 != "00" && t00 != "15"  && t00 != "25" && t00 != "30"   && t00 != "40" && t00 != "45" ) {
             //        showtime[i].remove()
             //    }
             // }
              $(ele).find("ol").eq(2).find('li').remove();
           })
            // ar showtime = $(".laydate-time-livst li ol").eq(1).find("li");
            // for (var i = 0; i < showtime.length; i++) {
            //     var t00 = showtime[i].innerText;
            //     if (t00 != "00" && t00 != "20"  && t00 != "25" && t00 != "30"  && t00 != "35" && t00 != "40" && t00 != "45" && t00 != "50") {
            //         showtime[i].remove()
            //     }
            // }
            // $($(".laydate-time-list li ol")[2]).find("li").remove();  //清空秒
  
       }

       // 格式化时间框
function  formatminutesDown(date) {
             $(".laydate-time-text").eq(0).html("上课时间");
             $(".laydate-time-text").eq(1).html("下课时间");
            $(".laydate-time-list").map(function(index,ele){
                var am = $(ele).find("ol").eq(0).find('li');
                for (var i = 0; i < am.length; i++) {
                var am00 = am[i].innerText;
                if (am00 != "14" && am00 != "15"  && am00 != "16" && am00 != "18" && am00 != "19" && am00 != "20" ) {
                    am[i].remove()
                  } 
                }  
             //    var showtime = $(ele).find("ol").eq(1).find('li');
             //    for (var i = 0; i < showtime.length; i++) {
             //    var t00 = showtime[i].innerText;
             //    if (t00 != "00" && t00 != "15"  && t00 != "25" && t00 != "30"   && t00 != "40" && t00 != "45" ) {
             //        showtime[i].remove()
             //    }
             // }
              $(ele).find("ol").eq(2).find('li').remove();
           })
            // ar showtime = $(".laydate-time-livst li ol").eq(1).find("li");
            // for (var i = 0; i < showtime.length; i++) {
            //     var t00 = showtime[i].innerText;
            //     if (t00 != "00" && t00 != "20"  && t00 != "25" && t00 != "30"  && t00 != "35" && t00 != "40" && t00 != "45" && t00 != "50") {
            //         showtime[i].remove()
            //     }
            // }
            // $($(".laydate-time-list li ol")[2]).find("li").remove();  //清空秒
  
  }
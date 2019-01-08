
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-12-31 15:36:02
 * @version $Id$
 */
 
require(["jquery","layui","path","tools","page"],function($,layui,path,tools,pages){
   var form = layui.form;
   var currentWeek = 0;
   var currentMouth = 0;
   var currentTpye = true;
   ui();
   form.render('select');
   initPage (currentTpye);




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
          var html = '<option value="">全部</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
          }
         $("select[name=area]").html(html);
         $("select[name=area]").val("");
          form.render('select');
       }
     })
     }else{
       $("select[name=area]").html('<option value="">全部</option>');
          form.render('select');
     }
    setTimeout(function(){
      initPage (currentTpye);
    },200)
});  

form.on('select(area)', function(data){
    initPage (currentTpye);
});

form.on('select(studyTime)', function(data){
    initPage (currentTpye);
});



// 点击选择周
   $(".week").click(function(event) {
       if($(this).hasClass('active')){
        return;
      }
      var obj = tools.calcDtScopeByWeek(currentWeek);
      var str = obj.start+" 至 " + obj.last;
      $("#timeInput").val(str);
      currentTimeTpye = "week";
   });

// 点击选择月
  $(".mouth").click(function(event) {
       if($(this).hasClass('active')){
        return;
      }
      var obj = tools.calcDtScopeByMonth(currentWeek);
      var str = obj.start+" 至 " + obj.last;
      $("#timeInput").val(str);
      currentTimeTpye = "mouth";
    
   });

 $(".fa-chevron-left").click(function(){
    if(currentTimeTpye == "week"){
      currentWeek = currentWeek - 1;
      var obj = tools.calcDtScopeByWeek(currentWeek);
      var str = obj.start+" 至 " + obj.last;
      $("#timeInput").val(str);
      initPage (currentTpye)
    }
    if(currentTimeTpye == "mouth"){
        currentMouth = currentMouth - 1;
        var obj = tools.calcDtScopeByMonth(currentMouth);
        var str = obj.start+" 至 " + obj.last;
        $("#timeInput").val(str);
        initPage (currentTpye);
    }
    
 })

 $(".fa-chevron-right").click(function(){
      if(currentTimeTpye == "week"){
      currentWeek = currentWeek + 1;
      var obj = tools.calcDtScopeByWeek(currentWeek);
      var str = obj.start+" 至 " + obj.last;
      $("#timeInput").val(str);
      initPage (currentTpye);
    }
    if(currentTimeTpye == "mouth"){
        currentMouth = currentMouth + 1;
        var obj = tools.calcDtScopeByMonth(currentMouth);
        var str = obj.start+" 至 " + obj.last;
        $("#timeInput").val(str);
        initPage (currentTpye);
    }
 })



// 点击选择学科
  $(".study").click(function(){

  })


 $("#searchBt").click(function(){
   var words = $("#inputText").val();
   if(!words){
     return false;
   }else{
     var url = path.api + "/api/getCityAreaInfoByKeyWord";
     $.get(url,{keyword:words},function(res){
          if(res.type == "success"){
            var list = res.data.data;
            var town_id = list.town_id
            $("select[name=city1]").val(list.city_id)
             form.render('select');
              var getData = {area_id:list.city_id,type:3}
              var url = "/api/getAreaList";
              $.get(url,getData,function(res2){
                   // console.log(res);
                  if(res2.type == "success") {
                    var list2 = res2.data.data.list;
                    var html = '<option value="">全部</option>';
                    for(var i=0;i<list2.length;i++){
                       html += '<option value="'+ list2[i].node_encrypt_id +'">'+ list2[i].node_name+'</option>'
                    }
                   $("select[name=area]").html(html);
                   console.log(list.town_id);
                   $("select[name=area]").val(town_id);
                    form.render('select');
                    initPage (currentTpye);
                 }
               })
          }else{
              $("select[name=city1]").val("");
              $("select[name=area]").val("");
               form.render('select');
             initPage (currentTpye);
          }
     })
     return false;
   }
   
 })




   function initPage (boolean){
      $(".tableLoading").show();
      if(boolean){
        $("#tbody_area").html("")
        var url = path.api+"/api/getAnalyticsAreaList";
      }else{
         $("#tbody_subject").html("")
         var url = path.api+"/api/getAnalyticsSubjectList";
      }

     var getData = {}

     var timeType = $(".tag-data").find(".active").attr("data-type");
      if(timeType == 1){
          getData.start_time = $("select[name=studyTime]").val().split("|")[0];
          getData.end_time = $("select[name=studyTime]").val().split("|")[1];
      }
      if(timeType == 2){
          getData.start_time = tools.calcDtScopeByMonth(currentMouth).start;
          getData.end_time = tools.calcDtScopeByMonth(currentMouth).last;
      }
       if(timeType == 3){
          getData.start_time = tools.calcDtScopeByWeek(currentWeek).start;
          getData.end_time = tools.calcDtScopeByWeek(currentWeek).last;
      }

      getData.city_id = $("select[name=city1]").val();
      getData.area_id = $("select[name=area]").val(); 
      $("select[name=city1]").find("option:selected").text();
      $("select[name=area]").find("option:selected").text();

      if($("select[name=city1]").find("option:selected").text() == "全部"){
            $(".cityText").text("湖北省");
       }else{
          $(".cityText").text($("select[name=city1]").find("option:selected").text());
       }

       
       if($("select[name=area]").find("option:selected").text() == "全部"){
            $(".areaText").text("");
       }else{
           var str = " > "+$("select[name=area]").find("option:selected").text();
          $(".areaText").text(str);
       }
 
      console.log(getData);
      $.get(url,getData,function(res){
          render(res,boolean)
      })
 }


function  render(res,boolean) {
      $(".tableLoading").hide();
      console.log(res);
     if(res.type == "error"){
        if(boolean){  
           $("#tbody_area").html('<tr><td colspan="4" style="padding:30px 0;">暂无数据~!</td></tr>')
        }else{
           $("#tbody_subject").html('<tr><td colspan="19" style="padding:30px 0;">暂无数据~!</td></tr>')
        }
     }
    if(res.type == "success"){
       var list = res.data.data;
       if(boolean){
          var html = "";
           for(v in list){
            html += '<tr>'
            html += '<td >' + list[v].area_name + '</td>'
            html += '<td>' + list[v].plan_count + '</td>'
            html += '<td>' + list[v].actual_count + '</td>'
            html += '<td>' + list[v].percent + '</td>'
            html += ' </tr>'
           }
           $("#tbody_area").html(html);
      }else{
           var html = "";
            for(v in list){
            html += '<tr>'
            html += '<td >' + v + '</td>'
            for(x in list[v]){
               html += '<td>' + list[v][x].plan_count + '</td>'
               html += '<td>' + list[v][x].actual_count + '</td>'
               html += '<td>' + list[v][x].percent + '</td>'
            }
            html += ' </tr>'
           }
           $("#tbody_subject").html(html);
      }
    }
}
 
















  function ui(){
   $(".areaTab").click(function(){
      currentTpye = true;
      initPage (currentTpye);
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      $(".area").show();
      $(".brane").hide();
   })
    $(".braneTab").click(function(){
      currentTpye = false;
      initPage (currentTpye);
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      $(".area").hide();
      $(".brane").show();
   })
  $(".tag-data").on("click","span",function(){
      if($(this).hasClass('active')){
        return;
      }
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
      if($(this).hasClass('study')){
         $("#studyDom").show();
         $(".rangeTimebox").hide();
      }else{
        $("#studyDom").hide();
        $(".rangeTimebox").show();
      }
      initPage (currentTpye);
  })
  }



})

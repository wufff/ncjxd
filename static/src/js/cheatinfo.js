require(["layui", "path","page","api","boot-dropdown"], function(layui, path,pages,api) {
    var layer = layui.layer;
    var $ = jQuery = layui.jquery;
    var form =  layui.form;
    var dialog;
    var loading;
    var table = layui.table;
    initPage (1);
    initPage2(1);



table.on('edit(table)', function(obj){ //注：edit是固定事件名，test是table原始容器的属性 lay-filter="对应的值"

  var tr  = obj.tr;
  var cell = $(tr).find("td");
  cell.each(function(index, el) {
     if(obj.field == $(el).attr("data-field")){
         $(el).addClass('red');
     }
  });
  var $dom = obj.data.city;
  $(".sotre").html($dom);
  var city = $(".sotre").find(".city_text").text();
  var code = $(".sotre").find(".code").text();
  var already = $(".sotre").find(".already").text();
  var getDataObj = obj.data;
  var getData = city + ","+ getDataObj.student_total +","+ getDataObj.school_total +","+ getDataObj.teacher_total;
      getData += "," + getDataObj.class_total +","+ getDataObj.course_total +","+ already+","+ code;
  var url = "/api/saveCityStatisData";
  
  api.ajaxGet(url,{data:getData},function(data){
               if(data.type == "success"){
                  layer.msg("保存成功");
                  layer.close(loading);
               }else{
                  layer.msg(data.msg,{icon:5});
               }
    })
});


table.on('edit(table2)', function(obj){ 
  var tr  = obj.tr;
  var cell = $(tr).find("td");
  cell.each(function(index, el) {
     if(obj.field == $(el).attr("data-field")){
         $(el).addClass('red');
     }
  });
  var getDataObj = obj.data;
  var type;
  if(getDataObj.title == '年度计划研修数' ){ type = 1}else{ type=2};
  var getData = "";
  for ( x in getDataObj){
      if( x != "title") {
         getData += x +"|"+  getDataObj[x] +","
      }
  }
  getData +=  type;
  var url = "/api/saveYxNumData";
  api.ajaxGet(url,{data:getData},function(data){
               if(data.type == "success"){
                  layer.msg("保存成功");
                  layer.close(loading);
               }else{
                  layer.msg(data.msg,{icon:5});
               }
  })



  // var $dom = obj.data.city;
  // $(".sotre").html($dom);
  // var city = $(".sotre").find(".city_text").text();
  // var code = $(".sotre").find(".code").text();
  // var already = $(".sotre").find(".already").text();
  // var getDataObj = obj.data;
  // var getData = city + ","+ getDataObj.student_total +","+ getDataObj.school_total +","+ getDataObj.teacher_total;
  //     getData += "," + getDataObj.class_total +","+ getDataObj.course_total +","+ already+","+ code;
  // var url = "/api/saveCityStatisData";
  
  // api.ajaxGet(url,{data:getData},function(data){
  //              if(data.type == "success"){
  //                 layer.msg("保存成功");
  //                 layer.close(loading);
  //              }else{
  //                 layer.msg(data.msg,{icon:5});
  //              }
  //   })
});



 

$("#reset").click(function(){
  var url = "/api/resetCityStatisData";
  api.ajaxGet(url,{},function(data){
               if(data.type == "success"){
                  layer.msg("还原成功！");
                  initPage (1);
               }else{
                  layer.msg(data.msg,{icon:5});
               }
    })
})


$("#reset2").click(function(){
  var url = "/api/resetYxActualData";
  api.ajaxGet(url,{},function(data){
               if(data.type == "success"){
                  layer.msg("还原成功！");
                  initPage2 (1);
               }else{
                  layer.msg(data.msg,{icon:5});
               }
    })
})








function initPage (goPage){
  var url = path.api+"/api/getCityStatisData";
  api.ajaxGet(url,{},function(res){
      if(res.type == "success"){
           buildTable(res.data.data)
     }else{
        layer.msg(res.message,{icon:5})
     }
  })
  
function buildTable(data) {
  console.log(data);
  var html = '';
  for (var i = 0; i < data.length; i++) {
    html += '<tr data-id="' + data[i].encrypt_id + '">'
    html += '<td class="city">' + '<span class="city_text">'+ data[i].city + '</span><span class="code">' +data[i].city_code +'</span><span class="already">' +data[i].already_course_total +'</span></td>'
    html += '<td class="school_total" >' + data[i].school_total + '</td>'
    html += '<td class="class_total">' + data[i].class_total + '</td>'
    html += '<td class="teacher_total">' + data[i].teacher_total + '</td>'
    html += '<td class="student_total">' + data[i].student_total + '</td>'
    html += '<td class="student_total">' + data[i].course_total + '</td>'
    html += ' </tr>'
  }
  $(".loading1").html(' ');
  $("#tbody").html(html);
  layer.close(loading);
  table.init('table', {
     height:742//设置高度
    ,limit: 18
     //注意：请务必确保 limit 参数（默认：10）是与你服务端限定的数据条数一致
  }); 


}
}



 function initPage2 (goPage){
      var url = path.api+"/api/getYxSubjectCount";
      api.ajaxGet(url,{},function(res){
          if(res.type == "success"){
               buildTable(res.data.data)
         }else{
            layer.msg(res.message,{icon:5})
         }
      })
      


    function buildTable(list) {
       console.log(list);
       var data = [];
       data[0] = {};
       data[1] = {};  
       $.each(list,function(i,v) {
           var  k = v.code;
           data[0][k] =  v.plan_num;
           data[0]["title"] = "年度计划研修数";
       });
       
       $.each(list,function(i,v) {
           var  k = v.code;
           data[1][k] =  v.plan_num;
           data[1]["title"] = "实际已开研修数";
       });
    
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr>'
        html += '<td>'+ data[i].title+'</td>'
        html += '<td>'+ data[i].GS001+'</td>'
        html += '<td>' + data[i].GS002 + '</td>'
        html += '<td>' + data[i].GS009 + '</td>'
         html += '<td>' + data[i].GS013 + '</td>'
        html += '<td>' + data[i].GS015 + '</td>'
        html += '<td>' + data[i].GS026 + '</td>'
         html += '<td>' + data[i].GS024 + '</td>'
         html += '<td>' + data[i].GS025 + '</td>'
        html += ' </tr>'
      }
      $(".loading2").html(' ');
      $("#tbody2").html(html);
      layer.close(loading);
      table.init('table2', {
         height:118
        ,limit: 18
      }); 


    }
 }

   



})
require(["jquery","layui","path","page","num"],function($,layui,path,pages,num){
  var layer = layui.layer;
  var form = layui.form;
  var room_num = "";
  ui();
  initPage(1);

  form.on('select(city)', function(data){
     // console.log(data.value)
     var getData = {
      area_id:data.value,
      type:3
     }
     var url = "/api/getAreaList";
     if(data.value){
      $.get(url,getData,function(res){
        if(res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">选择区县</option>';
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
}); 


form.on('select(grade)', function(data){
   // console.log(data.value);
   var url = path.api + "/api/getSubjectCodeList";
   var getData = {};
   getData.grade_id = data.value;
   if(data.value){
       $.get(url,getData,function(data){
        // console.log(data);
       if(data.type == "success") {
          var list = data.data.data.list;
          var html = '<option value="">选择学科</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].ss_id +'">'+ list[i].ss_name+'</option>'
          }
         $("select[name=subject]").html(html);
          console.log(html);
         $("select[name=subject]").val(" ");
          form.render('select');
       }
   })
   }else{
     $("select[name=subject]").html('<option value="">全部</option>');
     form.render('select');
   }
  
 
});   
      
   //搜索
  $("#searchBt").click(function(){
      initPage(1);
  })



// $(".tag").on("click","span",function(){
//       if($(this).hasClass('active')){
//         return;
//       }
//       alert(123);
//    })
$(".tagItem").click(function(){
   if($(this).hasClass('active')){
      return;
   }
   room_num = $(this).attr("room_num");

})





  function initPage (goPage){
      var data = {
       city_id:$("select[name=city]").val(),
       area_id:$("select[name=area]").val(),
       stage_id:$("select[name=grade]").val(),
       subject_id:$("select[name=subject]").val(),
       page:1,
       page_count:10,
       room_num:room_num,
       v:new Date().getTime()
   };
  
       var url = path.api+"/api/getTodayCentreSchoolPiliList";
       var getData = "&page=1&page_count=12&city_id="+data.city_id+"&area_id="+data.area_id+"&stage_id="+data.stage_id+"&subject_id="+data.subject_id+"&room_num="+data.room_num+"&v="+ new Date().getTime();
      console.log(getData);
      pages.getAjax(url,getData,function(data){
          // console.log(data);
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total,"pageNum","12",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="9" style="height:120px;">暂无数据~！</td></td>');
             $(".tableLoading").html('');
             return;
         }
      })
     
    function buildTable(list) {
      console.log(list);
    if (list.type == "success") {
      var data = list.data.data.list.map(function(item) {
        return {
          school_name: item.cn_school_name,
          city: item.cn_school_city,
          town:item.cn_school_town,
          stage:item.cn_stage,
          subject: item.cn_subject,
          teacher: item.cn_teacher_name,
          cn_num:item.cn_num,
          statusClass:"status_"+item.cn_status,
          status:num.patrolStatus(item.cn_status),
          id:item.cn_encrypt_id
        }
      })
     
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr>'
        html += '<td class="sn">' + data[i].school_name + '</td>'
        html += '<td>' + data[i].city + '</td>'
        html += '<td >' + data[i].town + '</td>'
        html += '<td >' + data[i].stage + '</td>'
        html += '<td >' + data[i].subject + '</td>'
        html += '<td >' + data[i].teacher + '</td>'
        html += '<td>' + data[i].cn_num + '</td>'
        html += '<td class="'+data[i].statusClass+'">' + data[i].status + '</td>'
        html += '<td><a href="/Patrol/details?node_id='+ data[i].id +'" class="open">进入课堂</a><a href="" class="go">发起互动</a></td>'
        html += ' </tr>'
      }
      $(".tableLoading").html(' ');
      $("#tbody").html(html);

    }
    if(list.type == "error") {
        var mun = goPage - 1;
        pages.gotopage.call(page,mun,false);
    }
  }
 }


 
  function ui(){
  $(".tag").on("click","span",function(){
      if($(this).hasClass('active')){
        return;
      }
      $(this).siblings().removeClass('active');
      $(this).addClass('active');
   })
  }




})
/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-12-31 15:36:02
 * @version $Id$
 */
require(["jquery","layui","path","tools","page","api","downList","boot-dropdown"],function($,layui,path,tools,pages,api,downList){
   var form = layui.form;
   var loading;
   initPage (1);
   //权限
   var city_id;
   var town_id;
   var city_id_authority = $("#city_id").val();
   var town_id_authority = $("#town_id").val();
   var authority = 0;
   if(town_id_authority && town_id_authority != 0){
       authority = 2;
    }else if(city_id_authority && city_id_authority != 0){
       authority = 1;
    }
 
  console.log("权限"+authority);
 
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
           
          break;
        default:
          break;
   } 






form.on('select(city)', function(data){
      if(city_id == data.value){
         return;
      }
     var getData = {
       area_id:data.value,
       type:3
     }
     $("#inputText").val("");
     city_id = data.value
     var url = "/api/getAreaList";
     if(data.value){
      api.ajaxGet(url,getData,function(res){
         console.log(res);
        if(res.type == "success") {
          var list = res.data.data.list;
          var html = '<option value="">全部</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].node_encrypt_id +'">'+ list[i].node_name+'</option>'
          }
         $("select[name=area]").html(html);
         $("select[name=area]").val("");
          form.render('select');
       }else {
            $("select[name=area]").html('<option value="">该地区无数据</option>');
             form.render('select');
       }
     })
     }else{

           $("select[name=area]").html('<option value="">全部</option>');
           form.render('select');
     }
});  

form.on('select(area)', function(data){
    if(town_id == data.value){
         return;
      }
     $("#inputText").val("");
     town_id = data.value  
});







$("#searchBt").click(function(){
  
   var words = $("#inputText").val();
   if(!words){
     return false;
   }else{
      loading = layer.load(5);
     var url = path.api + "/api/getCityAreaInfoByKeyWord";
     api.ajaxGet(url,{keyword:words},function(res){
          console.log(res);
          if(res.type == "success"){
            var list = res.data.data;
            var town_id = list.town_id
            $("select[name=city1]").val(list.city_id)
             form.render('select');
              var getData = {area_id:list.city_id,type:3}
              var url = "/api/getAreaList";
              api.ajaxGet(url,getData,function(res2){
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
                    initPage (1);
                 }
               })
          }else{
              $("select[name=city1]").val("");
              $("select[name=area]").val("");
              $("#tbody").html('<tr><td colspan="16" class="noneDataTd" style="padding:30px 0;">搜索区县 '+words+' 无数据~！</td></td>'); 
              $("#pageNum").html("");
               form.render('select');
               layer.close(loading);
             
          }
     })
     return false;
   }
 })



$("#searchBt_main").click(function(){
   loading = layer.load(5);
   initPage (1)
   return false;
})

 


function initPage (goPage){
      var url = path.api+"/api/getAreaSchoolAnalyticsList";
      var start_time = $("select[name=studyTime]").val().split("|")[0];
      var end_time = $("select[name=studyTime]").val().split("|")[1];
      var city_id = $("select[name=city1]").val();
      var area_id = $("select[name=area]").val();
      var getData = "area_id="+area_id+"&city_id="+city_id+"&end_time="+end_time+"&start_time="+start_time;
          getData += "&page=1&page_count=25&v="+ new Date().getTime();
      pages.getAjax(url,getData,function(data){
          console.log(data)
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","25",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="16" class="noneDataTd" style="padding:30px 0;">暂无数据~！</td></td>');
             $(".tableLoading").html('');
             layer.close(loading);
             return;
         }
      })
     
  function buildTable(list) {     
    if (list.type == "success") {
      var data = list.data.data.list;
      var dt = data;
      var sortColumn = ['city_name', 'town_name'];
      var  mergeColumns = []; //存放合并行内容的数组
      for(var i=0; i<sortColumn.length; i++){
        mergeColumns.push({
          rspan:1, //合并的行数
          colStr:'', //合并行的内容
          colName:sortColumn[i] //行key
        });
      }

    function dataMerge(curItem, preItem, curIndex){
    if (curItem[mergeColumns[curIndex].colName] == preItem[mergeColumns[curIndex].colName]) {//值相同说明该字段这两行数据内容相同，可以合并，所以rspan加1
      mergeColumns[curIndex].colStr = '';
            mergeColumns[curIndex].rspan += 1;
      if(curIndex == (mergeColumns.length-1)){//做一个限制，否则会无线递归下去
        return;
      }
      curIndex += 1;
      dataMerge(curItem, preItem, curIndex);//递归调用
        } else { //值不同，则需要进行列td输出。
      for(var j=curIndex; j<sortColumn.length; j++){//从curIndex进行内容处理，防止遗漏或过多处理
        mergeColumns[j].colStr = ('<td  rowspan="' + mergeColumns[j].rspan + '">' + curItem[mergeColumns[j].colName] + '</td>');
        mergeColumns[j].rspan = 1;
      }
      curIndex = 0;
        }
     }

    var ht = ''; //输出的行内容（数据都是倒叙拼接）
    for (var i = dt.length - 1; i > 0; i--) {
        var curItem = dt[i], preItem = dt[i - 1]; //获取当前条和前一条
        dataMerge(curItem, preItem,0);//合并数据
        ht = '<tr>' + mergeColumns[0].colStr + mergeColumns[1].colStr + '<td>' + curItem.id + '</td><td>' + curItem.school_name 
        + '</td><td>' + curItem.course_actual_count + '</td><td>' + curItem.course_plan_count+ '</td><td>' + curItem.course_percent
        + '</td><td>' + curItem.male_count + '</td><td>' + curItem.female_count+ '</td><td>' + curItem.leftover_children_count
        + '</td><td>' + curItem.room_num + '</td><td>' + curItem.teacher_total + '</td><td>' + curItem.teacher_within_total 
        + '</td><td>' + curItem.is_patrol
        + '</td><td>' + curItem.is_interact + '</td><td>' + curItem.centre_school_name + '</td></tr>' + ht;
    }
     
   let firstItem = dt[0];// 由于循环没有到第一条，所以必须单独补上第一条
   ht = '<tr><td  rowspan="' + mergeColumns[0].rspan + '">' + firstItem.city_name + '</td><td rowspan="' + mergeColumns[1].rspan + '">' 
   + firstItem.town_name + '</td><td>' +  firstItem.id + '</td><td>' + firstItem.school_name + '</td><td>' + firstItem.course_actual_count 
   + '</td><td>' + firstItem.course_plan_count+ '</td><td>' + firstItem.course_percent
   + '</td><td>' + firstItem.male_count + '</td><td>' + firstItem.female_count+ '</td><td>' + firstItem.leftover_children_count
   + '</td><td>' + firstItem.room_num + '</td><td>' + firstItem.teacher_total + '</td><td>' + firstItem.teacher_within_total 
   + '</td><td>' + firstItem.is_patrol
   + '</td><td>' + firstItem.is_interact + '</td><td>' + firstItem.centre_school_name + '</td></tr>' + ht;
   $(".tableLoading").html(' ');
   $("#tbody").html(ht);
   $("#tbody2").html(ht);
      layer.close(loading);
    }
    if(list.type == "error" ) {
        // var mun = goPage - 1;
        // pages.gotopage.call(page,mun,false);
    }
  }
 }










        $(window).scroll(function(){
            if ($(this).scrollTop()>300){
                
                $("#tablebox").show();
              
            }
            else{
           
                $("#tablebox").hide();
                // $("#tbody2").css("visibility","hidden")
            }
        });
   

})

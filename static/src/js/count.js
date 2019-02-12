/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-12-31 15:36:02
 * @version $Id$
 */
require(["jquery","layui","path","tools","page","api","downList","boot-dropdown"],function($,layui,path,tools,pages,api,downList){
   var form = layui.form;
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
     console.log(data.value)
     var getData = {
      area_id:data.value,
      type:3
     }
     city_id = data.value
     var url = "/api/getAreaList";
     if(data.value){
      api.ajaxGet(url,getData,function(res){
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
    if(town_id == data.value){
         return;
      }
     town_id = data.value  
});

form.on('select(studyTime)', function(data){
   
});





$("#searchBt").click(function(){
   var words = $("#inputText").val();
   if(!words){
     return false;
   }else{
     var url = path.api + "/api/getCityAreaInfoByKeyWord";
     api.ajaxGet(url,{keyword:words},function(res){
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
                    initPage (currentTpye);
                 }
               })
          }else{
              $("select[name=city1]").val("");
              $("select[name=area]").val("");
               form.render('select');
               initPage (1);
          }
     })
     return false;
   }
   
 })





 


function initPage (goPage){
      var url = path.api+"/api/getAreaSchoolAnalyticsList";
      var start_time = $("select[name=studyTime]").val().split("|")[0];
      var end_time = $("select[name=studyTime]").val().split("|")[1];
      var city_id = $("select[name=city1]").val();
      var area_id = $("select[name=area]").val();
      var getData = "area_id="+area_id+"&city_id="+city_id+"&end_time="+end_time+"&start_time="+start_time;
          getData += "&page=1&page_count=18&v="+ new Date().getTime();
      pages.getAjax(url,getData,function(data){
         console.log(data);
         if( data.type == "success"){
             var total = data.data.data.total;
             page =  new pages.jsPage(total, "pageNum","18",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }else{
             $("#tbody").html('<tr><td colspan="16" class="noneDataTd" style="padding:30px 0;">暂无数据~！</td></td>');
            $(".tableLoading").html('');
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
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-id="' + data[i].encrypt_id + '">'
        html += '<td class="sn">' + data[i].sn + '</td>'
        html += '<td class="title">' + data[i].title + '</td>'
        html += '<td>' + data[i].time + '</td>'
        html += '<td>' + data[i].teacher_name + '</td>'
        html += '<td><a class="inner_img" href="'+ data[i].img +'"><img  class="img" src="' + data[i].img + '"></a></td>'
        html += '<td>' + data[i].is_exist + '</td>'
        html += '<td><a class="change">修改</a><a class="del">删除</a></td>'
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
 }















 



})

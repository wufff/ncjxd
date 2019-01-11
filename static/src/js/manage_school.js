require(["layui", "path","api","page"], function(layui,path,api,pages) {
    var layer = layui.layer;
    var upload = layui.upload;
    var $ = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
    var user_type = $("#user_type").attr("user_type");
    var page;
    var loading;
    var dialog;
    var form = layui.form;
    var county_id;
    initPage (1);


  form.on('select(city)', function(data){
     var postData = {
      city_id:data.value
     }
     var url = "/SchoolManage/ajaxCountyListByCityId";
     if(data.value != 0){
      api.ajaxPost(url,postData,function(res){
        if(res.type == "success") {
          var list = res.message;
          var html = '<option value="">全部</option>';
          for(var i=0;i<list.length;i++){
             html += '<option value="'+ list[i].town_id +'">'+ list[i].town_name+'</option>'
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

   



$("#searchBt").click(function(){
    initPage (1);
})



$("body").on("click",".Untying",function(){
    loading = layer.load(3);
    var tr = $(this).parents("tr");
    var id = tr.attr("data-id");
    var classfily = tr.find(".school_classify").attr("school_classify");
    var url = "/SchoolManage/ajaxRelationSchoolList";
    api.ajaxPost(url,{school_classify:classfily,school_id:id},function(res){
         if( res.type == "success") {
             var data = res.message;
             console.log(data);
             var html = '';
            for (var i = 0; i < data.length; i++) {
              html += '<tr >'
              html += '<td class="sn">' + (i+1) + '</td>'
              html += '<td class="school_name">' + data[i].school_name + '</td>'
              html += '<td><span class="UntyBtn" school_id ="'+ id +'" center_school_id="'+data[i].relation_school_id +'" school_classify="'+ classfily +'">解绑</span></td></tr>'
            }
            $("#r_tbody").html(html);
            layer.close(loading);
            layer.open({
            type: 1,
            title:"解绑学校",
            content: $('#controluntySchool'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              if($(".UntyActive").length > 0){
                  var getData = {
                      center_school_id:"",
                      school_classify:""
                  }
                  var arry = [];
                  $(".UntyActive").each(function(index, el) {
                      getData.school_classify = $(el).attr("school_classify");
                      arry.push($(el).attr("center_school_id"));
                      if($(el).attr("school_classify") == 1) {
                          getData.center_school_id = $(el).attr("school_id");
                      }else if($(el).attr("school_classify") == 2) {
                          getData.jxd_school_id = $(el).attr("school_id");
                      }
                });

                if(getData.school_classify == 2) {
                     getData.center_school_id = arry.join(",");
                     
                }else if(getData.school_classify == 1){
                     getData.jxd_school_id = arry.join(","); 

                }
               var url = "/SchoolManage/ajaxDelCenterSchoolRelation"     

                // console.log(getData);
          
               api.ajaxPost(url,getData,function(res){
                       if(res.type == "success"){
                           layer.msg("解绑成功！",{time:500});
                           initPage (1);
                           layer.close(index); 
                       }
                  })      
              }else{
                  layer.close(index); 
              }
            }
          });
         }
    })
})

$("#addSchoolControl").on("click",".UntyBtn",function (){
     $(this).removeClass("UntyBtn").addClass('UntyActive').addClass("acitve");
     $(this).text("已关联");
  })



$("#controluntySchool").on("click",".UntyBtn",function (){
     $(this).removeClass("UntyBtn").addClass('UntyActive');
     $(this).text("已解绑");
  })





$("body").on("click",".related",function (){
      var tr = $(this).parents("tr");
       county_id = tr.attr("county_id");
       var url = "/SchoolManage/ajaxJxdSchoolList";
        api.ajaxPost(url,{county_id:county_id},function(res){
            if(res.type == "success") {
            var data = res.message;
             console.log(data);
             var html = '';
            for (var i = 0; i < data.length; i++) {
              html += '<tr >'
              html += '<td class="sn">' + (i+1) + '</td>'
              html += '<td class="school_name">' + data[i].school_name + '</td>'
              if(data[i].is_relation == 0){
                html += '<td><span class="UntyBtn" school_id ="'+ data[i].id +'">关联</span></td></tr>'
              }else if(data[i].is_relation == 1){
                html += '<td><span class="UntyActive" school_id ="'+ data[i].id +'">已关联</span></td></tr>'
              }
              
            }
            $("#addShooltbody").html(html);
            layer.close(loading);
           }
       })
       layer.open({
            type: 1,
            title:"关联学校",
            content: $('#addSchoolControl'),
            area:["700px","700px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
        });
       // loading = layer.load(3);
  
  })

  
$("#SoolchsearchBt").click(function(res){
      var school_name = $("#keyWords").val();
      if(school_name == ""){
         return;
      }
       var url = "/SchoolManage/ajaxSearchJxdSchool";
       api.ajaxPost(url,{county_id:county_id,school_name:school_name},function(res){
            console.log(res);
           if(res.type == "success") {
               if(res.message.length == 0){
                  layer.msg("此关键字无搜索结果",{icon:5});
                  return;
               }
            var html = '';
            var data = res.message;
            for (var i = 0; i < data.length; i++) {
              html += '<tr >'
              html += '<td class="sn">' + (i+1) + '</td>'
              html += '<td class="school_name">' + data[i].school_name + '</td>'
              if(data[i].is_relation == 0){
                html += '<td><span class="UntyBtn" school_id ="'+ data[i].id +'">关联</span></td></tr>'
              }else if(data[i].is_relation == 1){
                html += '<td><span class="UntyActive" school_id ="'+ data[i].id +'">已关联</span></td></tr>'
              }
              
            }
            $("#addShooltbody").html(html);

           }
       })
})





  $("body").on("click",".edit",function (){
      layer.open({
            type: 1,
            title:"编辑教室",
            content: $('#conrolEditClass'),
            area:["700px","700px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
  })





  $("body").on("click",".editClass",function (){
      layer.open({
            type: 1,
            title:"编辑教室",
            content: $('#conrolEditClassAdd'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
  })



$("body").on("click","#addClassbtn",function (){
      layer.open({
            type: 1,
            title:"添加教室",
            content: $('#conrolEditClassAdd'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
  })











  function initPage (goPage){
      var url = "/SchoolManage/ajaxSchoolList";
      var city_id = $("select[name=city]").val();
      var county_id = $("select[name=area]").val();
      var school_classify = $("select[name=searchType]").val();
      var school_name = $("#searchText").val();
      var getData = "city_id="+city_id +"&county_id="+ county_id;
          getData += "&school_classify="+ school_classify +"&school_name="+ school_name;
          getData += "&page=1&page_count=15&v="+ new Date().getTime();
          ;
          // console.log(getData);
      pages.getAjax(url,getData,function(data){
          console.log(data);
         if( data.type == "success"){
             var total = data.message.count;
             page =  new pages.jsPage(total, "pageNum","15",url,getData,buildTable,goPage,null);
             pages.pageMethod.call(page); 
           }
               
      })
     
    function buildTable(list) {
    if (list.type == "success") {
      var data = list.message.data;
      var total = list.message.count;
       if(total == 0){
                 $("#tbody").html('<tr><td colspan="10" class="noneDataTd">暂无数据~！</td></td>');
                 $(".tableLoading").html('');
                 return;
             } 
      var html = '';
      for (var i = 0; i < data.length; i++) {
        html += '<tr data-id="' + data[i].id + '" county_id="'+ data[i].county_id+'">'
        html += '<td class="sn">' + (i+1) + '</td>'
        html += '<td class="school_name" dodo_school_id="'+ data[i].dodo_school_id +'">' + data[i].school_name + '</td>'
        html += '<td class="school_classify" school_classify="'+ data[i].school_classify+'">' + data[i].school_classify_name; + '</td>'   
        html += '<td class="division_descript">' + data[i].division_descript + '</td>'
       
        if(data[i].relation_school != 0){
        html += '<td class="relation_school"><a class="Untying">' + data[i].relation_school; + '</a></td>'  
      }else{
         html += '<td class="relation_school">' + data[i].relation_school; + '</a></td>'  
      }
        html += '<td class="center_class_count">' + data[i].center_class_count + '</td>'
        html += '<td class="recive_class_count">' + data[i].recive_class_count + '</td>'
        html += '<td class="teacher_count">' + data[i].teacher_count + '</td>'
        html += '<td class="user_user">' + data[i].user_user + '</td>'
        if(data[i].school_classify == 2){
         html += '<td> <a class="edit">编辑教室</a></td>'  
       }else{
          html += '<td> <a class="edit">编辑教室</a>  <a class="related">关联学校</a> </td>'
       }
       
      }
      $(".tableLoading").html(' ');
      $("#tbody").html(html);
    }
  }
 }

})
























  // var zTreeObj;
  
   // var setting = {
   //  check:{
   //    enable:true
   //  }
   // };
 
   // var zNodes = [
   // {
   // name:"test1", 
   // open:true, 
   // children:[
   //    {name:"test1_1"}, 
   //    {
   //      name:"test1_2",
   //      open:false,
   //      children:[
   //            {name:"test_1_1_1"},
   //             {name:"test_1_1_2"},
   //       ]
   //    }]
   //  },
   // {
   //     name:"test2", 
   //     open:true, 
   //     children:[
   //    {name:"test2_1"}, 
   //    {name:"test2_2"}
   //    ]
   //  }
   // ];


   //  zTreeObj = $.fn.zTree.init($("#tree"), setting, zNodes);
   // //获得所被选中的节点
   // var nodes = zTreeObj.getNodes(); //获得所有节点
   // // console.log(zTreeObj.transformToArray(nodes)); //转换成统计数组
   

   // $(".getTree").click(function(){
   //   var checkedNode = zTreeObj.getCheckedNodes();
   //   console.log(checkedNode);
   // })
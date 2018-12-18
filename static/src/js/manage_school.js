require(["layui", "path","zTree"], function(layui,path,zTree) {
    var layer = layui.layer;
    var upload = layui.upload;
    var $_lay = jQuery = layui.jquery; //用他的jquey否则弹窗会有问题
  

   var zTreeObj;
  
   var setting = {
    check:{
      enable:true
    }
   };
 
   var zNodes = [
   {
   name:"test1", 
   open:true, 
   children:[
      {name:"test1_1"}, 
      {
        name:"test1_2",
        open:false,
        children:[
              {name:"test_1_1_1"},
               {name:"test_1_1_2"},
         ]
      }]
    },
   {
       name:"test2", 
       open:true, 
       children:[
      {name:"test2_1"}, 
      {name:"test2_2"}
      ]
    }
   ];


    zTreeObj = $.fn.zTree.init($("#tree"), setting, zNodes);
   //获得所被选中的节点
   var nodes = zTreeObj.getNodes(); //获得所有节点
   // console.log(zTreeObj.transformToArray(nodes)); //转换成统计数组
   

   $(".getTree").click(function(){
     var checkedNode = zTreeObj.getCheckedNodes();
     console.log(checkedNode);
   })
   
    $(".Untying").click(function(){
          layer.open({
            type: 1,
            title:"解绑学校",
            content: $_lay('#controluntySchool'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
    })




  $("body").on("click",".edit",function (){
      layer.open({
            type: 1,
            title:"编辑教室",
            content: $_lay('#conrolEditClass'),
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
            content: $_lay('#conrolEditClassAdd'),
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
            content: $_lay('#conrolEditClassAdd'),
            area:["500px","500px"],
            btn: ['确定', '取消'],
            yes: function(index, layero){
              layer.close(index); 
            }
          });
  })




   
})
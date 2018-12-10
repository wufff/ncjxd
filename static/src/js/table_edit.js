/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-14 15:55:46
 * @version $Id$
 */
 
require(["layui"],function(layui){
      var layer = layui.layer;
      var form = layui.form;
      var element = layui.element;
      var $ = jquery = layui.jquery;

      

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
        var next = oder + 1;
         $(".tagTabContentWrap").each(function(index,item){
            console.log(index);
            if(index > oder) {
                element.tabDelete('classTagTab', index)
            }
        })

        element.tabAdd('classTagTab', {
         title: '新选项'+ (Math.random()*1000|0) 
        ,content: '<div data-oder="'+next+'" class="tagTabContentWrap">'
                   +'<span class="tag">1</span>'
                   +'<span class="tag">2</span>'
                   +'<span class="tag">3</span>'
                 +'</div>'
        ,id: next
    })
        element.tabChange('classTagTab', next); 
       
       
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

})


/**
 * 
 * @authors Your Name (you@example.org)
 * @date    2018-11-13 15:26:43
 * @version $Id$
 */
require(["jquery","layui","path","ZeroClipboard","upLoad","tools","api","boot-dropdown"], function($,layui,path,ZeroClipboard,upLoad,tools,api) {
    window['ZeroClipboard'] = ZeroClipboard;
    var layer = layui.layer;
    var form = layui.form;
    var laydate = layui.laydate;
    var $ = jQuery = layui.jquery; 
    var uploader_doc = upLoad.doc('docfiles',10);
    var notice_id = tools.request("id");
    var tpye = 0;
    var del_ids = [];
    var ue = UE.getEditor('editor');
    if(notice_id){
        $("#publishBt").html("确认修改");
        tpye = 1;
         var url = path.api + "/api/getManageNoticeInfoById"
        api.ajaxGet(url,{notice_id:notice_id},function(res){
        	if (res.type == "success") {
                var list = res.data.data;
                // //console.log(list);
                var file_info = list.file_info;
                    $("#title").val(list.n_title);
                    $('input[name=type][value='+ list.n_type +']').prop("checked",true);
                    // $('input[name=type][value='+ list.n_type +']').siblings('.layui-form-radio').remove();
                     $('input[name=type][value='+ list.n_type +']').siblings('input').prop("disabled",true);
                    form.render("radio"); 
                    $("#author").val(list.n_author);
                    var timeValue = list.n_datetime.slice(0,10);
                    var n_content = list.n_content;
                   
                    laydate.render({
                       elem: '#dataInput',
                       value:timeValue
                    });  
                    var html ="";     
                    for(var i= 0; i<file_info.length;i++){
                       html += '<div  class="doc_item">'
                       html +=    '<span class="fileName">'+  file_info[i].nf_file_name+'</span><b><span>100%</span></b> <a href="javascript:void(0)" id="'+ file_info[i].nf_encrypt_id+'" class="isdel">删除</a>'
                       html += '</div>'
                    }
                    $("#doclist").html(html);

              setTimeout(function(){   
                 ue.setContent(n_content);
                },200)       

        	}else {
        		layer.msg(res.message,{icon:5})
        	}
        })
    }else{
        $("#publishBt").html("确认发布");
          laydate.render({
	       elem: '#dataInput' //指定元素
	    });
    }
 

    $("body").on("click",".isdel",function(){
         var id = $(this).attr("id");
         del_ids.push(id);
          $(this).parent().remove();
   })




    $("#publishBt").click(function(){
    	$("#submit").click();
    })


    




   form.on('submit(form)', function(data){
       var getData = data.field; 
       getData.id=notice_id;
       var doc_paths = [];
       var doc_names = [];
       var html = ue.getContent();
       if(!html && html == 0){
          layer.msg("内容未填写,请填写内容",{icon:5});
          return false;
       } 
       getData.content = html;
        if($(".doc_item").length != 0)  {
             $(".fileName").each(function(index, el) {
             doc_names.push($(el).text());
             $(".docPath").each(function(index, el) {
                  doc_paths.push($(el).val())
             });
             getData.file_paths = doc_paths.join(",");
             getData.file_names = doc_names.join(",");
        });
        } 
        //console.log(getData);

       
      if(tpye == 0){
            var url = path.api + "/api/addManageNotice";
            var str ="添加成功";
        }
       if(tpye == 1){
           var url =  path.api +"/api/modifyManageNoticeData"
           var str ="修改成功";
           getData.del_ids = del_ids.join(",");
        }
        api.ajaxPost(url,getData,function(res){
        	// //console.log(res);
          if(res.type == "success") {
             layer.msg(str)
             setTimeout(function(){
             	// window.location.reload();
              window.history.go(-1);
             },500)
          }else{
             layer.msg("没有修改，返回请点击返回",{icon:5})
          }
        }) 
        return false;
  });
})
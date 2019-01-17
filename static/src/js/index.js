require(["Swiper","jquery","viewPhoto","api","boot-dropdown",],function(Swiper,$,view,api){
  //登录切换
  $(".white_black .h4").click(function() {
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        if($(this).attr("id") == "manageLogin"){
          $(".manageLogin").show();
          $(".teacherLogin").hide();
        }else{
          $(".manageLogin").hide();
          $(".teacherLogin").show();
        }
  });

//登录按钮
  $("#loginBt").click(function(){
     var user_name = $("#user_name").val();
     var password = $("#user_pwd").val();
     var autologin = $("#autologin").is(':checked')? 1 : 0
    if(user_name && password) {
    api.ajaxPost("/Login/loginPost",{
        user_name:user_name,
        user_pwd:password,
        autologin:autologin
     },function(res){
        if(res.type == 'success'){
          window.location.href = res.message;
        }else{
          $("#errInfo").html(res.message);
        }
     })
    }
     
  });


  new Swiper('#spotRound', {
	     loop : true,
       slidesPerView : 'auto',
       loopedSlides :6,
       autoplay : 5000,
       autoplayDisableOnInteraction:false,
       prevButton:'.bar_left',
       nextButton:'.bar_right',
  })
   new Swiper('#bannerRound', {
       loop : true,
       autoplay : 4000,
       effect:'fade',
       speed:800,
       autoplayDisableOnInteraction:false,
       pagination: '.swiper-pagination',
       nextButton: '.banner-next',
       prevButton: '.banner-pre',
  })



//轮播样式
 $("#bannerRound").mouseover(function(){
                  $(".banner-bar").show();
              }).mouseout(function(){
                 
                  $(".banner-bar").hide();
              });
  $(".banner-bar").mouseover(function(){
                  $(".banner-bar").show();
              })


//登录样式  
  $("#user_name").focus(function(){
    $("#errInfo").html("");
  })
  $("#user_pwd").focus(function(){
     $("#errInfo").html("");
  })
  

   view.viewimg("#spot");
    






});

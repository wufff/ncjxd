require(["Swiper","jquery","viewPhoto","boot-dropdown"],function(Swiper,$,view){

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

 $("#bannerRound").mouseover(function(){
                  $(".banner-bar").show();
              }).mouseout(function(){
                 
                  $(".banner-bar").hide();
              });
  $(".banner-bar").mouseover(function(){
                  $(".banner-bar").show();
              })
   view.viewimg("#spot");
});

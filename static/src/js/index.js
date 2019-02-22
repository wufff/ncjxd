require(["Swiper","viewPhoto","api","layui","tools","headLogin"],function(Swiper,view,api,layui,tools){
  var layer = layui.layer;
  var $ = jQuery = layui.jquery; 
  view.viewimg("#spot");
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

});

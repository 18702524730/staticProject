/* 首页js */ 
$(document).ready( function() {
	// 全屏翻页
	$('#fullpage').fullpage({
    navigation: true,
		anchors: ['page1', 'page2', 'page3', 'page4','page5','page6'],
    scrollingSpeed: 500,  //滚动速度
    slidesNavigation: true,  //是否显示左右滑块的项目导航
    loopBottom: true,  //滚动到最底部后是否滚回顶部
    // loopTop: true,  //滚动到最顶部后是否滚底部
    afterRender: function () {  //生成页面时的回调函数
      // $('#fullpage').find('.active').addClass('focus');
    },
    afterLoad: function (anchorLink, indexObj) { //滚动到某一屏的回调函数
      // $('#fullpage').children().eq(index-1).addClass('focus');
      let index_ = $('#fp-nav ul>li').length;
      if(indexObj.index == index_-1) {
        $('#moveUp').fadeOut();
      }
      else{
        $('#moveUp').fadeIn();
      }
    },
    // onLeave: function (index, nextIndex, direction) { //滚动前
    // 	$('#fullpage').children('.focus').removeClass('focus');
    // } 
  });
  
  function initSwiperFn (num){
    var mySwiper = new Swiper('#swiper'+num, {
      autoplay : 50000,//可选选项，自动滑动
      loop : true,//可选选项，开启循环
      pagination : '#pagination'+num,
      onSlideChangeEnd: function(swiper){
        setIndex()
      }
    })
    // 设置当前页码
    function setIndex(){
      let index = mySwiper.activeLoopIndex+1 < 10 ? '0'+(mySwiper.activeLoopIndex+1) : mySwiper.activeLoopIndex+1;
      let total = $('#pagination'+ num +' .swiper-pagination-switch').length;
      total = total < 10 ? '0'+total : total;
      $('#indexBox' + num + ' .index').text(index);
      $('#indexBox' + num + ' .total').text(total);
    }
    setIndex();
    // 上一页
    $('#prev'+num).click(function(){
      mySwiper.swipePrev();
      setIndex();
    })
    // 下一页
    $('#next'+num).click(function(){
      mySwiper.swipeNext();
      setIndex();
    })
  }

  // 第一屏轮播
  initSwiperFn('One')

  // 第二屏轮播
  var swiperTwo = new Swiper('#swiperTwo',{
    autoplay : 50000,//可选选项，自动滑动
    loop : true,//可选选项，开启循环
  })

  // 第三屏轮播
  initSwiperFn('Three')

  // 第五屏轮播
  initSwiperFn('Five')
  
  $(document).on('click', '#moveUp', function(){
    fullpage_api.moveSectionDown();
  });




})
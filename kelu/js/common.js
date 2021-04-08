// 获取登录用户信息
function getUserInfo(externalUrl, on_result) {
  $.ajax({
    url : externalUrl + "user/get-user.json",
    type : 'POST',
    data : JSON.stringify({
    }),
    dataType : "json",
    contentType : 'application/json;charset=utf-8',
    cache : false,
    success : function(data) {
      return on_result(data);
    },
    complete: function (XMLHttpRequest, textStatus) {
      var res = XMLHttpRequest.responseText;
      try {
        var jsonData = JSON.parse(res);
        if (jsonData.code === 2 || jsonData.code === 666) {
          // 不拦截跳登录
          // location.href="./login.html";
        }
      } catch (e) {}
    }
  });
  return false;
}

function sendVerifycode(externalUrl, mobile, on_result) {
  $.ajax({
    url : externalUrl + "common/send-verifycode.json",
    type : 'POST',
    data : JSON.stringify({
      mobile : mobile
    }),
    dataType : "json",
    contentType : 'application/json;charset=utf-8',
    cache : false,
    success : function(data) {
      return on_result(data);
    }
  });

  return false;
}

function getPriceDisplay(price) {
  var sprice = Math.round(price * 100) / 100;
  sprice = sprice + "";
  var pointInd = sprice.indexOf('.');
  if (-1 === pointInd) {
    sprice = sprice + ".00";
  } else {
    var lastInd = sprice.length - 1;
    if (1 === lastInd - pointInd) {
      sprice = sprice + "0";
    }
  }
  return sprice;
}

$.ajaxSetup({
  complete: function (XMLHttpRequest, textStatus) {
    var res = XMLHttpRequest.responseText;
    try {
      var jsonData = JSON.parse(res);
      if (jsonData.code === 2) {
        location.href="./login.html";
      }
    } catch (e) {}
  }
});

$(document).ready(function() {
  // 全局 externalUrl
  if (location.host.indexOf('localhost') !== -1) {
    window.externalUrl = 'http://localhost:3000/kelu/'
  }else{
    window.externalUrl = 'http://47.110.124.54:8081/kelu'
  }
  // 头部登录状态
  var initTopHeader = function() {
    var el = $('.logined');
    if (!el.length) {return}
    getUserInfo(externalUrl, function(data) {
      if (data.code === 0) {
        var userInfo = data.user_info;
        if (userInfo) {
          //全局
          window.UserInfo = userInfo;
          $('.logined').show();
          $('.login_enter').hide();
          $('.reg_enter').hide();
          $('.login_name span').text(userInfo.username||'');
          $('.login_name img').attr('src', externalUrl + userInfo.head_portrait_url);
        }
        return false;
      }
      $('.logined').hide();
      $('.login_enter').show();
      $('.reg_enter').show();
      return false;
    });
  }
  initTopHeader();

  if (navigator.userAgent.match(/mobile/i)) {
    // 暂时不拦截
    //location.href = '../weixin/mp.html';
    //return false;
  }

  $(".keydown-focus").keydown(function(e) {
    if (e.keyCode == 13) {
      $('#keydown-focus-target').click();
    }
  });

  $(window).resize(function() {
    var windowHeight = $(window).height();

    $('.modal-body').not('.modal-body-auto-height').css('max-height', (windowHeight - 200) + 'px').css('overflow-y', 'auto');
  });
  $(window).resize();

  /* 鼠标移入保持按钮颜色(蓝色) */
  // $("button").mousemove(function() {
  //     $(this).css("background-color", "#005E9E");
  //     $(this).css("color", "#FFFFFF");
  // });
});

/* 设置弹出层位置 */
$(window).resize(function() {
  var height = $(window).height() / 2;
  var width = $(window).width() / 2;
  $(".modal-win").css("position", "absolute");
  $(".modal-win").css("top", (height - 120) + 'px');
  $(".modal-win").css("left", (width - 200) + 'px');
});

// 弹出层
function commonModal(modalTtile, messageDate) {
  $(".bs-example-modal-sm").modal('show');
  $("#mySmallModalLabel").html(modalTtile);
  $("#messageHint").html(messageDate);
}

//全局消息提示
$.confirm = function(tip, type) {
  var el = $('.el-dialog');
  if (!el.length) {
    $('body').append('<div tabindex="-1" role="dialog" aria-modal="true" aria-label="提示" class="el-dialog el-message-box__wrapper"><div class="el-message-box"><div class="el-message-box__header"><div class="el-message-box__title"><!----><span>提示</span></div><button type="button" aria-label="Close" class="el-message-box__headerbtn"><i class="el-message-box__close glyphicon glyphicon-remove el-icon-close"></i></button></div><div class="el-message-box__content"><img src="../images/icon/warning.svg" alt="" class="el-message-box__img"><div class="el-message-box__message"><p></p></div><div class="el-message-box__input" style="display: none;"><div class="el-input"><!----><input type="text" autocomplete="off" placeholder="" class="el-input__inner"><!----><!----><!----><!----></div><div class="el-message-box__errormsg" style="visibility: hidden;"></div></div></div><div class="el-message-box__btns"><button type="button" class="el-button el-button--default el-button--small cancel"><!----><!----><span>取消</span></button><button type="button" class="el-button el-button--default el-button--small el-button--primary confirm"><!----><!----><span>确定</span></button></div></div><div class="v-modal" tabindex="0" style="z-index: 2000;"></div></div>');
    el = $('.el-dialog');
  }
  $('p', el).html(tip);
  //$.event.trigger('delConfirm')
  el.unbind();
  el.delegate('.cancel, .el-message-box__close', 'click', function(){
    el.fadeOut();
  });
  el.delegate('.confirm', 'click', function(){
    $.event.trigger('delConfirm')
  });
  el.fadeIn();
}

//全局消息提示
$.message = function(tip, type) {
  var el = $('.el-message');
  if (!el.length) {
    $('body').append('<div class="el-message" style="z-index: 2006;display: none"><img src="../images/icon/info.svg" alt="" class="el-message__img"><div class="el-message__group"><p></p></div></div>');
    el = $('.el-message');
  }
  $('p', el).html(tip);
  if (type === 'ok') {
    $('.el-message__img', el).attr('src', '../images/icon/ok.svg');
  } else if (type === 'error') {
    $('.el-message__img', el).attr('src', '../images/icon/error.svg');
  } else if (type === 'warning') {
    $('.el-message__img', el).attr('src', '../images/icon/warning.svg');
  }
  el.fadeIn();
  setTimeout(function() {
    el.fadeOut();
  }, 3000);
}

//全局消息提示
$.notify = function(tip, title, type) {
  var el = $('.el-notification');
  if(!el.length) {
    $('body').append('<div class="el-notification" style="top: 16px; z-index: 2011;display: none"><img src="../images/icon/info.svg" alt="" class="el-notification__icon"><div class="el-notification__group"><h2 class="el-notification__title">提示</h2><div class="el-notification__content"></div><div class="el-notification__closeBtn el-icon-close">×</div></div></div>');
    el = $('.el-notification').last();
    $('.el-notification__closeBtn').click(function () {
      el.fadeOut();
    })
  }
  $('.el-notification__content', el).html(tip);
  $('h2', el).html(title || '提示');
  if (type === 'ok') {
    $('.el-notification__icon', el).attr('src', '../images/icon/ok.svg');
  } else if (type === 'error') {
    $('.el-notification__icon', el).attr('src', '../images/icon/error.svg');
  } else if (type === 'warning') {
    $('.el-notification__icon', el).attr('src', '../images/icon/warning.svg');
  }
  el.fadeIn();
  setTimeout(function() {
    el.fadeOut();
  }, 3000);
}

function _debounce (fn, delay, immediate) {
  var timer;
  return function () {
    var args = Array.prototype.slice.call(arguments);
    if (!timer&&immediate) {
      fn.apply(this, args);
    }
    if (timer) {
      clearTimeout(timer);
    }
    var self = this;
    timer = setTimeout(function () {
      timer = null
      if(!immediate){
        fn.apply(self, args);
      }
    }, delay);
  }
}

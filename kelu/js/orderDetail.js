// var externalUrl = 'http://localhost:3000/kelu/'
$(function(){
  init();

  $('#submitOrderBtn').on('click', _debounce(submitOrder, 1500, true));
  $('#downloadSL').on('click', downloadSL);
  $('#down2').on('click', function(){
    downloadSL(2)
  })
  // 保存物流信息
  $('#saveLogisticBtn').on('click', saveLogistic);
  // 录入物流信息
  $('#intoWitnessVideo').on('click', intoWitness);
  // 申请公证
  $('#applyBtn').on('click', applyFn);
  $('#cxqz').on('click', againQz)
})

function init () {
  getDetail();
}
// 前往公证处录入物流信息
function intoWitness () {
  $.ajax({
    url : externalUrl + 'tools/start-witness-video/into-logistics.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({order_id: getParam('order_id')}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        // window.location.reload();
        window.location.href = data.url
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}
// 提交物流信息
function saveLogistic (e) {
  if ($(e.target).html() == '保存') {
    var id = getParam('order_id'),
    data = {
      order_id: id, 
      expressage_company: $('#expressage_company').val(),
      tracking_number: $('#tracking_number').val()
    }
    var errorMsg = validSaveLogisticFn(data);
    if (errorMsg) {
      $.notify(errorMsg, '', 'error');
      return;
    }
    $.ajax({
      url : externalUrl + 'order/logistics/edit.json',
      type: 'post',
      contentType: "application/json; charset=utf-8",
      data : JSON.stringify(data),
      dataType : 'JSON',
      success : function(data){
        if(data.code === 0){
          //成功
          $(e.target).html('编辑')
          $('#expressage_company').attr('disabled', 'disabled')
          $('#tracking_number').attr('disabled', 'disabled')
          // window.location.reload();
          // window.location.href = data.url
        } else {
          $.notify(data.message, '', 'error');
        }
      }
    });
  } else {
    $('#expressage_company').prop('disabled', false)
    $('#tracking_number').attr('disabled', false)
    $(e.target).html('保存')
  }

}
function validSaveLogisticFn (form) {
    var validator = new Validator();
    // 添加验证规则
    validator.addArr(form.expressage_company, [
      { strategy: 'isNotEmpty', errorMsg: '请输入快递公司' },
      { strategy: 'minLength:2', errorMsg: '快递公司最少两位' }
    ]);
    validator.addArr(form.tracking_number, [
      { strategy: 'isNotEmpty', errorMsg: '请输入物流单号' }
    ]);
    var errorMsg = validator.start();
    return errorMsg;
}
// 提交订单
function submitOrder () {
  var id = getParam('order_id');
  console.log($('#checkBox').is(':checked'));
  if (!$('#checkBox').is(':checked')) {
    $.notify('请先阅读并勾选《委托办理公证书协议》', '', 'error')
    return;
  }
  $.ajax({
    url : externalUrl + 'order/affirm-order.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({order_id: id, agreement: $('#checkBox').is(':checked')}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        window.location.href = externalUrl + data.url;
        // window.location.href = data.url
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}
// 下载见证实录
function downloadSL (type) {
  var id = getParam('order_id');
  $.ajax({
    url : externalUrl + 'evidence/witness-video-download.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({order_id: id, type: type || 1}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        window.location.href = externalUrl + data.url
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}
function getPayType (type) {
  var text;
  switch (type+'') {
    case '1':
      text = '待付款';
      break;
    case '2':
      text = '已付款';
      break;    
    case '3':
    case '4':
      text = '待收货';
      break;
    case '5':
      text = '出证中';
      break;
    case '6':
      text = '已出证';
      break;
  }
  return text;
}
// 获取订单详情
function getDetail () {
  var id = getParam('order_id');
  sessionStorage.removeItem('order_id')
  $.ajax({
    url : externalUrl + 'order/details.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({order_id: id}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        var order_info = data.order_info;
        sessionStorage.setItem('order_id', order_info.order_id)
        // order_info.order_status = 5;
        $('.order_id').html(order_info.order_id);
        $('.order_time').html(order_info.order_time);
        $('.pay_time').html(order_info.pay_time);
        if(order_info.power_prove){ // 权利证明文件
          $('#fileDowm').attr('href', externalUrl + order_info.power_prove)
        }
        var type = order_info.order_status;

        if (order_info.order_type == 1) { // 自助购买
          $('#selfWrap').show();
          order_info.order_type_text = '自助';
          $('#title').html('订单信息-自助');
          $('.selfLi').show();
          $('.productTable').hide();
          if (type < 6) {
            $('#selfWrap').find('.stepItem').eq(type).addClass('currentStep').siblings().removeClass('currentStep');
            $('#selfWrap').find('.stepItem').eq(type).addClass('currentStep').prevAll().addClass('activeStep');    
          } else {
            $('#selfWrap').find('.stepItem').addClass('activeStep').siblings().removeClass('currentStep');
          }

          switch (type+'') {
            case '2': // 待付款
              $('#payContainer').show();
              $('.logistic').hide();
              break;
            case '3': // 待付款
            case '4': // 录入物流
            case '5': // 申请公证
              // $('.logistic').show();
              $('#logisticBtnWrap').show();
              if (type == 5) {
                $('#applyBtn').show() 
              }
              if(type == 3 && !order_info.goods_logistics_witness_video){
                $('#saveLogisticBtn').hide() 
              } else {
                $('.logistic').show();
              }
              break;
            // case '5': // 申请公证
              // $('.logistic').show();
              break;
            case '6': // 收取证书
              
              break;
          }
        } else { // 委托代理购买详情
          order_info.order_type_text = '委托';
          $('#title').html('订单信息-委托');
          $('#proxyWrap').show();
          if (type == 4) { // 已购买商品
            $('#proxyWrap').find('.stepItem').eq(3).addClass('currentStep').siblings().removeClass('currentStep');
            $('#proxyWrap').find('.stepItem').eq(3).prevAll().addClass('activeStep');
            // 显示申请公证按钮
            $('#logisticBtnWrap').show()
            $('#saveLogisticBtn').hide();
            $('#intoWitnessVideo').hide();
          } else if (order_info.order_status == 5) { // 证书出具中
            $('#proxyWrap').find('.stepItem').eq(4).addClass('currentStep').siblings().removeClass('currentStep');
            $('#proxyWrap').find('.stepItem').eq(4).prevAll().addClass('activeStep');

          } else if (order_info.order_status == 6) { // 收取整数
            $('#proxyWrap').find('.stepItem').addClass('activeStep').siblings().removeClass('currentStep');
          }
          // 购买的商品
          var trStr = ''
          goods_info = order_info.goods_info;
          for (var i = 0; i < goods_info.length; i++) {
            trStr += '<tr>' +
            '<td class="link"><div>' + goods_info[i].url + '</div></td>' +
            '<td class="type">' + goods_info[i].type + '</td>' +
            '<td class="price">' + goods_info[i].price + '</td>' +
            '<td class="note"><div>' + goods_info[i].remark + '</div></td>' +
          '</tr>'
          }
          $('#products').html(trStr);
        }
        $('.order_type').html(order_info.order_type_text);

        $('.order_status').html(getPayType(order_info.order_status));
        $('.goods_url').html(order_info.goods_url);
        $('.goods_name').html(order_info.goods_name);
        $('.order_amount').html(order_info.order_amount);
        $('.remark').html(order_info.remark);
        // 截图信息
        if (order_info.basic_info_screenshot) {
          var imgStr = '';
          for (var i = 0; i < order_info.basic_info_screenshot.length; i++) {
            imgStr += '<img src="' + externalUrl+order_info.basic_info_screenshot[i] + '" />'
          }
          $('#screenshot').html(imgStr)
        } else {
          $('#screenshot').html('')
        }
        // 发票信息
        $('.invoice_title').html(order_info.invoice_title);
        $('.duty_paragraph').html(order_info.duty_paragraph);
        $('.invoice_recipients').html(order_info.invoice_recipients);
        $('.invoice_mobile').html(order_info.invoice_mobile);
        $('.invoice_address').html(order_info.invoice_address);
        // 公证书信息 物流信息
        $('.notary_no').html(order_info.notary_no);
        $('.notary_logistics_company').html(order_info.notary_logistics_company);
        $('.notary_tracking_number').html(order_info.notary_tracking_number);
        $('.notary_recipients').html(order_info.notary_recipients);
        $('.notary_mobile').html(order_info.notary_mobile);
        $('.notary_address').html(order_info.notary_address);
        // 物流截图信息
        if (order_info.goods_logistics_screenshot) {
          var logImgSrc = '';
          for (var i = 0; i < order_info.goods_logistics_screenshot.length; i++) {
            logImgSrc += '<img src="' + externalUrl + order_info.goods_logistics_screenshot[i] + '" />'
          }
          $('#logisImgWrap').html(logImgSrc)
        } else {
          $('#logisImgWrap').html('')
        }
        // 物流信息
        if (order_info.notary_logistics_company) {
          $('#expressage_company').val(order_info.notary_logistics_company).attr('disabled', 'disabled');
          $('#tracking_number').val(order_info.notary_tracking_number).attr('disabled', 'disabled');
        }
        //成功
      } else if(data.code == 158){
        $('#errorInfo').html(data.message)
        $('#qzWrap').show();
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}

// 重新取证
function againQz () {
  var id = JSON.parse(sessionStorage.getItem('order_id'));
  $.ajax({
    url : externalUrl + 'tools/again-task.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({order_id: id, type: 1}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        window.location.href = data.url;
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}
// 申请公证
function applyFn () {
  var id = getParam('order_id');
  $.ajax({
    url : externalUrl + 'notary/apply-notary-book.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({order_id: id}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        window.location.reload();
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}

/**  
 * 获取指定的URL参数值  
 * 参数：paramName URL参数  
 * 调用方法:getParam("name")  
 * 返回值:tyler  
 */  
function getParam(paramName) {
  paramValue = "", isFound = !1;  
  if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {  
      arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&"), i = 0;  
      while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++  
  }  
  return paramValue == "" && (paramValue = null), paramValue  
}  

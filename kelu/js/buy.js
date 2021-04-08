// var externalUrl = 'kelu/'
var fileList1 = [], fileList2 = [];
$(function (){
  init();

  // 保存收货地址
  $('#saveAddress').click(saveAddressFunc)
  // 修改收货地址
  $('#editAddress').click(saveAddressFunc)
  // 地址列表下拉功能
  $('.addressIconfont').click(function (e) {
    var self = $(e.target);
    if (self.hasClass('iconfontUp')) {
      self.removeClass('iconfontUp');
      $('#adressTplWrap').css({height: '126px'})
    } else {
      self.addClass('iconfontUp');
      $('#adressTplWrap').css({height: 'auto'})
    }
  })
  // 开始取证点击
  $('#startBtn').on('click', _debounce(start, 2000, true));
  // 添加发票
  $('.addInvoiceBtn').on('click', addInvoice);
  // 添加地址
  $('.addAddressBtn').on('click', addAddress);
  // 保存发票信息
  $('#saveInvoice').click(saveInvoiceFunc)
  // 修改发票信息
  $('#editInvoice').click(saveInvoiceFunc)
  // 发票信息下拉
  $('.invoiceIconfont').click(function (e) {
    var self = $(e.target);
    if (self.hasClass('iconfontUp')) {
      self.removeClass('iconfontUp');
      $('#invoiceTplWrap').css({height: '180px'})
    } else {
      self.addClass('iconfontUp');
      $('#invoiceTplWrap').css({height: 'auto'})
    }
  })
  // 授权委托书上传
  $('#file2').change(function (e) {
    files = $('#file2').get(0).files;
    // fileList2 = files;
    var htmlStr = '';
    for (var i = 0; i < files.length; i++) {
      fileList2.push(files[i]);
    }
    for (var i = 0; i < fileList2.length; i++) {
      htmlStr += '<p><b>' + fileList2[i].name + '</b><a href="javascript:void(0)" onclick="delFile1(2, '+ i +')">×</a></p>'
    }
    console.log(htmlStr)
    $('#fileWrap2').html(htmlStr);
  })
  // 权利证明上传
  $('#file1').change(function (e) {
    // var formData = new FormData();
    var file = $('#file1').get(0).files[0],
    files = $('#file1').get(0).files;
    // fileList1 = files;
    // formData.append('file1', files);
    console.log('fileList1',fileList1);
    var htmlStr = '';
    for (var i = 0; i < files.length; i++) {
      fileList1.push(files[i]);    
    }
    for (var i = 0; i < fileList1.length; i++) {
      htmlStr += '<p><b>' + fileList1[i].name + '</b><a href="javascript:void(0)" onclick="delFile1(1, '+ i +')">×</a></p>'
    }
    console.log(htmlStr)
    $('#fileWrap1').html(htmlStr);
  })
  // 委托购买下单
  $('#proxyBtn').on('click', _debounce(proxySubmit, 1500, true))
  
})

function init () {
  sessionStorage.removeItem('invoiceList');
  sessionStorage.removeItem('addressList');
  getAddressList();
  getInvoiceList();
}
// 删除权利文件
function delFile1 (type, index) {

  var htmlStr = '';
  if (type == 1) {
    fileList1.splice(index, 1);
    for (var i = 0; i < fileList1.length; i++) {
      htmlStr += '<p><b>' + fileList1[i].name + '</b><a href="javascript:void(0)" onclick="delFile1(1, '+ i +')">×</a></p>'
    }
    console.log(htmlStr)
    $('#fileWrap1').html(htmlStr);
  } else {
    fileList2.splice(index, 1);
    for (var i = 0; i < fileList2.length; i++) {
      htmlStr += '<p><b>' + fileList2[i].name + '</b><a href="javascript:void(0)" onclick="delFile1(2, '+ i +')">×</a></p>'
    }
    console.log(htmlStr)
    $('#fileWrap2').html(htmlStr);
  }

}
// 选择收货地址
function selectAddress(id) {
  var addressList = JSON.parse(sessionStorage.getItem('addressList')),
      curAddress, index;
  for (var i = 0; item = addressList[i++];) {
    if (item.id == id) {
      index = i;
      curAddress = item;
    }
  }
  var midVar = JSON.parse(JSON.stringify(addressList[0]));
  addressList[0] = curAddress;
  addressList[index-1] = midVar;
  console.log('addressList', addressList, index, midVar)
  $('#adressTplWrap').html($("#addressTpl").tmpl(addressList));
  $('.addressIconfont').removeClass('iconfontUp');
  $('#adressTplWrap').css({height: '126px'})

  sessionStorage.setItem('addressList', JSON.stringify(addressList));
}
// 地址编辑事件
function handleClickAddressEdit (id) {
  console.log('handleClickAddressEdit', id);
  addAddress('edit', id);
  var addressList = JSON.parse(sessionStorage.getItem('addressList'));
  var curAddress;
  for (var i = 0; item = addressList[i++];) {
    if (item.id == id) {
      curAddress = item
    }
  }
  $('#addressName').val(curAddress.name);
  $('#addressMobile').val(curAddress.mobile);
  $('#addressSite').val(curAddress.site);
  $('#checked').attr('checked', curAddress.tacitly)
  console.log(curAddress);
  return false;
}
// 地址删除事件
function handleClickAddressDel (id) {
  console.log(id);
  $.ajax({
    url : externalUrl + 'order/notary-book-address/remove.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({id: id}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        $.notify('删除成功', '', 'ok');
        var addressList = JSON.parse(sessionStorage.getItem('addressList'));
        var curAddress;
        getAddressList()
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
  return false;
}

// 获取收货地址列表
function getAddressList () {
  sessionStorage.removeItem('addressList');
  $.ajax({
    url : externalUrl + 'order/notary-book-address/list.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        if (data.rows.length) {
          $('#adressTplWrap').show();
          data.rows.length == 1 ? $('.addressIconfont').hide() : $('.addressIconfont').show();
          sessionStorage.setItem('addressList', JSON.stringify(data.rows));
          $('#adressTplWrap').html($("#addressTpl").tmpl(data.rows));
        } else {
          $('#adressTplWrap').hide();
          $('.addressIconfont').hide();
        }
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}
// 选择收货地址
function selectInvoide(id) {
  var invoiceList = JSON.parse(sessionStorage.getItem('invoiceList')),
      curAddress, index;
  for (var i = 0; item = invoiceList[i++];) {
    if (item.id == id) {
      index = i;
      curAddress = item;
    }
  }
  var midVar = JSON.parse(JSON.stringify(invoiceList[0]));
  invoiceList[0] = curAddress;
  invoiceList[index-1] = midVar;
  console.log('invoiceList', invoiceList, index, midVar)
  $('#invoiceTplWrap').html($("#invoideTpl").tmpl(invoiceList));
  $('.invoiceIconfont').removeClass('iconfontUp');
  $('#invoiceTplWrap').css({height: '180px'})
  sessionStorage.setItem('invoiceList', JSON.stringify(invoiceList));
}
// 发票编辑事件
function handleClickInvoiceEdit (id) {
  console.log(id);
  addInvoice('edit', id);
  var invoiceList = JSON.parse(sessionStorage.getItem('invoiceList'));
  var curInvoice;
  for (var i = 0; item = invoiceList[i++];) {
    if (item.id == id) {
      curInvoice = item
    }
  }
  $('#invoiceTitle').val(curInvoice.invoice);
  $('#dutyParagraph').val(curInvoice.duty_paragraph);
  $('#invoiceName').val(curInvoice.name);
  $('#invoiceMobile').val(curInvoice.mobile);
  $('#invoiceSite').val(curInvoice.site);
  $('#invoiceChecked').attr('checked', curInvoice.tacitly)
  console.log(curInvoice);
  return false;
}
// 发票删除事件
function handleClickInvoiceDel (id) {
  console.log(id)
  $.ajax({
    url : externalUrl + 'order/invoice/remove.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({id: id}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        $.notify('删除成功', '', 'ok');
        getInvoiceList()
      } else {
        $.notify(data.message, '', 'error');
      }
    },
    fail: function () {
      $.notify('删除失败', '', 'error');
    }
  });
  return false;
}
// 获取发票信息列表
function getInvoiceList () {
  sessionStorage.removeItem('invoiceList');
  $.ajax({
    url : externalUrl + 'order/invoice/list.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        if (data.rows.length) {
          $('#invoiceTplWrap').show();
          data.rows.length == 1 ? $('.invoiceIconfont').hide() : $('.invoiceIconfont').show();
          sessionStorage.setItem('invoiceList', JSON.stringify(data.rows));
          $('#invoiceTplWrap').html($("#invoideTpl").tmpl(data.rows));
        } else {
          $('#invoiceTplWrap').hide();
          $('.invoiceIconfont').hide();
        }
      } else {
        $.notify(data.message, '', 'error');
      }
    }
  });
}

/** 委托购买 */
// 委托购买订单提交事件
function proxySubmit () {
  var goods_info = getProList(),
  shop_name = $('#shop_name').val(),
  agreement = $('#agreement').is(':checked');
  if (!shop_name) {
    $.notify('请先填写店铺名称', '', 'error');
    return;
  }
  if (shop_name.length < 2) {
    $.notify('店铺名称最少两位', '', 'error');
    return;
  }
  if (!goods_info.length) {
    $.notify('请先添加商品信息', '', 'error');
    return;
  }
  var proInput = $('#products').find('input[disabled]');
  var allProInput = $('#products').find('input');
  if (proInput.length != allProInput.length) {
    $.notify('请先保存商品', '', 'error');
    return;
  }
  console.log('proInput', proInput, proInput.length);
  if (!fileList1.length) {
    $.notify('请选择权利证明文件', '', 'error');
    return;
  }
  if (!fileList2.length) {
    $.notify('请选择授权委托书', '', 'error');
    return;
  }
  if (!agreement) {
    $.notify('请先阅读并勾选《委托购买协议》《委托办理公证书协议》', '', 'error');
    return;
  }
  var addressList = JSON.parse(sessionStorage.getItem('addressList'));
  var invoiceList = JSON.parse(sessionStorage.getItem('invoiceList'));
  console.log('s', invoiceList)
  if (!addressList || !addressList.length) {
    $.notify('请先添加公证书收货地址', '', 'error');
    return;
  }
  // if (!invoiceList || !invoiceList.length) {
  //   $.notify('请先添加发票信息', '', 'error');
  //   return;
  // }
  var formData = new FormData();
  formData.append('shop_name', shop_name);
  formData.append('goods_info', JSON.stringify(goods_info));
  for (var i = 0; i < fileList1.length; i++) {
    formData.append('power_prove_file', fileList1[i]);
  }
  for (var i = 0; i < fileList2.length; i++) {
    formData.append('power_attorney', fileList1[i]);
  }
  
  formData.append('notary_address_id', addressList[0].id);
  if (invoiceList && invoiceList.length) {
    formData.append('invoice_id', invoiceList[0].id);
  }
  formData.append('agreement', agreement);
  $.ajax({
    url : externalUrl + 'order/submit-entrust-order.json',
    type: 'post',
    contentType: false,
    processData: false,
    cache: false,
    data : formData,
    success : function(data){
      if(data.code === 0){
        //成功
        $.notify(data.message, '', 'ok');
         window.location.href = externalUrl + data.url;
      } else if (data.code == 154) {
        // $('.dialog-dropback').show();
        // $('.writePhone').show();
        // $('.addressInput').hide();
        // $('.voiceInput').hide();
      } else {
        $.notify(data.message, '', 'error');
      }
      return false;
    }
  });

  console.log('proArr', goods_info)
}
function getProList () {
  var domTr = $('#products').find('tr');
  var proArr = [],
      domTd,
      obj = {goods_url: '', goods_type: '', goods_money: '', remark: ''};
  if (domTr.length) {
    for (var i = 0; i < domTr.length; i++) {
      domTd = $(domTr[i]).find('td');
      obj['goods_url'] = $(domTd[0]).find('input').val();
      obj['goods_type'] = $(domTd[1]).find('input').val();
      obj['goods_money'] = $(domTd[2]).find('input').val();
      obj['remark'] = $(domTd[3]).find('input').val();
      proArr.push(obj);
    }
  }
  return proArr;
}
function validProInfo (form) {
  var validator = new Validator();
  // 添加验证规则
  validator.addArr(form.goods_url, [
    { strategy: 'isNotEmpty', errorMsg: '请输入商品链接' }
  ]);
  validator.addArr(form.goods_type, [
    { strategy: 'isNotEmpty', errorMsg: '请输入商品型号' }
  ]);
  validator.addArr(form.goods_money, [
    { strategy: 'isNotEmpty', errorMsg: '请输入商品价格' },
    { strategy: 'isNum', errorMsg: '价格请输入最多两位小数的正数' }
  ]);

  var errorMsg = validator.start();
  return errorMsg;
}
function editProduct (e) {
  var domTr = $('#products').find('tr');
  var innerHtml = $(e.target).html();
  var input = $(e.target).parent().parent().find('input');
  if (innerHtml == '编辑') {
    input.removeAttr('disabled');
    $(e.target).html('保存');
    $(e.target).siblings().html('取消');
    $(e.target).parent().css({'color': '#5C8CFA'});
  } else if (innerHtml == '保存') {
    console.log('input', input)
    var obj = {goods_url: '', goods_type: '', goods_money: '', remark: ''};
    obj.goods_url = $(input[0]).val();
    obj.goods_type = $(input[1]).val();
    $(input[2]).val(Number($(input[2]).val()).toFixed(2))
    obj.goods_money = $(input[2]).val();
    obj.remark = $(input[3]).val();
    var errorMsg = validProInfo(obj);
    if (errorMsg) {
      $.notify(errorMsg, '', 'error');
      return;
    }
    input.attr('disabled', true);
    $(e.target).html('编辑');
    $(e.target).siblings().html('删除');
    $(e.target).parent().css({'color': '#DD1D1D'});
    $(e.target).parent().parent().removeClass('newTr');
    // 累加商品价格及总价格
    var priceInput = $('#products').find('.price').find('input'),
    price = 0;    
    for (var i = 0; i < priceInput.length; i++) {
      price += parseFloat($(priceInput[i]).val())
    }
    $('#productPrice').html(price.toFixed(2));
    $('#allPrice').html((price + 1200).toFixed(2));
    console.log('price', price)
  } else if (innerHtml == '删除') {
    if (domTr.length <= 1) {
      $.notify('最后一条不能删除', '', 'error');
      return
    }
    $(e.target).parent().parent().remove();
  } else if (innerHtml == '取消') {
    if (domTr.length <= 1) {
      $.notify('最后一条不能取消', '', 'error');
      return
    }
    if ($(e.target).parent().parent().hasClass('newTr')) {
      $(e.target).parent().parent().remove();
    }
    input.attr('disabled', true);
    $(e.target).html('删除');
    $(e.target).siblings().html('编辑');
    $(e.target).parent().css({'color': '#DD1D1D'});
  }
}

// 添加商品
$('.addPro').on('click', function () {
  $('#products').append('<tr class="newTr">' +
          '<td class="link"><input type="text" value=""></td>' +
          '<td class="type"><input type="text" value=""></td>' +
          '<td class="price"><input type="text" value=""></td>' +
          '<td class="note"><input type="text" value=""></td>' +
          '<td class="operate" style="color: #5c8cfa;"><b class="edit">保存</b> <b class="del">取消</b></td>' +
        '</tr>')
})
// 收件地址验证
function validaAddressFunc (form) {
  var validator = new Validator();
  // 添加验证规则
  validator.addArr(form.name, [
    { strategy: 'isNotEmpty', errorMsg: '请输入您的姓名' },
    { strategy: 'minLength:2', errorMsg: '姓名最少两位' }
  ]);
  validator.addArr(form.mobile, [
    { strategy: 'isNotEmpty', errorMsg: '请输入您的手机号' },
    { strategy: 'mobileFormat', errorMsg: '手机号格式不正确' }
  ]);
  validator.addArr(form.site, [
    { strategy: 'isNotEmpty', errorMsg: '请输入您的收货地址' }
  ]);

  var errorMsg = validator.start();
  return errorMsg;
}

// 保存、修改收件地址
function saveAddressFunc () {
  var id = $('#addressId').val();
  console.log('das', id)
  var form = {
    name: $('#addressName').val(),
    mobile : $('#addressMobile').val(),
    site : $('#addressSite').val(),
    tacitly : $('#checked')[0].checked
  },
  url = externalUrl + 'order/notary-book-address/add.json';
  if (id) {
    form.id = id;
    url = externalUrl + 'order/notary-book-address/to-edit.json'
  }
  console.log('form', form)
  var errorMsg = validaAddressFunc(form);
  if (errorMsg) {
    $.notify(errorMsg, '', 'error');
    return;
  }
  $.ajax({
    url : url,
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(form),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        $.notify(data.message, '', 'ok');//消息提示 
        getAddressList();
        hideDia();
      } else {
        $.notify(data.message, '', 'error');
      }
      //失败
      return false;
    }
  });
}

// 发票信息验证
function validInvoiceFunc (form) {
  var validator = new Validator();
  // 添加验证规则
  validator.addArr(form.invoice_title, [
    { strategy: 'isNotEmpty', errorMsg: '请输入您的发票抬头' }
  ]);
  validator.addArr(form.duty_paragraph, [
    { strategy: 'isNotEmpty', errorMsg: '请输入您的税号' },
    { strategy: 'companyCodeFormat', errorMsg: '税号格式不正确' }
  ]);
  validator.addArr(form.name, [
    { strategy: 'isNotEmpty', errorMsg: '请输入收件人' },
    { strategy: 'minLength:2', errorMsg: '姓名最少两位' }
  ]);
  validator.addArr(form.mobile, [
    { strategy: 'isNotEmpty', errorMsg: '请输入您的手机号' },
    { strategy: 'mobileFormat', errorMsg: '手机号格式不正确' }
  ]);
  validator.addArr(form.site, [
    { strategy: 'isNotEmpty', errorMsg: '请输入您的收货地址' }
  ]);

  var errorMsg = validator.start();
  return errorMsg;
}
// 保存发票信息
function saveInvoiceFunc () {
  var id = $('#invoiceId').val();
  var form = {
    invoice_title : $('#invoiceTitle').val(),
    duty_paragraph : $('#dutyParagraph').val(),
    name : $('#invoiceName').val(),
    mobile : $('#invoiceMobile').val(),
    site : $('#invoiceSite').val(),
    tacitly : $('#invoiceChecked')[0].checked,
  },
  url = externalUrl + 'order/invoice/add.json';

  if (id) {
    form.id = id;
    url = externalUrl + 'order/invoice/edit.json';
  }
  console.log('form', form)
  var errorMsg = validInvoiceFunc(form);
  if (errorMsg) {
    $.notify(errorMsg, '', 'error');
    return;
  }
  $.ajax({
    url : url,
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify(form),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        hideDia();
        $.notify(data.message, '', 'ok');//消息提示 
        getInvoiceList();
      } else {
        $.notify(data.message, '', 'error');
      }
      return false;
    }
  });
}

function validStart () {
  var form = {
    goods_name: $('#goods_name').val(),
    goods_url: $('#goods_url').val()
  }
  var validator = new Validator();
  // 添加验证规则
  validator.addArr(form.goods_name, [
    { strategy: 'isNotEmpty', errorMsg: '请输入商品名称' },
    { strategy: 'minLength:2', errorMsg: '商品名称最少两位' }
  ]);
  validator.addArr(form.goods_url, [
    { strategy: 'isNotEmpty', errorMsg: '请输入商品链接' }
  ]);

  var errorMsg = validator.start();
  return errorMsg;
}
function writePhone() {
  if (!$('#buyerMobile').val()) {
    $.notify('请填写手机号', '', 'error');
    return;
  }
  if (!/^1[3-9]\d{9}$/.test($('#buyerMobile').val())) {
    $.notify('手机号格式不正确', '', 'error');
    return;
  }
  $.ajax({
    url : externalUrl + 'order/send-shipping-address.json',
    type: 'post',
    contentType: "application/json; charset=utf-8",
    data : JSON.stringify({mobile: $('#buyerMobile').val()}),
    dataType : 'JSON',
    success : function(data){
      if(data.code === 0){
        //成功
        hideDia();
        $.notify(data.message, '', 'ok');//消息提示 
        start();
      } else {
        $.notify(data.message, '', 'error');
      }
      return false;
    }
  });
}
// 开始取证
function start () {
  var errorMsg = validStart();
  if (errorMsg) {
    $.notify(errorMsg, '', 'error');
    return;
  }
  if (!fileList1.length) {
    $.notify('请选择权利证明文件', '', 'error');
    return;
  }
  if (!fileList2.length) {
    $.notify('请选择授权委托书', '', 'error');
    return;
  }
  var addressList = JSON.parse(sessionStorage.getItem('addressList'));
  var invoiceList = JSON.parse(sessionStorage.getItem('invoiceList'));
  if (!addressList || !addressList.length) {
    $.notify('请先添加公证书收货地址', '', 'error');
    return;
  }
  if (!invoiceList || !invoiceList.length) {
    $.notify('请先添加发票信息', '', 'error');
    return;
  }
  // var formData = new FormData($('#uploadForm')[0]); 
  var formData = new FormData(); 
  formData.append('goods_name', $('#goods_name').val());
  formData.append('goods_url', $('#goods_url').val());
  formData.append('remark', $('#remark').val());
  for (var i = 0; i < fileList1.length; i++) {
    formData.append('power_prove_file', fileList1[i]);
  }
  for (var i = 0; i < fileList2.length; i++) {
    formData.append('power_attorney', fileList1[i]);
  }
  
  console.log('formdata', formData, $('#uploadForm')[0]);
  formData.append('notary_address_id', addressList[0].id);
  formData.append('invoice_id', invoiceList[0].id);
  $.ajax({
    url : externalUrl + 'order/submit-self-help-order-info.json',
    type: 'post',
    contentType: false,
    processData: false,
    cache: false,
    data : formData,
    success : function(data){
      if(data.code === 0){
        //成功
        $.notify(data.message, '', 'ok');
        window.location.href = data.url;
      } else if (data.code == 154) {
        $('.dialog-dropback').show();
        $('.writePhone').show();
        $('.addressInput').hide();
        $('.voiceInput').hide();
      } else {
        $.notify(data.message, '', 'error');
      }
      return false;
    }
  });
}

function hideDia (e) {
  $('.dialog-dropback').hide();
}

// 新增发票
function addInvoice (type, id) {
  $('#invoiceTitle').val('');
  $('#dutyParagraph').val('');
  $('#invoiceName').val('');
  $('#invoiceMobile').val('');
  $('#invoiceSite').val('');

  $('.dialog-dropback').show();
  $('.writePhone').hide();
  $('.addressInput').hide();
  $('.voiceInput').show();
  if (type == 'edit') {
    $('#invoiceId').val(id);
  } else {
    $('#invoiceId').val('');
  }
}
// 新增收货地址
function addAddress (type, id) {
  $('#addressName').val('');
  $('#addressMobile').val('');
  $('#addressSite').val('');
  // $('#checked').attr('checked', false);

  $('.dialog-dropback').show();
  $('.writePhone').hide();
  $('.addressInput').show();
  $('.voiceInput').hide();
  if (type == 'edit') {
    $('#addressId').val(id);
  } else {
    $('#addressId').val('');
  }
}

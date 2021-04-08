function readIt(externalUrl, ids, on_result) {
    $.ajax({
        url : externalUrl + "message/sign-read.json",
        type : 'POST',
        data : JSON.stringify(ids),
        dataType : "json",
        contentType : 'application/json;charset=utf-8',
        cache : false,
        success : function(data) {
            return on_result(data);
        }
    });

    return false;
}

function getMsgList(externalUrl, params, message_status, on_result) {
    //message_status 1：已读 2：未读
    $.ajax({
        url : externalUrl + "message/page.json",
        type : 'POST',
        data : JSON.stringify(Object.assign(params, {
            message_status,
        })),
        dataType : "json",
        contentType : 'application/json;charset=utf-8',
        cache : false,
        success : function(data) {
            return on_result(data);
        }
    });
    return false;
}

function delMsg(externalUrl, ids, on_result) {
    $.ajax({
        url : externalUrl + "message/delete.json",
        type : 'POST',
        data : JSON.stringify(ids),
        dataType : "json",
        contentType : 'application/json;charset=utf-8',
        cache : false,
        success : function(data) {
            return on_result(data);
        }
    });

    return false;
}

$(function() {
  /*
  $.message('我是提示语');
  $.message('我是提示语', 'ok');
  $.message('我是提示语', 'warning');
  $.message('我是提示语', 'error');

  $.notify('我是提示语');
  $.notify('我是提示语', '提示', 'ok');
  $.notify('我是提示语', '警告', 'warning');
  $.notify('我是提示语', '错误', 'error');
  */
  
  // 参数
  var listParams = {
    page_no: 1,
    page_size: 10
  }

  var message_status = 0;

  var listParams_copy = Object.assign({}, listParams);

  // 渲染表格
  var renderTable = function(data) {
    if (data.code !== 0) {
      $.message(data.message, 'error');
      return;
    }
    var rows = data.rows;
    /*rows = [
      { id: '31211', time: '2019-10-01',  title: '商品名称', content: '商品名称商品名称商品名称', status: 1},
      { id: '31212', time: '2019-10-02',  title: '商品名称', content: '商品名称商品名称商品名称', status: 2},
    ];*/
    // $item代表当前的模板；$data代表当前的数据。
    if (rows.length){
      $('#table_body').html('');
      $("#table_tmpl").tmpl(rows, {
        getStatusText: function (status) {
          return this.data.status == 1 ? '已读' : '未读';
        },
      }).appendTo('#table_body');
      //翻页
      $(".pagenation").createPage({
        pageSize: data.page_size,
        current: data.page_no,
        total: data.total,
        backfun: function(e) {
          listParams_copy = Object.assign(listParams_copy, {
            page_no: e.current,
            page_size: e.pageSize
          });
          getMsgList(externalUrl, listParams_copy, message_status, renderTable);
        }
      });
    } else {
      $('#table_body').html(
        `<tr class="empty">
          <td colspan="7">
            <img src="./images/my/no_order.png">
          </td>
        </tr>`);
      $(".pagenation").hide();
    }
  }

  getMsgList(externalUrl, listParams, message_status, renderTable);

  // 标记已读
  $('.my_message').delegate(".read_it", "click", function(e){
    var tg = $(e.target);
    var orderId = tg.parent().attr('orderid');
    var ids = [];
    $('.msg_checkbox:checked').each(function(){
      ids.push($(this).attr('msgid'));
    });
    if (!ids.length) {
      $.message('请先选择消息', 'error');
      return
    }
    console.log(ids);
    readIt(externalUrl, ids, function(data){
      if (data.code===0) {
        getMsgList(externalUrl, listParams, message_status, renderTable);
        return
      }
      $.message(data.message, 'error');
    });
  });

  // 未读消息
  $('.my_message').delegate(".no_read_msg", "click", function(e){
    message_status = 2;
    getMsgList(externalUrl, listParams, message_status, renderTable);
  });

  // 全选
  $('.my_message').delegate("#all", "click", function(e){
    console.log($(this).prop('checked'))
    if ($(this).prop('checked')) {
      $('.msg_checkbox').prop('checked', true)
    }else{
      $('.msg_checkbox').prop('checked', false)
    }
  });
  // tbody中tr选择
  $('#table_body').delegate("tr", "click", function(e){
    var el = $('.msg_checkbox', $(this));
    var isChecked = el.prop('checked');
    console.log(isChecked)
    el.prop('checked', !isChecked)
  });

  // tbody中tr选择
  $('#table_body').delegate(".msg_checkbox", "click", function(e){
    e.stopPropagation();
  });
  
  var ids = [];
  // 删除
  $('.my_message').delegate(".del", "click", function(e){
    $('.msg_checkbox:checked').each(function(){
      ids.push($(this).attr('msgid'));
    });
    if (!ids.length) {
      $.message('请选择要删除的消息', 'error');
      return
    }
    $.confirm('确认删除吗？')
  });

  $(document).on('delConfirm', function(){
    delMsg(externalUrl, ids, function(data){
      if (data.code===0) {
        $.message('操作成功', 'ok');
        $('.el-dialog').fadeOut();
        getMsgList(externalUrl, listParams, message_status, renderTable);
        return
      }
      $.message(data.message, 'error');
    });
  })

});

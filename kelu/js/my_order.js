function deleteOrder(externalUrl, order_id, on_result) {
    $.ajax({
        url : externalUrl + "order/remove.json",
        type : 'POST',
        data : JSON.stringify({
            order_id
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


function getOrderList(externalUrl, params, on_result) {
    //1：注册验证码  2：修改密码验证码  3：实名认证验证码
    $.ajax({
        url : externalUrl + "order/page.json",
        type : 'POST',
        data : JSON.stringify(params),
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
    order_type: 0,
    order_status: 0,
    page_no: 1,
    page_size: 10
  }

  // 渲染表格
  var renderTable = function(data) {
    if (data.code !== 0) {
      $.message(data.message, 'error');
      return;
    }
    var rows = data.rows;
    /*rows = [
      { order_id: '31211', order_number: '545', order_time: '2019-10-01', order_type: 1,  order_name: '商品名称', order_money: '500.00', order_status: 1},
      { order_id: '31212', order_number: '546', order_time: '2019-10-02', order_type: 2,  order_name: '商品名称', order_money: '500.00', order_status: 2},
    ];*/
    // $item代表当前的模板；$data代表当前的数据。
    if (rows.length){
      $('#table_body').html('');
      $("#table_tmpl").tmpl(rows, {
        getOrderStatusText: function (status) {
          return this.data.order_status == 1 ? '待付款' : 'nn付款';
        },
        getOrderTypeText: function (type) {
          return this.data.order_type == 1 ? '自助' : '委托';
        }
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
          getOrderList(externalUrl, listParams_copy, renderTable);
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

  // 下拉框筛选
  var order_type= $('#order_type').val() - 0;
  var order_status= $('#order_status').val() - 0;
  var listParams_copy = Object.assign({}, listParams, {
    order_type,
    order_status
  });
  getOrderList(externalUrl, listParams_copy, renderTable);

  $('#order_type').change(function(e) {
    var v = $(this).val()-0;
    console.log(v)
    if(v != order_type){
      order_type = v;
      listParams_copy = Object.assign(listParams_copy, {
        order_type,
        page_no: 1
      });
      getOrderList(externalUrl, listParams_copy, renderTable);
    }
  });

  $('#order_status').change(function(e) {
    var v = $(this).val()-0;
    console.log(v)
    if(v != order_status){
      order_status = v;
      listParams_copy = Object.assign(listParams_copy, {
        order_status,
        page_no: 1
      });
      getOrderList(externalUrl, listParams_copy, renderTable);
    }
  })

  // 查看
  $('.my_order').delegate(".view", "click", function(e){
    var tg = $(e.target);
    var orderId = tg.parent().attr('orderid');
    location.href = `./orderDetail.html?order_id=${orderId}`;
  });

  // 删除
  var curOrderId = '';
  $('.my_order').delegate(".del", "click", function(e){
    var tg = $(e.target);
    curOrderId = tg.parent().attr('orderid');
    $.confirm('确认删除该订单吗？')
  });

  $(document).on('delConfirm', function(){
    var orderId = curOrderId;
    deleteOrder(externalUrl, orderId, function(data){
      if (data.code === 0) {
        $.message('操作成功', 'ok');
        $('.el-dialog').fadeOut();
        getOrderList(externalUrl, listParams_copy, renderTable);
      }else{
        $.message(data.message, 'error');
      }
    });
  })

});

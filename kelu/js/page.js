/* 
<div class="pagenation">
  <span class="total">共100条数据</span>
  <span class="prev disabled"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></span>
  <span class="cur">1</span><span>2</span><span>3</span><span>4</span><span class="ov">...</span><span>10</span>
  <span class="next"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></span>
  <select>
    <option value="10">10条/页</option>
    <option value="15">15条/页</option>
    <option value="20">20条/页</option>
    <option value="50">50条/页</option>
  </select>
  <span class="jump">跳至 <input type="text" name="">页</span>
</div>

//翻页
$(".pagenation").createPage({
  pageNum: 20,
  current: 6,
  total: 100,
  backfun: function(e) {
    //console.log(e);//回调
  }
});
*/
(function($) {
  var zp = {
    init: function(obj, pageinit) {
      return (function() {
        zp.addhtml(obj, pageinit);
        zp.bindEvent(obj, pageinit);
      }());
    },
    addhtml: function(obj, pageinit) {
      return (function() {
        pageinit.pageNum = pageinit.pageNum ? pageinit.pageNum : pageinit.total ? Math.ceil(pageinit.total/(pageinit.pageSize || 10)) : 10;
        console.log(pageinit)
        obj.empty().unbind();
        obj.append('<span class="total">共'+pageinit.total+'条数据</span>');
        if (pageinit.current > 1) {
          obj.append('<span class="prev"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></span>');
        } else {
          obj.append('<span class="prev disabled"><span class="glyphicon glyphicon-menu-left" aria-hidden="true"></span></span>');
        }
        if (pageinit.current > 4 && pageinit.pageNum > 4) {
          obj.append('<span class="page_num">1</span>');
          obj.append('<span class="page_num">2</span>');
          obj.append('<span class="ov">...</span>');
        }
        if (pageinit.current > 4 && pageinit.current <= pageinit.pageNum - 5) {
          var start = pageinit.current - 2
            , end = pageinit.current + 2;
        } else if (pageinit.current > 4 && pageinit.current > pageinit.pageNum - 5) {
          var start = pageinit.pageNum - 4
            , end = pageinit.pageNum;
        } else {
          var start = 1
            , end = 9;
        }
        for (; start <= end; start++) {
          if (start <= pageinit.pageNum && start >= 1) {
            if (start == pageinit.current) {
              obj.append('<span class="page_num cur">' + start + '</span>');
            } else if (start == pageinit.current + 1) {
              obj.append('<span class="page_num">' + start + '</a>');
            } else {
              obj.append('<span class="page_num">' + start + '</a>');
            }
          }
        }
        if (end < pageinit.pageNum) {
          obj.append('<span class="ov">...</span>');
        }
        if (pageinit.current >= pageinit.pageNum) {
          obj.append('<span class="next disabled"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></span>');
        } else {
          obj.append('<span class="next"><span class="glyphicon glyphicon-menu-right" aria-hidden="true"></span></span>');
        }
        obj.append('<select class="page_size"><option value="10">10条/页</option><option value="15">15条/页</option><option value="20">20条/页</option><option value="50">50条/页</option></select>');
        //obj.append('<span>' + '共' + '<b>' + pageinit.pageNum + '</b>' + '页，' + '</span>');
        obj.append('<span class="jump">跳至 <input type="text" name="" class="page_ipt" value="'+(pageinit.inputNum || '')+'">页</span>');
        //obj.append('<span class="zxfokbtn">' + '确定' + '</span>');
        $('select.page_size').val(pageinit.pageSize);
      }());
    },
    bindEvent: function(obj, pageinit) {
      return (function() {
        obj.on("click", ".prev", function() {
          if ($(this).hasClass('disabled')) {return}
          var cur = parseInt(obj.children("span.cur").text());
          var current = $.extend(pageinit, {
            "current": cur - 1
          });
          zp.addhtml(obj, current);
          if (typeof (pageinit.backfun) == "function") {
            pageinit.backfun(current);
          }
        });
        obj.on("click", ".page_num", function() {
          var cur = parseInt($(this).text());
          var current = $.extend(pageinit, {
            "current": cur
          });
          zp.addhtml(obj, current);
          if (typeof (pageinit.backfun) == "function") {
            pageinit.backfun(current);
          }
        });
        obj.on("click", ".next", function() {
          if ($(this).hasClass('disabled')) {return}
          var cur = parseInt(obj.children("span.cur").text());
          var current = $.extend(pageinit, {
            "current": cur + 1
          });
          zp.addhtml(obj, current);
          if (typeof (pageinit.backfun) == "function") {
            pageinit.backfun(current);
          }
        });
        obj.on("blur", ".page_ipt", function() {
          var num = $("input.page_ipt").val();
          var cur = parseInt(num);
          if (!num || cur>pageinit.pageNum) {return}
          var current = $.extend(pageinit, {
            "current": cur,
            "pageNum": pageinit.pageNum,
            "inputNum": cur,
          });
          zp.addhtml(obj, current);
          if (typeof (pageinit.backfun) == "function") {
            pageinit.backfun(current);
          }
        });
        obj.on("change", ".page_size", function() {
          console.log($(this).val())
          var page_size = parseInt($(this).val());
          var current = $.extend(pageinit, {
            "current": 1,
            "pageSize": page_size,
            "pageNum": 0,
            "inputNum": ''
          });
          zp.addhtml(obj, current);
          if (typeof (pageinit.backfun) == "function") {
            pageinit.backfun(current);
          }
        });
      }());
    }
  }
  $.fn.createPage = function(options) {
    var pageinit = $.extend({
      current: 1,
      backfun: function() {}
    }, options);
    zp.init(this, pageinit);
  }
}(jQuery));

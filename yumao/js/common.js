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

$(document).ready(function() {
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
    $("button").mousemove(function() {
        $(this).css("background-color", "#005E9E");
        $(this).css("color", "#FFFFFF");
    });
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

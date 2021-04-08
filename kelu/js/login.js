function loginRequest(externalUrl, account, loginPassword, userType, on_result) {
    $.ajax({
        url : externalUrl + "login.json",
        type : 'POST',
        data : JSON.stringify({
            login_name : account,
            login_pwd : loginPassword,
            type : userType
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

$(document).ready(function() {
    var externalUrl = 'http://localhost:3000/kelu/';//$('#external-url').val();
    var returnMapping = $('#return-mapping').val();
    var userType = '1';
    
    // tab切换
    $('.tab_label label').click(function(e) {
        console.log(e.target)
        var id = e.target.id;
        $('.tab_label label').removeClass('cur');
        $(this).toggleClass('cur');
        if (id == 1) {
            $('#dialog-qypart').removeClass('active');
            $('#dialog-grpart').addClass('active');
        } else {
            $('#dialog-grpart').removeClass('active');
            $('#dialog-qypart').addClass('active');
        }
        userType = id;
    });

    //登录
    $('.login-dialog .submit-login').click(function() {
        var accountField;
        var loginPasswordField;

        var account;
        var loginPassword;
        if (userType === "1") {
            accountField = $('.login-dialog #dialog-grpart .login-account');
            loginPasswordField = $('.login-dialog #dialog-grpart .login-login-password');

            account = accountField.val();
            loginPassword = loginPasswordField.val();
            if (!account) {
              $.message('请输入用户名', 'error');
              return;
            }
            if (!loginPassword) {
              $.message('请输入密码', 'error');
              return;
            }
        } else {
            accountField = $('.login-dialog #dialog-qypart .login-account');
            loginPasswordField = $('.login-dialog #dialog-qypart .login-login-password');

            account = accountField.val();
            loginPassword = loginPasswordField.val();
            if (!account) {
              $.message('请输入机构名称', 'error');
              return;
            }
            if (!loginPassword) {
              $.message('请输入密码', 'error');
              return;
            }
        }
                
        loginRequest(externalUrl, account, loginPassword, userType, function(data) {
            if (data.code === 0) {
                $.message('登录成功', 'ok');
                setTimeout(function(){
                  location.href = "./index.html";
                }, 1000);
                //window.location.href = externalUrl + "realname-auth.html?return_mapping=" + encodeURIComponent(encodeURIComponent("index.html"));
                return false;
            }
            $.message(data.message, 'error');
            return false;
        });
        return false;
    });
});

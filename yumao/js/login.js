function login(externalUrl, account, loginPassword, userType, on_result) {
    $.ajax({
        url : externalUrl + "login.json",
        type : 'POST',
        data : JSON.stringify({
            account : account,
            login_password : loginPassword,
            user_type : userType
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
    var externalUrl = $('#external-url').val();
    var returnMapping = $('#return-mapping').val();
    var userType = '1';
    
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
        } else {
            accountField = $('.login-dialog #dialog-qypart .login-account');
            loginPasswordField = $('.login-dialog #dialog-qypart .login-login-password');

            account = accountField.val();
            loginPassword = loginPasswordField.val();
        }
        
        login(externalUrl, account, loginPassword, userType, function(data) {
            if (data.code === 0) {
                $('#login-modal .close').click();
                window.location.href = externalUrl + "realname-auth.html?return_mapping=" + encodeURIComponent(encodeURIComponent("index.html"));
                return false;
            }
            alert(data.message);
            return false;
        });
        return false;
    });

    $('.login-frame .to-register').click(function() {
        window.location.href = externalUrl + "register.html";
        return false;
    });
    
    $(window).resize();
    $('.login-frame .submit-login').click(function() {
        //$(this).html('loading...');
        var $btn = $(this).button('loading');
        
        var accountField;
        var loginPasswordField;

        var account;
        var loginPassword;
        if (userType === "1") {
            accountField = $('.login-frame #grpart .login-account');
            loginPasswordField = $('.login-frame #grpart .login-login-password');

            account = accountField.val();
            loginPassword = loginPasswordField.val();
        } else {
            accountField = $('.login-frame #qypart .login-account');
            loginPasswordField = $('.login-frame #qypart .login-login-password');

            account = accountField.val();
            loginPassword = loginPasswordField.val();
        }
        login(externalUrl, account, loginPassword, userType, function(data) {
            if (data.code === 0) {
                window.location.href = externalUrl + returnMapping;
                return false;
            }
            commonModal("登录失败",data.message);
            //解开loading
            $btn.button('reset');
            return false;
        });
        return false;
    });
});

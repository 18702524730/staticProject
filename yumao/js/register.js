function register(externalUrl, username, loginPassword, affirmLoginPassword, userType, mobile, entUniCreditCode, entContactsRealname, entContactsMobile, mobileVerifycode, agreement, on_result) {
    $.ajax({
        url : externalUrl + "register.json",
        type : 'POST',
        data : JSON.stringify({
            username : username,
            login_password : loginPassword,
            affirm_login_password : affirmLoginPassword,
            user_type : userType,
            mobile : mobile,
            ent_uni_credit_code : entUniCreditCode,
            ent_contacts_realname : entContactsRealname,
            ent_contacts_mobile : entContactsMobile,
            mobile_verifycode : mobileVerifycode,
            agreement : agreement
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

    var userType = '1';

    $('.agreement').show();

    $('.agree-btn').click(function(e) {
        $('.agreement').hide();
    })
    
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

    $('.register-dialog .to-login').click(function() {
        $('#register-modal .close').click();
        $('#login-modal').modal();
        return false;
    });

    $('.register-dialog #dialog-grpart .get-verifycode').click(function() {
        var _this = $(this);

        var mobileField = $('.register-dialog .register-mobile');
        var mobile = mobileField.val();

        return sendVerifycode(externalUrl, mobile, function(data) {
            if (data.code === 0) {
                var count = 60;
                var intervalID = setInterval(function() {
                    _this.text(count + '秒后重新发送').prop('disabled', true);

                    if (count < 0) {
                        clearInterval(intervalID);
                        _this.text('重新发送').prop('disabled', false);
                    }

                    count--;
                }, 1000);
                return false;
            }
            alert(data.message);
            return false;
        });
    });

    $('.register-dialog #dialog-qypart .get-verifycode').click(function() {
        //点击按钮后锁定
        var _this = $(this);
        
        var _this = $(this);

        var mobileField = $('.register-dialog #dialog-qypart .register-ent-contacts-mobile');
        var mobile = mobileField.val();

        return sendVerifycode(externalUrl, mobile, function(data) {
            if (data.code === 0) {
                var count = 60;
                var intervalID = setInterval(function() {
                    _this.text(count + '秒后重新发送').prop('disabled', true);

                    if (count < 0) {
                        clearInterval(intervalID);
                        _this.text('重新发送').prop('disabled', false);
                    }

                    count--;
                }, 1000);
                //解开loading
                $btn.button('reset');
                return false;
            }
            alert(data.message);
            //解开loading
            $btn.button('reset');
            return false;
        });
    });

    $('.register-dialog .submit-register').click(function() {
        var usernameField;
        var loginPasswordField;
        var affirmLoginPasswordField;
        var mobileField;
        var entUniCreditCodeField;
        var entContactsRealnameField;
        var entContactsMobileField;
        var mobileVerifycodeField;
        var agreementField;

        var username;
        var loginPassword;
        var affirmLoginPassword;
        var mobile = "";
        var entUniCreditCode = "";
        var entContactsRealname = "";
        var entContactsMobile = "";
        var mobileVerifycode;
        var agreement;
        if (userType === "1") {
            usernameField = $('.register-dialog #dialog-grpart .register-username');
            loginPasswordField = $('.register-dialog #dialog-grpart .register-login-password');
            affirmLoginPasswordField = $('.register-dialog #dialog-grpart .register-affirm-login-password');
            mobileField = $('.register-dialog #dialog-grpart .register-mobile');
            mobileVerifycodeField = $('.register-dialog #dialog-grpart .register-mobile-verifycode');
            agreementField = $('.register-dialog .register-agreement');

            username = usernameField.val();
            loginPassword = loginPasswordField.val();
            affirmLoginPassword = affirmLoginPasswordField.val();
            mobile = mobileField.val();
            mobileVerifycode = mobileVerifycodeField.val();
            agreement = agreementField.prop('checked');
        } else {
            usernameField = $('.register-dialog #dialog-qypart .register-username');
            loginPasswordField = $('.register-dialog #dialog-qypart .register-login-password');
            affirmLoginPasswordField = $('.register-dialog #dialog-qypart .register-affirm-login-password');
            entUniCreditCodeField = $('.register-dialog #dialog-qypart .register-ent-uni-credit-code');
            entContactsRealnameField = $('.register-dialog #dialog-qypart .register-ent-contacts-realname');
            entContactsMobileField = $('.register-dialog #dialog-qypart .register-ent-contacts-mobile');
            mobileVerifycodeField = $('.register-dialog #dialog-qypart .register-mobile-verifycode');
            agreementField = $('.register-dialog .register-agreement');

            username = usernameField.val();
            loginPassword = loginPasswordField.val();
            affirmLoginPassword = affirmLoginPasswordField.val();
            entUniCreditCode = entUniCreditCodeField.val();
            entContactsRealname = entContactsRealnameField.val();
            entContactsMobile = entContactsMobileField.val();
            mobileVerifycode = mobileVerifycodeField.val();
            agreement = agreementField.prop('checked');
        }

        register(externalUrl, username, loginPassword, affirmLoginPassword, userType, mobile, entUniCreditCode, entContactsRealname, entContactsMobile, mobileVerifycode, agreement, function(data) {
            if (data.code === 0) {
                location.href = externalUrl + "login.html?return_mapping=" + encodeURIComponent(encodeURIComponent("original-works/index.html"));
                return false;
            }
            alert(data.message);
            return false;
        });
        return false;
    });

    $('.register-frame span[name="register-user-type"]').click(function() {
        if ('register-user-type-personal' === $(this).attr("id")) {
            $("#register-user-type-personal").attr('ischecked', true).css('border-bottom', '2px solid #007CC5');
            $("#register-user-type-enterprise").attr('ischecked', false).css('border-bottom', '2px solid #FFFFFF');

            $('.register-frame #qypart').removeClass('active');
            $('.register-frame #grpart').addClass('active');
        } else {
            $("#register-user-type-personal").attr('ischecked', false).css('border-bottom', '2px solid #FFFFFF');
            $("#register-user-type-enterprise").attr('ischecked', true).css('border-bottom', '2px solid #007CC5');

            $('.register-frame #grpart').removeClass('active');
            $('.register-frame #qypart').addClass('active');
        }
    });

    $('.register-frame .to-login').click(function() {
        window.location.href = externalUrl + "login.html";
        return false;
    });
    //个人验证码
    $('.register-frame #grpart .get-verifycode').click(function() {
        //点击按钮后锁定
        var $btn = $(this).button('loading');
        
        var _this = $(this);

        var mobileField = $('.register-frame .register-mobile');
        var mobile = mobileField.val();
        return sendVerifycode(externalUrl, mobile, function(data) {
            if (data.code === 0) {
                var count = 60;
                
                var intervalID = setInterval(function() {
                    _this.text(count + '秒后重新发送').prop('disabled', true);

                    if (count < 0) {
                        clearInterval(intervalID);
                        //解开loading
                        $btn.button('reset');
                        _this.text('重新发送').prop('disabled', false);
                    }

                    count--;
                }, 1000);
                
                return false;
            }
            //弹出层
            commonModal("获取验证码失败",data.message);
            //解开loading
            $btn.button('reset');
            return false;
        });
    });
    //企业验证码
    $('.register-frame #qypart .get-verifycode').click(function() {
        //点击按钮后锁定
        var $btn = $(this).button('loading');
        
        var _this = $(this);

        var mobileField = $('.register-frame #qypart .register-ent-contacts-mobile');
        var mobile = mobileField.val();
        return sendVerifycode(externalUrl, mobile, function(data) {
            if (data.code === 0) {
                var count = 60;
                var intervalID = setInterval(function() {
                    
                    _this.text(count + '秒后重新发送').prop('disabled', true);

                    if (count < 0) {
                        clearInterval(intervalID);
                        //解开loading
                        $btn.button('reset');
                        _this.text('重新发送').prop('disabled', false);
                    }

                    count--;
                }, 1000);
                return false;
            }
            //弹出层
            commonModal("获取验证码失败",data.message);
            //解开loading
            $btn.button('reset');
            return false;
        });
    });

    $('.register-frame .submit-register').click(function() {
        var $btn = $(this).button('loading');

        var userTypeField = $('.register-frame span[name="register-user-type"][ischecked="true"]');
        var userType = ('register-user-type-personal' === userTypeField.attr("id")) ? "1" : "2";
        var usernameField;
        var loginPasswordField;
        var affirmLoginPasswordField;
        var mobileField;
        var entUniCreditCodeField;
        var entContactsRealnameField;
        var entContactsMobileField;
        var mobileVerifycodeField;
        var agreementField;

        var username;
        var loginPassword;
        var affirmLoginPassword;
        var mobile = "";
        var entUniCreditCode = "";
        var entContactsRealname = "";
        var entContactsMobile = "";
        var mobileVerifycode;
        var agreement;
        if (userType === "1") {
            usernameField = $('.register-frame #grpart .register-username');
            loginPasswordField = $('.register-frame #grpart .register-login-password');
            affirmLoginPasswordField = $('.register-frame #grpart .register-affirm-login-password');
            mobileField = $('.register-frame #grpart .register-mobile');
            mobileVerifycodeField = $('.register-frame #grpart .register-mobile-verifycode');
            agreementField = $('.register-frame .register-agreement');

            username = usernameField.val();
            loginPassword = loginPasswordField.val();
            affirmLoginPassword = affirmLoginPasswordField.val();
            mobile = mobileField.val();
            mobileVerifycode = mobileVerifycodeField.val();
            agreement = agreementField.prop('checked');
        } else {
            usernameField = $('.register-frame #qypart .register-username');
            loginPasswordField = $('.register-frame #qypart .register-login-password');
            affirmLoginPasswordField = $('.register-frame #qypart .register-affirm-login-password');
            entUniCreditCodeField = $('.register-frame #qypart .register-ent-uni-credit-code');
            entContactsRealnameField = $('.register-frame #qypart .register-ent-contacts-realname');
            entContactsMobileField = $('.register-frame #qypart .register-ent-contacts-mobile');
            mobileVerifycodeField = $('.register-frame #qypart .register-mobile-verifycode');
            agreementField = $('.register-frame .register-agreement');

            username = usernameField.val();
            loginPassword = loginPasswordField.val();
            affirmLoginPassword = affirmLoginPasswordField.val();
            entUniCreditCode = entUniCreditCodeField.val();
            entContactsRealname = entContactsRealnameField.val();
            entContactsMobile = entContactsMobileField.val();
            mobileVerifycode = mobileVerifycodeField.val();
            agreement = agreementField.prop('checked');
        }

        register(externalUrl, username, loginPassword, affirmLoginPassword, userType, mobile, entUniCreditCode, entContactsRealname, entContactsMobile, mobileVerifycode, agreement, function(data) {
            if (data.code === 0) {
                location.href = externalUrl + "login.html?return_mapping=" + encodeURIComponent(encodeURIComponent("original-works/index.html"));
                return false;
            }
            commonModal("注册失败",data.message);
            //解开loading
            $btn.button('reset');
            return false;
        });
        return false;
    });
});

function registerRequest(externalUrl, username, loginPassword, affirmLoginPassword, userType, mobile, mobileVerifycode, agreement, on_result) {
    $.ajax({
        url : externalUrl + "register.json",
        type : 'POST',
        data : JSON.stringify({
            login_name : username,
            login_pwd : loginPassword,
            login_affirm_pwd : affirmLoginPassword,
            user_type : userType,
            mobile : mobile,
            //ent_uni_credit_code : entUniCreditCode,
            //ent_contacts_realname : entContactsRealname,
            //ent_contacts_mobile : entContactsMobile,
            verify_code : mobileVerifycode,
            agree_or_disagree : agreement
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

function sendVerifycode(externalUrl, mobile, type, on_result) {
		//1：注册验证码  2：修改密码验证码  3：实名认证验证码
    $.ajax({
        url : externalUrl + "common/send-verifycode.json",
        type : 'POST',
        data : JSON.stringify({
            mobile : mobile,
            type: type
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

    // 个人为1， 企业为2
    var userType = '1';

    // $('.agreement').show();

    $('.agree-btn').click(function(e) {
        $('.agreement').hide();
    })
    
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

    $('.register-dialog .to-login').click(function() {
        $('#register-modal .close').click();
        $('#login-modal').modal();
        return false;
    });

    // 个人获取短信验证码
    $('.register-dialog #dialog-grpart .get-verifycode').click(function() {
        var _this = $(this);
        if (_this.hasClass('disabled')) {
        	return;
        }

        var mobileField = $('.register-dialog .register-mobile');
        var mobile = mobileField.val();
        if (!mobile) {
          $.message('请输入注册手机号', 'error');
          return;
        } else if(!/^1\d{10}$/.test(mobile)) {
          $.message('手机号格式不正确', 'error');
          return;
        }

        return sendVerifycode(externalUrl, mobile, 1, function(data) {
          if (data.code === 0) {
            $.message('发送成功', 'ok');
            var count = 60;
            var intervalID = setInterval(function() {
              _this.text('重新发送('+ count + 's)').addClass('disabled');

              if (count < 0) {
                clearInterval(intervalID);
                _this.text('重新发送').removeClass('disabled');
              }

              count--;
            }, 1000);
            return false;
          }
          $.message(data.message, 'error');
          return false;
        });
    });


    // 企业获取短信验证码
    $('.register-dialog #dialog-qypart .get-verifycode').click(function() {
        //点击按钮后锁定
        var _this = $(this);
        if (_this.hasClass('disabled')) {
        	return;
        }

        var mobileField = $('.register-dialog #dialog-qypart .register-ent-contacts-mobile');
        var mobile = mobileField.val();

        return sendVerifycode(externalUrl, mobile, 1, function(data) {
          if (data.code === 0) {
            $.message('发送成功', 'ok');
            var count = 60;
            var intervalID = setInterval(function() {
                _this.text('重新发送('+ count + 's)').addClass('disabled');

                if (count < 0) {
                    clearInterval(intervalID);
                    _this.text('重新发送').removeClass('disabled');
                }

                count--;
            }, 1000);
            return false;
          }
          $.message(data.message, 'error');
          return false;
        });
    });

    // 同意条款并注册
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
            if (!username) {
              $.message('请输入用户名', 'error');
              return;
            }
            if (!loginPassword) {
              $.message('请设置登录密码', 'error');
              return;
            }
            if (!affirmLoginPassword) {
              $.message('请确认登录密码', 'error');
              return;
            }
            if (affirmLoginPassword !== loginPassword) {
              $.message('两次输入密码不一致', 'error');
              return;
            }
            if (!mobile) {
              $.message('请输入注册手机号', 'error');
              return;
            } else if(!/^1\d{10}$/.test(mobile)) {
              $.message('手机号格式不正确', 'error');
              return;
            }
            if (!mobileVerifycode) {
              $.message('请输入验证码', 'error');
              return;
            }
            if (!agreement) {
              $.message('请阅读并同意《网站服务条例》', 'error');
              return;
            }
        } else if (userType === "2") {
            usernameField = $('.register-dialog #dialog-qypart .register-username');
            loginPasswordField = $('.register-dialog #dialog-qypart .register-login-password');
            affirmLoginPasswordField = $('.register-dialog #dialog-qypart .register-affirm-login-password');
            entContactsMobileField = $('.register-dialog #dialog-qypart .register-ent-contacts-mobile');
            mobileVerifycodeField = $('.register-dialog #dialog-qypart .register-mobile-verifycode');
            agreementField = $('.register-dialog .register-agreement');

            username = usernameField.val();
            loginPassword = loginPasswordField.val();
            affirmLoginPassword = affirmLoginPasswordField.val();
            mobile = entContactsMobileField.val();
            mobileVerifycode = mobileVerifycodeField.val();
            agreement = agreementField.prop('checked');
            if (!username) {
              $.message('请输入机构名称', 'error');
              return;
            }
            if (!loginPassword) {
              $.message('请设置登录密码', 'error');
              return;
            }
            if (!affirmLoginPassword) {
              $.message('请确认登录密码', 'error');
              return;
            }
            if (affirmLoginPassword !== loginPassword) {
              $.message('两次输入密码不一致', 'error');
              return;
            }
            if (!mobile) {
              $.message('请输入注册手机号', 'error');
              return;
            } else if(!/^1\d{10}$/.test(mobile)) {
              $.message('手机号格式不正确', 'error');
              return;
            }
            if (!mobileVerifycode) {
              $.message('请输入验证码', 'error');
              return;
            }
            if (!agreement) {
              $.message('请阅读并同意《网站服务条例》', 'error');
              return;
            }
        }

        registerRequest(externalUrl, username, loginPassword, affirmLoginPassword, userType, mobile, mobileVerifycode, agreement, function(data) {
            if (data.code === 0) {
                $.message('注册成功', 'ok');
                setTimeout(function(){
                  location.href = "./login.html";
                }, 1000);
                return false;
            }
            $.message(data.message, 'error');
            return false;
        });
        return false;
    });
});

function forgetRequest(externalUrl, mobile, code, newPassword, confirmPassword, on_result) {
	$.ajax({
		url : externalUrl + "user/alter-password.json",
		type : 'POST',
		data : JSON.stringify({
			type: 2, //1为通过密码修改 2为通过手机号修改
			mobile : mobile,
			verify_code: code,
			new_password: newPassword,
			confirm_password: confirmPassword,
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

	// 获取短信验证码
	$('.forget-dialog .get-verifycode').click(function() {
		var _this = $(this);
		if (_this.hasClass('disabled')) {
			return;
		}

		var mobileField = $('.forget-dialog .login-account');
		var mobile = mobileField.val();

		if (!mobile) {
      $.message('请输入注册手机号', 'error');
      return;
    } else if(!/^1\d{10}$/.test(mobile)) {
      $.message('手机号格式不正确', 'error');
      return;
    }
		return sendVerifycode(externalUrl, mobile, 2, function(data) {
			if (data.code === 0) {
        $.message('验证码已发送', 'ok');
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
	
	// 下一步
	$('.forget-dialog .forget_next').click(function() {
		var mobile = $('.forget-dialog .login-account').val();
		var code = $('.forget-dialog .forget-mobile-verifycode').val();
		if (!mobile) {
      $.message('请输入注册手机号', 'error');
      return;
    } else if(!/^1\d{10}$/.test(mobile)) {
      $.message('手机号格式不正确', 'error');
      return;
    }
		if (!code) {
      $.message('请输入验证码', 'error');
      return;
    } else if(!/^\d{4}$/.test(code)) {
      $.message('验证码格式不正确', 'error');
      return;
    }
		$(this).parent().hide().next().show();
	});

	// 确认修改
	$('.login-dialog .forget_confirm').click(function() {
		var _self = this;
		var newPassword = $('.forget-dialog .login-login-password').val();
		var confirmPassword = $('.forget-dialog .login-confirm-password').val();
		if (!newPassword) {
      $.message('请输入新密码', 'error');
			return;
		}
		if (!confirmPassword) {
      $.message('请再次输入新密码', 'error');
			return;
		}
		if (confirmPassword !== newPassword) {
      $.message('两次输入密码不一致', 'error');
			return;
		}

		var mobile = $('.forget-dialog .login-account').val();
		var code = $('.forget-dialog .forget-mobile-verifycode').val();

		forgetRequest(externalUrl, mobile, code, newPassword, confirmPassword, function(data) {
			if (data.code === 0) {
				$(_self).parent().hide().next().show();
				return false;
			}
			$.message(data.message, 'error');
			return false;
		});
		return false;
	});
});

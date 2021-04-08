function forgetRequest(externalUrl, mobile, code, oldPassword, newPassword, confirmPassword, type, on_result) {
	$.ajax({
		url : externalUrl + "user/alter-password.json",
		type : 'POST',
		data : JSON.stringify({
			type: type, //1为通过密码修改 2为通过手机号修改
			mobile : mobile,
			verify_code: code,
			this_password: oldPassword,
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


function getUserInfo(externalUrl, on_result) {
	$.ajax({
		url : externalUrl + "user/get-user.json",
		type : 'POST',
		data : JSON.stringify({
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

function realName(externalUrl, params, on_result) {
  var formData = new FormData();
  Object.keys(params).forEach(function(name){
    formData.append(name, params[name]);
  });
  $.ajax({
    url : externalUrl + "user/real-name.json",
    type : 'POST',
    data : formData,
    dataType : "json",
    processData: false, // jQuery不要去处理发送的数据
    contentType: false, // jQuery不要去设置Content-Type请求头
    cache : false,
    success : function(data) {
      return on_result(data);
    }
  });
  return false;
}

// 修改头像
function updateHead(externalUrl, params, on_result) {
	var formData = new FormData();
	Object.keys(params).forEach(function(name){
	  formData.append(name, params[name]);
	});
	$.ajax({
		url : externalUrl + "user/update-head-portrait.json",
		type : 'POST',
		data : formData,
		dataType : "json",
		processData: false, // jQuery不要去处理发送的数据
		contentType: false, // jQuery不要去设置Content-Type请求头
		cache : false,
		success : function(data) {
			return on_result(data);
		},
    complete: function (XMLHttpRequest, textStatus) {
      var res = XMLHttpRequest.responseText;
      try {
        var jsonData = JSON.parse(res);
        if (jsonData.code === 2 || jsonData.code === 666) {
          // 不拦截跳登录
          // location.href="./login.html";
        }
      } catch (e) {}
    }
	});
	return false;
}

// 更新手机号
function updateMobile(externalUrl, params, on_result) {
  $.ajax({
    url : externalUrl + "user/update-mobile.json",
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

//选择图片，马上预览
function html5Preview(obj) {
	if (typeof FileReader == 'undefined') {
	  $.message('浏览器不支持图片上传预览', 'error');
	  return;
	}
	var file = obj.files[0];

	var reader = new FileReader();

	//读取文件过程方法
	reader.onloadstart = function (e) {
		console.log("开始读取....");
	}
	reader.onprogress = function (e) {
		console.log("正在读取中....");
	}
	reader.onabort = function (e) {
		console.log("中断读取....");
	}
	reader.onerror = function (e) {
		console.log("读取异常....");
	}
	reader.onload = function (e) {
		console.log("成功读取....");
		var img = $('img', $(obj).parent())[0];
		img.src = e.target.result;
		//或者 img.src = this.result;  //e.target == this
	}
	reader.readAsDataURL(file)
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
  
  var init = function() {
  	getUserInfo(externalUrl, function(data) {
  	  if (data.code === 0) {
  		var userInfo = data.user_info;
  		if (userInfo) {
  		  //全局
  		  window.UserInfo = userInfo;
  		  initInfo(userInfo);
  		}
  		return false;
  	  }
  	  $.message(data.message, 'error');
  	  return false;
  	});
  }
  
  init();

  // 初始化基本信息
  var initInfo = function(data) {
  	// 个人
  	if (data.type == 1) {
  	  $('.company_info').remove();
  	  $('#company_verify').remove();
  	  var c = $('.person_info').show();
  	  if (data.head_portrait_url) {
  		  $('.photo img', c).attr('src', externalUrl + data.head_portrait_url);
  	  }
  	  $('.username span', c).text(data.username||'');
  	  $('.true_name span', c).text(data.true_name || '');
  	  $('.id_number span', c).text(data.id_number|| '');
  	  $('.mobile span', c).text(data.mobile|| '');
  	  if (data.id_number_front_url) {
  		  $('.id_number_front img', c).attr('src', externalUrl + data.id_number_front_url);
  	  }
  	  if (data.id_number_verso_url) {
  		  $('.id_number_verso img', c).attr('src', externalUrl + data.id_number_verso_url);
  	  }
  	  if (data.real_name == 1) {
  		  $('.J_verify', c).hide();
  	  }else{
  		  $('.J_verify', c).show();
  	  }
  	}
  	if (data.type == 2) {
  	  $('.person_info').remove();
  	  $('#person_verify').remove();
  	  var c = $('.company_info').show();
  	  if (data.head_portrait_url) {
  		  $('.photo img', c).attr('src', externalUrl + data.head_portrait_url);
  	  }
  	  if (data.username) {
  		  $('.username span', c).text(data.username);
  	  }
  	  $('.id_number span', c).text(data.id_number || '');
  	  $('.contact_name span', c).text(data.contact_name || '');
  	  $('.mobile span', c).text(data.mobile|| '');
  	  if (data.real_name == 1) {
  		  $('.J_verify', c).hide();
  	  }else{
  		  $('.J_verify', c).show();
  	  }
  	}
  }

  // 上传头像注册事件
  $('.upload_photo').change(function(e){
    var head_portrait_file = $(this)[0].files[0];
    if (!head_portrait_file) {
      $.message('请上传头像', 'error');
      return;
    }
    var ret = {
      head_portrait_file
    };
    console.log(ret)
    updateHead(externalUrl, ret, function(data) {
      if (data.code === 0) {
        $.message('保存成功', 'ok');
        init();
        return false;
      }
      $('#upload_photo').val('');
      $.message(data.message, 'error');
    });
  });
  
  // 账号管理
  var titleEls = $('.title_wrap .title');
  if (titleEls.length) {
  	titleEls.click(function(e) {
  	  titleEls.removeClass('cur');
  	  $(this).addClass('cur');
  	  $('.base_info, .modify_pass').hide();
  	  var className = $(this).attr('for');
  	  $('.'+className).show();
  	})
  	// 修改密码切换
  	var changeTypeEls = $('.change_type span');
  	var type = 1;
  	changeTypeEls.click(function(e) {
  	  var id = e.target.id;
  	  changeTypeEls.removeClass('cur');
  	  $(this).addClass('cur');
  	  $('.type1, .type2').hide();
  	  var className = $(this).attr('for');
  	  $('.'+className).show();
  	  type = id;
  	});
  	// 获取短信验证码
  	$('.modify_pass .code').click(function() {
  		var _this = $(this);
  		if (_this.hasClass('disabled')) {
  		  return;
  		}

  		var mobileField = $('.modify_pass .mobile');
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
  	
  	// 修改保存
  	$('.modify_pass .J_modifyPwd').click(function() {
  		var _self = this;
  		if (type == 1) {
  		  var oldPassword = $('.type1 .this_password').val();
  		  var newPassword = $('.type1 .new_password').val();
  		  var confirmPassword = $('.type1 .confirm_password').val();
  		  console.log(oldPassword, newPassword, confirmPassword)
  		  if (!oldPassword) {
    			$.message('请输入当前密码', 'error');
    			return;
  		  }
  		  if (!newPassword) {
    			$.message('请输入新密码', 'error');
    			return;
  		  }
  		  if (!confirmPassword) {
    			$.message('请确认新密码', 'error');
    			return;
  		  }
  		  if (confirmPassword !== newPassword) {
    			$.message('再次输入新密码不一致', 'error');
    			return;
  		  }

  		} else if(type == 2) {
  		  var mobile = $('.type2 .mobile').val();
  		  var code = $('.type2 .verify_code').val();
  		  var newPassword = $('.type2 .new_password').val();
  		  var confirmPassword = $('.type2 .confirm_password').val();
  		  oldPassword = undefined;
  		  console.log(mobile, code, newPassword, confirmPassword)
  		  if (!mobile) {
    			$.message('请输入注册手机号', 'error');
    			return;
  		  }
  		  if(!/^1\d{10}$/.test(mobile)) {
    			$.message('手机号格式不正确', 'error');
    			return;
  		  }
  		  if (!code) {
    			$.message('请输入验证码', 'error');
    			return;
  		  }
  		  if (!newPassword) {
    			$.message('请输入新密码', 'error');
    			return;
  		  }
  		  if (!confirmPassword) {
    			$.message('请确认新密码', 'error');
    			return;
  		  }
  		  if (confirmPassword !== newPassword) {
    			$.message('再次输入新密码不一致', 'error');
    			return;
  		  }
  		}
  		forgetRequest(externalUrl, mobile, code, oldPassword, newPassword, confirmPassword, type, function(data) {
  			if (data.code === 0) {
  				$.message('修改成功', 'ok');
  				return false;
  			}
  			$.message(data.message, 'error');
  		});
  		return false;
  	});

  }

  // 修改手机号
  var modify_box = $('#modify_mobile');
  if (modify_box.length) {
    // 修改手机号入口
    $('.mobile i').click(function(){
      $('#modify_mobile').show();
      $('#modify_mobile .fir').show();
      $('#modify_mobile .fir .mobile').text(window.UserInfo.mobile);
      $('#modify_mobile .modify_success').hide();
    });

    var closeEls = $('#modify_mobile .close');
    // 弹框关闭
    closeEls.click(function(e) {
      $('#modify_mobile').hide();
      init();
    });
    // 修改手机号 第一步点击
    $('.next', modify_box).click(function(e) {
      var verify_code = $('.verify_code', modify_box).val();
      if (!verify_code) {
        $.message('请输入验证码', 'error');
        return;
      } else if(!/^\d{4}$/.test(verify_code)) {
        $.message('验证码格式不正确', 'error');
        return;
      }
      $('#modify_mobile .fir').hide();
      $('#modify_mobile .sec').show();
    });
    // 修改手机号 第二步提交点击
    $('.submit', modify_box).click(function(e) {
      var mobile = $('.mobile_new', modify_box).val();
      var verify_code = $('.verify_code', modify_box).val();
      var verify_code_new = $('.verify_code_new', modify_box).val();

      if (!mobile) {
        $.message('请输入注册手机号', 'error');
        return;
      } else if(!/^1\d{10}$/.test(mobile)) {
        $.message('手机号格式不正确', 'error');
        return;
      }
      if (!verify_code_new) {
        $.message('请输入验证码', 'error');
        return;
      } else if(!/^\d{4}$/.test(verify_code_new)) {
        $.message('验证码格式不正确', 'error');
        return;
      }

      var ret = {
        verifycode_original: verify_code,
        verifycode_new: verify_code_new,
        mobile,
      };
      console.log(ret)
      updateMobile(externalUrl, ret, function(data) {
        //if (data.code === 0) {
          $('.sec', modify_box).hide();
          $('.modify_success', modify_box).show();
          return false;
        //}
        $.message(data.message, 'error');
      });
    });
    // 修改手机号 老手机号获取短信验证码
    $('.code_ori', modify_box).click(function() {
      var _this = $(this);
      if (_this.hasClass('disabled')) {
        return;
      }
      var mobileField = $('.mobile', modify_box);
      var mobile = mobileField.text();
      if (!mobile) {
        $.message('异常，手机号不存在', 'error');
        return;
      }
      return sendVerifycode(externalUrl, mobile, 4, function(data) {
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
    // 修改手机号 新手机号获取短信验证码
    $('.code_new', modify_box).click(function() {
      var _this = $(this);
      if (_this.hasClass('disabled')) {
        return;
      }
      var mobileField = $('.mobile', modify_box);
      var mobile = mobileField.text();
      if (!mobile) {
        $.message('异常，手机号不存在', 'error');
        return;
      }
      return sendVerifycode(externalUrl, mobile, 5, function(data) {
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
  }

  // 个人 实名认证按钮
  var p_verifyEls = $('.person_info .J_verify');
  if (p_verifyEls.length) {
  	var closeEls = $('#person_verify .close');
  	// 弹框关闭
  	closeEls.click(function(e) {
  	  $('#person_verify').hide();
  	  init();
  	});

  	// 实名认证弹框显示
  	p_verifyEls.click(function(e) {
  	  $('#person_verify').show();
  	  $('#person_verify .fir').show();
  	  $('#person_verify .fir .mobile').text(window.UserInfo.mobile);
  	  $('#person_verify .ver_success').hide();
  	});
  	var c = $('#person_verify');
  	// 获取短信验证码
  	$('.code', c).click(function() {
  		var _this = $(this);
  		if (_this.hasClass('disabled')) {
  		  return;
  		}

  		var mobileField = $('.mobile', c);
  		var mobile = mobileField.text();
  		if (!mobile) {
  		  $.message('异常，手机号不存在', 'error');
  		  return;
  		}
  		return sendVerifycode(externalUrl, mobile, 3, function(data) {
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
  	// 提交点击
  	$('.fir .submit', c).click(function(e) {
  	  var name = $('.name', c).val();
  	  var id_number = $('.id_number', c).val();
  	  var id_number_front = $('.id_number_front', c)[0].files[0];
  	  var id_number_verso = $('.id_number_verso', c)[0].files[0];
  	  var mobile = $('.mobile', c).text();
  	  var verify_code = $('.verify_code', c).val();
  	  console.log(name, id_number, id_number_front, id_number_verso, verify_code)
  	  if (!name) {
    		$.message('请输入姓名', 'error');
    		return;
  	  }
  	  if (!id_number) {
    		$.message('请输入身份证号', 'error');
    		return;
  	  }
  	  if (!id_number_front) {
    		$.message('请上传身份证人像页', 'error');
    		return;
  	  }
  	  if (!id_number_verso) {
    		$.message('请上传身份证国徽页', 'error');
    		return;
  	  }
  	  if (!verify_code) {
    		$.message('请输入验证码', 'error');
    		return;
  	  }
  	  var ret = {
    		name,
    		id_number,
    		id_number_front,
    		id_number_verso,
    		mobile,
    		verify_code
  	  };
  	  console.log(ret)
  	  realName(externalUrl, ret, function(data) {
    		if (data.code === 0) {
    		  $('.fir', c).hide();
    		  $('.ver_success', c).show();
    		  return false;
    		}
    		$.message(data.message, 'error');
  	  });
  	});
  }

  // 企业 实名认证按钮
  var c_verifyEls = $('.company_info .J_verify');
  if (c_verifyEls.length) {
  	var closeEls = $('#company_verify .close');
  	// 弹框关闭
  	closeEls.click(function(e) {
  	  $('#company_verify').hide();
  	  init();
  	});

  	// 实名认证弹框显示
  	c_verifyEls.click(function(e) {
  	  $('#company_verify').show();
  	  $('#company_verify .fir').show();
  	  $('#company_verify .sec').hide();
  	  $('#company_verify .ver_success').hide();
  	  $('#company_verify .fir .name').val(window.UserInfo.username);
  	});
  	var c = $('#company_verify');
  	var name;
  	var unified_social_credit_code;
  	var legal_person_name;
  	var business_license_file;
  	// 第一步点击
  	$('.next', c).click(function(e) {
  	  name = $('.name', c).val();
  	  unified_social_credit_code = $('.unified_social_credit_code', c).val();
  	  legal_person_name = $('.legal_person_name', c).val();
  	  business_license_file = $('.business_license_file', c)[0].files[0];
  	  if (!name) {
    		$.message('请输入机构名称', 'error');
    		return;
  	  }
  	  if (!unified_social_credit_code) {
    		$.message('请输入统一社会信用代码证', 'error');
    		return;
  	  }
  	  if (!legal_person_name) {
    		$.message('请输入法人姓名', 'error');
    		return;
  	  }
  	  if (!business_license_file) {
    		$.message('请上传营业执照', 'error');
    		return;
  	  }
  	  $('#company_verify .fir').hide();
  	  $('#company_verify .sec').show();
  	  $('#company_verify .sec .mobile').text(window.UserInfo.mobile);
  	});
  	// 获取短信验证码
  	$('.code', c).click(function() {
  		var _this = $(this);
  		if (_this.hasClass('disabled')) {
  		  return;
  		}

  		var mobileField = $('.mobile', c);
  		var mobile = mobileField.text();
  		if (!mobile) {
  		  $.message('异常，手机号不存在', 'error');
  		  return;
  		}
  		return sendVerifycode(externalUrl, mobile, 3, function(data) {
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
  	// 第二步身份切换
  	$('.sec .tab', c).click(function(e) {
  	  $(this).addClass('cur').siblings().removeClass('cur');
  	});
  	// 第二步提交点击
  	$('.submit', c).click(function(e) {
  	  var contact_type = $('.contact_type.cur', c).attr('tp');
  	  var contact_name = $('.contact_name', c).val();
  	  var id_number = $('.id_number', c).val();
  	  var id_number_front = $('.id_number_front', c)[0].files[0];
  	  var id_number_verso = $('.id_number_verso', c)[0].files[0];
  	  var mobile = $('.mobile', c).text();
  	  var verify_code = $('.verify_code', c).val();
  	  if (!contact_name) {
  		  $.message('请输入联系人姓名', 'error');
  		  return;
  	  }
  	  if (!id_number) {
  		  $.message('请输入身份证号', 'error');
  		  return;
  	  }
  	  if (!id_number_front) {
  		  $.message('请上传身份证人像页', 'error');
  		  return;
  	  }
  	  if (!id_number_verso) {
  		  $.message('请上传身份证国徽页', 'error');
  		  return;
  	  }
  	  if (!verify_code) {
  		  $.message('请输入验证码', 'error');
  		  return;
  	  }
  	  var ret = {
    		name,
    		card_type: 2,
    		unified_social_credit_code,
    		legal_person_name,
    		business_license_file,
    		contact_type,
    		contact_name,
    		id_number,
    		id_number_front,
    		id_number_verso,
    		mobile,
    		verify_code
  	  };
  	  console.log(ret)
  	  realName(externalUrl, ret, function(data) {
    		if (data.code === 0) {
    		  $('.sec', c).hide();
    		  $('.ver_success', c).show();
    		  return false;
    		}
    		$.message(data.message, 'error');
  	  });
  	});
  }

});

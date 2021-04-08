// 验证规则策略对象
const strategys = {
  // 为空
  isNotEmpty: function (value, errorMsg) {
    if (value === '' || value === undefined) {
      return errorMsg;
    }
  },
  // 最小长度
  minLength: function (value, length, errorMsg) {
    if (value.length < length) {
      return errorMsg;
    }
  },
  // 手机号验证
  mobileFormat: function (value, errorMsg) {
    var reg = /^1[3-9]\d{9}$/;
    if (!reg.test(value)) {
      return errorMsg;
    }
  },
  // 身份证 
  idCardFormat: function (value, errorMsg) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (!reg.test(value)) {
      return errorMsg;
    }
  },
  // 正数
  isNum: function (value, errorMsg) {
    var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    // var reg = /^(0\.0*[1-9]+[0-9]*$|[1-9]+[0-9]*\.[0-9]*[0-9]$|[1-9]+[0-9]*$)|^0$/;
    if (!reg.test(value)) {
      return errorMsg;
    }
  },
  // 统一信用代码 
  companyCodeFormat: function (value, errorMsg) {
    var reg = /(^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$)|([0-9A-Za-z]{15})/;
    if (!reg.test(value)) {
      return errorMsg;
    }
  },
  // 商标注册号验证
  trademarkFormat: function (value, errorMsg) {
    var reg = /^[a-zA-Z0-9]{4,12}$/;
    if (!reg.test(value)) {
      return errorMsg;
    }
  }
}

function Validator () {
  this.cache = [];
}
Validator.prototype = {
  constructor: Validator,
  addArr: function (value, rules) {
    var self = this;
    for (var i = 0, rule; rule = rules[i++];) {
      (function(rule){
        var errorMsg = rule.errorMsg,
            r = rule.strategy;
        var str = r.split(':');
        self.cache.push(() => {
          var strate = str.shift();
          str.unshift(value);
          str.push(errorMsg);
          return strategys[strate].apply(value, str);
        })
      })(rule)
    }
  },
  start: function () {
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
      var msg = validatorFunc();
      if (msg) {
        return msg;
      }
    }
  }
}


// 利用闭包的特性，判断是否已经存在实例
var instance;

function Dialog(config) {

    this.title = config.title ? config.title : '这是标题';
    this.content = config.content ? config.content : '这是提示内容';

    this.html = '<div class="dialog-dropback">' +
        '<div class="diaContainer">' +
            '<div class="head">'+ this.title +'</div>' +
            '<div class="content">'+ this.content +'</div>' +
            '<div class="footer">' +
                '<button class="cancel">取消</button>' +
                '<button class="confirm">确认</button>' +
            '</div>' +
        '</div>' +
    '</div>'
}

Dialog.prototype = {
    constructor: Dialog,
    show: function() {
        var _this = this;
        if (instance) {
            this.destory();
        }
        $(this.html).appendTo($(document.body));
        instance = this;

        return new Promise(function(resolve, reject) {
            $('.dialog-dropback .cancel').on('click', function(e) {
                _this.hide();
                reject(e);
            })

            $('.dialog-dropback .confirm').on('click', function(e) {
                _this.hide();
                resolve(e);
            })
        })
    },

    destory: function() {
        instance = null;
        $('.dialog-dropback .cancel').off('click');
        $('.dialog-dropback .confirm').off('click');
        $('.dialog-dropback').remove();
    },

    hide: function() {
        this.destory();
    }
}














// class Dialog {
//   constructor (config) {
//     this.instance = null;
//     this.title = config.title ? config.title : '弹框';
//     this.content = config.content;
//     this.html = `<div class="dialog-dropback">
//                   <div class="diaContainer">
//                     <div class="head">${this.title}</div>
//                     <div class="footer">
//                       <button class="cancel">取消</button>
//                       <button class="confirm">确认</button>
//                     </div>
//                   </div>
//                 </div>`
//   }
//   show () {
//     var _this = this;
//     if (this.instance) {
//         this.destory();
//     }
//     $(this.html).appendTo($(document.body));
//     this.instance = true;

//     return new Promise(function(resolve, reject) {
//         $('.dialog-dropback .cancel').on('click', function(e) {
//             console.log('1')
//             _this.hide();
//             reject(e);
//         })

//         $('.dialog-dropback .confirm').on('click', function(e) {
//             _this.hide();
//             resolve(e);
//         })
//     })
//   }
//   destory () {
//     console.log('des')
//     this.instance = null;
//     $('.dialog-dropback .cancel').off('click');
//     $('.dialog-dropback .confirm').off('click');
//     $('.dialog-dropback').remove();
//   }
//   hide () {
//       console.log('hide')
//       this.destory();
//   }
// }

// export { Dialog } 

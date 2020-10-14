$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新密码验证
        samePwd: function (value) {
            if (value === $('input[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        rePwd: function (value) {
            if (value !== $('input[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }


    })

    // 监听表单的提交事件
    $('.layui-form').submit(function (e) {
        e.preventDefault();
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message || '重置密码失败')
                }
                layer.msg('更新密码成功');

                // 重置密码
                $('.layui-form')[0].reset();


            }
        })
    })
})
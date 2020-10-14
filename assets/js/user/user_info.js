$(function () {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称的长度必须在1~6个字符之间'
            }
        }

    });

    initUserInfo()
    // 获取用户的信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg('获取用户信息失败');
                    return;
                }
                console.log(res);
                //调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }
        })
    }
    // 重置表单里的数据
    $('#btnReset').on('click', function (e) {
        // 阻止表单的重置行为
        e.preventDefault();
        // 重新调用
        initUserInfo();
    });

    // 监听表单的提交事件
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    layer.msg(res.message || '更新失败');
                    return;
                }
                layer.msg('更新用户信息成功！');
                // 调用父页面中的方法渲染头像和用户信息
                window.parent.getUserInfo();

            }


        })
    })



})
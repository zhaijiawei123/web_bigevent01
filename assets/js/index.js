$(function () {
    getUserInfo();
    // 给退出按钮绑定点击事件
    var layer = layui.layer;
    $('.btnLongout').on('click', function () {
        layer.confirm('是否确定退出？', { icon: 3, title: '提示' }, function (index) {
            // 清空本地存储token
            localStorage.removeItem('token');
            // 跳转到登录页面
            location.href = 'login.html'
            // 关闭询问框
            layer.close(index);
        });
    })




})
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        //   headers: {
        //     Authorization: localStorage.getItem('token') || ''
        //   },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                layui.layer.msg('获取用户信息失败');
                return;
            }
            // 调用 renderAvatar 渲染用户头像
            renderAvatar(res.data);
        },
        // //ajax 请求无论成功还是失败都会调用
        // complete: function (res) {
        //     console.log(res.responseJSON);
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         // 清空本地存储
        //         localStorage.removeItem('token');
        //         // 强制跳转到登录页面
        //         location.href = 'login.html'
        //     }
        // }

    })
}
//   渲染用户头像
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username;
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 按照需求渲染用户的头像
    if (user.user_pic !== null) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase();
        $('.text-avatar').html(first).show();
    }

}
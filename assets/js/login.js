$(function () {
    // 给‘去注册’绑定点击事件
    $('#link_reg').on('click', function () {
        $('.login_box').hide();
        $('.reg_box').show();
    });
    // 给‘去登录’绑定点击事件
    $('#link_login').on('click', function () {
        $('.login_box').show();
        $('.reg_box').hide();
    });
    // 自定义校验规则
    //如果需要去自定义校验规则，我们先要得到form模块对象
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 验证两次密码是否一样
        repwd: function (value) {
            var pwd = $('.reg_box [name=password]').val();
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    });


    // 监听注册表单的提交事件
    $('#form-reg').on('submit', function (e) {
        // 阻止表单的默认行为
        e.preventDefault();
        // 发起 post请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg_box [name="username"]').val(),
                password: $('.reg_box [name="password"]').val(),
            },
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    layer.msg(res.message || '注册失败');
                    return;
                }
                layer.msg('注册成功,去登陆');
                // 模拟点击行为
                $('#link_login').click();
            }
        })
    });

    // 监听登录表单提交事件
    $('#form-login').submit(function (e) {
        // 阻止表单的默认行为
        e.preventDefault();
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    layer.msg(res.message || '登录失败');
                    return;

                }
                layer.msg('登录成功');
                // 将登陆成功得到的token字符串保存到localStroage中
                localStorage.setItem('token', res.token);
                //跳转页面 后台主页
                location.href = 'index.html'
            }
        })
    })

})
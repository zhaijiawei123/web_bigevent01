$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();

    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    };
    // 为添加类别按钮绑定一个点击事件
    var indexadd = null;
    $('#btnAddCate').on('click', function () {
        indexadd = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        });
    });
    // 通过代理的方式来监听表单的提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败');
                }
                // 添加成功后 重新获取文章列表
                initArtCateList();
                layer.msg('新增分类成功');
                // 根据索引关闭相应的弹出层
                layer.close(indexadd);

            }
        })
    });
    // 通过代理的方式来监听 编辑按钮 的点击事件
    var indexedit = null;
    $('tbody').on('click', '#btn-edit', function () {
        indexedit = layer.open({
            type: 1,
            area: ['500px', '300px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        });
        var id = $(this).attr('data-Id');
        // 发起请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // console.log(res);
                form.val('form-edit', res.data)
            }
        })
    });
    // 通过代理的方式为 编辑的弹出层 绑定一个 submit 事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功');
                // 根据索引关闭编辑弹出层
                layer.close(indexedit);
                // 更新成功后 重新获取文章列表
                initArtCateList();
            }
        })
    });
    // 通过代理的方式为删除按钮绑定一个点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id');
        layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功');
                    // 关闭弹出框
                    layer.close(index);
                    // 重新获取文章列表
                    initArtCateList();
                }
            })

           
        });

    })


})
$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (timess) {
        var data = new Date(timess);

        var y = data.getFullYear();
        var m = padZero(data.getMonth() + 1);
        var d = padZero(data.getDate());

        var hh = padZero(data.getHours());
        var mm = padZero(data.getMinutes());
        var ss = padZero(data.getSeconds());

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n

    }


    var q = {
        pagenum: 1,//页码值,默认为第一页
        pagesize: 2,//每页显示多少条数据,每页默认为2条数据
        cate_id: '',//文章分类的 Id
        state: '',//文章的状态
    };

    initTable();
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                // 使用模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用分页的方法
                renderPage(res.total)
            }
        })
    };

    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章数据失败')
                }

                // 调用模板引擎
                var htmStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmStr);
                // 通过layui重新渲染表单区域的ui结构
                form.render();
            }
        })
    };

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 获取表单中选中的值
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 为查询对象q 重新赋值
        q.cate_id = cate_id;
        q.state = state;
        // 根据最新条件重新渲染数据
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用laypage.render()方法来渲染分页结构
        laypage.render({
            elem: 'pageBox',//分页容器id
            count: total,//数据总数
            limit: q.pagesize,//每页显示的条数
            curr: q.pagenum,//起始页
            layout: ["count", "limit", "prev", "page", "next", "refresh", "skip"],
            limits: [2, 3, 5, 7, 9],
            theme: '#006400',
            // 当分页被切换时触发，会触发jump回调
            jump: function (obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值赋给 q 查询参数对象中
                q.pagenum = obj.curr;
                // 把最新的每页条目数 赋值给 q 查询参数对象中
                q.pagesize = obj.limit

                // 只有通过点击页码的时候才执行
                // 获取数据
                if (!first) {
                    initTable();
                }
            }

        });

        // 通过代理的方式为删除按钮绑定一个点击事件
        $('tbody').on('click', '.btn-delete', function () {
            // 获取页面中按钮的长度
            var len = $('.btn-delete').length;
            console.log(len);
            // 获取id
            var id = $(this).attr('data-id');
            // 询问用户是否确定删除
            layer.confirm('是否确定删除?', { icon: 3, title: '提示' }, function (index) {
                $.ajax({
                    method: 'GET',
                    url: '/my/article/delete/' + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg('删除失败')
                        }
                        layer.msg('删除成功');
                        if (len === 1) {
                            // 如果len=1， 表明删除完毕后，页面中没有数据了
                            // 页码之最小为1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                        }
                        // 重新获取数据
                        initTable();

                    }
                })
                // 关闭弹出层
                layer.close(index);
            });
        })
    }
})
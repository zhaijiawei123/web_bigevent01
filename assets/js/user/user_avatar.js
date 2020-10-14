$(function () {
    var layer = layui.layer;
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 给上传按钮绑定一个点击事件
    $('#imageChoose').on('click', function () {
        $('#file').click();
    })

    // 给文件选择框绑定一个 change  事件
    $('#file').change(function (e) {
        // 获取用户选择的文件
        var fileList = e.target.files;
        if (fileList.length === 0) {
            return layui.msg('请选择图片')
        }
        // 拿到用户选择的文件
        var file = e.target.files[0];
        // 将文件转为路径
        var imgUrl = URL.createObjectURL(file);
        //  重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgUrl) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })
    // 给确定按钮绑定一个人点击事件
    $('#btnSure').on('click', function () {
        // 拿到用户裁剪后的头像
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png');
        // 上传到服务器
        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataURL
            },
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('上传头像失败')
                }
                layer.msg('上传头像成功');
                // 调用父级方法
                window.parent.getUserInfo();

            }
        })
    })
})
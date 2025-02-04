function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
        .then(() => {
            // 替换 alert 为更友好的提示
            const toast = document.createElement('div');
            toast.className = 'toast-message';
            toast.textContent = '链接已复制到剪贴板！';
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 2000);
        })
        .catch(err => {
            console.error('复制失败：', err);
            alert('复制失败，请手动复制链接');
        });
}

function shareToWechat() {
    // 可以使用微信SDK实现
    alert('请复制链接到微信分享');
}

function shareToQQ() {
    try {
        // 使用新的QQ分享链接格式
        const currentUrl = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        const summary = encodeURIComponent("清风团队X辉达");
        window.open(`mqqapi://share/to_fri?src_type=web&version=1&file_type=news&url=${currentUrl}&title=${title}&description=${summary}`);
    } catch (error) {
        console.error('分享到QQ失败：', error);
        alert('分享失败，请稍后重试');
    }
}

function shareToWeibo() {
    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`http://service.weibo.com/share/share.php?url=${currentUrl}&title=${title}`);
}

function shareToSkype() {
    try {
        const currentUrl = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`skype:?chat&topic=${title}&text=${currentUrl}`);
    } catch (error) {
        console.error('分享到Skype失败：', error);
        alert('分享失败，请稍后重试');
    }
}

// 添加全局错误处理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('错误: ', msg, 'URL: ', url, '行号: ', lineNo);
    // 可以添加错误上报逻辑
    return false;
}; 
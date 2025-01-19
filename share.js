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
        const currentUrl = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`http://connect.qq.com/widget/shareqq/index.html?url=${currentUrl}&title=${title}`);
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

// 添加全局错误处理
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('错误: ', msg, 'URL: ', url, '行号: ', lineNo);
    // 可以添加错误上报逻辑
    return false;
}; 
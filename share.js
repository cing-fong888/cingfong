function copyLink() {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl)
        .then(() => alert('链接已复制到剪贴板！'))
        .catch(err => console.error('复制失败：', err));
}

function shareToWechat() {
    // 可以使用微信SDK实现
    alert('请复制链接到微信分享');
}

function shareToQQ() {
    const currentUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`http://connect.qq.com/widget/shareqq/index.html?url=${currentUrl}&title=${title}`);
} 
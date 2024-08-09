document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
        const button = document.createElement('button');
        button.className = 'copy-button';

        // 使用 Material 风格的图标
        button.innerHTML = '<i class="material-icons">content_copy</i>'; // 使用 Material Icons

        button.onclick = () => {
            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                showToast('复制成功！'); // 显示提示
            });
        };

        codeBlock.parentNode.insertBefore(button, codeBlock);

        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';
    });
});

// 显示提示的函数
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 2000); // 2秒后移除
}

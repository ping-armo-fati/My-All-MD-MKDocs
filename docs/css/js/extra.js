document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
        const button = document.createElement('button');
        button.innerText = 'copy';
        button.className = 'copy-button';

        button.onclick = () => {
            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                alert('已复制到剪贴板！');
            });
        };

        // 将按钮添加到代码块的父元素
        codeBlock.parentNode.insertBefore(button, codeBlock);

        // 设置按钮的样式
        button.style.position = 'absolute';
        button.style.top = '10px'; // 距离顶部
        button.style.right = '10px'; // 距离右侧
    });
});

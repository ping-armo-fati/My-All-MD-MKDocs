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
        codeBlock.parentNode.insertBefore(button, codeBlock);
    });
});

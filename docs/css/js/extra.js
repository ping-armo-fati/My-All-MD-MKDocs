var copy_icon = `
<svg t="1723201903148" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4254" width="30" height="30"><path d="M853.333333 981.333333h-384c-72.533333 0-128-55.466667-128-128v-384c0-72.533333 55.466667-128 128-128h384c72.533333 0 128 55.466667 128 128v384c0 72.533333-55.466667 128-128 128z m-384-554.666666c-25.6 0-42.666667 17.066667-42.666666 42.666666v384c0 25.6 17.066667 42.666667 42.666666 42.666667h384c25.6 0 42.666667-17.066667 42.666667-42.666667v-384c0-25.6-17.066667-42.666667-42.666667-42.666666h-384z" p-id="4255"></path><path d="M213.333333 682.666667H170.666667c-72.533333 0-128-55.466667-128-128V170.666667c0-72.533333 55.466667-128 128-128h384c72.533333 0 128 55.466667 128 128v42.666666c0 25.6-17.066667 42.666667-42.666667 42.666667s-42.666667-17.066667-42.666667-42.666667V170.666667c0-25.6-17.066667-42.666667-42.666666-42.666667H170.666667c-25.6 0-42.666667 17.066667-42.666667 42.666667v384c0 25.6 17.066667 42.666667 42.666667 42.666666h42.666666c25.6 0 42.666667 17.066667 42.666667 42.666667s-17.066667 42.666667-42.666667 42.666667z" p-id="4256"></path></svg>
`;



document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
        const button = document.createElement('button');
        button.className = 'copy-button';

        // 使用 Material 风格的图标
        button.innerHTML = copy_icon; // 使用 Font Awesome 图标


        button.onclick = () => {
            navigator.clipboard.writeText(codeBlock.innerText).then(() => {
                showToast('复制成功！'); // 显示提示
            });
        };

        codeBlock.parentNode.insertBefore(button, codeBlock);

        button.style.position = 'absolute';
        button.style.top = '-0.3rem';
        button.style.right = '1rem';
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

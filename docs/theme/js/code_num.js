document.addEventListener('DOMContentLoaded', function() {
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach((codeBlock) => {
        const lines = codeBlock.innerText.split('\n').length;
        let lineNumbers = '<div class="line-numbers">';
        for (let i = 1; i <= lines; i++) {
            lineNumbers += `<span>${i}</span>`;
        }
        lineNumbers += '</div>';

        // 创建代码块的容器
        const codeContainer = document.createElement('div');
        codeContainer.className = 'code-container';
        codeContainer.innerHTML = lineNumbers; // 添加行号
        codeContainer.appendChild(codeBlock.parentNode); // 添加代码块

        // 替换原有代码块
        codeBlock.parentNode.replaceWith(codeContainer);
    });
});

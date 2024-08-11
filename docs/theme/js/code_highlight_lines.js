document.addEventListener('DOMContentLoaded', function() {
    // 选择所有的代码块
    var codeBlocks = document.querySelectorAll('pre code');

    // 为每个代码块的行添加点击事件
    codeBlocks.forEach(function(block) {
        var lines = block.innerHTML.split('\n');
        var highlightLine = -1; // 用于记录当前高亮的行

        // 为每一行代码包裹元素，并添加点击事件
        lines.forEach(function(line, index) {
            var lineElement = document.createElement('span');
            lineElement.className = 'code-line';
            lineElement.textContent = line;
            lineElement.addEventListener('click', function() {
                // 移除之前的高亮
                block.querySelectorAll('.highlight').forEach(function(prevLine) {
                    prevLine.classList.remove('highlight');
                });
                // 高亮当前行
                lineElement.classList.add('highlight');
                // 记录当前高亮的行
                highlightLine = index;
            });
            block.innerHTML = ''; // 清空原有的代码内容
            block.appendChild(lineElement);
        });

        // 为代码块添加样式
        block.classList.add('highlightable');
    });
});

// 添加CSS样式
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    .highlightable .code-line.highlight {
        background-color: #FFFF99; /* 黄色高亮背景 */
        display: block;
    }
    .highlightable .code-line {
        display: block;
    }
`;
document.head.appendChild(style);
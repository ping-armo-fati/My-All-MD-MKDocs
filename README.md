# My-All-MD-MKDocs

my all markdown files to create 
a html by MkDocs and commit to read the docs, 

##  install MKDocs

``` shell
pip install mkdocs
# init
mkdocs new my-project
cd my-project
# serve
mkdocs serve
```
## To be Done
- .md 文件名、路径名中不能有中文
  - 因为windows路径编码GMK与python的utf-8冲突、乱码
- unused img修补
  - 打印未使用的img
  - 编辑对应的md文件
  - 再次测试
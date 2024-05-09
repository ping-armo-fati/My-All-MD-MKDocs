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

## 主题

### 其他

> 总体
> 
> https://github.com/mkdocs/mkdocs/wiki/MkDocs-Themes
> 
> 可选
> 
> https://siphalor.github.io/mkdocs-custommill/#customization/
> https://github.com/daizutabi/mkdocs-ivory
> https://squidfunk.github.io/mkdocs-material/creating-your-site/
> 
>

### materials for Mkdocs

- Install

```shell
pip install mkdocs-material
```

- 设置导航
  ```yaml
  # 设置主题
  theme:
  name: material
  # 锚跟踪
  features:
    - navigation.tracking      
  # 顶端路径
    - navigation.path
  # 节索引页
    - navigation.indexes
  # 锚跟随
    - toc.follow
  ```
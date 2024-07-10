# 软件包









## Python详细进阶知识及技巧

- <https://blog.csdn.net/xiaolinyui/article/details/137351381>

## 模块编写&安装

- 包结构

```sh
my_package/
├── __init__.py
├── module_a.py
└── module_b.py
```

- `__init__.py`例程

```python
# 导入 module_a 中的 public_function 函数
from .module_a import public_function

# 定义一个新的函数，它将被公开给导入 my_package 的任何模块
def package_wide_function():
    print("A function defined in __init__.py and available across the package.")
```

### 使用方法&安装

- Python项目架构

> [包（Package）、模块（Module）和类（Class）这些部分构成](https://zhuanlan.zhihu.com/p/335347908)[1](https://zhuanlan.zhihu.com/p/335347908)：
>
> - [**包（Package）**：可以看成文件夹，可以包含多个模块。如果让普通文件夹变成Python的包，在该文件夹下必须包含`__init__.py`文件。`__init__.py`也是一个特殊的模块，模块名就是包名](https://zhuanlan.zhihu.com/p/335347908)[1](https://zhuanlan.zhihu.com/p/335347908)。
> - [**模块（Module）**：可以看成文件，对应Python中的`.py`文件。一个模块下面也可以包含多个类。模块下面也可以直接写函数](https://zhuanlan.zhihu.com/p/335347908)[1](https://zhuanlan.zhihu.com/p/335347908)。
> - [**类（Class）**：类中定义了变量和函数](https://zhuanlan.zhihu.com/p/335347908)[1](https://zhuanlan.zhihu.com/p/335347908)。
>
> [在Python项目中，文件命名需要遵循以下基本规则](https://zhuanlan.zhihu.com/p/335347908)[2](https://bing.com/search?q=python放置的文件名)：
>
> - 文件名使用小写字母，可以包含数字和下划线。
> - 文件名必须以`.py`扩展名结尾，表示该文件为Python脚本。
>
> [在Python项目中，通常会有以下几种类型的文件](https://zhuanlan.zhihu.com/p/341842461)[3](https://zhuanlan.zhihu.com/p/341842461)：
>
> - [`main.py`：项目的入口文件，每次启动项目从这里开始](https://zhuanlan.zhihu.com/p/618340649)[4](https://zhuanlan.zhihu.com/p/618340649)。
> - [`app.py`：FastAPI的APP定义脚本](https://zhuanlan.zhihu.com/p/335347908)[4](https://zhuanlan.zhihu.com/p/618340649)。
> - [`run.py`：执行`app.py`的脚本](https://zhuanlan.zhihu.com/p/335347908)[4](https://zhuanlan.zhihu.com/p/618340649)。
> - [`__init__.py`：用来标识该文件夹是一个包。导入包或包下的模块时，`__init__.py`文件被自动执行](https://zhuanlan.zhihu.com/p/618340649)[4](https://zhuanlan.zhihu.com/p/618340649)。



- 同一目录下

```python
# script.py
from my_package import package_wide_function, module_b_function

package_wide_function()  # 调用包中定义的函数
module_b_function()  # 调用模块 B 中定义的函数
```

- 添加环境变量

```makefile
export PYTHONPATH="/path/to/my_package/parent_directory:$PYTHONPATH"
```

- 安装-1

  - 安装为一个可全局访问的 Python 包，放置到 Python `site-packages` 目录中，目录通常位于 Python 的安装目录下。
  -  `site-packages` 目录的方法是在命令行中运行：

  ```shell
  python -m site --user-site
  ```

  - 将包复制到该目录下

- 安装-2

  - 通过pip指令安装
  - `my_package` 的根目录中创建一个 `setup.py` 文件，并使用 `setuptools` 打包工具。
  - `setup.py` 文件的一个基本示例：

  ```python
  from setuptools import setup, find_packages
  
  setup(
      name='my_package',
      version='0.1',
      packages=find_packages(),
      install_requires=[
          # 这里可以列出依赖的其他包
      ],
  )
  ```

  - 安装or全局安装

  ```shell
  pip install .
  pip install -e .
  ```

  - 如果您正在开发包并希望进行可编辑安装（这样您可以在不重新安装的情况下测试更改），可以使用：
  
  ```shell
  pip install -e /path/to/my_package
  ```
  
  - 分发
  
    - 创建一个源分发包（`.tar.gz` 文件）：这将在 `dist` 目录下创建一个 `.tar.gz` 文件。
  
    ```shell
    python setup.py sdist
    ```
  
    - 对应本地安装
  
    ```shell
    pip install /path/to/my_package/dist/my_package-0.1.tar.gz
    # 可编辑模式
    pip install -e /path/to/my_package
    ```
  
    

### 安装包与环境

在系统中全局安装一个 Python 软件包时，它会被安装到系统级别的 Python 环境中。这意味着，如果系统中有多个 Python （例如，系统自带的 Python、conda base  环境和自定义环境），全局安装的软件包只会对您在安装时使用的 Python 版本可见。

在激活了 conda base 环境的情况下使用 `pip` 安装了一个包，那么该包将被安装到 conda base 环境中的 `site-packages` 目录中。如果您在没有激活任何环境的情况下使用 `pip` 安装了一个包，那么它将被安装到当前 shell 会话中激活的 Python 版本的 `site-packages` 目录中。要查看当前激活的 Python 版本和 `site-packages` 目录的位置：

若使用`conda install`	安装了一个python包，那么无论是否在base环境下，都会安装在，`ananconda3/pkgs`路径下

```shell
python --version
pip show package_name
```

- 全局安装or可修改安装

> `pip install .` 和 `pip install -e .` 这两个命令都是用来安装 Python 包的，但是它们的工作方式有所不同：
>
> - `pip install .`：这个命令会将包安装到 Python 的 site-packages 目录中。如果你在安装后修改了包的源代码，那么你需要重新安装才能看到更改的效果。
> - [`pip install -e .`（或 `pip install --editable .`）：这个命令会在 site-packages 目录中创建一个指向你的包的源代码目录的链接。这意味着你可以在不重新安装的情况下修改源代码，并立即看到更改的效果。这对于开发和测试新功能非常有用](https://blog.csdn.net/robot_learner/article/details/128946745)[1](https://blog.csdn.net/robot_learner/article/details/128946745)。

## 关于依赖项和`requirmensts.txt`

- 生成requirments.txt
  - [Python基础：生成requirements.txt文件 ](https://www.bilibili.com/read/cv33254010/)
  - [PyCharm自动生成requirements.txt_pycharm生成requirements](https://blog.csdn.net/COCO56/article/details/117452383)

```shell
pip freeze>requirements.txt
pip install -r requirements.txt
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
```



# 基础练习

## 参考

- 视频课
  - 林粒粒

> 1. **LeetCode**：
>    - 提供了大量的编程题目，包括Python，你可以按照难度或类别筛选题目。
>    - 网址：[https://leetcode.com/](https://leetcode.com/)
>
> 2. **Codecademy**：
>    - 提供互动的Python课程，包括许多练习题。
>    - 网址：[https://www.codecademy.com/learn/learn-python-3](https://www.codecademy.com/learn/learn-python-3)
>
> 3. **HackerRank**：
>    - 提供了许多Python练习题，涵盖从基础到高级的各种主题。
>    - 网址：[https://www.hackerrank.com/domains/tutorials/10-days-of-python](https://www.hackerrank.com/domains/tutorials/10-days-of-python)
>
> 4. **Codewars**：
>    - 提供了一个名为“Kata”的编程挑战，你可以用Python来解决。
>    - 网址：[https://www.codewars.com/](https://www.codewars.com/)
>
> 5. **Exercism**：
>    - 提供了大量的编程练习题，包括Python，并且有社区成员提供的解决方案。
>    - 网址：[https://exercism.io/tracks/python](https://exercism.io/tracks/python)
>
> 6. **Python.org**：
>    - Python官方网站提供了一些练习题，适合初学者。
>    - 网址：[https://docs.python.org/3/tutorial/index.html](https://docs.python.org/3/tutorial/index.html)
>
> 7. **GeeksforGeeks**：
>    - 提供了大量的Python练习题和解决方案。
>    - 网址：[https://www.geeksforgeeks.org/python-programming-language/](https://www.geeksforgeeks.org/python-programming-language/)
>
> 8. **Edabit**：
>    - 提供了按难度分类的Python编程挑战。
>    - 网址：[https://edabit.com/challenges/python](https://edabit.com/challenges/python)
>
> 9. **Project Euler**：
>    - 如果你喜欢解决数学问题，可以尝试Project Euler的挑战，其中很多问题可以用Python来解决。
>    - 网址：[https://projecteuler.net/](https://projecteuler.net/)
>
> 10. **CodeChef**：
>     - 提供了大量的编程题目，包括Python，可以在线提交解决方案。
>     - 网址：[https://www.codechef.com/problems/school/](https://www.codechef.com/problems/school/)
>

## 刷题开始

- 力扣
  - https://leetcode.com/problemset/
- 官网
  - https://docs.python.org/zh-cn/3.10/tutorial/index.html

- 挑战简介
  - https://edabit.com/tutorial/python

- 菜鸟100道
  - https://www.runoob.com/python/python-exercise-example38.html
- Git Hub
  - https://github.com/xianhu/LearnPython





> ### 数据结构
>
> 1. **Coursera - Data Structures and Algorithms Specialization by University of California, San Diego (UCSD) and HSE University**
>    - 链接：[https://www.coursera.org/specializations/data-structures-algorithms](https://www.coursera.org/specializations/data-structures-algorithms)
>    - 这个专项课程系列包括多个课程，涵盖了基本和高级的数据结构。
>
> 2. **edX - Data Structures Fundamentals by Microsoft**
>    - 链接：[https://www.edx.org/course/data-structures-fundamentals](https://www.edx.org/course/data-structures-fundamentals)
>    - 由微软提供的入门课程，介绍了核心数据结构和编程概念。
>
> ### 数据结构与算法
>
> 1. **Coursera - Algorithms, Part I and Part II by Princeton University**
>    - 链接：[https://www.coursera.org/learn/algorithms-part1](https://www.coursera.org/learn/algorithms-part1) 和 [https://www.coursera.org/learn/algorithms-part2](https://www.coursera.org/learn/algorithms-part2)
>    - 这两门课程由Robert Sedgewick和Kevin Wayne教授，涵盖了基本的数据结构和算法。
>
> 2. **Udemy - The Complete Data Structures and Algorithms Course by Rob Miller**
>    - 链接：[https://www.udemy.com/course/data-structures-and-algorithms-the-complete-指南/](https://www.udemy.com/course/data-structures-and-algorithms-the-完整指南/)
>    - 这是一门全面的课程，适合初学者和有经验的程序员。
>
> ### 算法导论
>
> 1. **MIT OpenCourseWare - Introduction to Algorithms by MIT**
>    - 链接：[https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/)
>    - 这门课程提供了丰富的讲座视频、课程笔记和作业，是基于MIT著名的教材《算法导论》。
>
> 2. **Coursera - Algorithms, Part I and Part II by Stanford University (via NPTEL)**
>    - 链接：[https://nptel.ac.in/courses/106/106/106106079/](https://nptel.ac.in/courses/106/106/106106079/)
>    - 这门课程由Stanford University的教授通过NPTEL平台提供，涵盖了算法的基础知识。

## TIps

- 创建虚拟环境

```shell
py -m venv venv
venv/Scripts/activate
```



## 规范

https://www.runoob.com/w3cnote/google-python-styleguide.html



## 开发者模式安装软件包

> [是的，你的理解是正确的。当你使用`pip install . -e`命令时，Python会生成一个`.egg-info`目录](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[1](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[2](https://blog.csdn.net/fengqianlang/article/details/132281624)。
>
> [这个命令是用来在开发模式下安装Python包的，也就是说，它会在你的Python环境中创建一个指向你的项目源代码的链接](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[1](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[2](https://blog.csdn.net/fengqianlang/article/details/132281624)[。这样，你就可以在不重新安装包的情况下，立即看到对源代码的修改如何影响包的行为](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[1](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[2](https://blog.csdn.net/fengqianlang/article/details/132281624)。
>
> [生成的`.egg-info`目录包含了关于这个包的元数据，比如它的名称、版本、作者、许可证等信息，以及它的依赖关系](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[1](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[2](https://blog.csdn.net/fengqianlang/article/details/132281624)[。这些信息被`setuptools`和`pip`等Python包管理器用来执行各种操作，如安装、卸载和升级包](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[1](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[2](https://blog.csdn.net/fengqianlang/article/details/132281624)。
>
> [因此，当你运行`pip install . -e`命令时，Python会在你的项目目录下生成一个`.egg-info`目录](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[1](https://www.cnblogs.com/wuzhiblog/p/python_make_egg_or_whl.html)[2](https://blog.csdn.net/fengqianlang/article/details/132281624)。希望这个解答对你有所帮助！

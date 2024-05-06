# 高精度手眼标定

## 算法对比

>
>
>1. Tsai-Lenz算法：由Tsai和Lenz于1989年提出的算法，通过测量相机和机器人末端执行器之间的关系来进行手眼标定。
>2. Daniilidis算法：由Daniilidis于1999年提出的算法，使用非线性优化方法来估计相机和机器人末端执行器之间的转换。
>3. Park-Horaud算法：由Park和Horaud于1992年提出的算法，通过将手眼标定问题转化为多平面法线（MPN）问题来进行求解。
>4. Andreff算法：由Andreff等人在2002年提出的算法，结合了机器人模型和离散信号理论，用于估计机器人手眼标定中的相机和机器人末端执行器之间的转换。

## 数据分析

###  chat -python 实现

安装所需的库。您可以使用以下命令在命令行中安装`pyyaml`和`pandas`库

安装`openpyxl`库来处理Excel文件导出：

```shell
$ pip install pyyaml pandas
$ pip install openpyxl
```

读取YAML文件并将其转换为字典对象

创建一个空的pandas数据帧来存储提取的数据

```python
import os
import yaml
import pandas as pd

# 设置文件夹路径和表格名称
folder_path = "/path/to/your/yaml/files"
excel_file = "output.xlsx"

# 获取所有yaml文件的文件名
file_names = [f for f in os.listdir(folder_path) if f.endswith(".yaml")]

# 创建空的pandas数据帧
df = pd.DataFrame(columns=["Parameter"] + file_names)

# 遍历每个yaml文件
for file_name in file_names:
    file_path = os.path.join(folder_path, file_name)
    
    # 读取yaml文件并将其转换为字典对象
    with open(file_path) as f:
        data = yaml.safe_load(f)
    
    # 提取参数值并添加到数据帧的相应列中
    for param, value in data.items():
        df.loc[df.shape[0]] = [param] + [value[file_name]]

# 将数据帧保存到Excel表格中
df.to_excel(excel_file, index=False)
```



将`folder_path`替换为包含您的YAML文件的文件夹的路径

将`excel_file`替换为要保存的Excel文件的名称和路径。

将遍历文件夹中的每个YAML文件

读取其中的数据并提取参数值

将结果保存到pandas数据帧中

将数据帧保存为Excel表格





https://www.bilibili.com/video/BV1Jx411L7LU/?spm_id_from=333.337.search-card.all.click&vd_source=6e01dedcf408a17a20fd6d828fe9dff8

https://www.bilibili.com/video/BV1wN4y1T7K9/?spm_id_from=333.337.search-card.all.click&vd_source=6e01dedcf408a17a20fd6d828fe9dff8

https://www.bilibili.com/video/BV18T411t7SD/?spm_id_from=333.337.search-card.all.click&vd_source=6e01dedcf408a17a20fd6d828fe9dff8
(15条消息) 3D点云 (Lidar)检测入门篇 ： PointPillars PyTorch实现\_3Ｄ视觉工坊的博客-CSDN博客

星期一, 十二月 5, 2022

9:23 上午

已剪辑自: [https://blog.csdn.net/Yong\_Qi2015/article/details/125057053]{.underline}

作者丨千百度@知乎

来源丨https://zhuanlan.zhihu.com/p/521277176

编辑丨3D视觉工坊

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_000.png)

基于Lidar的object检测模型包括Point-based \[PointRCNN(CVPR19), IA-[SSD]{.underline}(CVPR22)等\], Voxel-based \[PointPillars(CVPR19), CenterPoint(CVPR21)等\]，Point-Voxel-based \[PV-RCNN(CVPR20), HVPR(CVPR21)等\]和Multi-view-based\[PIXOR(CVPR18)等\]等。本博客主要记录，作为菜鸟的我，在KITTI数据集上(3类)基于PyTorch实现PointPillars的一些学习心得, 训练和测试的pipeline如Figure 1所示。这里按照深度学习算法的流程进行展开: 数据 + 网络结构 + 预测/可视化 + 评估，和实现的代码结构是一一对应的，完整代码已更新于github:https://github.com/zhulf0804/PointPillars

\[说明 - 代码的实现是通过阅读mmdet3dv0.18.1源码, 加上自己的理解完成的。因为不会写cuda, 所以cuda代码和少量代码是从mmdet3dv0.18.1复制过来的。\]

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_001.png)

**一、KITTI 3D检测数据集**
--------------------------

### 1.1 数据集信息:

**·**KITTI数据集论文: Are we ready for autonomous driving? the kitti vision benchmark suite \[CVPR 2012\] 和 Vision meets robotics: The kitti dataset \[IJRR 2013\]

**·**KITTI数据集下载(下载前需要登录): point cloud(velodyne, 29GB), images(image\_2, 12 GB), calibration files(calib, 16 MB)和labels(label\_2, 5 MB)。数据velodyne, calib 和 label\_2的读取详见utils/io.py。

### **1.2 ground truth label信息 \[file\]**

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_002.png)

1)训练时主要用到的是类别信息(type) 和3d bbox 信息 (location, dimension, rotation\_y).

2)观测角(alpha)和旋转角(rotation\_y)的区别和联系可以参考博客blog.csdn.net/qq\_161375。

### **1.3 坐标系的变换**

因为gt label中提供的bbox信息是Camera坐标系的，因此在训练时需要使用外参等将其转换到Lidar坐标系; 有时想要把3d bbox映射到图像中的2d bbox方便可视化，此时需要内参。具体转换关系如Figure 2。坐标系转换的代码见utils/process.py。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_003.png)

### **1.4 数据增强**

数据增强应该是Lidar检测中很重要的一环。发现其与2D检测中的增强差别较大，比如3D中会做database sampling(我理解的是把gt bbox进行cut-paste), 会做碰撞检测等。在本库中主要使用了采用了5种数据增强, 相关代码在dataset/data\_aug.py。

-   采样gt bbox并将其复制到当前帧的点云

>  

-   从Car, Pedestrian, Cyclist的database数据集中随机采集一定数量的bbox及inside points, 使每类bboxes的数量分别达到15, 10, 10.

-   将这些采样的bboxes进行碰撞检测, 通过碰撞检测的bboxes和对应labels加到gt\_bboxes\_3d, gt\_labels

-   把位于这些采样bboxes内点删除掉, 替换成bboxes内部的点.

<!-- -->

-   bbox 随机旋转平移

>  

-   以某个bbox为例, 随机产生num\_try个平移向量t和旋转角度r, 旋转角度可以转成旋转矩阵(mat).

-   对bbox进行旋转和平移, 找到num\_try中第一个通过碰撞测试的平移向量t和旋转角度r(mat).

-   对bbox内部的点进行旋转和平移.

-   对bbox进行旋转和平移.

<!-- -->

-   随机水平翻转

>  

-   points水平翻转

-   bboxes水平翻转

<!-- -->

-   整体旋转/平移/缩放

>  

-   object旋转, 缩放和平移

-   point旋转, 缩放和平移

<!-- -->

-   对points进行shuffle: 打乱点云数据中points的顺序。

Figure3是对上述前4种数据增强的可视化结果。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_004.png)

二、网络结构与训练
------------------

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_005.png)

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_006.png)

### 2.2 GT值生成

Head的3个分支基于anchor分别预测了类别, bbox框(相对于anchor的偏移量和尺寸比)和旋转角度的类别, 那么在训练时, 如何得到每一个anchor对应的GT值呢 ? 相关代码见model/anchors.py

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_007.png)

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_008.png)

### 2.3 损失函数和训练

现在知道了类别分类head, bbox回归head和朝向分类head的预测值和GT值, 接下来介绍损失函数。相关代码见loss/loss.py。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_009.png)

总loss = 1.0\*类别分类loss + 2.0\*回归loss + 2.0\*朝向分类loss。

模型训练: 优化器torch.optim.AdamW(), 学习率的调整torch.optim.lr\_scheduler.OneCycleLR(); 模型共训练160epoches。

三、单帧预测和可视化
--------------------

基于Head的预测值和anchors, 如何得到最后的候选框呢 ? 相关代码见model/pointpillars.py。一般经过以下几个步骤:

基于预测的类别分数的scores, 选出nms\_pre (100) 个anchors: 每一个anchor具有3个scores, 分别对应属于每一类的概率, 这里选择这3个scores中最大值作为该anchor的score; 根据每个anchor的score降序排序, 选择anchors。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_010.png)

3\. 逐类进行以下操作:

-   过滤掉类别score 小于 score\_thr (0.1) 的bboxes

-   基于nms\_thr (0.01), nms过滤掉重叠框:

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_011.png)

另外, 基于Open3d实现了在Lidar和Image里3d bboxes的可视化, 相关代码见test.py和utils/vis\_o3d.py。下图是对验证集中id=000134的数据进行可视化的结果。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_012.png)

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_013.png)

四、模型评估
------------

评估指标同2D检测类似, 也是采用AP, 即Precison-Recall曲线下的面积。不同的是, 在3D中可以计算3D bbox, BEV bbox 和 (2D bbox, AOS)的AP。

先说明一下AOS指标和Difficulty的定义。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_014.png)

Difficulty: 根据2d框的高度, 遮挡程度和截断程度, 把bbox分为 difficulty=0, 1, 2 或 其它。相关定义具体查看代码pre\_process\_kitti.py\#L16-32。

这里以3D bbox为例, 介绍类别=Car, difficulty=1 AP的计算。注意, difficulty=1的数据实际上是指difficulty\<=1的数据; 另外这里主要介绍大致步骤, 具体实现见evaluate.py。

1.计算3D IoU (utils/process.py iou3d(bboxes1, bboxes2)), 用于判定一个det bbox是否和gt bbox匹配上 (IoU \> 0.7)。

2.根据类别=Car, difficulty=1选择gt bboxes和det bboxes。

-   gt bboxes: 选择类别=Car, difficulty\<=1的bboxes;

-   det bboxes: 选择预测类别=Car的bboxes。

3\. 确定P-R曲线中的点对(Pi, Ri)对应的score阈值。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_015.png)

**五、总结**

点云检测, 相比于点云中其它任务(分类, 分割和配准等), 逻辑和代码都更加复杂, 但这并不是体现在网络结构上, 更多的是体现在数据增强, Anchors和GT生成, 单帧推理等。

点云检测, 相比于2D图像检测任务, 不同的是坐标系变换, 数据增强(碰撞检测, 点是否在立方体判断等), 斜长方体框IoU的计算等; 评估方式因为考虑到DontCare, difficulty等, 也更加复杂一些.

初次接触基于KITTI的3D检测, 如有理解错误的, 还请指正; 内容太多了, 如有遗漏, 待以后补充。

本文仅做学术分享，如有侵权，请联系删文。\
 

**3D视觉工坊精品课程官网：3dcver.com**

[1.面向自动驾驶领域的多传感器数据融合技术]{.underline}

[2.面向自动驾驶领域的3D点云目标检测全栈学习路线！(单模态+多模态/数据+代码)]{.underline}\
[3.彻底搞透视觉三维重建：原理剖析、代码讲解、及优化改进]{.underline}\
[4.国内首个面向工业级实战的点云处理课程]{.underline}\
[5.激光-视觉-IMU-GPS融合SLAM算法梳理和代码讲解]{.underline}\
[6.彻底搞懂视觉-惯性SLAM：基于VINS-Fusion正式开课啦]{.underline}\
[7.彻底搞懂基于LOAM框架的3D激光SLAM: 源码剖析到算法优化]{.underline}\
[8.彻底剖析室内、室外激光SLAM关键算法原理、代码和实战(cartographer+LOAM +LIO-SAM)]{.underline}

[9.从零搭建一套结构光3D重建系统\[理论+源码+实践\]]{.underline}

[10.单目深度估计方法：算法梳理与代码实现]{.underline}

[11.自动驾驶中的深度学习模型部署实战]{.underline}

[12.相机模型与标定(单目+双目+鱼眼）]{.underline}

[13.重磅！四旋翼飞行器：算法与实战]{.underline}

[14.ROS2从入门到精通：理论与实战]{.underline}

[15.国内首个3D缺陷检测教程：理论、源码与实战]{.underline}

**重磅！3DCVer-学术论文写作投稿 交流群已成立**

扫码添加小助手微信，可**申请加入3D视觉工坊-学术论文写作与投稿 微信交流群，旨在交流顶会、顶刊、SCI、EI等写作与投稿事宜。**

**同时**也可申请加入我们的细分方向交流群，目前主要有**3D视觉**、**CV&深度学习**、**SLAM**、**三维重建**、**点云后处理**、**自动驾驶、多传感器融合、CV入门、三维测量、VR/AR、3D人脸识别、医疗影像、缺陷检测、行人重识别、目标跟踪、视觉产品落地、视觉竞赛、车牌识别、硬件选型、学术交流、求职交流、ORB-SLAM系列源码交流、深度估计**等微信群。

一定要备注：**研究方向+学校/公司+昵称**，例如："3D视觉 + 上海交大 + 静静"。请按照格式备注，可快速被通过且邀请进群。**原创投稿**也请联系。

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_016.png)

▲长按加微信群或投稿\
 

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_016.png)

▲长按关注公众号

**3D视觉从入门到精通知识星球**：针对3D视觉领域的**视频课程（[三维重建系列]{.underline}、[三维点云系列]{.underline}、[结构光系列]{.underline}、[手眼标定]{.underline}、[相机标定]{.underline}、激光/视觉SLAM、自动驾驶等）、知识点汇总、入门进阶学习路线、最新paper分享、疑问解答**五个方面进行深耕，更有各类大厂的算法工程人员进行技术指导。与此同时，星球将联合知名企业发布3D视觉相关算法开发岗位以及项目对接信息，打造成集技术与就业为一体的铁杆粉丝聚集区，近4000星球成员为创造更好的AI世界共同进步，知识星球入口：

学习3D视觉核心技术，扫描查看介绍，3天内无条件退款

![](../../../assets/008_(15条消息)_3D点云_(Lidar)检测入门篇_：_PointPillars_PyTorch实现_3Ｄ视觉工坊的博客-CSDN博客_016.png)

 圈里有高质量教程资料、答疑解惑、助你高效解决问题

**觉得有用，麻烦给个赞和在看\~  **

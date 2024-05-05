【翻译】Kinect v1和Kinect v2的彻底比较

星期四, 十二月 15, 2022

12:29 下午

 

已剪辑自: [http://wjhsh.net/TracePlus-p-4136297.html]{.underline}

  本连载主要是比较Kinect for Windows的现行版（v1）和次世代型的开发者预览版（v2），以C++开发者为背景介绍进化的硬件和软件。本文主要是对传感的配置和运行条件进行彻底的比较。

       

  本连载介绍的Kinect for Windows Developer Preview是暂定的，软件、硬件以及API有可能因为最终的产品版发生变更，还请谅解。

 

**关于本连载**

 

  本连载主要是比较次世代型的Kinect for Windows（后面称作Kinect v2预览版）和现行型的Kinect for Windows（后面称作Kinect v1）的同时，介绍面向c++开发者而进化的硬件和软件。（本网站也发布了对应C\#/Visual Basic开发者的内容，.NET开发者可以同时参考\[新型Kinect for Windows v2 Developer Preview programing入门\]）\
 

**次世代型的Kinect for Windows**

 

  2012年美国微软发售的Kinect v1，因为可以很方便就能取得Depth（深度）和 skeleton（人物姿势）等信息，被全世界的开发者和研究人员关注。

  2014年预定发售的Kinect v2，预测在硬件和软件上会做很大的进化，在销售前，开发者向的预览版的Kinect v2(传感器)和SDK v2（软件开发套件）很早就发布了出来。

 

  还有，因为这个开发者向的早期提供程序是必须签订NDA(密码保持契约)，本稿有不能公布的事项也事先请各位谅解。

 

**Kinect v1和Kinect v2预览版的外观比较**

Kinect v1(图1)和Kinect v2 预览版(图2)的外观的照片。

 

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_000.png)

 **图1 Kinect for Windows v1(现行型)**

 

  Kinect v1的Depth传感器，采用了「Light Coding」的方式，读取投射的红外线pattern，通过pattern的变形来取得Depth的信息。为此，Depth传感器分为投射红外线pattern的IR Projector（左）和读取的这个的IR Camera（右）。还有Depth传感器中间还搭载了Color Camera。\
 

  Light Coding是以色列的PrimeSense公司的Depth传感器技术，于2013年被美国苹果公司收购。

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_001.png)

**图2 Kinect for Windows v2(次世代型)预览版**

 

  Kinect V2预览版的Depth传感器，采用的是「Time of Flight(TOF)」的方式，通过从投射的红外线反射后返回的时间来取得Depth信息。Depth传感器看不到外观，不过Color Camera旁边是红外线Camera(左)和投射脉冲变调红外线的Porjector（右）。

    

  微软过去收购过使用TOF方式处理Depth传感器技术的公司（注：应该是指的3DV），已经在使用这个技术，不过没有详细的公布。

 

**Kinect v1和Kinect v2预览版的配置比较**

 

  Kinect v1和Kinect v2预览版的传感器的配置比较在表1显示。

 Kinect v1Kinect v2预览版            颜色（Color）分辨率（Resolution）fps深度（Depth）分辨率（Resolution）fps人物数量（Player）人物姿势（Skeleton）関節（Joint）手的開閉状態（Hand State）检测範囲（Range of Detection）角度（Angle）（Depth）水平（Horizontal）垂直（Vertical）（Tilt Motor）複数的App

|                        |            |
|------------------------|------------|
|                        |            |
| 640×480                | 1920×1080  |
| 30fps                  | 30fps      |
| 320×240                | 512×424    |
| 30fps                  | 30fps      |
| 6人                    | 6人        |
| 2人                    | 6人        |
| 20関節／人             | 25関節／人 |
| △（Developer Toolkit） | ○（SDK）   |
| 0.8～4.0m              | 0.5～4.5m  |
| 57度                   | 70度       |
| 43度                   | 60度       |
| ○                      | ×（手動）  |
| ×（単一的App）         | ○          |

** 表1是Kinect v1和Kinect v2预览版的传感器的配置比较**

 

Kinect v1的Color Camera的分辨率是640x480较低，不能取得非常漂亮的图像，Kinect v2预览版的分辨率大幅提高，能取得1920×1080非常漂亮的图像（图3）。

（注：v1的要求是USB2.0理论传输速率是60MB/s，v2是USB3.0理论传输速率是500MB/s。可以计算一下，以XRGB Color为例，30fps，那么每秒所需传输的数据大小为640 x 480 x 4 x 30约为35M；再加上USHORT格式的Depth Color，30fps，大小为320 x 240 x 2 x 30约为4M。总计约为40MB/s，因为带宽有限，所以在保证画面帧率稳定的情况下，分辨率只能如此，而且基本上必须独占一个USB Controller。再算算v2的情况，Color = 1920 x 1080 x 4 x 30 约为237M，Depth = 512 x 424 x 2 x 30约为12M，总计约为250M/s。所以非USB3.0不可，否则传输不了这么大的数据量。显而易见，Color Map是最占带宽的，其实可以通过一些其他格式，比如I420或MJPG来减少数据量，然后通过CPU或GPU来进行解压和回放。）

   

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_002.png)

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_003.png)

**图3 Kinect v1和Kinect v2预览版的Color**

  Kinect v2预览版的Depth传感器的分辨率也提高到512×424，而Kinect v1是可以取640×480分辨率的Depth数据，乍一看规格好像下降了，其实Kinect v1的Depth传感器的物理分辨率是320x240，Up Sacling到640x480而已（注：猜测是Runtime处理的）。另外，Depth传感器的方式也是从Light Coding变更为Time of Flight(TOF)。

  

  不能详细叙述，不过Kinect V2预览版Depth数据的精度也提高了(图4)，关于精度还敬请等待产品版。

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_004.png)

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_005.png)

**图4 Kinect v1和Kinect v2预览版的Depth**

   Kinect v1，v2预览版可以取得Player（可识别的人体）数量都是6人。Kinect v2预览版因为Depth传感器的分辨率提高了，用Player数据只需要简单的剪切就可以很漂亮得把背景和人物分离。

   Kinect v1可以取得全部关节（Joint）的skeleton的数量是2人，随着Depth传感器的分辨率上升和视角的宽广，Kinect v2预览版变得能取得6人。

 

    还有，Kinect v1能取得的Joint是20个Joint每人，Kinect v2预览版变为能取得25个Joint。具体的如图5所示，头(Neck)，指尖（HAND\_TIP\_LEFT，HAND\_TIP\_RIGHT），大拇指（THUMB\_LEFT，THUMB\_RIGHT），增加了这5个Joint。不仅仅是手的位置，大拇指和指尖的细小信息也可以获取到。

 

   Hand State（手的开闭状态）的识别，Kinect v1是靠Developer Toolkit里的「Kinect Interaction」库来支持，不过在Kinect V2预览版SDK里是标准支持。

    

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_006.png)

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_007.png)

Kinect v1和Kinect v2预览版可以取得的Joint

Kinect v1为了摇头装载了倾斜电机(Tilt motor)，也有视角扩展，Kinect v2预览版没有搭载Tilt motor，靠手动来摇头。

 

Kinect v1不能多个应用程序同时连接到一个传感器。Kinect v2预览版通过「Kinect Service」，可以让多个应用程序同时从传感器取得数据（参考图6）

现在，Kinect Service作为常驻程序被提供， 一般认为产品版里会成为Windows的服务(Service)。

 

![](..\..\..\assets\019_【翻译】Kinect_v1和Kinect_v2的彻底比较_008.png)

**图6 通过Kinect Service，对应多个应用程序**

  Kinect v1和Kinect v2 预览版的运行环境的比较表(表2)。

 Kinect v1Kinect v2预览版OS 编译器（Compiler）接続端子（Connector） CPU GPU RAM

|                        |                        |
|------------------------|------------------------|
|                        |                        |
| Windows 7以后          | Windows 8以后          |
| Visual Studio 2010以后 | Visual Studio 2012以后 |
| USB 2.0                | USB 3.0                |
| Dual-Core 2.66GHz      | Dual-Core 2.66GHz      |
| DirectX 9.0c           | DirectX 11.0           |
| 2.0GBytes              | 2.0 GBytes             |

表2　Kinect v1和Kinect v2预览版的最小运行环境比較

 

  Kinect v1要在Windows 7以后的版本上运行，Kinect v2要求是在Windows 8 运行。关于Visual Studio也要求是2012以后的版本。

 

  Kinect v1要求USB 2.0（或更快的USB）来运行，因为Kinect 2预览版传感器的分辨率也提高了，需要更快的USB 3.0来运行。Kinect v1和Kinect v2预览版的专有USB总线带宽都没有变化。

 

  Kinect v1和Kinect v2预览版都有与部分USB Host Controller不兼容而导致不能正常运行的情况，现在是Renesas和Intel的USB 3.0 Host Controller可以运行。台式PC也可以增加USB3.0扩展卡来对应。

 

  CPU方面，和Kinect v1一样，要求Dual Core 2.66 GHz以上。「时钟频率较低」一类的运行环境也稍微下降了，不是特别差的情况都可以运行，不过注意传感器分辨率提高，取得的数据的处理消耗也上升了。

 

  Kinect v1要求的是支持DirectX 9.0c的GPU（Kinect Fusion除外），Kinect v2预览版要求支持DirectX 11.0以后的GPU，像笔记本这种没有装载NVIDIA GeForce和AMD Radeon外置GPU（独立显卡）的很多无法运行，而像有Intel HD Graphics这种支持DirectX 11.0以后的处理器内置的GPU（集成显卡）是可以运行的。

 

   如上展示了Kinect v2预览版的必要运行环境，和前述一样在产品版中有变更的可能性，现在还不需要着急准备对应环境。关于USB Host Controller的兼容性今后也有解决的可能，希望起到参考的作用。

 

**总结**

  这次彻底的比较了Kinect v1和Kinect v2预览版的传感器配置和必要运行环境，下一回是关于使用Kinect SDK v2.0预览版的C++的程序设计方法在v1和v2预览版上的比较和介绍。

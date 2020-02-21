# my-npm-package
测试上传自定义的npm包

# 对外暴露方法：

1.getLayerPoints(cb)： 

  功能：获取图层上绘制的边框（矩形边框、多边形自由边框）
  
  参数：cb-回调方法
  返回：{pBoxList, pPolygonList, pixelOrigin}。
       其中pBoxList-矩形边框数组；pPolygonList-多边形自由边框数组；
  pixelOrigin-图层像素投影坐标系下的左上角的点，适用于坐标点相对于初始坐标偏移量的计算
  
  
  
# 标注框位置说明：
1.矩形标注框组件定义type为bbox,多边形标注框类型为polygon；

2.矩形框以两个坐标点确定位置：左上角point1+右下角point2。坐标象限分界为：右上的称为第一象限,左上的称为第二象限,左下的称为第三象限,右下的称为第四象限，即横坐标从左至右递增，纵坐标从下至上递增。具体项目设置标注框位置时坐标需要按照此规定换算。



## gojs的基本概念

上面的示例是让我们先在感官上认知一下gojs的产出物，下面我们来阐述一下gojs的基本概念。

gojs绘制的图表（`Diagram`）具有两个最基本的元素，就是点和线（`Node`和`Link`），并且他们可以自由组合组成一个组（`Group`）。所有的元素都处在图层（`Layer`）上，并且可以对它们进行布局（`Layout`）。

每个`Diagram`都是通过数据模型（`Model`）来填充和确定`Node`的信息和`Link`的所属关系的。并且我们只需要创建好`Node`和`Link`的模板以及数据模型，其他的是事情都交给gojs去处理。它会通过`Model.nodeDataArray`方法和`GraphLinksModel.linkDataArray`方法自动加载模型并构建元素。

每一个`Node`和`Link`都是通过模板来描述他们的文本、形状、颜色等信息以及交互行为。每个模板其实就是一个面板（`Panel`）（你可以将各种元素自由组合在它里面，也可以在它里面添加各种交互行为），比如说将`TextBlock`、`Shape`、`Picture`等元素添加到这个`Panel`中，鼠标进入离开的交互行为也可以添加到`Panel`中，那么这个`Panel`就是一个模板。

每个`Node`的位置可以使用`Diagram.layout`或`Group.layout`进行初始化设置，也可以基于交互行为进行拖拽。

gojs里的工具类可以为`Diagram`添加鼠标、键盘事件。一般情况下`Diagram`都默认设置了几种交互行为，比如说拖拽、连线。我们也可以通过`ToolManager`对象来管理工具类，或者说来管理交互行为，比如说可以停止某些交互，或开启某些交互等。

每个`Diagram`同时也包含`CommandHandler`对象，它的作用是添加一些键盘命令，比如点`Delete`键删除元素，`Ctrl+C`复制、`Ctrl+V`粘贴、`Ctrl+Z`撤销等。但是`CommandHandler`也是被`ToolManager`管理的。

`Diagram`也提供通过鼠标中键滚动视图、放大缩小视图。

gojs还提供了图表的预览视图（`Overview`），用于了解大规模图表的概况，同时还提供了组件管理面板（`Palette`），用于管理创建的组件，并且支持将组件拖拽到`Diagram`中。

在`Diagram`中，你可以选中`Node`或者`Link`，你会发现他们有少许的变化，比如在`Node`周围会增加选中框，选中`Link`会变色等。这些都是由`Adornment`对象控制的，你还可以用它来增加提示框、右键菜单等。

### 画布

| 获取当前画布的json                    | myDiagram.model.toJson();                                    |
| ------------------------------------- | ------------------------------------------------------------ |
| 加载json刷新画布                      | myDiagram.model = go.Model.fromJson(model);                  |
| 删除选中节点或线                      | myDiagram.commandHandler.deleteSelection();                  |
| 获取选中的节点或线myDiagram.selection | ` ``//用例获取选中的节点或线``var nodeOrLinkList=myDiagram.selection;``nodeOrLinkList.each(function(nodeOrLink) {``console.log(nodeOrLink.data);``});``//获取第一个选中的节点或线``var nodeOrLink=myDiagram.selection.first()` |
| 获取画布所有节点对象myDiagram.nodes   | ` ``var nodes=myDiagram.nodes;``//遍历输出节点对象``nodes.each(function (node) {``console.log(node.data.text);``});` |

### 节点

 

| 添加节点                                                     | myDiagram.model.addNodeData(nodeData);                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 删除节点                                                     | myDiagram.model.removeNodeData(nodeData);                    |
| 选中单个节点（不能批量选中）                                 | myDiagram.select(node);                                      |
| 更改属性值                                                   | myDiagram.model.setDataProperty(nodeData, 'color', "#ededed"); |
| 根据节点数据对象更改节点属性myDiagram.model.updateTargetBindings(nodeData); | ` ``var nodeData = myDiagram.model.findNodeDataForKey('4.1');``nodeData.text = "2333"``nodeData.color = "#000000";``myDiagram.model.updateTargetBindings(nodeData);` |
| 获取节点对象                                                 | var node=myDiagram.findNodeForKey('key');                    |
| 获取节点data                                                 | var nodeData=myDiagram.model.findNodeDataForKey('key');      |
| 批量删除节点myDiagram.model.removeNodeDataCollection(nodes)  | ` ``var removeNodes = []; ``var aNodeData = myDiagram.model.findNodeDataForKey('Akey');``var bNodeData = myDiagram.model.findNodeDataForKey('Bkey');``removeNodes.push(aNodeData );``removeNodes.push(bNodeData);``myDiagram.model.removeNodeDataCollection(removeNodes);` |
| 模糊获取节点(版本1.68以上)**注意值类型，字符串和数值**myDiagram.findNodesByExample(data);匹配方式默认为===运算符进行比较。/abc/ 匹配包含“abc”的任何字符串 /abc/i 匹配包含“abc”的任何字符串，忽略大小写 /^no/i 匹配任何以“no”开头的字符串，忽略大小写 /ism$/匹配任何以“ism”结尾的字符串 /(green\|red) apple/ 匹配包含“green apple”或“red apple”的字符串官网还有更多的匹配方式，这里就不列举了 | ` ``//注意值类型，字符串和数值，``//如果json中是1.1，写成"1.1"就会查询不到``var data={};``  data.text="设计";``// data.text=/设计/;``// data.text=/设计/i;``// data.text=/^设计/;``// data.text=/设计$/;``// data.text=/(勘|察)设计/;``var nodes = myDiagram.findNodesByExample(data);``   nodes.iterator.each(function (node) {``    console.log(node.data);``});` |

### 线

| 添加线                                                       | myDiagram.model.addLinkData(linkData);                       |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 删除线                                                       | myDiagram.model.removeLinkData(linkData);                    |
| 批量删除线{Array\|iterator} removeLinksremoveLinkDataCollection(removeLinks); | ` ``var removeLinks=[];``//首先拿到这个节点的对象``var node = myDiagram.findNodeForKey('key');``//获取节点所有线``node.findLinksConnected().each(function(link) { ``   removeLinks.push(link.data);``   }`` );``myDiagram.model.removeLinkDataCollection(removeLinks);` |
| 模糊获取线(版本1.68以上)**注意值类型，字符串和数值**myDiagram.findLinksByExample(data);匹配 方式和模糊获取节点的规则一致 | ` ``//注意值类型，字符串和数值``//如果json中是from:1.1，写成from:"1.1"就会查询不到``var links=myDiagram.findLinksByExample({from:1.1, to:2.1});``links.iterator.each(function (link) {``   console.log(link.data);``});` |
| 更改属性值                                                   | myDiagram.model.setDataProperty(linkData, 'from', "-2");     |
| 获取节点的线{string \| null =} PID 端口IDfindLinksConnected(PID) | var node=myDiagram.findNodeForKey('key');node.findLinksConnected().each(function(link) {console.log(link.data)}); |
| 获取进入节点的线{string \| null =} PID 端口IDfindLinksInto(PID) | var node=myDiagram.findNodeForKey('key');node.findLinksInto().each(function(link) {console.log(link.data)}); |
| 获取从节点出来的线{string \| null =} PID 端口IDfindLinksOutOf(PID) | var node=myDiagram.findNodeForKey('key');node.findLinksOutOf().each(function(link) {console.log(link.data)}); |
| 获取A-B节点之间的线 {node } othernode B节点对象 {string \| null =} PID 端口ID {string \| null =} otherPID B节点端口IDfindLinksTo(othernode, PID, otherPID) | var nodeA=myDiagram.findNodeForKey('key');var nodeB=myDiagram.findNodeForKey('key');nodeA.findLinksTo(nodeB).each(function(link) {console.log(link.data)}); |
|                                                              |                                                              |
|                                                              |                                                              |

### 树节点

| 根据甲，找甲的祖宗十八代（包括甲）node.findTreeParentChain(); | ` ``node.findTreeParentChain().each(function(pNode) {``console.log(pNode.data)``});` |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| 根据甲，找甲的子孙十八代（包括甲）node.findTreeParts();      | ` ``node.findTreeParts().each(function(sNode) {``console.log(sNode.data)``});` |
| 根据甲，找甲的父亲node.findTreeParentNode();                 | var pNode=node.findTreeParentNode();                         |
| 根据甲，找甲的孩子们node.findTreeChildrenNodes();            | ` ``node.findTreeChildrenNodes().each(function(cNode) {``console.log(cNode.data)``});` |
| 根据甲，获取甲和其孩子的关系 node.findTreeChildrenLinks();   | 未测                                                         |
| ### 对象                                                     |                                                              |
| 类型                                                         | 说明                                                         |
| -------                                                      | ------------------------------------------------------------ |
| Diagram                                                      | 基本元素是点和线（`Node`和`Link`）                           |
| Node                                                         | 可以加入$(go.TextBlock,{ ... }), $(go.Picture,{ ... }), $(go.Shape,{ ... }), $(go.Panel,{ ... }),四种节点。分别为文本快（可编辑），图片，图形，面板（来保存其他Node的集合） ,更新节点数据myDiagram.model.updateTargetBindings(node.data) |
| Link                                                         | linkTemplate，linkDataArray，GraphLinksModel http://www.devtalking.com/articles/gojs-links/ |
| Group                                                        |                                                              |
| Layer                                                        |                                                              |
| Layout                                                       |                                                              |

### 数据模型
>Model：最基本的（不带连线，如上面的例子）
GraphLinksModel ：连线图
TreeModel：树形图

### 面板Panel
```javascript
Panel.Position
Panel.Vertical
Panel.Horizontal
Panel.Auto
Panel.Spot
Panel.Table(columnSpan合并)
Panel.Viewbox
Panel.Link
Panel.Grid
```


 **gojs操作画布常用API**

 

|      | API                                                          | 用例                                                         |
| :--- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| 增   | addNodeData(节点对象);addLinkData(线对象);                   | ` ``var node = {};``node["key"] = "节点Key";``node["loc"] = "0 0";//节点坐标``node["text"] = "节点名称";``myDiagram.model.addNodeData(node);` |
| 删   | removeNodeData(节点对象)removeLinkData(线对象);              | ` ``//首先拿到这个节点的对象,这里直接通过节点的Key获取，``//也可以通过各种事件的返回的对象中获取``var nodeData = myDiagram.model.findNodeDataForKey('key');``//删除单个节点``myDiagram.model.removeNodeData(nodeData);` |
| 改   | 参数:data: nodeData或linkDatapropname：属性名val:修改的值setDataProperty(data, propname, val); | ` ``//首先拿到这个节点的data对象``var nodeData = myDiagram.model.findNodeDataForKey('key');``//然后对这个对象的属性进行更改，如果没有则新增这个属性``myDiagram.model.setDataProperty(nodeData, 'color', "#ededed");` |
| 查   | 根据key获取节点data对象findNodeDataForKey('节点key');根据linkData模糊匹配线集合(gojs1.68以上)findLinksByExample(linkData) | ` ``//根据Key获取节点数据对象``var nodeData = myDiagram.model.findNodeDataForKey('key');``//根据linkData，模糊匹配线集合,linkData可以为部分属性组成``//如from:-1或to:-1,或者from:-1,to:-1``var links=myDiagram.findLinksByExample({"from":-1, "to":-2});``while (links.next()) {``//遍历输出所有线数据对象``console.log(links.value.data);``}` |

 ** gojs 函数实践**  
* 添加节点
```javascript
 var CreateNode={
	key:getNextKey(), //设置key的方法，每个节点最好是有自己独立的key
  "category":"nodeStyleOne", //节点样式选择?nodeStyleOne? => 你自己定义的样式名
	"loc":"",
	"text":"节点的text值",//也阔以是动态的值
	source:“123.svg”,//也阔以是动态的路径 			
	}
	myDiagram.model.addNodeData(CreateNode);
```

* 动态加线
```javascript
myDiagram.model.addLinkData({"from":连线起点的key, "to":连线终点key,"category":样式名});
```

* 复制内容错位显示
```javascript
//为diagram添加“剪贴板复制粘贴”事件
    self.myDiagram.addDiagramListener("ClipboardPasted", function(e) {
      //复制后，粘贴时位置偏移
      e.subject.each(function(node) {
        let nodeData = node.data;
        if(nodeData.loc){
          let locs = nodeData.loc.split(" ");
          let loc = (Number(locs[0])+50)+" "+(Number(locs[1])+30)
          self.myDiagram.model.setDataProperty(nodeData, "loc", loc);          
        }
      });
    });
```
* 拖动高亮
```javascript
myDiagram.groupTemplate =
      $(go.Group,

        ……

        { // highlight group when dragover or dragdrop
          mouseDragEnter: function(e, grp, prev) { highlightGroup(grp, true); },
          mouseDragLeave: function(e, grp, next) { highlightGroup(grp, false); },
          mouseDrop: function(e, grp) {
            var ok = grp.addMembers(grp.diagram.selection, true);
            if (!ok) grp.diagram.currentTool.doCancel();
          }
        },

        ……

      new go.Binding("fill", "isHighlighted", function(h) { return h ? dropFill : groupFill; }).ofObject(),
      new go.Binding("stroke", "isHighlighted", function(h) { return h ? dropStroke: groupStroke; }).ofObject())
      );
```
* 阻止键盘事件
```javascript
myDiagram.commandHandler.doKeyDown = function （） {
    var e = myDiagram.lastInput;
    // Meta（Command）键代替Mac命令的“控制”
    var control = e.control || e.meta;
    var key = e.key;
    //退出任何撤销/重做组合键，具体键值根据需求而定
    if（control &&（key === 'Z' || key === 'Y'））return ;

    //调用没有参数的基础方法（默认功能）
    go.CommandHandler.prototype.doKeyDown.call（this）;
  };
```

* 监听连线完成事件
```javascript
myDiagram.addDiagramListener("LinkDrawn",function(e){
       (e.subject.data )    //这是这个线条的数据
 }) ; 同时要在linkTemplate 配置上 selectable: true,这样 再监听连线成功时 的回调中 调 

myDiagram.commandHandler.deleteSelection() 才行 ,才能删除这个连线。
```

* 拖拽框选功能
```javascript
 myDiagram.toolManager.dragSelectingTool.box =
    $(go.Part,
      { layerName: "Tool", selectable: false },
      $(go.Shape,
        { name: "SHAPE", fill: null, stroke: "chartreuse", strokeWidth: 3 }));
```

* 监听新拖拽到画布的节点
```javascript
diagram.addModelChangedListener(function(evt) {
    // ignore unimportant Transaction events
    if (!evt.isTransactionFinished) return;
    var txn = evt.object;  // a Transaction
    if (txn === null) return;
    // iterate over all of the actual ChangedEvents of the Transaction
    txn.changes.each(function(e) {
      // ignore any kind of change other than adding/removing a node
      if (e.modelChange !== "nodeDataArray") return;
      // record node insertions and removals
      if (e.change === go.ChangedEvent.Insert) {
        console.log(evt.propertyName + " added node with key: " + e.newValue.key);
      } else if (e.change === go.ChangedEvent.Remove) {
        console.log(evt.propertyName + " removed node with key: " + e.oldValue.key);
      }
    });
  });
```

* 监听新拖拽的连线
```javascript
diagram.addModelChangedListener(function(evt) {
    // ignore unimportant Transaction events
    if (!evt.isTransactionFinished) return;
    var txn = evt.object;  // a Transaction
    if (txn === null) return;
    // iterate over all of the actual ChangedEvents of the Transaction
    txn.changes.each(function(e) {
      // record node insertions and removals
      if (e.change === go.ChangedEvent.Property) {
        if (e.modelChange === "linkFromKey") {
          console.log(evt.propertyName + " changed From key of link: " +
                      e.object + " from: " + e.oldValue + " to: " + e.newValue);
        } else if (e.modelChange === "linkToKey") {
          console.log(evt.propertyName + " changed To key of link: " +
                      e.object + " from: " + e.oldValue + " to: " + e.newValue);
        }
      } else if (e.change === go.ChangedEvent.Insert && e.modelChange === "linkDataArray") {
        console.log(evt.propertyName + " added link: " + e.newValue);
      } else if (e.change === go.ChangedEvent.Remove && e.modelChange === "linkDataArray") {
        console.log(evt.propertyName + " removed link: " + e.oldValue);
      }
    });
  });
```

* 大小网格交替线
```javascript
grid: $(go.Panel, "Grid",
                            $(go.Shape, "LineH", { stroke: "gray", strokeWidth: .5 }),
                            $(go.Shape, "LineH", { stroke: "darkslategray", strokeWidth: 1.5, interval: 10 }),
                            $(go.Shape, "LineV", { stroke: "gray", strokeWidth: .5 }),
                            $(go.Shape, "LineV", { stroke: "darkslategray", strokeWidth: 1.5, interval: 10 })
                          ),
```

* 改变属性
```javascript
// 动态控制节点颜色变化
var node = diagram.model.findNodeDataForKey("zip");
diagram.model.setDataProperty(node, "color", "lightgreen");
```


gojs最佳教程: [http://www.devtalking.com/categories/%E5%89%8D%E7%AB%AF/](http://www.devtalking.com/categories/前端/)

https://www.jianshu.com/p/f91fbf085574

[事件](https://www.cnblogs.com/1rookie/p/8085230.html)


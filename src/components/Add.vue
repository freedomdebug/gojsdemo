<template>
  <div class="container">
    <a href="javascript:;"
       @click="undo">撤销</a>
    <a href="javascript:;"
       @click="redo">重做</a>
    <a href="javascript:;"
       @click="add">添加</a>
    <div id="myDiagramDiv"
         style="width: 1200px; height: 800px"></div>
    <div class="addModal"
         :style="{top: `${modal.y}px`, left: `${modal.x}px`}"
         v-if="modal.visiable">
      <p>top: {{modal.y}}px, left: {{modal.x}}px</p>

      <div @click="addNode('Rectangle')"
           class="rectangle"></div>
      <div>节点</div>
      <div @click="addNode('Diamond')"
           class="rhombus"></div>
      <div>判断</div>
    </div>
  </div>
</template>
<script>
import go from 'gojs'
// import { LinkShiftingTool } from 'gojs/extensions/LinkShiftingTool'
let $ = go.GraphObject.make
var myDiagram = null
export default {
  name: 'Add',
  data () {
    return {
      modal: {
        visiable: false,
        from: null,
        x: 0,
        y: 0
      },
      model: {
        nodes: [
          { key: 'Alpha', location: '0 0' },
          { key: 'Beta', location: '0 100' }
        ],
        links: [
          { from: 'Alpha', to: 'Beta' }
        ]
      }
    }
  },
  methods: {
    init () {
      const that = this
      myDiagram =
        $(go.Diagram, 'myDiagramDiv',
          {
            initialPosition: new go.Point(0, 0),
            'grid.visible': true, // 显示网格
            'grid.gridCellSize': new go.Size(10, 10),
            scale: 1,
            minScale: 0.5, // 画布最小比例
            maxScale: 2.0, // 画布最大比例
            'undoManager.isEnabled': true,
            'linkingTool.isUnconnectedLinkValid': true
          })
      // myDiagram.toolManager.mouseDownTools.add($(LinkShiftingTool))

      // myDiagram.initialContentAlignment = go.Spot.Center
      myDiagram.nodeTemplate =
        $(go.Node, 'Auto',
          {
            fromSpot: go.Spot.AllSides,
            toSpot: go.Spot.AllSides,
            fromLinkable: true,
            toLinkable: true,
            locationSpot: go.Spot.Center
          },
          new go.Binding('location', 'location', go.Point.parse).makeTwoWay(go.Point.stringify),
          $(go.Shape, {
            width: 100,
            height: 50,
            fill: 'lightyellow'
            // figure: 'Diamond'
          }, new go.Binding('figure')),
          $(go.TextBlock, { margin: 10 },
            { fromLinkable: false, toLinkable: false },
            new go.Binding('text', 'key'))
        )

      myDiagram.linkTemplate =
        $(go.Link,
          {
            reshapable: true,
            resegmentable: true,
            relinkableFrom: true,
            relinkableTo: true,
            adjusting: go.Link.Stretch
          },
          // remember the (potentially) user-modified route
          new go.Binding('points').makeTwoWay(),
          // remember any spots modified by LinkShiftingTool
          new go.Binding('fromSpot', 'fromSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
          new go.Binding('toSpot', 'toSpot', go.Spot.parse).makeTwoWay(go.Spot.stringify),
          $(go.Shape),
          $(go.Shape, { toArrow: 'Standard' })
        )

      myDiagram.model = new go.GraphLinksModel(this.model.nodes, this.model.links)
      myDiagram.addModelChangedListener(function (evt) {
        // ignore unimportant Transaction events
        if (!evt.isTransactionFinished) return
        var txn = evt.object // a Transaction
        if (txn === null) return
        // iterate over all of the actual ChangedEvents of the Transaction
        txn.changes.each(function (e) {
          // record node insertions and removals
          if (e.change === go.ChangedEvent.Property) {
            if (e.modelChange === 'linkFromKey') {
              console.log(evt.propertyName + ' changed From key of link: ' +
                e.object + ' from: ' + e.oldValue + ' to: ' + e.newValue)
            } else if (e.modelChange === 'linkToKey') {
              console.log(evt.propertyName + ' changed To key of link: ' +
                e.object + ' from: ' + e.oldValue + ' to: ' + e.newValue)
            }
          } else if (e.change === go.ChangedEvent.Insert && e.modelChange === 'linkDataArray') {
            if (e.newValue && e.newValue.points && e.newValue.points._dataArray) {
              // debugger
              console.log(evt.propertyName + ' added link: ' + e.newValue.points._dataArray)
              // debugger
              that.modal.x = e.newValue.points._dataArray[e.newValue.points._dataArray.length - 1].x + 20
              that.modal.y = e.newValue.points._dataArray[e.newValue.points._dataArray.length - 1].y + 20
              that.modal.visiable = true
            }
          } else if (e.change === go.ChangedEvent.Remove && e.modelChange === 'linkDataArray') {
            console.log(evt.propertyName + ' removed link: ' + e.oldValue)
          }
        })
      })
      myDiagram.addDiagramListener('InitialLayoutCompleted', function (e) {
        // select the Link in order to show its two additional Adornments, for shifting the ends
        myDiagram.links.first().isSelected = true
      })
      myDiagram.addDiagramListener('LinkDrawn', function (e) {
        // debugger
        console.log('LinkDrawn')
        console.log(e.subject.data)// 这是这个线条的数据
        that.modal.from = e.subject.data.from
        console.log('当前鼠标位置:%s', `x:${e.diagram.toolManager.contextMenuTool.mouseDownPoint.x},y:${e.diagram.toolManager.contextMenuTool.mouseDownPoint.y}`)
      })
      myDiagram.addDiagramListener('LinkRelinked', function (e) {
        console.log('LinkRelinked')
        // console.log(e.subject.data)// 这是这个线条的数据
      })
    }, // end init
    save () {

    },
    load () {

    },
    /**
     * Shape包括Rectangle（矩形）、RoundedRectangle（圆角矩形），Ellipse（椭圆形），Triangle（三角形），Diamond（菱形），Circle（圆形）
     */
    addNode (type = '', name = '') {
      if (!name) name = `node${new Date().getTime()}`
      myDiagram.startTransaction('add model')
      // this.model.nodes.push({ key: name, color: 'lightblue' })
      // this.myDiagram.model = new go.GraphLinksModel(this.model.nodes, this.model.links)

      myDiagram.model.addNodeData({
        key: name,
        color: 'lightblue',
        location: `${this.modal.x} ${this.modal.y}`,
        figure: type
      })
      // myDiagram.model.addLinkData({ from: this.modal.from, to: name })
      this.model.links.map(link => {
        if (!link.to) {
          link.to = name
          myDiagram.model.updateTargetBindings(link)
        }
      })

      this.modal.visiable = false
      myDiagram.commitTransaction('add model')
      // importance
      myDiagram.rebuildParts()
    },
    undo () {
      if (typeof myDiagram === 'undefined') {
        alert('浏览器不兼容此功能，请使用高版本谷歌浏览器！')
        return false
      }
      myDiagram.undoManager.undo()
    },
    redo () {
      if (typeof myDiagram === 'undefined') {
        alert('浏览器不兼容此功能，请使用高版本谷歌浏览器！')
        return false
      }
      myDiagram.undoManager.redo()
    },
    add () {
      this.addNode()
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#myDiagramDiv {
  background-color: #f8f8f8;
  border: 1px solid #aaa;
}
.addModal {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 99999;
  background: #fff;
  width: 200px;
  height: 200px;
  opacity: 0.8;
  border-radius: 10px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 2px 2px 4px #ccc;
  border: 1px solid #ccc;

  display: flex;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
.rectangle {
  width: 90px;
  height: 45px;
  background: lightgrey;
  border: 1px solid #000;
  margin: 0 auto;
}
.rhombus {
  width: 45px;
  height: 60px;
  -webkit-transform: rotateZ(45deg) skew(30deg, 30deg);
  transform: rotateZ(136deg) skew(30deg, 30deg);
  background: lightgrey;
  border: 1px solid #000;
  margin: 0 auto;
}
</style>

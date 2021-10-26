<template>
  <div class="container">
    <a href="javascript:;"
       @click="undo">撤销</a>
    <a href="javascript:;"
       @click="redo">重做</a>
    <a href="javascript:;"
       @click="add">添加</a>
    <div id="myDiagramDiv"
         style="width: 800px; height: 800px"></div>
  </div>
</template>
<script>
import go from 'gojs'
let $ = go.GraphObject.make
export default {
  name: 'HelloWorld',
  data () {
    return {
      myDiagram: null,
      model: {
        nodes: [
          { key: 'Omega', isGroup: true },
          { key: 'Alpha', color: 'lightblue', group: 'Omega' },
          { key: 'Beta', color: 'orange', group: 'Omega' },
          { key: 'Gamma', color: 'lightgreen' },
          { key: 'Delta', color: 'pink' },
          { key: 'Omega-child', color: 'pink' }
        ],
        links: [
          { from: 'Alpha', to: 'Beta' },
          { from: 'Alpha', to: 'Gamma' },
          { from: 'Beta', to: 'Beta' },
          { from: 'Gamma', to: 'Delta' },
          { from: 'Delta', to: 'Alpha' },
          { from: 'Omega', to: 'Omega-child' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.myDiagram = $(go.Diagram, 'myDiagramDiv', {
        'undoManager.isEnabled': true
      })
      // define a simple Node template
      this.myDiagram.nodeTemplate = $(
        go.Node,
        'Auto', // the Shape will go around the TextBlock
        $(
          go.Shape,
          'RoundedRectangle',
          { strokeWidth: 0, fill: 'white' },
          // Shape.fill is bound to Node.data.color
          new go.Binding('fill', 'color')
        ),
        $(
          go.TextBlock,
          { margin: 8, font: 'bold 14px sans-serif', stroke: '#333' }, // Specify a margin to add some room around the text
          // TextBlock.text is bound to Node.data.key
          new go.Binding('text', 'key')
        )
      )
      this.myDiagram.linkTemplate =
        $(go.Link,
          { relinkableFrom: true, relinkableTo: true },
          $(go.Shape, // 连线形状设置
            { strokeWidth: 2 },
            new go.Binding('stroke', '', this.linkColorConverter)), // 连线的颜色设置
          $(go.Shape, // arrowhead
            { toArrow: 'Triangle', stroke: null, scale: 1.5 }, // 箭头设置
            new go.Binding('fill', '', this.linkColorConverter))
        )
      // but use the default Link template, by not setting Diagram.linkTemplate
      // create the model data that will be represented by Nodes and Links
      this.myDiagram.model = new go.GraphLinksModel(this.model.nodes, this.model.links)
    },
    undo () {
      if (typeof this.myDiagram === 'undefined') {
        alert('浏览器不兼容此功能，请使用高版本谷歌浏览器！')
        return false
      }
      this.myDiagram.undoManager.undo()
    },
    redo () {
      if (typeof this.myDiagram === 'undefined') {
        alert('浏览器不兼容此功能，请使用高版本谷歌浏览器！')
        return false
      }
      this.myDiagram.undoManager.redo()
    },
    add () {
      this.myDiagram.startTransaction('add model')
      this.model.nodes.push({ key: `TM${new Date().getTime()}`, color: 'lightblue' })
      // this.myDiagram.model = new go.GraphLinksModel(this.model.nodes, this.model.links)
      this.myDiagram.model.addNodeData({ key: `TM${new Date().getTime()}`, color: 'lightblue' })
      this.myDiagram.commitTransaction('add model')
    }
  },
  mounted () {
    this.init()
  }
}
</script>
<style scoped>
.container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
#myDiagramDiv {
  background-color: #f8f8f8;
  border: 1px solid #aaa;
}
</style>

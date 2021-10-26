<template>
  <div>
    <div id="myDiagramDiv"
         style="width: 1200px; height: 800px"></div>
  </div>
</template>
<script>
import go from 'gojs'
// import { LinkShiftingTool } from 'gojs/extensions/LinkShiftingTool'
let $ = go.GraphObject.make
var myDiagram = null
export default {
  name: 'Panel',
  data () {
    return {

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

      myDiagram.add($(
        go.Part,
        go.Panel.Table,
        {
          // position: new go.Point(0, 0),
          background: '#eee'
        },
        $(go.TextBlock,
          { text: '一行一列', row: 0, column: 0, margin: 2, background: '#6bc1ff' }
        ),

        // 当设置了行或列的长宽时，可以通过设置alignment: go.Spot.Left/Right/Center来设定表格内元素对齐方式。
        $(go.RowColumnDefinition,
          { column: 0, width: 200, background: '#eee' }
        ),
        $(go.Shape,
          'RoundedRectangle',
          { stroke: '#3385ff', fill: '#6bc1ff', row: 0, column: 0, alignment: go.Spot.Left }
        ),
        // 通过columnSpan和rowSpan属性，可以合并单元格。
        $(go.TextBlock,
          {
            text: '顶标题',
            row: 0,
            column: 0,
            columnSpan: 3,
            stretch: go.GraphObject.Horizontal,
            margin: 2,
            background: '#6bc1ff'
          }
        )
      ))
    }
  },
  mounted () {
    this.init()
  }
}
</script>

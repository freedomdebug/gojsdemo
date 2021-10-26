<template>
  <div id="myDiagramDiv"
       style="width: 1200px; height: 800px">Table</div>
</template>
<script>
import TableLayout from '@/libs/extensions/TableLayout.js'
import go from 'gojs'
let $ = go.GraphObject.make
var myDiagram = null

// define a custom ResizingTool to limit how far one can shrink a row or column
function LaneResizingTool () {
  go.ResizingTool.call(this)
}
go.Diagram.inherit(LaneResizingTool, go.ResizingTool)

LaneResizingTool.prototype.computeMinSize = function () {
  var diagram = this.diagram
  var lane = this.adornedObject.part // might be row or column
  var horiz = (lane.category === 'Column Header') // or "Row Header"
  var margin = diagram.nodeTemplate.margin
  var bounds = new go.Rect()
  diagram.findTopLevelGroups().each(function (g) {
    if (horiz ? (g.column === lane.column) : (g.row === lane.row)) {
      var b = diagram.computePartsBounds(g.memberParts)
      if (b.isEmpty()) return // nothing in there?  ignore it
      b.unionPoint(g.location) // keep any empty space on the left and top
      b.addMargin(margin) // assume the same node margin applies to all nodes
      if (bounds.isEmpty()) {
        bounds = b
      } else {
        bounds.unionRect(b)
      }
    }
  })

  // limit the result by the standard value of computeMinSize
  var msz = go.ResizingTool.prototype.computeMinSize.call(this)
  if (bounds.isEmpty()) return msz
  return new go.Size(Math.max(msz.width, bounds.width), Math.max(msz.height, bounds.height))
}

LaneResizingTool.prototype.resize = function (newr) {
  var lane = this.adornedObject.part
  var horiz = (lane.category === 'Column Header')
  var lay = this.diagram.layout // the TableLayout
  if (horiz) {
    var col = lane.column
    var coldef = lay.getColumnDefinition(col)
    coldef.width = newr.width
  } else {
    var row = lane.row
    var rowdef = lay.getRowDefinition(row)
    rowdef.height = newr.height
  }
  lay.invalidateLayout()
}
// end LaneResizingTool class

export default {
  name: 'Table',
  data () {
    return {
    }
  },
  methods: {
    init () {
      myDiagram =
        $(go.Diagram, 'myDiagramDiv',
          {
            layout: $(TableLayout,
              $(go.RowColumnDefinition, { row: 1, height: 22 }), // fixed size column headers
              $(go.RowColumnDefinition, { column: 1, width: 22 }) // fixed size row headers
            ),
            'SelectionMoved': function (e) { e.diagram.layoutDiagram(true) },
            'resizingTool': new LaneResizingTool(),
            // feedback that dropping in the background is not allowed
            mouseDragOver: function (e) { e.diagram.currentCursor = 'not-allowed' },
            // when dropped in the background, not on a Node or a Group, cancel the drop
            mouseDrop: function (e) { e.diagram.currentTool.doCancel() },
            'animationManager.isInitial': false,
            'undoManager.isEnabled': true
          })

      myDiagram.nodeTemplateMap.add('Header', // an overall table header, at the top
        $(go.Part, 'Auto',
          {
            row: 0,
            column: 1,
            columnSpan: 9999,
            stretch: go.GraphObject.Horizontal,
            selectable: false,
            pickable: false
          },
          $(go.Shape, { fill: 'green', strokeWidth: 0 }),
          $(go.TextBlock, { alignment: go.Spot.Center, font: 'bold 12pt sans-serif' },
            new go.Binding('text'))
        ))

      myDiagram.nodeTemplateMap.add('Sider', // an overall table header, on the left side
        $(go.Part, 'Auto',
          {
            row: 1,
            rowSpan: 9999,
            column: 0,
            stretch: go.GraphObject.Vertical,
            selectable: false,
            pickable: false
          },
          $(go.Shape, { fill: 'transparent', strokeWidth: 0 }),
          $(go.TextBlock, { alignment: go.Spot.Center, font: 'bold 12pt sans-serif', angle: 270 },
            new go.Binding('text'))
        ))

      myDiagram.nodeTemplateMap.add('Column Header', // for each column header
        $(go.Part, 'Spot',
          {
            row: 1,
            rowSpan: 9999,
            column: 2,
            minSize: new go.Size(100, NaN),
            stretch: go.GraphObject.Fill,
            movable: false,
            resizable: true,
            resizeAdornmentTemplate:
              $(go.Adornment, 'Spot',
                $(go.Placeholder),
                $(go.Shape, // for changing the length of a lane
                  {
                    alignment: go.Spot.Right,
                    desiredSize: new go.Size(7, 50),
                    fill: 'lightblue',
                    stroke: 'dodgerblue',
                    cursor: 'col-resize'
                  })
              )
          },
          new go.Binding('column', 'col'),
          $(go.Shape, { fill: null },
            new go.Binding('fill', 'color')),
          $(go.Panel, 'Auto',
            { // this is positioned above the Shape, in row 1
              alignment: go.Spot.Top,
              alignmentFocus: go.Spot.Bottom,
              stretch: go.GraphObject.Horizontal,
              height: myDiagram.layout.getRowDefinition(1).height
            },
            // 泳道的颜色
            $(go.Shape, { fill: 'gray', strokeWidth: 0 }, new go.Binding('fill', 'fill')),
            $(go.TextBlock,
              {
                font: 'bold 10pt sans-serif',
                isMultiline: false,
                wrap: go.TextBlock.None,
                overflow: go.TextBlock.OverflowEllipsis,
                editable: true
              },
              new go.Binding('text'),
              new go.Binding('stroke', 'textColor'))
          )
        ))

      myDiagram.nodeTemplateMap.add('Row Sider', // for each row header
        $(go.Part, 'Spot',
          {
            row: 2,
            column: 1,
            columnSpan: 9999,
            minSize: new go.Size(NaN, 100),
            stretch: go.GraphObject.Fill,
            movable: false,
            resizable: true,
            resizeAdornmentTemplate:
              $(go.Adornment, 'Spot',
                $(go.Placeholder),
                $(go.Shape, // for changing the breadth of a lane
                  {
                    alignment: go.Spot.Bottom,
                    desiredSize: new go.Size(50, 7),
                    fill: 'lightblue',
                    stroke: 'dodgerblue',
                    cursor: 'row-resize'
                  })
              )
          },
          new go.Binding('row'),
          $(go.Shape, { fill: null },
            new go.Binding('fill', 'color')),
          $(go.Panel, 'Auto',
            { // this is positioned to the left of the Shape, in column 1
              alignment: go.Spot.Left,
              alignmentFocus: go.Spot.Right,
              stretch: go.GraphObject.Vertical,
              angle: 270,
              height: myDiagram.layout.getColumnDefinition(1).width
            },
            $(go.Shape, { fill: 'transparent', strokeWidth: 0 }),
            $(go.TextBlock,
              {
                font: 'bold 10pt sans-serif',
                isMultiline: false,
                wrap: go.TextBlock.None,
                overflow: go.TextBlock.OverflowEllipsis
              },
              new go.Binding('text'))
          )
        ))

      myDiagram.nodeTemplate = // for regular nodes within cells (groups); you'll want to extend this
        $(go.Node, 'Auto',
          { width: 100, height: 50, margin: 4 }, // assume uniform Margin, all around
          new go.Binding('row'),
          new go.Binding('column', 'col'),
          $(go.Shape, { fill: 'white' },
            new go.Binding('fill', 'color')),
          $(go.TextBlock,
            new go.Binding('text', 'key'))
        )

      myDiagram.groupTemplate = // for cells
        $(go.Group, 'Auto',
          {
            layerName: 'Background',
            stretch: go.GraphObject.Fill,
            selectable: false,
            computesBoundsAfterDrag: true,
            computesBoundsIncludingLocation: true,
            handlesDragDropForMembers: true, // don't need to define handlers on member Nodes and Links
            mouseDragEnter: function (e, group, prev) { group.isHighlighted = true },
            mouseDragLeave: function (e, group, next) { group.isHighlighted = false },
            mouseDrop: function (e, group) {
              // if any dropped part wasn't already a member of this group, we'll want to let the group's row
              // column allow themselves to be resized automatically, in case the row height or column width
              // had been set manually by the LaneResizingTool
              var anynew = e.diagram.selection.any(function (p) { return p.containingGroup !== group })
              // Don't allow headers/siders to be dropped
              var anyHeadersSiders = e.diagram.selection.any(function (p) {
                return p.category === 'Column Header' || p.category === 'Row Sider'
              })
              if (!anyHeadersSiders && group.addMembers(e.diagram.selection, true)) {
                if (anynew) {
                  e.diagram.layout.getRowDefinition(group.row).height = NaN
                  e.diagram.layout.getColumnDefinition(group.column).width = NaN
                }
              } else { // failure upon trying to add parts to this group
                e.diagram.currentTool.doCancel()
              }
            }
          },
          new go.Binding('row'),
          new go.Binding('column', 'col'),
          // the group is normally unseen -- it is completely transparent except when given a color or when highlighted
          $(go.Shape,
            {
              fill: 'transparent',
              stroke: 'transparent',
              strokeWidth: myDiagram.nodeTemplate.margin.left,
              stretch: go.GraphObject.Fill
            },
            new go.Binding('fill', 'color'),
            new go.Binding('stroke', 'isHighlighted', function (h) { return h ? 'red' : 'transparent' }).ofObject()),
          $(go.Placeholder,
            { // leave a margin around the member nodes of the group which is the same as the member node margin
              alignment: (function (m) { return new go.Spot(0, 0, m.top, m.left) })(myDiagram.nodeTemplate.margin),
              padding: (function (m) { return new go.Margin(0, m.right, m.bottom, 0) })(myDiagram.nodeTemplate.margin)
            })
        )

      myDiagram.model = new go.GraphLinksModel(
        [
          // headers
          { key: 'Header', text: '泳池1', category: 'Header' },
          { key: 'Sider', text: '阶段', category: 'Sider' },
          // column and row headers
          { key: 'swim1', text: '泳道1', col: 2, color: 'lightblue', textColor: 'green', fill: 'yellow', category: 'Column Header' },
          { key: 'swim2', text: '泳道2', col: 3, category: 'Column Header' },
          { key: 'swim3', text: '泳道3', col: 4, category: 'Column Header' },
          { key: 'swim4', text: '泳道4', col: 5, category: 'Column Header' },
          { key: 'setup1', text: '阶段1', row: 2, category: 'Row Sider' },
          { key: 'setup2', text: '阶段2', row: 3, category: 'Row Sider' },
          { key: 'setup3', text: '阶段3', row: 4, category: 'Row Sider' },
          { key: 'setup4', text: '阶段4', row: 5, category: 'Row Sider' },

          // cells, each a group assigned to a row and column
          { key: 'EmpReq', row: 2, col: 2, isGroup: true, color: 'lightyellow' },
          // { key: 'EmpApp', row: 2, col: 3, isGroup: true, color: 'lightgreen' },
          // { key: 'ManReq', row: 3, col: 2, isGroup: true, color: 'lightgreen' },
          // { key: 'ManApp', row: 3, col: 3, isGroup: true, color: 'lightyellow' },
          // { key: 'AdmReq', row: 4, col: 2, isGroup: true, color: 'lightyellow' },
          { key: 'AdmApp', row: 4, col: 3, isGroup: true, color: 'lightgreen' },

          // nodes, each assigned to a group/cell
          { key: 'Delta', color: 'orange', size: '100 100', group: 'EmpReq' },
          { key: 'Epsilon', color: 'coral', size: '100 50', group: 'EmpReq' },
          // { key: 'Zeta', color: 'tomato', size: '50 70', group: 'ManReq' },
          // { key: 'Eta', color: 'coral', size: '50 50', group: 'ManApp' },
          { key: 'Theta1', color: 'tomato', size: '100 50', group: 'AdmApp' },
          { key: 'Theta2', color: 'tomato', size: '100 50', group: 'AdmApp' },
          { key: 'Theta3', color: 'tomato', size: '100 50', group: 'AdmApp' },
          { key: 'Theta4', color: 'tomato', size: '100 50', group: 'AdmApp' },
          { key: 'Theta5', color: 'tomato', size: '100 50', group: 'AdmApp' },
          { key: 'Theta6', color: 'tomato', size: '100 50', group: 'AdmApp' },
          // single node without swim
          { key: 'Single1', color: 'tomato', size: '100 50' }
        ],
        [ // link data
          { from: 'Single1', to: 'Delta' },
          { from: 'Delta', to: 'Epsilon' },
          { from: 'Epsilon', to: 'Theta2' },
          { from: 'Theta1', to: 'Theta2' }
        ]
      )
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

import { useAsyncComponent } from '@/lib/lib_hook'

export const GeneralPage = {
  Test_Basic: {
    label: 'Basic',
    value: 'Test_Basic',
    component: useAsyncComponent<typeof import('./GeneralPage/Test_Basic/Test_Basic.vue')['default']>(
      () => import('./GeneralPage/Test_Basic/Test_Basic.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/'
  },
  Drag_Drop: {
    label: 'Drag & Drop',
    value: 'Drag_Drop',
    component: useAsyncComponent<typeof import('./GeneralPage/Drag_Drop/Drag_Drop.vue')['default']>(
      () => import('./GeneralPage/Drag_Drop/Drag_Drop.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/dnd.html'
  },
  Test_Interaction: {
    label: 'Interactions',
    value: 'Test_Interaction',
    component: useAsyncComponent<typeof import('./GeneralPage/Test_Interaction/Test_Interaction.vue')['default']>(
      () => import('./GeneralPage/Test_Interaction/Test_Interaction.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/interaction.html'
  },
  Save_Restore: {
    label: 'Save & Restore',
    value: 'Save_Restore',
    component: useAsyncComponent<typeof import('./GeneralPage/Save_Restore/Save_Restore.vue')['default']>(
      () => import('./GeneralPage/Save_Restore/Save_Restore.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/save.html'
  },
  Math_Operation: {
    label: 'Math Operation Flow',
    value: 'Math_Operation',
    component: useAsyncComponent<typeof import('./GeneralPage/Math_Operation/Math_Operation.vue')['default']>(
      () => import('./GeneralPage/Math_Operation/Math_Operation.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/math.html'
  },
  Confirm_Delete: {
    label: 'Confirm Delete',
    value: 'Confirm_Delete',
    component: useAsyncComponent<typeof import('./GeneralPage/Confirm_Delete/Confirm_Delete.vue')['default']>(
      () => import('./GeneralPage/Confirm_Delete/Confirm_Delete.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/confirm.html'
  },
  Test_Hidden: {
    label: 'Hidden',
    value: 'Test_Hidden',
    component: useAsyncComponent<typeof import('./GeneralPage/Test_Hidden/Test_Hidden.vue')['default']>(
      () => import('./GeneralPage/Test_Hidden/Test_Hidden.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/hidden.html'
  },
  Multi_Flows: {
    label: 'Multi Flows',
    value: 'Multi_Flows',
    component: useAsyncComponent<typeof import('./GeneralPage/Multi_Flows/Multi_Flows.vue')['default']>(
      () => import('./GeneralPage/Multi_Flows/Multi_Flows.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/multi.html'
  },
  Viewport_Transition: {
    label: 'Viewport Transition',
    value: 'Viewport_Transition',
    component: useAsyncComponent<typeof import('./GeneralPage/Viewport_Transition/Viewport_Transition.vue')['default']>(
      () => import('./GeneralPage/Viewport_Transition/Viewport_Transition.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/transition.html'
  },
  Teleport_Nodes: {
    label: 'Teleport Nodes',
    value: 'Teleport_Nodes',
    component: useAsyncComponent<typeof import('./GeneralPage/Teleport_Nodes/Teleport_Nodes.vue')['default']>(
      () => import('./GeneralPage/Teleport_Nodes/Teleport_Nodes.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/teleport.html'
  },
  StressTest: {
    label: 'Stress Test',
    value: 'StressTest',
    component: useAsyncComponent<typeof import('./GeneralPage/StressTest/StressTest.vue')['default']>(
      () => import('./GeneralPage/StressTest/StressTest.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/stress.html'
  }
}

export const LayoutPage = {
  Test_Layout: {
    label: 'Layout',
    value: 'Test_Layout',
    component: useAsyncComponent<typeof import('./LayoutPage/Test_Layout/Test_Layout.vue')['default']>(
      () => import('./LayoutPage/Test_Layout/Test_Layout.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/layout/simple.html'
  },
  Animation_Layout: {
    label: 'Animation and Layout',
    value: 'Animation_Layout',
    component: useAsyncComponent<typeof import('./LayoutPage/Animation_Layout/Animation_Layout.vue')['default']>(
      () => import('./LayoutPage/Animation_Layout/Animation_Layout.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/layout/animated.html'
  }
}

export const NodesPage = {
  Custom_Node: {
    label: 'Custom Node',
    value: 'Custom_Node',
    component: useAsyncComponent<typeof import('./NodesPage/Custom_Node/Custom_Node.vue')['default']>(
      () => import('./NodesPage/Custom_Node/Custom_Node.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/nodes/'
  },
  Update_Node: {
    label: 'Update Node',
    value: 'Update_Node',
    component: useAsyncComponent<typeof import('./NodesPage/Update_Node/Update_Node.vue')['default']>(
      () => import('./NodesPage/Update_Node/Update_Node.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/nodes/update-node.html'
  },
  Node_Intersections: {
    label: 'Intersections',
    value: 'Node_Intersections',
    component: useAsyncComponent<typeof import('./NodesPage/Node_Intersections/Node_Intersections.vue')['default']>(
      () => import('./NodesPage/Node_Intersections/Node_Intersections.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/nodes/intersection.html'
  },
  Nested_Nodes: {
    label: 'Nested Nodes',
    value: 'Nested_Nodes',
    component: useAsyncComponent<typeof import('./NodesPage/Nested_Nodes/Nested_Nodes.vue')['default']>(
      () => import('./NodesPage/Nested_Nodes/Nested_Nodes.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/nodes/nesting.html'
  },
  Node_Resizer: {
    label: 'Node Resizer',
    value: 'Node_Resizer',
    component: useAsyncComponent<typeof import('./NodesPage/Node_Resizer/Node_Resizer.vue')['default']>(
      () => import('./NodesPage/Node_Resizer/Node_Resizer.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/nodes/node-resizer.html'
  },
  Node_Toolbar: {
    label: 'Node Toolbar',
    value: 'Node_Toolbar',
    component: useAsyncComponent<typeof import('./NodesPage/Node_Toolbar/Node_Toolbar.vue')['default']>(
      () => import('./NodesPage/Node_Toolbar/Node_Toolbar.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/nodes/node-toolbar.html'
  }
}

export const EdgesPage = {
  Test_Edges: {
    label: 'Edges',
    value: 'Test_Edges',
    component: useAsyncComponent<typeof import('./EdgesPage/Test_Edges/Test_Edges.vue')['default']>(
      () => import('./EdgesPage/Test_Edges/Test_Edges.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/edges/'
  },
  Updatable_Edge: {
    label: 'Updatable Edge',
    value: 'Updatable_Edge',
    component: useAsyncComponent<typeof import('./EdgesPage/Updatable_Edge/Updatable_Edge.vue')['default']>(
      () => import('./EdgesPage/Updatable_Edge/Updatable_Edge.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/edges/updatable-edge.html'
  },
  Custom_Connection_Line: {
    label: 'Custom Connection Line',
    value: 'Custom_Connection_Line',
    component: useAsyncComponent<typeof import('./EdgesPage/Custom_Connection_Line/Custom_Connection_Line.vue')['default']>(
      () => import('./EdgesPage/Custom_Connection_Line/Custom_Connection_Line.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/edges/connection-line.html'
  },
  Connection_Validation: {
    label: 'Connection Validation',
    value: 'Connection_Validation',
    component: useAsyncComponent<typeof import('./EdgesPage/Connection_Validation/Connection_Validation.vue')['default']>(
      () => import('./EdgesPage/Connection_Validation/Connection_Validation.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/edges/validation.html'
  },
  Edge_Markers: {
    label: 'Edge Markers',
    value: 'Edge_Markers',
    component: useAsyncComponent<typeof import('./EdgesPage/Edge_Markers/Edge_Markers.vue')['default']>(
      () => import('./EdgesPage/Edge_Markers/Edge_Markers.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/edges/markers.html'
  },
  Connection_Radius: {
    label: 'Connection Radius',
    value: 'Connection_Radius',
    component: useAsyncComponent<typeof import('./EdgesPage/Connection_Radius/Connection_Radius.vue')['default']>(
      () => import('./EdgesPage/Connection_Radius/Connection_Radius.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/edges/connection-radius.html'
  },
  Loopback_Edges: {
    label: 'Loopback Edges',
    value: 'Loopback_Edges',
    component: useAsyncComponent<typeof import('./EdgesPage/Loopback_Edges/Loopback_Edges.vue')['default']>(
      () => import('./EdgesPage/Loopback_Edges/Loopback_Edges.vue'), 'rect'
    ),
    link: 'https://vueflow.dev/examples/edges/loopback.html'
  }
}

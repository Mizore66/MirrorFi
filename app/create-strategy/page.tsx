"use client"
import { useState, useCallback } from "react"
import type React from "react"

import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  type Node,
  type Edge,
  type Connection,
  MarkerType,
  Position,
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { CreateNodeDialog } from "@/components/create-node-dialog"
import { CustomNode } from "@/components/custom-node"

// Define node types
const nodeTypes = {
  customNode: CustomNode,
}

// Initial nodes with custom styling
const initialNodes: Node[] = [
  {
    id: "1",
    type: "customNode",
    data: {
      label: "SOL Wallet",
      description: "",
      nodeType: "deposit",
      connectionCount: 0,
    },
    position: { x: 50, y: 150 },
    sourcePosition: Position.Right,
    targetPosition: undefined,
    draggable: false
  },
]

// Initial edges with custom styling
const initialEdges: Edge[] = []

const CreateStrategyPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [open, setOpen] = useState(false)
  const [nodeToConnect, setNodeToConnect] = useState<Node | null>(null)

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            animated: true,
            style: { strokeDasharray: "5, 5" },
            markerEnd: {
              type: MarkerType.ArrowClosed,
            },
          },
          eds,
        ),
      ),
    [setEdges],
  )

  const handleCreateNode = useCallback(
    (nodeData: {
      label: string
      description: string
      nodeType: "protocol" | "token"
    }) => {
        let connectionCount = nodeToConnect ? nodeToConnect.data.connectionCount : 0;
      //Find which handle was clicked
      
      const newNode: Node = {
        id: `${nodes.length + 1}-${Date.now()}`,
        type: "customNode",
        data: nodeData,
        position: {
          x: nodeToConnect ? nodeToConnect.position.x + 400 : Math.random() * 300 + 200,
          y: nodeToConnect ? nodeToConnect.position.y + ((-1)**connectionCount)*200*(Math.ceil(connectionCount/2)): Math.random() * 300 + 50,
        },
      }

      
      // Update connection count for the node being connected to
      connectionCount += 1;
      if (nodeToConnect) {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === nodeToConnect.id) {
            return { ...n, data: { ...n.data, connectionCount } }
          }
          return n
        }),
      )
    }

      setNodes((nds) => [...nds, newNode])

      if (nodeToConnect) {
        const newEdge: Edge = {
          id: `e${nodeToConnect.id}-${newNode.id}`,
          source: nodeToConnect.id,
          target: newNode.id,
          animated: true,
          style: { strokeDasharray: "5, 5" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
        }
        setEdges((eds) => [...eds, newEdge])
      }

      setNodeToConnect(null)
    },
    [nodes, setNodes, nodeToConnect, setEdges],
  )

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setNodeToConnect(node)
      setOpen(true)
    },
    [],
  )

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <header className="flex items-center justify-between p-6 bg-card border-b border-border">
        <div className="flex items-center space-x-4">
          <img src="/SVG/MirrorFi-Logo-Blue.svg" alt="MirrorFi Logo" className="h-8 w-auto" />
          <h1 className="text-xl font-semibold">Create Yield Strategy</h1>
        </div>
      </header>

      <main className="flex-1">
        <CreateNodeDialog onCreateNode={handleCreateNode} isOpen={open} onClose={() => setOpen(false)} />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          defaultViewport={{
            zoom: 0.7,
            x: initialNodes[0]?.position.x*2 || 0,
            y: initialNodes[0]?.position.y*1.5 || 0,
          }} // Align viewport with the initial nodes
          className="bg-background"
        >
          <Controls className="bg-card border border-border text-foreground" />
          <Background color="#3b82f6" gap={16} size={1} />
        </ReactFlow>
      </main>
    </div>
  )
}

export default CreateStrategyPage

import { Handle, Position, type NodeProps } from "reactflow"

type NodeData = {
  label: string
  description?: string
  nodeType?: "protocol" | "token"
  percentage?: string
  connectionCount: number
}

export function CustomNode({ data, isConnectable }: NodeProps<NodeData>) {
  const nodeClass = `custom-node node-${data.nodeType || "default"}`

  return (
    <div className={nodeClass}>
      <div className="custom-node-header">{data.label}</div>
      {data.description && <div className="custom-node-content">{data.description}</div>}
      {data.percentage && <div className="custom-node-content">{data.percentage}</div>}
      <Handle type="source" position={Position.Right} isConnectable={isConnectable} />
      {/* Render handle only if label of node isn't "SOL Wallet" */}
      {data.label !== "SOL Wallet" && (
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} />
      )}
    </div>
  )
}
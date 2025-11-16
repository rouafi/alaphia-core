"use client"

import { useMemo } from "react"
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
} from "reactflow"

import "reactflow/dist/style.css"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/Card"
import { PageHeader } from "@/components/ui/PageHeader"

const baseNodeStyle = {
  borderRadius: 16,
  padding: 12,
  border: "1px solid rgba(255,255,255,0.08)",
  background: "#111827",
  color: "#F8FAFC",
  fontSize: 13,
  fontWeight: 500,
  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.45)",
}

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 120 },
    data: { label: "HQ · Vision" },
    style: baseNodeStyle,
  },
  {
    id: "2",
    position: { x: -120, y: 20 },
    data: { label: "Product Design" },
    style: { ...baseNodeStyle, background: "#1A2234" },
  },
  {
    id: "3",
    position: { x: 140, y: 40 },
    data: { label: "Growth Ops" },
    style: { ...baseNodeStyle, background: "#1A2234" },
  },
  {
    id: "4",
    position: { x: -180, y: 200 },
    data: { label: "Customer Champions" },
    style: { ...baseNodeStyle, background: "#0F172A" },
  },
  {
    id: "5",
    position: { x: 160, y: 220 },
    data: { label: "Advisors" },
    style: { ...baseNodeStyle, background: "#0F172A" },
  },
  {
    id: "6",
    position: { x: -20, y: -60 },
    data: { label: "AI Research" },
    style: { ...baseNodeStyle, background: "#3B82F6" },
  },
]

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", type: "smoothstep" },
  { id: "e1-3", source: "1", target: "3", type: "smoothstep" },
  { id: "e1-4", source: "1", target: "4", type: "smoothstep" },
  { id: "e1-5", source: "1", target: "5", type: "smoothstep" },
  { id: "e2-6", source: "2", target: "6", type: "smoothstep" },
  { id: "e3-6", source: "3", target: "6", type: "smoothstep" },
  { id: "e4-3", source: "4", target: "3", type: "smoothstep" },
]

export default function NetworkPage() {
  const nodes = useMemo(() => initialNodes, [])
  const edges = useMemo(
    () =>
      initialEdges.map((edge) => ({
        ...edge,
        animated: true,
        style: { stroke: "rgba(59,130,246,0.5)", strokeWidth: 1.5 },
      })),
    []
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="Network graph"
        description="Visualize how champions, buyers, and advisors connect across your Aphilia workspace."
        actions={
          <Button className="bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90">
            Sync CRM
          </Button>
        }
      />

      <Card className="p-0">
        <div className="border-b border-white/5 px-6 py-4">
          <p className="text-sm font-semibold text-white">Relationship map</p>
          <p className="text-sm text-white/60">
            Drag nodes around to explore key champions and influence paths.
          </p>
        </div>
        <div className="reactflow-wrapper h-[540px] w-full bg-[#020617]">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            style={{
              background: "linear-gradient(135deg, #020617 0%, #0F172A 100%)",
            }}
          >
            <Background
              gap={24}
              size={1}
              color="rgba(148,163,184,0.25)"
            />
            <Controls
              className="!bg-[#111827]/80 !text-white"
              showInteractive={false}
            />
          </ReactFlow>
        </div>
      </Card>
    </div>
  )
}


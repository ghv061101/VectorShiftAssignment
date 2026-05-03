import { useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { withNodeDataUpdater } from "./flow/useNodeDataUpdater";
import TextNode from "./nodes/TestNode";
import {
  PromptTemplateNode,
  JsonParseNode,
  JoinTextNode,
  DelayNode,
  RegexExtractNode,
} from "./nodes/custom/index.jsx";
import { submitPipeline } from "./submit";
import logo from "./assets/hero.png";

const initialNodes = [
  {
    id: "1",
    type: "text",
    position: { x: 50, y: 150 },
    data: {
      text: "Hero: Dragon Slayer\nCity: Crystal Falls",
    },
  },
  {
    id: "2",
    type: "promptTemplate",
    position: { x: 350, y: 80 },
    data: {
      template:
        "Write a short fantasy tale where {{text}} uncovers an ancient secret.",
    },
  },
  {
    id: "3",
    type: "joinText",
    position: { x: 350, y: 240 },
    data: { sep: " → " },
  },
  {
    id: "4",
    type: "delay",
    position: { x: 650, y: 160 },
    data: { ms: 500 },
  },
  {
    id: "5",
    type: "regexExtract",
    position: { x: 900, y: 150 },
    data: { pattern: "\\b[A-Z][a-z]+\\b" },
  },
];

const initialEdges = [
  { id: "e1-2", source: "1", target: "2", animated: true },
  { id: "e1-3", source: "1", target: "3", animated: true },
  { id: "e2-4", source: "2", target: "4", animated: true },
  { id: "e4-5", source: "4", target: "5", animated: true },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onChange = useMemo(() => withNodeDataUpdater(setNodes), [setNodes]);
  const nodeTypes = useMemo(
    () => ({
      text: TextNode,
      promptTemplate: PromptTemplateNode,
      jsonParse: JsonParseNode,
      joinText: JoinTextNode,
      delay: DelayNode,
      regexExtract: RegexExtractNode,
    }),
    []
  );

  const nodesWithChange = nodes.map((n) => ({
    ...n,
    data: { ...(n.data ?? {}), onChange },
  }));

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const handleSubmit = async () => {
    const loadingToast = toast.loading("Running pipeline...");
    try {
      await submitPipeline({ nodes: nodesWithChange, edges });
      toast.dismiss(loadingToast);
    } catch (e) {
      toast.dismiss(loadingToast);
      toast.error(e.message || "Failed to submit pipeline");
    }
  };

  return (
    <div className="app-shell">
      <Toaster position="top-right" />
      <header className="app-header glassy">
        <div className="brand">
          <img
            src={logo}
            alt="logo"
            className="logo"
          />
          <div>
            <span className="brand-title">VectorShift Playground</span>
            <div className="brand-tag">Design flow-based stories, automations, and prompts.</div>
          </div>
        </div>
        <button className="vs-btn" onClick={handleSubmit}>
          Run the pipeline
        </button>
      </header>

      <main className="app-main">
        <div className="reactflow-wrapper">
          <ReactFlow
            nodes={nodesWithChange}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            style={{ width: '100%', height: '100%' }}
          >
            <Background
              variant="dots"
              gap={18}
              size={1.2}
              color="#d1d5db"
            />
            <MiniMap
              nodeColor={() => "#2563eb"}
              maskColor="rgba(37,99,235,0.1)"
            />
            <Controls />
          </ReactFlow>
        </div>
      </main>
    </div>
  );
}
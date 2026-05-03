import toast from "react-hot-toast";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function detectCycle(nodes, edges) {
  const graph = new Map();
  const visited = new Map();

  nodes.forEach((node) => graph.set(node.id, []));
  edges.forEach((edge) => {
    if (graph.has(edge.source)) {
      graph.get(edge.source).push(edge.target);
    }
  });

  function dfs(nodeId) {
    if (visited.get(nodeId) === "visiting") return true;
    if (visited.get(nodeId) === "visited") return false;

    visited.set(nodeId, "visiting");
    for (const neighbor of graph.get(nodeId) || []) {
      if (dfs(neighbor)) return true;
    }
    visited.set(nodeId, "visited");
    return false;
  }

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId) && dfs(nodeId)) return true;
  }

  return false;
}

function localPipelineResult({ nodes, edges }) {
  return {
    num_nodes: nodes.length,
    num_edges: edges.length,
    is_dag: !detectCycle(nodes, edges),
  };
}

export async function submitPipeline({ nodes, edges }) {
  const payload = {
    nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data || {} })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
  };

  try {
    const res = await fetch(`${API_BASE}/pipelines/parse`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Server error: ${res.status} ${res.statusText}`);
    }

    const json = await res.json();
    const message = `Nodes: ${json.num_nodes} | Edges: ${json.num_edges} | Is DAG: ${
      json.is_dag ? "✅" : "❌"
    }`;
    toast.success(message, { duration: 5000 });
  } catch (error) {
    const fallback = localPipelineResult(payload);
    const message = `[Local] Nodes: ${fallback.num_nodes} | Edges: ${fallback.num_edges} | Is DAG: ${
      fallback.is_dag ? "✅" : "❌"
    }`;
    toast.info(message, { duration: 5000 });
  }
}
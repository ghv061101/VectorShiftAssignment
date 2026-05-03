from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="Pipeline Parser",
    description="Simple backend for the frontend pipeline editor.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"] ,
    allow_headers=["*"] ,
)


class Node(BaseModel):
    id: str
    type: str
    data: dict = {}


class Edge(BaseModel):
    id: str
    source: str
    target: str


class PipelinePayload(BaseModel):
    nodes: List[Node]
    edges: List[Edge]


class PipelineResponse(BaseModel):
    num_nodes: int
    num_edges: int
    is_dag: bool


def _is_dag(nodes: List[Node], edges: List[Edge]) -> bool:
    graph = {node.id: [] for node in nodes}
    for edge in edges:
        if edge.source in graph:
            graph[edge.source].append(edge.target)
        else:
            graph[edge.source] = [edge.target]

    visited = {}

    def dfs(node_id: str) -> bool:
        state = visited.get(node_id)
        if state == "visiting":
            return False
        if state == "visited":
            return True

        visited[node_id] = "visiting"
        for neighbor in graph.get(node_id, []):
            if not dfs(neighbor):
                return False
        visited[node_id] = "visited"
        return True

    return all(dfs(node_id) for node_id in graph)


@app.post("/pipelines/parse", response_model=PipelineResponse)
async def parse_pipeline(payload: PipelinePayload):
    return PipelineResponse(
        num_nodes=len(payload.nodes),
        num_edges=len(payload.edges),
        is_dag=_is_dag(payload.nodes, payload.edges),
    )

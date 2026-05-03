# VectorShift Backend

A FastAPI server that powers the VectorShift Playground pipeline editor. Validates and analyzes node-and-edge graph pipelines.

## Features

- **Pipeline Parsing** — Accepts node/edge definitions and validates structure
- **DAG Detection** — Determines if the graph is acyclic using DFS cycle detection
- **CORS Support** — Allows requests from local frontend development
- **Type Safety** — Pydantic models for request/response validation

## API Endpoints

### `POST /pipelines/parse`

Validates a pipeline and returns metrics.

**Request:**
```json
{
  "nodes": [
    { "id": "1", "type": "text", "data": { "text": "Example" } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2" }
  ]
}
```

**Response:**
```json
{
  "num_nodes": 1,
  "num_edges": 1,
  "is_dag": true
}
```

## Installation

### Prerequisites
- Python 3.8+
- pip

### Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv .venv
.\\.venv\\Scripts\\activate  # Windows
source .venv/bin/activate    # macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

- **Interactive Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Environment Variables

No environment variables are required for local development. Default behavior:
- Server runs on `localhost:8000`
- CORS allows all origins (`*`)

## Project Structure

```
backend/
├── main.py           # FastAPI app and route handlers
├── requirements.txt  # Python dependencies
└── README.md         # This file
```

## Dependencies

- **fastapi** — Modern web framework
- **uvicorn** — ASGI server
- **pydantic** — Data validation

See `requirements.txt` for versions.

## Development

### Testing the API

Using curl:
```bash
curl -X POST http://localhost:8000/pipelines/parse \
  -H "Content-Type: application/json" \
  -d '{
    "nodes": [{"id": "1", "type": "text", "data": {}}],
    "edges": []
  }'
```

Using FastAPI interactive docs at http://localhost:8000/docs

## Algorithm Notes

**Cycle Detection:**
- Uses depth-first search (DFS) with three states: "visiting", "visited", and unvisited
- A cycle exists if we encounter a node in "visiting" state
- Time complexity: O(V + E) where V = nodes, E = edges

## License

MIT

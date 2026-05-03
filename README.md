# VectorShift — Full Stack Pipeline Editor

A complete full-stack application for designing, visualizing, and validating data flow pipelines. Features a React-based frontend editor and a FastAPI backend for pipeline analysis.

## Overview

**VectorShift Playground** is an interactive platform where users can:
- Visually design complex data pipelines using drag-and-drop nodes
- Connect nodes to create data flow graphs
- Validate graph structure (detect cycles, count components)
- Get real-time feedback with toast notifications
- Use local fallback validation when backend is unavailable

---

## Quick Start

### Prerequisites
- **Node.js** 16+ and **npm** (for frontend)
- **Python** 3.8+ and **pip** (for backend)

### 1. Start the Backend

```bash
cd backend
python -m venv .venv
.\\.venv\\Scripts\\activate  # Windows
source .venv/bin/activate    # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend will run at: `http://localhost:8000`

### 2. Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at: `http://localhost:5173` (or next available port)

### 3. Test the App

1. Open browser to frontend URL
2. View the pre-loaded example pipeline
3. Click **"Run the pipeline"** to submit
4. See results in a toast notification

---

## Project Structure

```
amn/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── requirements.txt      # Python dependencies
│   └── README.md            # Backend documentation
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main app component
│   │   ├── index.css        # Global styles
│   │   ├── submit.js        # Pipeline API integration
│   │   ├── nodes/           # Node component definitions
│   │   └── flow/            # React Flow utilities
│   ├── .env                 # Backend URL config
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.js       # Vite configuration
│   └── README.md            # Frontend documentation
│
└── README.md                # This file
```

---

## Architecture

### Frontend (React + React Flow)
- **Port:** 5173 (Vite dev server)
- **Framework:** React 19 with modern hooks
- **Graph Editor:** React Flow with custom node types
- **Styling:** Tailwind CSS + custom CSS
- **Notifications:** react-hot-toast
- **State Management:** React hooks

### Backend (FastAPI)
- **Port:** 8000
- **Framework:** FastAPI with Pydantic
- **Server:** Uvicorn (ASGI)
- **API:** RESTful JSON endpoints
- **Validation:** Cycle detection, DAG analysis

### Communication
- Frontend POST to `{VITE_BACKEND_URL}/pipelines/parse`
- Response includes node count, edge count, and DAG status
- Fallback local validation if backend unavailable

---

## API Reference

### Backend Endpoint

**POST** `/pipelines/parse`

Parse and validate a pipeline graph.

**Request:**
```json
{
  "nodes": [
    {"id": "1", "type": "text", "data": {"text": "input"}},
    {"id": "2", "type": "promptTemplate", "data": {}}
  ],
  "edges": [
    {"id": "e1-2", "source": "1", "target": "2"}
  ]
}
```

**Response:**
```json
{
  "num_nodes": 2,
  "num_edges": 1,
  "is_dag": true
}
```

---

## Node Types

### Available Nodes

| Type | Purpose | Example |
|------|---------|---------|
| **Text** | Raw text input with variable detection | `Hello {{name}}` |
| **Prompt Template** | AI prompt with variable substitution | `Greet {{text}}` |
| **Join Text** | Combine multiple inputs | Separator: ` → ` |
| **Delay** | Add processing delay | Duration: 500ms |
| **Regex Extract** | Pattern matching | Pattern: `\b[A-Z][a-z]+\b` |
| **JSON Parse** | Structured data parsing | (placeholder) |

### Variable Syntax
- Use `{{variableName}}` in text nodes
- Auto-detected and creates input handles
- Can connect from other node outputs

---

## Example Pipeline

The app comes with a pre-loaded example:

1. **Text Node** (`Dragon Slayer` + `Crystal Falls`)
2. **Prompt Template** (writes fantasy tale)
3. **Join Text** (combines with ` → `)
4. **Delay** (500ms processing)
5. **Regex Extract** (extracts proper nouns)

All nodes are connected with animated edges showing data flow.

---

## Configuration

### Backend

No configuration needed for local development. Default:
- Runs on `localhost:8000`
- CORS allows all origins
- Uses in-memory graph validation

### Frontend

Create `.env` in `frontend/` directory:
```env
VITE_BACKEND_URL=http://localhost:8000
```

If not set, defaults to `http://localhost:8000`

---

## Development Workflow

### Common Commands

**Frontend:**
```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

**Backend:**
```bash
cd backend
uvicorn main:app --reload              # Dev server with auto-reload
uvicorn main:app --port 8001           # Custom port
python -m pytest                        # Run tests (if added)
```

### Adding New Node Types

1. Create component in `frontend/src/nodes/custom/`
2. Export with `buildNode()` wrapper
3. Register in `App.jsx` `nodeTypes` map
4. Add to initial nodes or create in editor

### Debugging

**Frontend:**
- Open browser DevTools (F12)
- Check Network tab for API calls
- Look for console errors

**Backend:**
- Check terminal output for request logs
- Use FastAPI interactive docs: http://localhost:8000/docs
- Test with curl or Postman

---

## Features & Capabilities

### ✅ Completed

- React Flow visual editor with multiple node types
- Real-time variable detection in text nodes
- Pipeline submission to backend or local validation
- Toast notifications for user feedback
- DAG cycle detection algorithm
- Dark theme with glassmorphic UI
- Animated edges and minimap
- Responsive container sizing

### 🔄 Possible Enhancements

- Undo/redo functionality
- Save/load pipeline configurations
- Node search and palette
- Custom node builder UI
- Export pipeline as JSON/YAML
- Pipeline execution simulation
- Collaborative editing
- Advanced styling customization

---

## Troubleshooting

### Frontend Issues

| Problem | Solution |
|---------|----------|
| "Failed to fetch" | Check backend is running on `http://localhost:8000` |
| Blank canvas | Clear cache, restart dev server |
| Nodes not appearing | Check browser console for errors |
| No notifications | Verify `.env` has correct backend URL |

### Backend Issues

| Problem | Solution |
|---------|----------|
| Port 8000 in use | Use `--port 8001` or kill existing process |
| Import errors | Run `pip install -r requirements.txt` |
| CORS errors | Verify `add_middleware(CORSMiddleware...)` in main.py |
| Invalid JSON | Check request format matches schema |

---

## Tech Stack

### Frontend
- React 19
- React Flow 11+
- react-hot-toast
- Tailwind CSS 4
- Vite
- ESLint

### Backend
- FastAPI
- Uvicorn
- Pydantic
- Python 3.8+

---

## Performance Notes

- **Frontend:** Optimized with memoized node types and component updates
- **Backend:** DFS cycle detection scales O(V + E) with graph size
- **Network:** Single POST request per pipeline submission
- **Memory:** No persistent state; stateless on backend

---


---

## Support

For issues or feature requests, check the individual README files:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

Or refer to inline code comments for specific implementation details.
#

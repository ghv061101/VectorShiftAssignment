# VectorShift Playground

A modern, interactive React-based flow editor for designing data pipelines and automations. Built with React Flow, Tailwind CSS, and react-hot-toast notifications.

## Features

- **Visual Node Editor** — Drag, connect, and arrange pipeline nodes
- **Pre-built Node Types:**
  - **Text** — Input raw text and template variables
  - **Prompt Template** — AI prompt generation with variable interpolation
  - **JSON Parse** — Parse structured data
  - **Join Text** — Concatenate multiple inputs
  - **Delay** — Introduce timing delays
  - **Regex Extract** — Extract patterns from text
- **Real-time Graph Analysis** — Validates DAG structure and node/edge count
- **Toast Notifications** — Non-blocking feedback on pipeline submission
- **Responsive Design** — Dark theme with gradient backgrounds and glassmorphic UI

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file to configure the backend URL (optional):
```env
VITE_BACKEND_URL=http://localhost:8000
```

## Running

### Development Server
```bash
npm run dev
```

The app will start at `http://localhost:5173` (or next available port)

### Production Build
```bash
npm run build
```

Optimized bundle is output to `dist/`

### Preview Build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## Project Structure

```
frontend/
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
├── .env                    # Backend URL config
├── src/
│   ├── main.jsx           # App entry point
│   ├── App.jsx            # Main app component
│   ├── App.css            # App styles
│   ├── index.css          # Global styles
│   ├── submit.js          # Pipeline submission logic
│   ├── assets/            # Images and icons
│   ├── flow/
│   │   └── useNodeDataUpdater.js  # Node state management
│   └── nodes/
│       ├── factory.jsx           # Generic node builder
│       ├── NodeShell.jsx         # Common node wrapper
│       ├── TestNode.jsx          # Text node implementation
│       └── custom/
│           └── index.jsx         # Custom node types
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── README.md
```

## Key Components

**App.jsx**
- Main application container
- Manages React Flow state (nodes, edges)
- Handles pipeline submission

**TextNode.jsx**
- Dynamic variable detection using regex
- Auto-sizing textarea
- Real-time handle generation for each variable

**NodeShell.jsx**
- Wrapper for all node types
- Manages input/output handles

**submit.js**
- POST pipeline to backend or use local validation fallback
- Displays results via toast notifications

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_BACKEND_URL` | `http://localhost:8000` | FastAPI backend endpoint |

### Styling

Global styles in `index.css`:
- Dark theme with radial gradients
- Glassmorphic header
- Animated nodes with React Flow
- Responsive layout

## Dependencies

- **react** `^19.2.5` — UI framework
- **react-dom** `^19.2.5` — DOM rendering
- **reactflow** `^11+` — Visual node editor
- **react-hot-toast** `^2+` — Toast notifications
- **tailwindcss** `^4.2.4` — Utility CSS
- **@tailwindcss/vite** `^4.2.4` — Tailwind Vite plugin
- **@vitejs/plugin-react** `^6.0.1` — React Vite plugin

## Creating Custom Nodes

1. Define the node using `buildNode()`:
```jsx
export const MyNode = buildNode({
  title: "My Node",
  inputs: [{ id: "input1" }],
  outputs: [{ id: "output1" }],
  render: ({ id, data }) => <div>Node content</div>,
});
```

2. Register in `App.jsx`:
```jsx
const nodeTypes = useMemo(() => ({
  myNode: MyNode,
  // ...
}), []);
```

3. Use in initial nodes:
```jsx
{ id: "1", type: "myNode", position: { x: 0, y: 0 }, data: {} }
```

## Submission Flow

1. Click **"Run the pipeline"** button
2. Loading toast appears
3. Frontend sends nodes/edges to backend POST `/pipelines/parse`
4. Backend validates graph and returns metrics
5. Success toast displays results or fallback local validation

## Local Backend Fallback

If the backend is unavailable, the app still validates pipelines locally:
- Counts nodes and edges
- Performs local DAG cycle detection
- Shows results via info toast

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank canvas | Ensure React Flow container has explicit height (check CSS) |
| Nodes not visible | Verify `nodeTypes` is memoized in App.jsx |
| Backend connection fails | Check `VITE_BACKEND_URL` in `.env` and backend port |
| Notifications not showing | Verify `<Toaster />` is in App.jsx JSX |

## Development Tips

- **Node Data Flow:** Use `data.onChange(id, { key: value })` to update node settings
- **Auto Height:** TextNode textarea auto-expands with content
- **Variable Detection:** Regex pattern `{{variable}}` is auto-detected
- **Connection Animation:** Edges have `animated: true` for visual feedback

## License

MIT

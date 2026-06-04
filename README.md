# 🧙‍♂️ React Sokoban Puzzle Engine

A tile-based puzzle game built with React and Vite based on the classic "Sokoban" mechanics. The player controls a wizard character tasked with pushing crates/blocks onto designated target goal spaces within a grid-based map.

## 🚀  Features

- **Dynamic Grid Rendering:** The entire tile map grid layer, player initialization position, and movable block entities are systematically generated from a data array matrix.
- **Custom Controls:** Keyboard Arrow keys provide smooth layout navigation. Page scrolling behaviors are automatically overridden.
- **Collision Physics Engine:** Implements solid wall stopping logic.
- **Push Mechanics:** The wizard can push exactly **one** block into an open space or goal at a time. Pushing two adjacent blocks or pushing a block into a wall is physically restricted.
- **Victory Assessment:** Real-time matrix evaluation triggers a success overlay notice the exact moment all dynamic blocks occupy goal spaces.

---

## 🛠️ Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Language:** JavaScript (JSX)
- **Styling:** CSS Grid & Flexbox layouts

---

## 📦 Project Directory Layout

```text
sokoban-react/
├── src/
│   ├── App.jsx            # Core layout wrapper and game engine loops
│   ├── main.jsx           # Application mount controller
│   └── sokobanbase.js     # Shared assignment array configuration matrix
├── index.html             # Local dev template window frame
└── package.json           # Scripts and asset module dependencies

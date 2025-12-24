
## Data Table Features

**Sorting:**

- Click header → sort asc/desc/none.
- Shift+Click → add/remove secondary sort levels.
- Sort indicators show direction and priority (1,2,…).

**Column chooser:**

- Button “Columns ▾” in top right.
- Right-click any header to open menu at cursor.
- Column visibilities are remembered across app restarts.

**Column reordering:**

- Drag a header and drop onto another header to reorder.
- Order is remembered in localStorage.

**Column resizing:**

Hover at right edge of header, drag left/right.

Widths are persisted.

**Auto-scroll:**

- When user stays at bottom: new rows auto-follow.
- If user scrolls up: auto-follow pauses until back at bottom.

**Virtualization:**

- Only visible rows are rendered → snappy even with 100k+ records.

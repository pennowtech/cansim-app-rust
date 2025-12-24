# TODO List

- [] 1. Read message format or structure from a plug-n-play schema file
- [] Raw log decoding (candump → structured messages)
- [] CSV export/import from Rust side
- [] MQTT backend with async streaming
- [] 2. Implement message encoding and decoding based on the schema
- [] 3. Develop a user interface for loading and managing schema files
- [] 4. Add error handling for invalid or incompatible schema files
- [] 5. Create documentation and examples for using schema files with the CAN tool
- [] Windows CAN: Use a CAN-over-TCP bridge (works great for dev + mixed environments) <br />
  Run SocketCAN only on Linux (real or virtual), and for Windows you connect to it via a network bridge.
  Examples:
  A small daemon on Linux that reads SocketCAN and exposes frames over TCP/WebSocket
  Tauri app speaks to that daemon on both platforms
  Pros: app code stays mostly the same; Windows works without vendor APIs
  Cons: Windows needs access to a Linux machine/VM/WSL that has CAN

- [] Basic CAN message sending and receiving
- [] Logging of CAN messages to a file
- [] Command-line interface for sending/receiving messages
- [] Configuration file support for setting CAN interface parameters
- [] Timestamping of received CAN messages
- [] Filtering of CAN messages based on ID
- [] Support for different CAN bitrates
- [] Error frame handling
- [] Support for multiple CAN interfaces
- [] Real-time display of CAN messages in terminal
- [] Integration with existing CAN libraries (e.g., SocketCAN)
- [] Unit tests for CAN message handling
- [] Graceful shutdown and cleanup of CAN interfaces
- [] CAN message filtering
- [] WebSocket backend for real-time updates
- [] Raw log decoding (candump → structured messages)
- [] CSV export/import from Rust side
- [] MQTT backend with async streaming
- [] GUI for visualizing CAN data
- [] Unit tests for core functionalities
- [] Documentation for API and usage instructions
- [] Performance optimizations for high-throughput CAN data
- [] Support for additional CAN protocols (e.g., CAN FD)
- [] Integration with popular CAN hardware interfaces
- [] Error handling and logging improvements
- [] User authentication and access control for web interface
- [] Configuration management (e.g., saving/loading settings)
- [] Docker containerization for easy deployment
- [] Cross-platform support (Windows, Linux, macOS)
- [] Benchmarking and profiling tools for performance analysis
- [] Community contributions and plugin system
- [] Continuous integration and deployment setup
- [] Localization and internationalization support
- [] Mobile app for remote CAN monitoring
- [] Data visualization tools (graphs, charts)
- [] Alerting system for specific CAN events
- [] Historical data storage and retrieval
- [] Integration with cloud services for data backup and analysis
- [] Support for multiple CAN interfaces simultaneously
- [] Real-time data analytics and processing
- [] User-friendly installation scripts and guides
- [] API for third-party integrations
- [] Support for different data formats (JSON, XML)
- [] Customizable dashboards for data monitoring
- [] Scheduled tasks for periodic data processing
- [] Backup and restore functionality for configurations and data
- [] Community forum or support channel for users
- [] Regular updates and maintenance for dependencies
- [] Security audits and vulnerability assessments
- [] Training materials and tutorials for new users
- [] Feedback system for user suggestions and bug reports
- [] Integration with version control systems for configuration tracking
- [] Support for advanced CAN features (e.g., error frames, remote frames)
- [] Collaboration tools for team-based CAN monitoring projects
- [] Automated testing framework for continuous quality assurance
- [] Scalability improvements for large-scale CAN networks
- [] Energy-efficient operation modes for embedded systems
- [] Integration with machine learning models for predictive analysis
- [] Support for custom CAN message formats and protocols
- [] Real-time collaboration features for multiple users
- [] Voice command support for hands-free operation
- [] Augmented reality interface for CAN data visualization


**Filtering:**

- Click funnel icon in header → filter menu.
- Text columns: contains, equals, starts with, ends with, is empty, is not empty.
- Numeric/date columns: equals, not equals, greater than, less than, between, is empty, is not empty.
- Multiple filters per column allowed (OR logic).
- Filters across columns combined with AND logic.
- Active filters shown in header with count.
- Clear individual filters or all filters at once.
- Filter states are remembered across app restarts.

**Pagination:**

- Controls at bottom: first, previous, next, last page.
- Select rows per page: 10, 25, 50, 100, 250, 500, 1000.
- Shows current page and total pages.
- Pagination state is remembered across app restarts.
- Works with filtering and sorting.
**Row selection:**
- Click row → select/deselect.
- Shift+Click → select range.
- Ctrl/Cmd+Click → toggle individual row selection.
- Select all checkbox in header → select/deselect all on current page.
- Selected row count shown in footer.
- Selection state is remembered across pagination and filtering.
**Exporting:**
- Button “Export ▾” in top right.
- Export current view (filtered/sorted) to CSV or Excel.
- Export all data (ignoring pagination) to CSV or Excel.
- Export selected rows to CSV or Excel.
- Exports include column headers.
- Large exports handled in background with progress indicator.
**Row details:**
- Click row → expand/collapse details panel below row.
- Details panel shows all column values and additional info.
- Only one row can be expanded at a time.
- Expanded row state is remembered across pagination.
**Keyboard navigation:**
- Arrow Up/Down → move selection up/down.
- Page Up/Down → scroll up/down one page.
- Home/End → go to first/last row.
- Enter → expand/collapse row details.
- Ctrl/Cmd+A → select all rows on current page.
- Esc → clear selection.
**Context menu:**
- Right-click row → context menu with actions (e.g., copy, delete, export).
- Context menu adapts to selection (e.g., bulk actions if multiple rows selected).
- Context menu options can be customized by developers.
**Performance optimizations:**
- Debounced filtering and sorting to prevent excessive re-renders.
- Memoization of row rendering to improve responsiveness.
- Efficient data structures for managing state (e.g., selected rows, filters).
- Lazy loading of large datasets when applicable.
**Accessibility:**
- ARIA roles and attributes for screen readers.
- Keyboard navigable controls and actions.
- Sufficient color contrast for text and UI elements.
- Focus indicators for interactive elements.
**Customization:**
- Developers can customize cell rendering (e.g., custom formatters).
- Custom filter components can be provided for specific columns.
- Theming support for colors, fonts, and styles.
- Plugin architecture for adding new features or integrations.
**Internationalization:**
- Support for multiple languages in UI text.
- Date and number formatting based on locale.
- Right-to-left (RTL) layout support.
**State persistence:**
- User preferences (e.g., column visibility, order, widths, filters, sorting, pagination) are saved in localStorage.
- Preferences are loaded on app start to restore user state.
- Option to reset to default settings.
**Responsive design:**
- Table layout adapts to different screen sizes.
- Horizontal scrolling for wide tables on small screens.
- Touch-friendly interactions for mobile devices.
**Developer API:**
- Well-documented API for integrating the table component.
- Hooks and callbacks for custom behavior (e.g., onRowClick, onFilterChange).
- TypeScript support with type definitions.
- Examples and demos for common use cases.
**Testing:**
- Comprehensive unit and integration tests.
- Performance benchmarks to ensure responsiveness.
- Accessibility testing to ensure compliance with standards.
- Cross-browser compatibility testing.
**Documentation:**
- Detailed user guide for end-users.
- Developer documentation with API reference.
- Tutorials and examples for common scenarios.
- FAQ and troubleshooting section.
**Support and maintenance:**
- Regular updates with new features and bug fixes.
- Community support forums or channels.
- Issue tracking for reporting bugs and requesting features.
- Contribution guidelines for open-source contributions.
**Integration:**
- Easy integration with popular frameworks (e.g., React, Vue, Angular).
- Support for server-side data fetching and pagination.
- Compatibility with state management libraries (e.g., Redux, Vuex).
- WebSocket support for real-time data updates.
**Security:**
- Protection against XSS attacks in cell rendering.
- Secure handling of user data and preferences.
- Compliance with data privacy regulations (e.g., GDPR).
- Regular security audits and updates.
**Backup and restore:**
- Option to export user settings to a file.
- Option to import user settings from a file.
- Automatic backups of user settings at regular intervals.
- Restore settings to a previous backup if needed.
**Analytics and logging:**
- Track user interactions with the table (e.g., sorting, filtering).
- Log performance metrics for table operations.
- Provide insights into usage patterns for future improvements.
- Option to disable analytics for privacy-conscious users.
**Collaboration features:**
- Real-time collaboration with multiple users editing/viewing the table.
- Change tracking and version history for table data.
- User presence indicators to show who is viewing/editing.
- Commenting system for discussing specific rows or data points.
**Mobile support:**
- Optimized touch interactions for mobile devices.
- Responsive layout for various screen sizes.
- Offline support for viewing and editing data.
- Mobile-specific features (e.g., swipe to select).
**Advanced filtering:**
- Support for complex filter expressions (AND/OR logic).
- Save and load filter presets.
- Filter by related data (e.g., foreign key relationships).
- Visual filter builder for non-technical users.
**Advanced sorting:**
- Multi-level sorting with drag-and-drop priority.
- Custom sort functions for specific columns.
- Save and load sort presets.
- Visual sort builder for non-technical users.
**Data grouping:**
- Group rows by one or more columns.
- Expand/collapse groups.
- Aggregate functions for group summaries (e.g., sum, average).
- Drag-and-drop to reorder groups.
**Row editing:**
- Inline editing of cell values.
- Validation rules for cell inputs.
- Bulk editing of selected rows.
- Undo/redo functionality for edits.
**Data import:**
- Import data from CSV, Excel, or JSON files.
- Map imported data to existing columns.
- Preview imported data before applying.
- Handle duplicates and conflicts during import.
**Data synchronization:**
- Sync data with external APIs or databases.
- Conflict resolution strategies for concurrent edits.
- Real-time updates from synchronized sources.
- Offline mode with sync queue for later updates.
**Custom actions:**
- Define custom actions for rows (e.g., send email, generate report).
- Add action buttons to row context menu or toolbar.
- Support for bulk actions on selected rows.
- Customizable action dialogs and workflows.
**Theming and styling:**
- Predefined themes (light, dark, high contrast).
- Custom CSS support for advanced styling.
- Theme switcher for users to choose their preferred theme.
- Dynamic theming based on user preferences or system settings.
**Performance monitoring:**
- Real-time performance metrics display.
- Alerts for performance degradation.
- Tools for profiling and optimizing table operations.
- Historical performance data for trend analysis.
**User roles and permissions:**
- Define user roles with specific permissions (e.g., view, edit, export).
- Role-based access control for table features.
- Audit logs for tracking user actions.
- Integration with external authentication systems.
**Data visualization:**
- Built-in charts and graphs for visualizing table data.
- Customizable visualization options (e.g., chart type, colors).
- Interactive visualizations linked to table data.
- Export visualizations to image or PDF formats.

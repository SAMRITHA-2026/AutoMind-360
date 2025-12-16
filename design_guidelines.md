# AutoMind 360™ Design Guidelines

## Design Approach

**Selected System**: Material Design with dark mode enterprise aesthetic
**Justification**: Information-dense enterprise dashboard requiring data visualization, real-time monitoring, and complex agent orchestration - Material Design provides robust patterns for dashboards and data-heavy interfaces while maintaining visual clarity.

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts) - for UI elements, metrics, labels
- **Accent Font**: JetBrains Mono - for code, logs, diagnostic codes
- **Hierarchy**:
  - Hero metrics: text-4xl font-bold
  - Section headers: text-2xl font-semibold
  - Card titles: text-lg font-medium
  - Body text: text-base
  - Metadata/timestamps: text-sm text-gray-400

### Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8
- Component padding: p-4, p-6
- Section spacing: gap-6, gap-8
- Card margins: m-4
- Grid gaps: gap-4

### Component Library

**Dashboard Layout**:
- Sidebar navigation (w-64, fixed) with agent status indicators
- Main content area (grid layout for multi-panel monitoring)
- Top header bar with system status and UEBA alerts

**Core Components**:

1. **Agent Status Cards**: Elevated cards showing Worker Agent activity, current tasks, and health indicators with pulsing status dots (green/yellow/red)

2. **Real-time Telematics Panel**: Grid of 10 vehicle cards displaying sensor readings, health scores, and diagnostic trouble codes with progress bars

3. **Voice Interaction Interface**: Chat-style conversation panel with waveform visualization during active voice calls, message bubbles for transcript

4. **Orchestration Flow Diagram**: Visual representation of Master Agent → Worker Agent communication with animated connection lines showing active workflows

5. **Service Demand Forecast**: Line charts showing predicted maintenance volume over time periods

6. **Manufacturing Insights Dashboard**: Table view of RCA/CAPA findings with severity badges, affected component tags, and action recommendations

7. **UEBA Security Monitor**: Alert panel with anomaly detection logs, severity indicators, and blocked action notifications

8. **Appointment Scheduler**: Calendar grid view with service center capacity heatmap and customer preference indicators

**Data Visualization**:
- Use Chart.js via CDN for line charts, bar graphs
- Progress bars for vehicle health scores (0-100%)
- Status badges with icons (Material Icons)

**Icons**: Material Icons (via CDN) for consistency with Material Design system

### Navigation Structure
- Persistent left sidebar: Dashboard, Vehicles, Agents, Scheduling, Manufacturing Insights, Security, Settings
- Active state indicators with left border accent
- Collapsible sub-menus for agent categories

### Interactive States
- Card elevation changes on hover (shadow-md → shadow-lg)
- Button states follow Material Design ripple patterns
- Real-time data updates with subtle fade-in animations
- Alert notifications slide in from top-right

### Images
No hero images needed - this is a functional dashboard. Use:
- Vehicle thumbnail images in telematics cards (140x90px, automotive stock photos)
- Agent avatar icons (circular, 48x48px) in status cards
- Manufacturing component diagrams in RCA/CAPA reports

### Specific Dashboard Sections

**Master Dashboard View**:
- 4-column grid (lg:grid-cols-4) for key metrics cards at top
- 2-column layout (lg:grid-cols-2) for main monitoring panels
- Full-width orchestration flow visualization
- Right sidebar for active alerts and notifications

**Vehicle Monitoring Panel**:
- 2-column grid (md:grid-cols-2, lg:grid-cols-3) for 10 vehicle cards
- Each card: vehicle image, health score gauge, sensor status indicators, predicted issues badge

**Voice Agent Interface**:
- Split layout: conversation history (60%) | customer profile + vehicle data (40%)
- Waveform visualization at bottom during active calls
- Transcript auto-scrolls with latest interaction highlighted

**Manufacturing Feedback**:
- Tabbed interface: Overview | RCA Analysis | CAPA Recommendations | Quality Trends
- Data tables with sortable columns, filter controls
- Export functionality for reports

### Edge Case Displays
- Declined appointment: Red badge with reschedule CTA
- Urgent failure alert: Full-width warning banner with flashing indicator
- Multi-vehicle fleet view: Condensed card layout with grouping by priority
- Recurring defects: Highlighted rows in manufacturing insights with trend graphs

This comprehensive system creates a professional, data-rich enterprise dashboard optimized for real-time monitoring, agent orchestration, and manufacturing quality improvement workflows.
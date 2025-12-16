# AutoMind 360™

## Overview

AutoMind 360™ is an advanced Agentic AI-driven Autonomous Predictive Maintenance and Proactive Service Scheduling platform designed for automotive OEMs and service networks. The system features a Master Agent that orchestrates multiple intelligent Worker AI Agents to manage the complete vehicle maintenance lifecycle, including real-time telematics monitoring, predictive failure detection, voice-based customer engagement, autonomous appointment scheduling, and manufacturing quality feedback through RCA/CAPA analysis. The platform includes UEBA (User and Entity Behaviour Analytics) for security monitoring of autonomous agent interactions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom plugins for Replit integration
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state with automatic refetching
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (dark/light mode support)
- **Charts**: Recharts for data visualization (service demand forecasting)

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful JSON API endpoints under `/api/*`
- **Build Process**: esbuild for server bundling, Vite for client

### Data Storage
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Storage Abstraction**: `server/storage.ts` provides an interface layer for data operations

### Key Data Models
- **Vehicles**: VIN, owner info, health scores, service history
- **Telematics**: Real-time sensor data (engine temp, oil pressure, brake wear, battery, tire pressure)
- **Agents**: AI agent status, type, health, task completion tracking
- **Appointments**: Service scheduling with status workflow
- **Predicted Failures**: AI-generated maintenance predictions with risk levels
- **RCA/CAPA Records**: Root cause analysis and corrective action tracking
- **UEBA Events**: Security anomaly detection and monitoring
- **Chat Messages**: Voice agent conversation history

### Application Pages
- **Dashboard**: Overview with stats, agent status, vehicle health, activity logs
- **Vehicles**: Fleet monitoring with telematics and health cards
- **Agents**: AI agent orchestration visualization and status
- **Scheduling**: Appointment management and service center capacity
- **Manufacturing**: RCA/CAPA analysis and quality insights
- **Security**: UEBA event monitoring and resolution
- **Voice Agent**: Customer engagement chat interface
- **Activity**: Real-time agent activity logging
- **Settings**: Theme and notification preferences

### Design System
- Material Design with dark mode enterprise aesthetic
- Typography: Inter for UI, JetBrains Mono for code/logs
- Color system using HSL CSS variables for theme switching
- Component spacing using Tailwind units (2, 4, 6, 8)

## External Dependencies

### AI Services
- **OpenAI API**: Powers the voice agent chat functionality for customer engagement

### Database
- **PostgreSQL**: Primary database (requires `DATABASE_URL` environment variable)
- **connect-pg-simple**: Session storage for Express

### Key NPM Packages
- **drizzle-orm/drizzle-zod**: Database ORM and schema validation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **recharts**: Data visualization
- **wouter**: Client-side routing
- **zod**: Runtime type validation
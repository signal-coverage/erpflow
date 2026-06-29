# 02 - Architecture.md

# Software Architecture

Version: 0.1.0

---

# Purpose

This document defines the software architecture of ERPFlow.

It describes how the project is organized, how the Core interacts with Plugins, and the conventions that every developer must follow.

The primary objective is to ensure that the platform remains modular, maintainable and scalable over time.

---

# Architectural Style

ERPFlow follows a **Modular Monolith** architecture.

The application is deployed as a single product but internally divided into independent domains.

```text
ERPFlow

├── Core
├── Shared
├── Plugins
└── Infrastructure
```

Advantages:

- Simple deployment
- Easy local development
- Low operational cost
- Clear separation of responsibilities
- Easy migration to microservices in the future (if ever needed)

---

# Project Structure

```text
src/

├── app/
│
├── core/
│
├── plugins/
│
├── shared/
│
├── infrastructure/
│
├── config/
│
├── hooks/
│
├── providers/
│
├── router/
│
└── main.tsx
```

---

# Folder Responsibilities

## app/

Application bootstrap.

Contains:

- App.tsx
- Providers
- Layout initialization

Never contains business logic.

---

## core/

Everything generic.

Examples

```text
core/

authentication/

patients/

appointments/

organizations/

billing/

dashboard/

permissions/

notifications/

reports/

settings/

audit/
```

Nothing inside Core may depend on a plugin.

---

## plugins/

Every medical specialty.

```text
plugins/

odontology/

nutrition/

psychology/

laboratory/

cardiology/
```

Each plugin is self-contained.

---

## shared/

Reusable UI and utilities.

```text
shared/

components/

icons/

utils/

constants/

types/

validators/

hooks/
```

Shared must never contain business logic.

---

## infrastructure/

External integrations.

Firebase

Storage

Cloud Functions

Analytics

Logging

Monitoring

API wrappers

---

## config/

Global configuration.

Example

```text
firebase.ts

environment.ts

plugin.config.ts
```

---

# Internal Module Structure

Every Core module follows exactly the same layout.

Example

```text
patients/

components/

pages/

hooks/

services/

types/

validators/

routes.ts

permissions.ts

index.ts
```

Plugins follow the same convention.

---

# Plugin Structure

Example

```text
plugins/

odontology/

components/

pages/

hooks/

services/

widgets/

permissions/

events/

collections/

routes.ts

plugin.ts

index.ts
```

Every plugin must be independently understandable.

---

# Plugin Manifest

Every plugin exports a manifest.

```typescript
export const plugin = {
  id: "odontology",
  version: "1.0.0",

  routes: [],
  permissions: [],
  widgets: [],
  navigation: [],
  events: [],
  collections: [],
};
```

The Core never imports internal plugin code.

It only reads the manifest.

---

# Dependency Rules

Allowed

```text
Plugin

↓

Core

↓

Shared

↓

Infrastructure
```

Forbidden

```text
Core

↓

Plugin
```

Forbidden

```text
Plugin A

↓

Plugin B
```

Communication happens through events.

---

# Route Registration

Routes are dynamically loaded.

Core routes

```text
/dashboard

/patients

/appointments

/settings

/users
```

Plugin routes

```text
/odontology

/nutrition

/psychology
```

The Router builds itself.

---

# Navigation

The sidebar is generated.

Core contributes

Dashboard

Patients

Billing

Reports

Plugins contribute

Odontology

Nutrition

Laboratory

Psychology

No duplicated configuration.

---

# Services

Every module owns its services.

Example

```text
patients.service.ts

appointments.service.ts

billing.service.ts
```

Responsibilities

Firestore

Cloud Functions

Business logic

Validation

Never manipulate UI.

---

# Components

Components are divided into three groups.

## Shared Components

Reusable.

Example

Button

Card

Modal

Table

Input

---

## Core Components

Specific to Core domains.

Example

PatientCard

AppointmentCalendar

UserAvatar

---

## Plugin Components

Only usable inside one plugin.

Example

Odontogram

NutritionChart

BodyMeasurementForm

---

# Hooks

Every module owns its hooks.

Example

```text
usePatients()

useAppointments()

useBilling()

useNutrition()

useOdontology()
```

Hooks never mix responsibilities.

---

# Types

Each module owns its types.

Example

```text
Patient

Appointment

Invoice

Organization
```

Plugins own

Treatment

NutritionProfile

PsychologySession

DentalChart

---

# State Management

Preferred order

TanStack Query

↓

React Context

↓

Local State

Avoid global state unless absolutely necessary.

---

# Data Flow

```text
Component

↓

Hook

↓

Service

↓

Firestore

↓

Firebase
```

Business rules live inside services.

Never inside components.

---

# Authentication Flow

Firebase Authentication

↓

User Loaded

↓

Organization Loaded

↓

Permissions Loaded

↓

Plugins Loaded

↓

Application Starts

---

# Authorization Flow

```text
User

↓

Role

↓

Permissions

↓

Plugin Permissions

↓

Route Access

↓

Component Rendering
```

Every screen validates permissions.

---

# Event Bus

The Core exposes an Event Bus.

Example

```typescript
emit("patient.created");

emit("appointment.finished");

emit("invoice.paid");
```

Plugins subscribe.

```typescript
subscribe("patient.created");
```

Plugins never call each other directly.

---

# Firestore Strategy

Every collection belongs to a domain.

Example

```text
patients

appointments

organizations

users

roles

notifications
```

Plugins create their own collections.

Example

```text
odontology_treatments

nutrition_profiles

psychology_sessions
```

---

# Storage

Cloud Storage

```text
patients/

organizations/

odontology/

laboratory/

psychology/
```

Every upload belongs to an organization.

---

# Error Handling

Every service returns

Success

Error

Validation

Never throw raw Firebase errors to the UI.

---

# Logging

Future architecture.

```text
UI

↓

Logger

↓

Cloud Functions

↓

BigQuery
```

Every critical action becomes auditable.

---

# Configuration

Plugins are configured through

plugin.ts

The Core never hardcodes plugin behavior.

---

# Design Principles

Single Responsibility

Open / Closed

Dependency Inversion

Composition over Inheritance

Convention over Configuration

---

# Code Standards

Prefer composition.

Prefer small functions.

Prefer feature folders.

Never duplicate business logic.

Never access Firestore directly from components.

Never place business rules inside pages.

Every feature must be testable in isolation.

---

# Future Evolution

Future versions may include

- Marketplace
- Remote plugins
- White-label support
- Public API
- Mobile application
- AI assistants

The architecture should support these features without requiring major changes.

---

# Final Rule

Whenever a new feature is proposed, ask:

**"Does this belong to the Core or to a Plugin?"**

If the answer is unclear, the architecture needs to be reconsidered before implementation.

# 03 - Roadmap.md

# ERPFlow Development Roadmap

Version: 0.1.0

---

# Objective

The purpose of this roadmap is to define the order in which ERPFlow will be developed.

The project should always remain deployable and usable after each phase.

Every phase must produce a working application.

Never build features that depend on systems that do not yet exist.

---

# Development Philosophy

Priority order:

1. Platform
2. Infrastructure
3. Core
4. Plugin System
5. First Plugin
6. Additional Plugins
7. Integrations
8. Enterprise Features

---

# Phase 0 — Foundation

Goal

Create the technical foundation.

Deliverables

- Git repository
- React + TypeScript + Vite
- Tailwind CSS
- shadcn/ui
- Firebase project
- Firestore
- Firebase Authentication
- Cloud Storage
- GitHub Actions
- ESLint
- Prettier
- Husky
- Commitlint

Folder structure

```text
src/

core/

plugins/

shared/

infrastructure/

config/
```

Result

An empty application that compiles and deploys.

---

# Phase 1 — Authentication

Goal

Users can log in securely.

Features

- Login
- Logout
- Forgot Password
- Protected Routes
- Session Restore

Collections

users

organizations

Result

Authenticated application.

---

# Phase 2 — Organization Engine

Goal

Support multiple customers.

Features

Organization creation

Organization settings

Subscription

Brand information

Every document references

organizationId

Result

Multi-tenant platform.

---

# Phase 3 — Permission Engine

Goal

RBAC.

Collections

roles

permissions

rolePermissions

userRoles

Features

Roles

Permissions

Permission Guards

Route Protection

Component Protection

Result

Permission system ready.

---

# Phase 4 — Dashboard

Goal

Common application shell.

Features

Sidebar

Header

Breadcrumb

Profile Menu

Notifications

Theme

Search

Quick Actions

Dashboard Layout

Result

Application shell complete.

---

# Phase 5 — Patient Engine

Goal

Central patient management.

Collections

patients

Features

CRUD

Search

Filters

History

Emergency contacts

Insurance

Documents

Result

Single patient database.

---

# Phase 6 — Appointment Engine

Goal

Scheduling.

Collections

appointments

workingHours

Features

Calendar

Agenda

Availability

Appointment Status

Reminders

Professional Assignment

Result

Scheduling works independently from plugins.

---

# Phase 7 — Billing

Goal

Financial management.

Collections

payments

invoices

cashRegisters

Features

Invoices

Payments

Receipts

Daily Cash

Reports

Result

Financial module operational.

---

# Phase 8 — Notification Engine

Goal

Communication.

Providers

Email

WhatsApp

Push Notifications

SMS (future)

Events

Appointment Reminder

Appointment Cancelled

Invoice Paid

Birthday

Result

Centralized notifications.

---

# Phase 9 — File Management

Goal

Document storage.

Storage

Images

PDF

Medical files

Laboratory results

Features

Upload

Download

Preview

Permissions

Result

Complete document management.

---

# Phase 10 — Plugin Engine

Goal

Support external modules.

Features

Plugin Loader

Plugin Registry

Plugin Manifest

Plugin Lifecycle

Dynamic Navigation

Dynamic Widgets

Dynamic Routes

Dynamic Permissions

Dynamic Collections

Result

Core becomes extensible.

---

# Phase 11 — Event Bus

Goal

Communication between Core and Plugins.

Core Events

Patient Created

Appointment Created

Appointment Finished

Invoice Paid

User Created

Plugins subscribe to events.

Result

Loose coupling.

---

# Phase 12 — Widget Engine

Goal

Dynamic dashboard.

Core widgets

Today's appointments

Revenue

Patients

Plugins

Today's treatments

BMI

Lab requests

Future

Charts

Analytics

AI widgets

Result

Fully customizable dashboard.

---

# Phase 13 — Settings Engine

Goal

Self-configurable platform.

Settings

Organization

Users

Notifications

Branding

Plugins

Permissions

Result

Configuration system completed.

---

# Phase 14 — Audit Engine

Goal

Track every important action.

Events

Patient Edited

Appointment Deleted

Invoice Paid

Permission Changed

Plugin Installed

Every action recorded.

Result

Audit trail.

---

# Phase 15 — First Plugin

Plugin

Odontology

Goal

Validate architecture.

Features

Odontogram

Treatments

Dental Procedures

Treatment Plans

Dental History

Attachments

Result

Proof that plugins work.

---

# Phase 16 — Second Plugin

Nutrition

Features

Body Measurements

Diet Plans

Progress

BMI

Calories

Reports

Result

Architecture validated for multiple specialties.

---

# Phase 17 — Third Plugin

Psychology

Features

Sessions

Clinical Notes

Questionnaires

Private Notes

Result

Plugin system consolidated.

---

# Phase 18 — Marketplace (Future)

Goal

Install plugins without redeploying.

Features

Plugin Catalog

Licensing

Activation

Updates

Dependencies

Result

ERPFlow ecosystem.

---

# Phase 19 — AI

Features

Clinical summaries

Appointment transcription

SOAP generation

Automatic reports

Treatment suggestions

Administrative assistant

Result

AI-enhanced platform.

---

# Phase 20 — Public API

Goal

Third-party integrations.

REST API

Webhooks

OAuth

API Keys

Developer Portal

Result

Open platform.

---

# Phase 21 — Mobile

Applications

Patient App

Professional App

Reception App

Notifications

Telemedicine

Offline mode

Result

Cross-platform ecosystem.

---

# MVP Definition

The MVP finishes after Phase 10.

Required features

- Authentication
- Organizations
- Roles
- Permissions
- Dashboard
- Patients
- Scheduling
- Billing
- File Storage
- Plugin Engine

Plus

One production-ready plugin.

No additional plugins are required for MVP.

---

# Success Criteria

The MVP is complete when:

✓ A clinic can register.

✓ Users can log in.

✓ Patients can be managed.

✓ Appointments can be scheduled.

✓ Billing works.

✓ Permissions work.

✓ One plugin operates independently.

✓ The Core runs without modifications when a second plugin is added.

---

# Long-Term Vision

```
Phase 0 → Infrastructure

↓

Core Platform

↓

Plugin Engine

↓

Medical Plugins

↓

Marketplace

↓

Artificial Intelligence

↓

Open Ecosystem

↓

Health Operating System
```

---

# Guiding Principle

Never build a feature for one specialty if it can belong to the Core.

Every feature added to the Core reduces duplication.

Every feature added to a Plugin increases flexibility.

Choose wisely.

# 01 - Big-Picture.md

# Big Picture

Version: 0.1.0

---

# Overview

ERPFlow is built around a simple principle:

> **Everything belongs either to the Core or to a Plugin. Never both.**

The Core provides the platform.

Plugins provide the medical specialization.

```
                   +-------------------------+
                   |       ERPFlow        |
                   +-------------------------+
                               |
             +-----------------+-----------------+
             |                                   |
         Core Platform                    Plugin Engine
             |                                   |
             |                     +-------------+-------------+
             |                     |             |             |
      Odontology             Nutrition     Psychology    Laboratory
```

---

# Architecture Layers

```
┌───────────────────────────────────────────────────────────────┐
│                        Frontend (React)                       │
├───────────────────────────────────────────────────────────────┤
│ Dashboard │ Core Pages │ Plugin Pages │ Shared Components     │
├───────────────────────────────────────────────────────────────┤
│                 Business Services Layer                       │
├───────────────────────────────────────────────────────────────┤
│      Core Engine              │        Plugin Engine          │
├───────────────────────────────────────────────────────────────┤
│               Firebase / Firestore / Storage                 │
└───────────────────────────────────────────────────────────────┘
```

---

# Core Responsibilities

The Core is responsible for all generic features.

It should continue working even if every medical plugin is removed.

## Authentication

- Login
- Logout
- Password reset
- Session validation

---

## Organizations

Every customer is an Organization.

Examples

- Clinic
- Hospital
- Dental Office
- Nutrition Office

Every document belongs to an organization.

```
Organization

id

name

plan

status

createdAt
```

---

## Users

Users belong to organizations.

Examples

Receptionist

Administrator

Doctor

Nutritionist

Dentist

Owner

---

## Roles

The Core defines authorization.

Permissions are independent from plugins.

Example

```
Appointments

Read

Create

Update

Delete
```

Plugins can register additional permissions.

Example

```
Odontology

Create Treatment

Delete Treatment

View X-Rays
```

---

## Patients

The Core owns patients.

Plugins NEVER create patients.

```
Patient

Personal information

Emergency contacts

Insurance

Address

General notes
```

Clinical information belongs to plugins.

---

## Scheduling

The scheduling engine belongs to the Core.

Responsibilities

Appointments

Calendars

Availability

Working hours

Professional assignment

Reminders

Plugins extend appointments.

Example

A nutrition appointment stores nutritional information.

A dental appointment stores dental treatment information.

---

## Billing

The Core manages

Invoices

Payments

Outstanding balances

Cash register

Receipts

Plugins may create billable items.

Example

Dental Cleaning

Nutrition Consultation

Psychology Session

---

## Notifications

Responsible for

Email

WhatsApp

Push Notifications

SMS

Future integrations

---

## Reports

Generic reports

Appointments

Revenue

Patients

Professionals

Plugins can register additional reports.

---

## Dashboard

Dashboard widgets are dynamically loaded.

Example

Core Widgets

Today's appointments

Revenue

Recent patients

Plugin Widgets

Dental treatments

Nutrition progress

Psychology sessions

---

# Plugin Engine

Plugins are isolated modules.

```
plugins/

odontology/

nutrition/

psychology/

laboratory/
```

Each plugin exposes a manifest.

```
Plugin Manifest

id

version

routes

permissions

collections

navigation

widgets

events

settings
```

The Core discovers plugins automatically.

---

# Plugin Lifecycle

Application starts

↓

Core loads configuration

↓

Core loads installed plugins

↓

Plugins register themselves

↓

Navigation is generated

↓

Permissions are registered

↓

Routes are created

↓

Dashboard widgets appear

↓

Application starts

---

# Plugin Responsibilities

A plugin owns

Business rules

Clinical models

Forms

Reports

Pages

Dashboard widgets

Collections

Cloud Functions

Events

Settings

Everything else belongs to the Core.

---

# Data Ownership

Core owns

Organizations

Users

Roles

Permissions

Patients

Appointments

Notifications

Billing

Audit Logs

Plugins own

Clinical records

Treatments

Measurements

Medical forms

Medical reports

Attachments

Specialized workflows

---

# Event System

The Core communicates using events.

Example

```
PatientCreated

AppointmentCreated

AppointmentCancelled

InvoicePaid

UserInvited
```

Plugins can subscribe.

Example

Nutrition

```
PatientCreated

↓

Create empty nutrition profile
```

Odontology

```
AppointmentFinished

↓

Generate treatment record
```

This avoids direct dependencies.

---

# Navigation

The sidebar is generated dynamically.

Core

Dashboard

Patients

Appointments

Billing

Reports

Settings

Plugins contribute

Odontology

Nutrition

Psychology

Laboratory

No hardcoded menu should exist.

---

# Widget System

Dashboard widgets are also plugins.

Example

Core Widget

Today's appointments

Plugin Widget

Today's dental procedures

Future Widget

Monthly BMI evolution

The Dashboard simply renders every registered widget.

---

# Permission Flow

```
User

↓

Role

↓

Permissions

↓

Plugin Permissions

↓

UI Rendering

↓

Route Access

↓

Firestore Security Rules
```

Permissions are validated in three places

Frontend

Backend

Database

---

# Storage Strategy

Firestore

Structured data

Cloud Storage

Files

Images

X-rays

PDFs

Laboratory results

Documents

---

# Multi-Tenant Isolation

Every document contains

organizationId

Example

```
patients

organizationId

appointments

organizationId

users

organizationId

invoices

organizationId
```

Every query MUST filter by organizationId.

No exceptions.

---

# Future Marketplace

Long-term objective

```
Marketplace

↓

Install Plugin

↓

Enable License

↓

Plugin Registered

↓

Navigation Updated

↓

Permissions Registered

↓

Collections Created
```

Future plugins could even be developed by third parties.

---

# Scalability Principles

The Core should never require modification to support a new medical specialty.

Adding a new specialty should only require creating a new plugin.

If adding a specialty requires editing Core code, the architecture has failed.

---

# Architectural Rules

Rule 1

The Core never imports plugin code.

Rule 2

Plugins may import Core utilities.

Rule 3

Plugins never communicate directly with each other.

Rule 4

Communication happens through events.

Rule 5

Patients belong to the Core.

Rule 6

Clinical information belongs to plugins.

Rule 7

Navigation is generated automatically.

Rule 8

Permissions are always explicit.

Rule 9

Every document belongs to an Organization.

Rule 10

The Core should remain deployable even when no plugins are installed.

---

# Big Picture Summary

```
                    ERPFlow

                        │

        ┌───────────────┴───────────────┐

        │                               │

      Core                       Plugin Engine

        │                               │

Patients                  Odontology

Users                     Nutrition

Billing                   Psychology

Reports                   Pediatrics

Scheduling                Laboratory

Permissions               Cardiology

Notifications             Dermatology

Audit                     Custom Plugins

        │                               │

        └───────────────┬───────────────┘

                        │

                  Firebase Backend

                        │

     Firestore │ Storage │ Functions │ Auth
```

The Core is the operating system.

Plugins are applications running on top of it.

That separation is the foundation of the entire architecture.

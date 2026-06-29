# 05 - Database/01-ERD.md

# Core Data Model (ERD)

Version: 0.1.0

---

# Purpose

This document defines the data model for the ERPFlow Core Platform.

The model is optimized for:

- Cloud Firestore
- Multi-tenancy
- Plugin architecture
- Scalability
- Low read cost
- Simplicity

---

# Design Principles

## 1. Every document belongs to an Organization.

```ts
organizationId: string;
```

---

## 2. Core owns generic data.

Plugins own clinical data.

---

## 3. Collections represent domains.

Avoid generic collections like:

```
data/

records/

items/
```

Instead:

```
patients/

appointments/

organizations/
```

---

## 4. Denormalize when it reduces reads.

Firestore favors reads over normalization.

---

# Core Collections

```text
organizations

users

roles

permissions

patients

appointments

professionals

notifications

invoices

payments

plugin_registry

audit_logs

settings
```

---

# Relationship Overview

```text
Organization

│

├── Users

├── Patients

├── Professionals

├── Appointments

├── Billing

├── Notifications

├── Plugins

└── Settings
```

---

# organizations

Represents a tenant.

```ts
Organization {

id

name

legalName?

taxId?

email

phone

logoUrl

primaryColor

timezone

currency

plan

status

enabledPlugins[]

createdAt

updatedAt

}
```

---

# users

Application users.

```ts
User {

id

organizationId

roleId

displayName

email

photoURL

phone

status

lastLogin

createdAt

updatedAt

}
```

---

# roles

```ts
Role {

id

organizationId

name

description

permissions[]

isSystem

createdAt

}
```

---

# permissions

Global permission catalog.

```ts
Permission {

id

key

name

description

module

}
```

Examples

```text
patients.read

patients.create

patients.update

appointments.cancel

billing.read
```

Plugins register additional permissions.

---

# professionals

Healthcare professionals.

```ts
Professional {

id

organizationId

userId?

specialties[]

license

phone

email

calendarColor

active

createdAt

}
```

A professional may or may not have a login.

---

# patients

Central entity.

```ts
Patient {

id

organizationId

documentType

documentNumber

firstName

lastName

birthDate

gender

phone

email

address

insurance

emergencyContact

tags[]

notes

active

createdAt

updatedAt

}
```

No clinical information lives here.

---

# appointments

Shared scheduling engine.

```ts
Appointment {

id

organizationId

patientId

professionalId

pluginId

status

scheduledStart

scheduledEnd

reason

location

notes

createdBy

createdAt

updatedAt

}
```

Notice

pluginId identifies which plugin owns the appointment workflow.

Example

```text
odontology

nutrition

psychology
```

---

# invoices

```ts
Invoice {

id

organizationId

patientId

number

status

currency

subtotal

tax

discount

total

issuedAt

paidAt

}
```

---

# payments

```ts
Payment {

id

organizationId

invoiceId

method

amount

currency

status

reference

paidAt

}
```

---

# notifications

```ts
Notification {

id

organizationId

type

recipientId

title

message

status

sentAt

}
```

---

# audit_logs

```ts
AuditLog {

id

organizationId

userId

action

entity

entityId

metadata

timestamp

}
```

Immutable.

Never edited.

---

# plugin_registry

Installed plugins.

```ts
PluginRegistry {

id

organizationId

pluginId

version

enabled

installedAt

settings

}
```

---

# settings

Organization settings.

```ts
Settings {

organizationId

branding

notifications

billing

plugins

security

}
```

---

# Plugin Collections

Every plugin owns its own collections.

Example

Odontology

```text
odontology_treatments

odontology_teeth

odontology_prescriptions
```

Nutrition

```text
nutrition_profiles

nutrition_measurements

nutrition_diets
```

Psychology

```text
psychology_sessions

psychology_tests

psychology_reports
```

---

# Collection Ownership

```text
Core

patients

appointments

users

roles

billing

notifications

audit_logs
```

Plugins

Everything clinical.

---

# References

Firestore stores document IDs.

Example

```ts
Appointment;

patientId;

professionalId;
```

Avoid embedding large objects.

Duplicate only frequently displayed fields.

Example

```ts
patientName;

professionalName;
```

Useful for calendar rendering.

---

# Common Metadata

Every document includes

```ts
createdAt;

createdBy;

updatedAt;

updatedBy;

organizationId;
```

Soft delete

```ts
deletedAt;

deletedBy;
```

---

# Status Conventions

Avoid booleans.

Instead

```text
ACTIVE

INACTIVE

PENDING

CANCELLED

ARCHIVED
```

More extensible.

---

# IDs

Firestore auto-generated IDs.

Never sequential.

Public document numbers (invoice numbers, receipts) are generated separately.

---

# Index Strategy

Typical composite indexes

```text
organizationId

createdAt DESC
```

```text
organizationId

status
```

```text
organizationId

professionalId

scheduledStart
```

```text
organizationId

patientId

createdAt
```

---

# Event Ownership

Core emits

```text
patient.created

patient.updated

appointment.created

appointment.cancelled

invoice.paid
```

Plugins subscribe.

Plugins also emit their own events.

---

# Future Collections

```text
branches

subscriptions

licenses

api_keys

integrations

telemedicine

ai_conversations

templates

marketplace
```

---

# Entity Diagram

```text
Organization
│
├── Users
│
├── Roles
│
├── Professionals
│
├── Patients
│
├── Appointments
│
├── Invoices
│
├── Payments
│
├── Notifications
│
├── Plugin Registry
│
├── Settings
│
└── Audit Logs
                │
                │
        ┌───────┴────────┐
        │                │
   Odontology       Nutrition
        │                │
Treatments      Measurements
DentalChart     DietPlans
Procedures      Progress
```

---

# Golden Rules

1. Core owns business-independent entities.

2. Plugins own specialty-specific entities.

3. Every document belongs to an Organization.

4. Firestore is optimized for reads, not normalization.

5. Collections represent domains.

6. Plugin collections never modify Core collections directly.

7. Core entities should remain stable even if new plugins are added.

---

# Final Thought

The data model is intentionally small.

The Core should remain stable for years.

Growth should happen by adding plugins, not by changing the database structure.

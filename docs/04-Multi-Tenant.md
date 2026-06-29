# 04 - Multi-Tenant.md

# Multi-Tenant Architecture

Version: 0.1.0

---

# Purpose

ERPFlow is designed as a **multi-tenant SaaS platform**.

A single deployment serves multiple healthcare organizations while ensuring complete data isolation.

Each organization behaves as if it had its own private installation.

---

# What is a Tenant?

A Tenant represents a customer.

Examples:

- Dental Office
- Nutrition Clinic
- Medical Center
- Psychology Office
- Hospital
- Health Insurance Provider

Every tenant owns:

- Users
- Patients
- Appointments
- Files
- Billing
- Plugins
- Settings

---

# Core Principle

> **Every piece of business data belongs to exactly one Organization.**

Every document stored in Firestore must contain:

```ts
organizationId: string;
```

No exceptions.

---

# High-Level Architecture

```text
                        ERPFlow

                             │

              ┌──────────────┴──────────────┐

              │                             │

      Organization A                Organization B

              │                             │

      Patients                     Patients

      Appointments                 Appointments

      Billing                      Billing

      Plugins                      Plugins

      Files                        Files

              │                             │

      Same application

      Same database

      Completely isolated data
```

---

# Firestore Strategy

Collections are shared.

Data is isolated through organizationId.

Example

```text
patients/

appointments/

users/

payments/

notifications/
```

Each document

```json
{
  "organizationId": "org_123"
}
```

---

# Why Shared Collections?

Advantages

- Simpler queries
- Lower maintenance
- Better scalability
- Easier analytics
- Lower Firestore costs
- Fewer security rules

Avoid

```text
organizations/

organizationA/

patients/

organizationB/

patients/
```

Nested tenant collections increase complexity and make cross-domain queries harder.

---

# Document Ownership

Every business document belongs to an organization.

Example

```text
Patient

organizationId

createdBy

createdAt
```

Appointment

```text
organizationId

patientId

professionalId
```

Invoice

```text
organizationId
```

Payment

```text
organizationId
```

---

# Authentication Flow

```text
User Login

↓

Firebase Authentication

↓

Load User Profile

↓

Load Organization

↓

Store organizationId in session

↓

Initialize Core

↓

Load Plugins

↓

Application Ready
```

---

# User Model

A user belongs to one organization.

```ts
User {

    id

    organizationId

    roleId

    email

    displayName

}
```

Future versions may support multi-organization users.

Not in MVP.

---

# Patient Model

Patients are isolated.

The same real person may exist in multiple organizations.

Example

Clinic A

Patient

John Doe

Clinic B

Patient

John Doe

These are different records.

No automatic sharing.

---

# Plugin Isolation

Plugins never bypass organization filtering.

Example

Odontology

```text
odontology_treatments

organizationId
```

Nutrition

```text
nutrition_profiles

organizationId
```

Every plugin follows the same rule.

---

# Storage

Cloud Storage

```text
organizations/

organizationId/

patients/

appointments/

odontology/

laboratory/
```

Example

```text
organizations/

org_123/

patients/

photo.png
```

No file exists outside an organization.

---

# Security Rules

Every Firestore request validates

```text
request.auth != null

AND

request.auth.organizationId

==

resource.organizationId
```

Even if the frontend fails,

Firestore rejects unauthorized access.

---

# Queries

Always

```ts
where("organizationId", "==", currentOrganization);
```

Never

```ts
collection("patients").get();
```

Without filtering.

---

# Service Layer

Every service automatically injects

organizationId.

Example

Instead of

```ts
getPatients();
```

Internally

```ts
getPatients(organizationId);
```

Developers should never manually remember tenant filtering.

---

# Soft Delete

Instead of deleting

```ts
deletedAt;

deletedBy;
```

Allows

Audit

Recovery

History

Legal compliance

---

# Audit Log

Every action includes

organizationId

userId

timestamp

action

resource

resourceId

Example

```json
{
  "organizationId": "...",
  "userId": "...",
  "action": "PATIENT_UPDATED"
}
```

---

# Billing Isolation

Invoices

Payments

Subscriptions

Cash Registers

Everything belongs to one organization.

Financial information is never shared.

---

# Plugin Configuration

Enabled plugins belong to organizations.

Example

```json
{
  "organizationId": "...",

  "plugins": ["odontology", "nutrition"]
}
```

Another clinic may only enable

```json
["nutrition"]
```

The Core adapts automatically.

---

# Branding

Each organization can define

Logo

Primary Color

Secondary Color

Business Name

Address

Phone

Email

Future

Custom Domain

---

# Subscription

Each organization has

Plan

Status

Limits

Enabled Plugins

Example

Starter

Professional

Enterprise

---

# Limits

Examples

Maximum Users

Maximum Professionals

Maximum Storage

Maximum Patients

Maximum Plugins

Maximum Branches

Limits are validated by the Core.

---

# Branches (Future)

Future support

```text
Organization

↓

Branch

↓

Professionals

↓

Appointments
```

Every branch still belongs to one organization.

---

# Performance

Indexes should always include

organizationId

Example

```text
organizationId

createdAt
```

or

```text
organizationId

status
```

This keeps queries efficient at scale.

---

# Analytics

Future analytics should always aggregate by organization.

Examples

Revenue

Appointments

Patients

Growth

Plugin usage

---

# Backup Strategy

Daily Firestore export.

Daily Storage backup.

Organization-level restore planned for future versions.

---

# Tenant Lifecycle

```text
Create Organization

↓

Create Owner User

↓

Initialize Collections

↓

Enable Plugins

↓

Apply Subscription

↓

Application Ready
```

---

# Future Features

- Multiple branches
- Multiple organizations per user
- White-label platform
- Custom domains
- Marketplace licensing
- Regional compliance
- Enterprise SSO

---

# Golden Rules

1. Every document belongs to one organization.

2. Every query filters by organizationId.

3. Every upload belongs to an organization.

4. Every plugin respects tenant boundaries.

5. Firestore Security Rules are the final authority.

6. Frontend validation is never enough.

7. Multi-tenancy is invisible to end users.

---

# Summary

ERPFlow runs as a single SaaS platform.

Customers never share data.

Developers never manually manage tenant isolation.

The platform guarantees security, scalability and simplicity through a single architectural rule:

> **Everything belongs to an Organization.**

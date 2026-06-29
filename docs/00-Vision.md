# 00 - Vision.md

# ERPFlow

> A modular ERP platform for healthcare organizations.

Version: 0.1.0

---

# Vision

ERPFlow is a SaaS platform designed to manage healthcare organizations of any size through a modular plugin architecture.

Instead of creating isolated software for dentists, nutritionists, psychologists or other specialties, ERPFlow provides a common platform where every organization shares the same core while enabling only the modules they require.

The objective is to make the Core completely independent of medical specialties.

Everything related to authentication, organizations, patients, scheduling, permissions, billing and reporting belongs to the Core.

Everything related to clinical workflows belongs to Plugins.

---

# Philosophy

The project is based on five principles.

## 1. Core First

The Core never contains business logic for a specific medical specialty.

The Core should work even if no medical plugin is installed.

Responsibilities:

- Authentication
- Organizations
- Users
- Roles
- Permissions
- Patients
- Scheduling
- Notifications
- Billing
- Reports
- Plugin Loader

---

## 2. Plugin Driven

Every specialty is implemented as an independent plugin.

Examples:

- Odontology
- Nutrition
- Psychology
- Dermatology
- Pediatrics
- Cardiology
- Laboratory

Installing a plugin automatically adds:

- Pages
- Dashboard widgets
- Navigation items
- Firestore collections
- Permissions
- Reports
- Settings
- Events

Removing a plugin should remove all of the above without affecting the Core.

---

## 3. Multi Tenant

Every customer is completely isolated.

Example:

Organization A

- Patients
- Users
- Billing
- Appointments

Organization B

- Patients
- Users
- Billing
- Appointments

No organization shares information with another.

The application is a single deployment serving multiple organizations.

---

## 4. Modular Growth

The platform must be usable by:

- A single nutritionist.
- A dentist.
- A psychology office.
- A clinic.
- A diagnostic center.
- A hospital.
- A health insurance provider.

Every customer uses exactly the same software.

Only enabled plugins and subscription plans change.

---

## 5. Cloud Native

The platform is designed as SaaS from day one.

Requirements:

- Automatic deployments
- Automatic backups
- Authentication
- Secure storage
- Audit logs
- Scalability
- Monitoring

---

# Target Customers

## Small Office

Example:

One nutritionist.

Needs:

- Patients
- Calendar
- Clinical notes
- Billing

Plugins:

Nutrition

---

## Medium Clinic

Example:

Dental clinic with five professionals.

Needs:

- Reception
- Billing
- Multiple users
- Scheduling
- Reports

Plugins:

Odontology

---

## Medical Center

Example:

Multiple specialties.

Needs:

- Reception
- Administration
- Scheduling
- Shared patients
- Different specialists

Plugins:

Odontology

Nutrition

Psychology

Cardiology

Laboratory

---

## Hospital

Future target.

Multiple branches.

Large staff.

Advanced permissions.

Auditing.

Integrations.

---

# Core Responsibilities

The Core owns the following domains.

Authentication

Organizations

Users

Roles

Permissions

Patients

Scheduling

Notifications

Billing

Reports

Dashboard

Plugin Loader

Settings

Audit Log

Media Storage

---

# Plugin Responsibilities

Plugins own their own business rules.

Examples:

Odontology

- Odontogram
- Treatments
- Implants
- Prosthetics

Nutrition

- Body measurements
- Diet plans
- Progress tracking

Psychology

- Sessions
- Clinical notes
- Psychological tests

Laboratory

- Orders
- Results
- Attachments

The Core should never know how these features work internally.

---

# Product Goals

The MVP should solve the daily operations of a healthcare office.

Future versions should become the operating system for healthcare organizations.

---

# Long-Term Vision

ERPFlow should become a platform where new specialties can be added without changing the existing application.

Future capabilities include:

- Marketplace for plugins.
- Online appointment booking.
- Patient mobile application.
- AI assistant.
- WhatsApp integration.
- Payment gateways.
- Electronic prescriptions.
- Telemedicine.
- Business intelligence dashboards.
- Public API.
- Third-party integrations.

---

# Non Goals

The platform is NOT intended to replace electronic health record systems required by specific national regulations during the MVP.

The first versions focus on workflow management rather than regulatory compliance.

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui

Backend

- Firebase Authentication
- Cloud Firestore
- Cloud Functions
- Cloud Storage
- Firebase Hosting

Infrastructure

- GitHub
- GitHub Actions
- Firebase App Hosting

Future

- Stripe
- Twilio / WhatsApp
- OpenAI
- BigQuery
- Analytics

---

# Success Metrics

The MVP is considered successful when:

- A clinic can manage patients.
- Professionals can manage appointments.
- Receptionists can register patients.
- Users can authenticate securely.
- Roles restrict access correctly.
- Plugins can be enabled or disabled without modifying the Core.

Only after these goals are achieved should additional medical specialties be implemented.

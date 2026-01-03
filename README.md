# GlobeTrotter – Empowering Personalized Travel Planning

## Overview

GlobeTrotter is a personalized, intelligent, and collaborative travel planning application designed to simplify and enhance the way people plan trips. The platform enables users to design multi-city itineraries, manage travel dates and activities, estimate budgets automatically, and share travel plans publicly or with friends. By combining structured planning with an interactive user experience, GlobeTrotter makes travel planning as exciting as the journey itself.

Deployment Link: odoo-sns-globe-trotter.vercel.app
Drive Link : https://drive.google.com/drive/folders/1awJ8EWYPzI7DGfm5VvwxQpfxGgq0JPYv?usp=drive_link
github link : https://github.com/AbhienayaSri9509/Odoo_SNS_GlobeTrotter
---

## Vision

To transform travel planning into a seamless, enjoyable, and insightful experience by providing an end-to-end digital platform where users can dream, design, organize, and share their trips effortlessly.

---

## Mission

To build a user-centric and responsive travel planning application that:

* Simplifies multi-city trip planning
* Offers full visibility into itineraries and budgets
* Enables informed, cost-effective travel decisions
* Encourages collaboration and sharing among travelers

---

## Key Features

### Authentication

* Secure Login & Signup
* Email and password validation
* Password recovery support

### Dashboard

* Overview of upcoming trips
* Quick access to recent itineraries
* Recommended destinations
* Budget highlights

### Trip Management

* Create customized trips with name, dates, and description
* View, edit, or delete trips
* Upload optional cover photos

### Itinerary Builder

* Add multiple cities (stops) to a trip
* Assign travel dates per city
* Add and manage activities for each stop
* Reorder cities dynamically

### Itinerary View

* Day-wise or city-wise structured view
* Calendar or list-based layout
* Clear visualization of daily plans

### City & Activity Discovery

* Search cities by country or region
* Browse activities by category, cost, and duration
* Add activities directly to itinerary

### Budget & Cost Breakdown

* Automatic cost estimation
* Category-wise breakdown (transport, stay, activities, meals)
* Visual charts (pie/bar)
* Alerts for over-budget days

### Shared/Public Itineraries

* Public shareable link
* Read-only itinerary view
* Option to copy an existing trip
* Social media sharing support

### User Profile & Settings

* Update personal details
* Language preferences
* Privacy controls
* Account deletion option

### Admin Dashboard (Optional/Future Scope)

* User and trip analytics
* Popular destinations and activities
* Platform usage insights

---

## Database Design (Relational)

**Core Tables:**

* Users
* Trips
* Stops (Cities)
* Activities
* Stop_Activities (Many-to-Many)
* Budgets

This relational structure ensures efficient storage, retrieval, and management of complex travel data.

---

## Tech Stack

### Frontend

* React.js
* Tailwind CSS
* Chart.js / Recharts

### Backend

* Node.js
* Express.js
* RESTful APIs

### Database

* MySQL / PostgreSQL

### Authentication

* JWT (JSON Web Tokens)

---

## Application Flow

1. User signs up or logs in
2. User creates a new trip
3. Adds cities and activities to build itinerary
4. System calculates estimated budget
5. User reviews itinerary via calendar/timeline view
6. User shares trip publicly or with friends

---

## Highlights

* End-to-end trip planning
* Clean and intuitive UI
* Proper use of relational database
* Budget-aware travel decisions
* Shareable and collaborative planning

---

## Future Enhancements

* AI-based itinerary recommendations
* Real-time cost updates
* Collaborative trip editing
* Mobile application support
* Integration with booking platforms

---

## Conclusion

GlobeTrotter addresses the challenges of fragmented travel planning by offering a unified, intelligent, and interactive platform. It empowers travelers to plan confidently, stay within budget, and enjoy complete visibility of their journey—making it a strong, scalable solution for modern travel needs.

---


# CodeHorse 🐎

**CodeHorse** is an AI-powered GitHub pull request review platform that automatically analyzes code changes and generates contextual feedback using **RAG (Retrieval Augmented Generation)** and **Google Gemini AI**.

The platform connects to GitHub repositories, indexes the entire codebase using vector embeddings, retrieves relevant context from the repository, and generates intelligent pull request reviews to help developers maintain high-quality and maintainable codebases.

CodeHorse is designed as a **developer productivity tool** that brings AI-assisted code review directly into the GitHub workflow.

---

# ✨ Features

## 🤖 AI-Powered Code Reviews

CodeHorse automatically reviews pull requests using **Gemini AI**.

Each review can include:

- Pull request summary
- Code walkthrough
- Strengths of the implementation
- Potential issues or bugs
- Suggested improvements
- Code readability feedback
- Architecture insights
- Optional creative summaries (such as poems)

This helps developers quickly understand and improve their changes before merging.

---

## 🧠 RAG-Based Code Understanding

CodeHorse uses **Retrieval Augmented Generation (RAG)** to understand your repository.

The system:

1. Indexes the repository source code
2. Generates embeddings for files
3. Stores embeddings in **Pinecone**
4. Retrieves relevant context during PR reviews

This allows the AI model to understand how the new code interacts with the existing codebase, producing more accurate and contextual feedback.

---

## 🔗 GitHub Integration

CodeHorse integrates directly with GitHub using the **GitHub API (Octokit)**.

Features include:

- Connect multiple repositories
- GitHub webhook handling
- Detect pull request events
- Automatically trigger reviews when PRs open or update
- Direct linking to GitHub PRs

This enables a fully automated AI review pipeline.

---

## ⚡ Background Job Processing

Heavy tasks such as repository indexing and AI review generation are processed asynchronously using **Inngest**.

Background jobs handle:

- Repository indexing
- Vector embedding generation
- Pull request review generation
- Review storage

This ensures the UI remains responsive while complex operations run in the background.

---

## 📊 Dashboard & Analytics

CodeHorse provides a modern dashboard with repository insights.

Features include:

- Total connected repositories
- Pull requests analyzed
- Generated reviews
- Commit activity
- Monthly development trends

Charts and visualizations help developers understand their workflow.

---

## 📦 Repository Management

Users can manage multiple repositories from the dashboard.

Capabilities include:

- Browse GitHub repositories
- Connect or disconnect repositories
- Search repositories
- Filter repository lists
- Infinite scrolling for large repository lists

---

## 👤 Authentication & User Management

Authentication is handled using **Better Auth**.

Features include:

- Secure login and session management
- User profile management
- Usage tracking
- Secure API access

---

## 💳 Subscription System

CodeHorse supports a **SaaS subscription model** powered by **Polar**.

### Free Plan
- 5 repositories
- 5 reviews per repository

### Pro Plan
- Unlimited repositories
- Unlimited reviews

Usage tracking ensures fair limits for free users.

---

# 🏗️ Tech Stack

## Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI

## Backend
- Next.js API Routes
- Next.js Server Actions

## Database
- PostgreSQL
- Prisma ORM

## AI / Machine Learning
- Google Gemini AI
- Gemini 2.5 Flash
- text-embedding-004

## Vector Database
- Pinecone

## Background Jobs
- Inngest

## Authentication
- Better Auth

## Payments
- Polar

## Data Fetching
- TanStack Query

## GitHub Integration
- Octokit API

## Charts
- Recharts

## Forms
- React Hook Form
- Zod Validation

---

## 🧠 System Architecture

```mermaid
graph TD
A[GitHub Pull Request Event] --> B[GitHub Webhook]
B --> C[Inngest Job]
C --> D[Repository Context Retrieval]
D --> E[Pinecone Vector Search]
E --> F[Gemini AI Review Generation]
F --> G[Review Stored in PostgreSQL]
G --> H[Displayed in CodeHorse Dashboard]

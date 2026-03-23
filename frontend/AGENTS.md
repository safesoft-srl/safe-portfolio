# AGENTS.md

## Purpose

This file defines strict rules for AI agents and code generators working in this repository.
All generated code MUST follow these guidelines.

---

## UI & Components

- Always use **shadcn/ui components** when possible.
- Do NOT create custom UI components if an equivalent exists in shadcn.
- Keep components reusable and consistent.

---

## Data Fetching

- Do NOT use `fetch`.
- Always use **axios** for HTTP requests.
- Use **TanStack Query** for server state management when applicable.

---

## Styling

- Use **Tailwind CSS** as the primary styling solution.
- Avoid custom CSS unless strictly necessary.
- If custom CSS is required:
  - Place it in `src/styles/`
  - Keep it minimal and modular.

---

## Code Style

- Do NOT use emojis in code comments.
- Keep comments clear, concise, and professional.
- All code, variables, and comments must be in English.

---

## Project Structure

- Follow the existing folder structure strictly.
- Use the `features/` pattern for scalable modules.
- Do not introduce new folders or patterns without justification.

---

## State Management

- Use **Zustand** for global client state when needed.
- Do NOT use global state for server data.
- Use **TanStack Query** for server state.

---

## API Layer

- All API calls must be placed inside `services/`.
- Do NOT call APIs directly inside components.

---

## Restrictions

- Do NOT introduce new libraries without strong justification.
- Do NOT mix multiple patterns for the same concern.
- Do NOT over-engineer solutions.

---

## Goal

Maintain a clean, consistent, and scalable codebase.

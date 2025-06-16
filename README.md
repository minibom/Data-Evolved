# Firebase Studio

This is a NextJS starter project for "Data Evolved" in Firebase Studio.

## Project Overview

"Data Evolved" is a 2.5D strategic RPG where players embody Data Entities within the Quantum Nexus. The game features a dynamic conflict between two AI-driven factions: the orderly AI Core and the chaotic Hackers (Shadow Decoders). Players evolve by collecting Data Scraps, increasing their GHZ (Processing Frequency), and eventually choosing a faction. The game world is intended to be dynamically shaped by player actions and the decisions of the two overarching AI entities, under admin supervision.

## Key Features (Planned)

*   **Dynamic Faction Warfare**: Engage in PvP and PvE to control Zones.
*   **Assimilation Protocol**: Defeated players in PvP can be forced to switch factions.
*   **Evolving Entities**: Increase GHZ, unlock skills, and choose a faction.
*   **Unique Combat Stats**: Power, Memory, Firewall, GHZ.
*   **AI-Driven World**: AI Core and Anonymous (Hacker AI) influence events, generate content, and balance the game.
*   **Procedural Content**: AI-generated maps, quests, and lore.
*   **Player-Influenced Evolution**: Protocol Fork system for players to propose game rule changes.
*   **Robust Admin Panel**: For monitoring, supervision, and management.

## Getting Started

1.  Install dependencies: `npm install`
2.  Run the development server: `npm run dev` (Next.js app)
3.  Run Genkit development server (for AI flows): `npm run genkit:dev` or `npm run genkit:watch`

The main application code is in `apps/web/src/`.
Shared types are in `packages/common-types/`.
Static game data is in `data/`.
AI flows are in `src/flows/`.

To get started with the game client, take a look at `apps/web/src/app/game/page.tsx` and the `apps/web/src/game-client/` directory.
The Admin Panel can be accessed at `/admin`.

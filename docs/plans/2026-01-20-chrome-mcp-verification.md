# Chrome MCP Verification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Validate the Chapter 2 encoding split visuals across multiple viewport sizes and zoom levels using Chrome MCP, then record completion in the TODO stack.

**Architecture:** Use the existing Vite dev server and Chrome MCP session to navigate to Chapter 2. Capture screenshots at defined viewport/zoom combinations that cover the tokenization, embedding, and pooling states. Update `.codex/TODO.md` to log the verification pass.

**Tech Stack:** Vite + React + TypeScript, Chrome MCP, Vite dev server.

### Task 1: Prep the verification session

**Files:**
- Modify: None

**Step 1: Ensure the dev server is running**

Run: `npm run dev -- --host 127.0.0.1 --port 5173`
Expected: Vite serves on an available local port.

**Step 2: Open the app in Chrome MCP**

Navigate to the local Vite URL and wait for the ML boot sequence to finish so the chapter tabs are available.

### Task 2: Capture Chapter 2 encoding visuals across viewports

**Files:**
- Create: `.codex/screenshots/mcp-ch2-<viewport>-<zoom>-<stage>.png`

**Step 1: Navigate to Chapter 2 (Gather)**

Select `CH.2 GATHER` and stay on step `2A: User Tower Encoding`.

**Step 2: Capture screenshots at the target sizes/zooms**

Capture each state below once the encoding stage is visible:

- 1440x900 @ 100% zoom (tokenize stage)
- 1440x900 @ 125% zoom (token embeddings stage)
- 1024x768 @ 100% zoom (pooling stage)
- 768x1024 @ 100% zoom (tokenize stage)
- 390x844 @ 100% zoom (token embeddings stage)
- 390x844 @ 125% zoom (pooling stage)

### Task 3: Log completion in the TODO stack

**Files:**
- Modify: `.codex/TODO.md`

**Step 1: Add the verification item to the stack**

Insert a new TODO entry describing the Chrome MCP viewport/zoom verification.

**Step 2: Mark the verification item complete**

Move the completed item to the Completed section.

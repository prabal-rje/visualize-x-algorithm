# Repository Notes for Agents

## Coding Style
- React 18 + TypeScript.
- Strict mode; functional components only.
- Highly functional, strongly typed style; prefer pure helpers and minimal mutable state.
- Favor map/filter/reduce, iterators, first-class functions, async/await, small typed state machines, and dependency injection.
- Code should read mathematically; keep data flow explicit and avoid hidden side effects.
- Create tests for any testable unit; use dependency injection so functions can be tested in isolation.
- Every commit must leave the project in a runnable state (tests/build pass).

## TODO Stack
- Maintain the task stack in `.codex/TODO.md`.
- The top-most unchecked item is done first; insert new tasks by priority.
- Move completed items to the Completed section to keep the stack clean.

## Hooks
### Pre-Start
- Read `.codex/AGENTS.md` and `.codex/TODO.md`.
- Confirm the top-most TODO item and required specs/appendix references.

### Pre-Finish
- Code review: run `git diff` and scan for style deviations.
- Fix style issues and rerun tests.
- Ensure the project runs properly before commit (tests/build as applicable).
- Update `.codex/TODO.md` with completed tasks.

## Superpowers System

<EXTREMELY_IMPORTANT>
You have superpowers. Superpowers teach you new skills and capabilities. RIGHT NOW run: `~/.codex/superpowers/.codex/superpowers-codex bootstrap` and follow the instructions it returns.
</EXTREMELY_IMPORTANT>

# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

See `_shared/skill-resolver.md` for the full resolution protocol.

## User Skills

| Trigger | Skill | Path |
|---------|-------|------|
| When writing TypeScript code | typescript | /home/alessandrolopez/.claude/skills/typescript/SKILL.md |
| When working with Next.js | nextjs-15 | /home/alessandrolopez/.claude/skills/nextjs-15/SKILL.md |
| When managing React state | zustand-5 | /home/alessandrolopez/.claude/skills/zustand-5/SKILL.md |
| React 19 patterns | react-19 | /home/alessandrolopez/.claude/skills/react-19/SKILL.md |
| When styling with Tailwind | tailwind-4 | /home/alessandrolopez/.claude/skills/tailwind-4/SKILL.md |
| When using Zod | zod-4 | /home/alessandrolopez/.claude/skills/zod-4/SKILL.md |
| When writing Python tests | pytest | /home/alessandrolopez/.claude/skills/pytest/SKILL.md |
| When building AI chat features | ai-sdk-5 | /home/alessandrolopez/.claude/skills/ai-sdk-5/SKILL.md |
| Django REST Frameworks | django-drf | /home/alessandrolopez/.claude/skills/django-drf/SKILL.md |
| Go tests | go-testing | /home/alessandrolopez/.claude/skills/go-testing/SKILL.md |
| Playwright E2E | playwright | /home/alessandrolopez/.claude/skills/playwright/SKILL.md |
| Creating Jira tasks | jira-task | /home/alessandrolopez/.claude/skills/jira-task/SKILL.md |
| Creating Jira epics | jira-epic | /home/alessandrolopez/.claude/skills/jira-epic/SKILL.md |
| Creating GitHub issues | issue-creation | /home/alessandrolopez/.config/opencode/skills/issue-creation/SKILL.md |
| Creating PRs | branch-pr | /home/alessandrolopez/.config/opencode/skills/branch-pr/SKILL.md |
| Odoo 17 development | odoo-17.0 | /home/alessandrolopez/.claude/skills/odoo-17.0/SKILL.md |
| Odoo i18n | odoo-i18n | /home/alessandrolopez/.claude/skills/odoo-i18n/SKILL.md |
| Judgment day review | judgment-day | /home/alessandrolopez/.config/opencode/skills/judgment-day/SKILL.md |
| Creating new skills | skill-creator | /home/alessandrolopez/.claude/skills/skill-creator/SKILL.md |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### typescript
- **Const Types Pattern**: Create const object first, extract type with `typeof STATUS[keyof typeof STATUS]`
- **Flat Interfaces**: One level depth, nested objects → dedicated interface
- **Never use `any`**: Use `unknown` for truly unknown types, then narrow with type guards
- **Erasable Syntax Only**: No `enum`, use `as const` instead
- **`keyof` for key access**: Use `keyof` to get union of keys, generic constraints for key parameter

### nextjs-15
- Server Components by default, add 'use client' only for interactivity/hooks
- Server Actions for mutations, `useFormStatus` for pending state
- `useOptimistic` for optimistic UI updates
- Partial Prerendering: wrap static content in `<Suspense>` boundaries
- Route not found: `export const dynamic = 'force-dynamic'` or `export const revalidate = 0`

### react-19
- No useMemo/useCallback needed — React Compiler handles memoization
- use() hook for promises/context, replaces useEffect for data fetching
- Server Components by default, add 'use client' only for interactivity
- ref as regular prop — no forwardRef needed
- Actions: use useActionState for form mutations, useOptimistic for optimistic UI

### tailwind-4
- Use `shrink-0` for flex items that shouldn't shrink
- Use `grow` explicitly on flex children that should expand
- Form utilities in `data-` attributes, not conditional classes
- CSS variables for fallback fonts, not @apply
- No `var()` in className — use utility directly

### zod-4
- Use `.schema` property (not `.schema()`) to access the inferred type
- Breaking: `.parse()` returns the parsed value, not boolean
- Use `.safeParse()` for validation without throwing on failure
- Input schemas with `.input`, output schemas with `.output`

### pytest
- Use pytest fixtures with `@pytest.fixture` decorator
- Parametrize tests with `@pytest.mark.parametrize`
- Mock with `unittest.mock` or `pytest-mock`
- Custom markers: `@pytest.mark.slow`, `@pytest.mark.integration`

### ai-sdk-5
- Breaking: No more `useChat` / `useCompletion` hooks
- Use AI SDK Core: `useAI` from `@ai-sdk/react`
- Stream AI responses with `useAI` hook, handle loading states manually
- Provider wraps the app with `AI` component

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| No convention files detected | — | Project has no AGENTS.md, CLAUDE.md, or .cursorrules |
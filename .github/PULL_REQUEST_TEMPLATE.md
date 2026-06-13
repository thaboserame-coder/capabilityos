## Summary

<!-- What does this PR change, and why? Link any related issue. -->

## Screenshots / recordings

<!-- For any UI change, attach before/after screenshots or a short clip. -->

## Quality gate checklist

- [ ] `npm run lint` passes with zero warnings
- [ ] `npm run format:check` passes
- [ ] `npm run test:coverage` passes (≥95% statements/functions/lines, ≥90% branches)
- [ ] `npm run build` succeeds
- [ ] `npm run e2e` passes locally (or CI's E2E job is green)
- [ ] New/changed components have Storybook stories and PropTypes/JSDoc
- [ ] Accessibility: no new `cypress-axe` violations; keyboard/focus order checked manually for new UI
- [ ] Lighthouse budgets (performance/accessibility/best-practices/SEO ≥ 90) unaffected — CI job is green

## Fix-from-the-root

- [ ] This change addresses the root cause, not a symptom (or explains below why a narrower fix was chosen)

## Reviewer notes

<!-- Anything reviewers should pay special attention to. -->

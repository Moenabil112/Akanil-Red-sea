---
name: arabic-rtl-experience
description: Builds a native Arabic RTL experience for Akanil. Use for Arabic layouts, navigation, mixed-direction text, typography, responsive behavior, forms, maps or language switching.
---
# Native Arabic RTL experience

Arabic is a first-class authored interface, not a mirrored translation.

## Layout

- Set document direction and language correctly.
- Use logical CSS properties.
- Review information order, not only physical alignment.
- Mirror directional icons only when their meaning is directional.
- Do not mirror logos, maps, charts or playback controls blindly.
- Keep identifiers, emails, URLs, numbers and Latin acronyms isolated with correct bidirectional handling.

## Typography

- Use the approved Arabic family and fallbacks.
- Adjust display line-height independently from Latin typography.
- Avoid excessive Arabic letter spacing.
- Check diacritics, ligatures, punctuation and line breaks.
- Prevent orphaned short words and awkward heading wraps where practical.

## Navigation

- Language switching must preserve the current page and section.
- Arabic navigation order should feel natural in RTL.
- Menus, breadcrumbs, progress indicators and tabs require authored RTL states.

## Maps and process flows

- Geographic direction does not automatically reverse.
- A route from Morocco toward the Red Sea remains geographically accurate.
- Process arrows may reverse when they represent reading progression, but not when they represent physical geography.

## Content parity

The Arabic version must contain the same institutional meaning and decision status as French and English, while remaining naturally written.

## Required tests

Test at minimum:

- narrow Android phone;
- common iPhone width;
- tablet portrait;
- desktop;
- 200% text zoom;
- keyboard navigation;
- mixed Arabic and Latin content;
- long institutional headings;
- language switching from a deep section.

Record and fix layout issues instead of hiding them with truncation.

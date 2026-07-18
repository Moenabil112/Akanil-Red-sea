---
name: visual-asset-integration-and-compression
description: Selects, edits and optimizes the Akanil image and motion library. Use when importing images, generating derivatives, preparing video, selecting hero media or managing public assets.
---
# Visual asset integration and compression

Use the curated asset catalog and motion-ready manifest as the starting inventory.

## Asset decision process

For each asset determine:

- role in the narrative;
- documentary or conceptual status;
- required crop by breakpoint;
- whether embedded text must be removed;
- whether the image needs layer separation for motion;
- production format;
- loading priority;
- alt text or decorative status;
- rights and publication status.

## Production derivatives

Create only the derivatives needed by the interface:

- AVIF where supported by the chosen pipeline;
- WebP fallback;
- appropriately sized JPEG where needed;
- SVG for true vector diagrams and icons;
- MP4/WebM for cinematic motion;
- poster frame for every video.

Keep source PNG files out of the public bundle unless technically required.

## Generated concept art

- Do not rely on generated image text.
- Remove or crop false labels.
- Do not present people, meetings, ports, facilities or routes as documentary evidence.
- Use generated art selectively for atmosphere, conceptual diagrams and motion layers.
- Mix with real documentary photography when approved assets become available.

## Motion conversion

Separate selected scenes into:

1. background;
2. architecture or terrain;
3. subject;
4. route and ribbons;
5. glow nodes;
6. particles;
7. logo;
8. semantic HTML text.

Avoid baking final headings and CTAs into video.

## Runtime integration

- reserve aspect ratio;
- implement responsive crops;
- load the hero intentionally;
- pause video when offscreen;
- provide reduced-motion and low-bandwidth alternatives;
- do not use animated GIF as the primary production format.

## Records

Maintain an asset-use file containing:

- asset ID;
- source;
- section;
- conceptual status;
- formats;
- dimensions;
- compression;
- alt text;
- motion behavior;
- publication approval.

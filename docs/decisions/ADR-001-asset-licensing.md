# ADR-001: Asset Licensing Policy

## Status
Accepted

## Context
PixelOps uses a pixel-art visual style inspired by projects like Pixel Agents. However, many pixel-art asset packs (tilesets, sprites) are commercially licensed and cannot be redistributed in an open-source project.

Pixel Agents, for example, uses a paid office tileset that is not included in its repository. We must not rely on assets with incompatible licenses.

## Decision
PixelOps will only ship with assets that meet one of the following criteria:

1. **Original assets** created specifically for Mossland PixelOps (owned by MosslandOpenDevs).
2. **Open-licensed assets** with licenses compatible with MIT:
   - CC0 (public domain)
   - CC-BY 4.0 (attribution required)
   - OGA-BY (OpenGameArt attribution)
   - MIT / Apache 2.0 licensed sprite packs

Assets with the following licenses are **not permitted**:
- CC-NC (no commercial use restrictions conflict with MIT)
- CC-ND (no derivatives)
- Proprietary / paid-only licenses
- Unknown or unverified licenses

## Consequences
- Every asset must have a corresponding entry in `assets/ATTRIBUTION.md` listing: source URL, license, author, and any modifications.
- Asset PRs require a license review before merge.
- We may need to commission original sprites for Mossland-specific characters and buildings.
- The initial MVP may use placeholder sprites until production assets are ready.

## References
- [Pixel Agents repo — asset note](https://github.com/AyuGram/Pixel-Agents)
- [Creative Commons license compatibility](https://creativecommons.org/faq/#can-i-combine-material-under-different-creative-commons-licenses-in-my-work)

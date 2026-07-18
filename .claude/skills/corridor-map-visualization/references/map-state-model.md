# Corridor Map State Model

| State | Meaning | Suggested visual |
|---|---|---|
| Conceptual | Strategic possibility only | Thin dashed line, low opacity |
| Under Study | Data collection or route analysis underway | Dashed line with study badge |
| Pilot Qualified | Ready for a limited controlled test | Solid line with outlined nodes |
| Operationally Verified | Current evidence supports operation | Solid line with verification date |
| Constrained | Route has a known material constraint | Muted line with warning symbol |
| Alternative | Fallback scenario | Secondary hue and branch pattern |

Every visible route must have a state.
The interface must not convert a conceptual route into an operational claim through animation intensity.

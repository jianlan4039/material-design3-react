## Overview

create a slider component, it has the following parts:

- track: an indicator that used to specify how much a value is;
- track container: contains tracks and handle(s) in a direction;
- handle: user drag it to set value;
- bulb: over the handle while dragging, it shows value.

### Track

A track is used both for an active track and an inactive track, the only difference is color. It can extend/shrink from both ends. This is controlled by dragging handle.

### Track Container

This container contains tracks and handle(s) in a row or column.

### Handle

User drag it moving along the track container, usually its left hand side is active track and the other side is inactive track. When range enabled, the left handle's left and right tracks reverses.

### Bulb

Bulb over the handle when user dragging handle, and shows concrete value.

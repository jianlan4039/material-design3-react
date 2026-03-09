# Material Design 3 Tokens Skill

## Overview
This skill provides expertise in creating and managing CSS variables using the Material Design 3 token system in this React component library.

## Key Concepts

### Token Creation Process
1. **Define tokens** in `src/tokens/components/[component]/index.scss`:
   ```scss
   $tokens: (
     "md.comp.button.container.color": "md.sys.color.primary",
     "md.comp.button.label-text.color": "md.sys.color.on-primary",
     "md.comp.button.container.height": "40px"
   );
   ```

2. **Generate CSS variables** in `_token-vars.scss`:
   ```scss
   @use "@tokens/components/[component]/index.scss" as *;
   @use "@tokens/converter" as converter;

   @layer nd-comp {
     :root {
       @include converter.iterateTokens($tokens);
     }
   }
   ```

3. **Import and use** in component styles:
   ```scss
   @use "../parts/_token-vars.scss";

   .button {
     background-color: var(--md-comp-button-container-color);
   }
   ```

## Token Naming Convention
- `md.sys.*` - System tokens (colors, shapes, elevation)
- `md.comp.*` - Component-specific tokens
- Use dot notation in definitions, hyphens in CSS variables
- Reference system tokens for consistency

## Best Practices
- Follow M3 naming structure
- Define all variants and states
- Use semantic names
- Include proper copyright headers
- Document all token purposes
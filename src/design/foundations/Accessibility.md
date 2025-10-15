# Overview

Accessible design enables users with diverse abilities to navigate, understand, and enjoy a UI.
Accessibility by default is a core design value for Material. Material's accessibility requirements and goals are
documented across component pages and guidelines.

## Principles

- Honor Individuals
- Learn before, not after
- Requirements as a starting point

## Assistive technology

Assistive technology helps increase, maintain, or improve the functional capabilities of individuals with disabilities.
People can live more independently by engaging with technology through devices like keyboards, screen readers, and
braille displays, as well as tracking input, magnifiers, and voice input.

## Designing

Designing and implementing accessible product experiences involve a range of considerations.

### Color Contrast

Color and contrast can be used to help users see and interpret your app’s content, interact with the right elements, and
understand actions.

Color contrast is important for users to distinguish various text and non-text elements. Higher contrast makes the
imagery easier to see, while low-contrast images may be difficult for some users to differentiate in bright or low light
conditions, such as on a very sunny day or at night.

**The W3C recommends the following contrasts for body text and image text:**

| Text Type                                                    | Color Contrast Radio                  |
|--------------------------------------------------------------|---------------------------------------|
| Large text (at 14 pt bold/18 pt regular and up) and graphics | At least 3:1 against the background   |
| Small text                                                   | At least 4.5:1 against the background |

- Elements that are clustered with others, such as a group of buttons, require the user to distinguish each one from the
  group. These elements benefit from 3:1 contrast between themselves and the background.
- Elements that stand on their own and apart from other elements on the screen, such as a FAB, are already
  distinguishable to users because of their prominence. These elements don’t benefit from 3:1 contrast between
  themselves and the background.
- When placing components together in a cluster, use components or types of components that each achieve at least 3:1
  contrast between themselves and the background.

### Structure

When navigation is easy, users understand where they are in your app and what’s important. To emphasize which
information is important, multiple visual and textual cues like color, shape, text, and motion add clarity.

### Flow

People should be able to navigate and interact with your app without the use of a traditional mouse or touch screen. To
support navigation by keyboard, screen reader, or other assistive technology, goals should be achievable by using tab,
arrow, and other common navigation keys.

### Labeling elements

Elements can be defined and labeled to enhance understanding of their function and reduce confusion for those navigating
with assistive technology. Add accessibility labels to define roles and indicate decorative elements.

## Writing and Text

Accessibility text refers to text that is used by screen reader accessibility software, such as Google’s TalkBack on
Android, Apple’s VoiceOver on iOS, and Freedom Scientific’s JAWS on desktop. Screen readers read aloud the on-screen
text and elements (such as buttons), including both visible and nonvisible alternative text.

### Text Resizing

People with low vision or those who prefer large text must be able to scale up the size of text in a UI. This adjustment
is often performed through a device OS setting or in-app option.

UIs should support a minimum text increase of 200%.

Most components behave the same when text is resized:

- Text and line height scale up proportionally, multiplied by scale value
- Padding remains constant at 1x the default size
- Spacing between elements in a component remain constant at 1x the default size
- Components that don't include text, like progress indicators, checkboxes, or radio buttons, aren't affected by text
  resizing.

#### Methods

- **Increase Container Size:** Resizing containers can prevent text from overlapping, clipping, or truncating.
- **Reflow the layout:** Consider reflowing the layout, especially when components grow very long. To accommodate larger
  text, components can be stacked on top of one another, rather than fixed side-by-side.
- **Enable content to scroll:** When long strings of enlarged text don’t fit on one screen, consider adding a scrollbar
  to provide access to more content.
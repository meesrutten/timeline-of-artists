# Timeline of artists

A timeline of artists who lived between 1500 and 1700 and were based in Amsterdam.

This project contains:
- GSAP TweenMax
- GSAP SplitText plugin
- Adamlink opendata
- ES6, ES7 code
- Pretty things

## Project
This project is a prototype built in a week, so my code is not that pretty (sorry for that).
I mainly focussed on aesthetics and animation.

![gif of project](https://github.com/meesrutten/timeline-of-artists/blob/master/timeline-artist-Mees-Rutten.gif "The Project")

## Browser Technologies
### Progressive enhancement

#### Good:
- Works without custom fonts
- Works without images but the site revolves around images...
- Works without color
- No cookies
- No localstorage

#### Bad:
- No alt tags
- Does not work without JavaScript...
- Works with slow connection, but no loading indicator
- Does not work at all with tab

#### Accessibility
- Added aria-labels
- Changed clickable buttons to a[href]
- Set focus state to clickable buttons
- The website is now fully tab-able
- Added accesskeys for back button
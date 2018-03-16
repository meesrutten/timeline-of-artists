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

Tests were done by using Mac OS VoiceOver and multiple devices
![voiceover of project](https://github.com/meesrutten/timeline-of-artists/blob/browser-technologies/voiceover.png "The Project")

#### Good:
- Works without custom fonts
- Works without images but the site revolves around images...
- Works without color
- No cookies
- No localstorage

#### Bad:
- No alt attribute
- Does not work without JavaScript...
- Works with slow connection, but no loading indicator
- Does not work at all with tab

#### Images
When images are disabled the user will not see images of the work of the artists.
They will be able to see the rest of the site.
![no images in project](https://github.com/meesrutten/timeline-of-artists/blob/browser-technologies/images.png "The Project")

#### Custom fonts
When custom fonts are disabled users will be able to use the website as normal.
![no fonts in project](https://github.com/meesrutten/timeline-of-artists/blob/browser-technologies/fonts.png "The Project")

#### Javascript (volledig)
When Javascript is disabled the user will not see any of the content. Just the title.
#### Kleur
Colors used are black and white. The contrast ratio is strong enough for good readability.
The only colors apart from black and white are in the images.
#### Breedband internet
The website will work but the content will render much slower
#### Cookies
No cookies were used
#### localStorage
No localstorage was used
#### Muis/Trackpad
Interface is tab-able
![tabs project](https://github.com/meesrutten/timeline-of-artists/blob/browser-technologies/tab.png "The Project")

#### Usability test
The website works on most devices. Because of a problem with open WiFi and API calls I was not able to get the content.
My animations work on almost every device (even Kindle browser).
The only problem sometimes is the layout of the page.
![image project](https://github.com/meesrutten/timeline-of-artists/blob/browser-technologies/test1.jpg "The Project")
![image project](https://github.com/meesrutten/timeline-of-artists/blob/browser-technologies/test2.jpg "The Project")
![image project](https://github.com/meesrutten/timeline-of-artists/blob/browser-technologies/test3.jpg "The Project")


#### Changes after research
- Added aria-labels
- Changed clickable buttons to a[href]
- Set focus state to clickable buttons
- The website is now fully tab-able


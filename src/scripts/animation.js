function initialAnimation(){

	const timeline = new TimelineLite

	const mySplitText = new SplitText("#title", {type:"words,chars"})
    const chars = mySplitText.chars; //an array of all the divs that wrap each character

	timeline.set(chars, {autoAlpha: 0})
	timeline.set('#black_stripe', { transformOrigin: 'left', width: '1100', height: '300', skewX: '-10deg', x: 0, transform: 'none' })
	timeline.set('[data-type="timeline"], .vertical-timeline', { autoAlpha: 0 })

	timeline.staggerTo(chars, 0.8, { autoAlpha: 1 }, .1)

	timeline.to("#black_stripe", 1, { x: '100%' }, 2)

	timeline.to('[data-type="timeline"], .vertical-timeline', 1, { autoAlpha: 1 }, 3)

	timeline.play()

}

export default initialAnimation

// const io = new IntersectionObserver(
// 	entries => {
// 		console.log(entries);
// 	},
// 	{
// 		/* Using default options. Details below */
// 	}
// );


// // Start observing an element
// io.observe(document.querySelector('[data-type="timeline"]'));

// 	// Stop observing an element
// 	// io.unobserve(element);

// 	// Disable entire IntersectionObserver
// 	// io.disconnect();

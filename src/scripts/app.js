import initialAnimation from "./animation";

const creatorQuery = `
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX sem: <http://semanticweb.cs.vu.nl/2009/11/sem/>
PREFIX schema: <http://schema.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
SELECT ?creatorName ?birthYear ?deathYear ?werkTitle ?werkYear ?werkImg ?age  WHERE {
  ?werk dc:creator ?creator .
  ?creator foaf:name ?creatorName .
  ?creator schema:birthDate ?birthDate .
  ?creator schema:deathDate ?deathDate .  
  ?werk dc:title ?werkTitle .
  ?werk sem:hasBeginTimeStamp ?werkDate .
  ?werk foaf:depiction ?werkImg .
  FILTER REGEX(?werkDate, "^[12][0-9]{3}$") .
  BIND (year(xsd:gYear(?werkDate)) AS ?werkYear) .
  FILTER REGEX(?birthDate, "^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$") .
  BIND (year(xsd:dateTime(?birthDate)) AS ?birthYear) .
  FILTER REGEX(?deathDate, "^[12][0-9]{3}-[0-9]{2}-[0-9]{2}$") .
  BIND (year(xsd:dateTime(?deathDate)) AS ?deathYear) .
  BIND ((?werkYear - ?birthYear) AS ?age) .
  FILTER (strlen(?werkTitle) < 50)
}
ORDER BY ?birthYear
LIMIT 1500					`;

function makeQueryURL(query) {
	const encodedquery = encodeURIComponent(query);
	return `https://api.data.adamlink.nl/datasets/AdamNet/all/services/endpoint/sparql?default-graph-uri=&query=${encodedquery}&format=application%2Fsparql-results%2Bjson&timeout=0&debug=on`;
}
const app = {
	pageNumber: 1,
	creators: [],
	onTimeline: true,
	checkPageAndFetch() {
		const creatorInfo = makeQueryURL(creatorQuery)
		initialAnimation()
		
		fetch(creatorInfo)
			.then((resp) => resp.json()) // transform the data into json
			.then(function (data) {
				
				if (data.results.bindings.length > 0) {
					const verticalTimeline = document.querySelector('.vertical-timeline [data-type="timeline-info"]')

					const result = data.results.bindings.reduce((acc, el) => ({
						...acc,
						[el.creatorName.value]: Array.isArray(acc[el.creatorName.value]) ? [...acc[el.creatorName.value], el] : [el],
					}), {});

					const resultArray = Object.keys(result).map(key => result[key])

					resultArray.forEach( (creator) => {
						// console.log(creator);
						if(creator.length > 8){
							const nameWithoutAlias = creator[0].creatorName.value.split(',');
							const firstName = function() {
								for (var i = 0; i < nameWithoutAlias.length; i++) {
									var codeLine = nameWithoutAlias[i];
									return codeLine.substr(0, codeLine.indexOf(" "));
								}
							}
							// console.log(firstName());
							verticalTimeline.insertAdjacentHTML('beforeend', `
							<a class="creatorWork" style="opacity: 0" href="#${firstName()}-${creator[0].birthYear.value}">
								<div class="creatorWorkYear">
									<p aria-label="Year of birth is ${creator[0].birthYear.value}">${creator[0].birthYear.value}</p>
								</div>
								<h2 id="${firstName()}-${creator[0].birthYear.value}">${nameWithoutAlias[0]}</h2>
								<img class="timeline-image" src="${creator[0].werkImg.value}" alt="An image of ${nameWithoutAlias[0]}'s work">
							</a> 
							`)
						}
					} )
					TweenMax.staggerTo('.creatorWork', 2, { opacity: 1, delay: 1 }, 0.25)

					const TWO_PI = Math.PI * 2;

					const button = document.querySelectorAll('[data-type="timeline-info"] .creatorWork'),
						label = document.querySelectorAll('[data-type="timeline-info"] .creatorWork h2');

					let mouseOutTween;// set on mouse-out

					TweenMax.set([button, label], { transformPerspective: 700 });
					button.forEach((el) => {
						el.addEventListener('click', function (e) {
							let rect = el.getBoundingClientRect(),
								x = e.clientX - rect.left,
								y = e.clientY - rect.top,
								hit = { x: x, y: y, radius: 1, alpha: 1 };

							TweenMax.to(hit, 0.5, { radius: 200, alpha: 0, ease: Power1.easeOut });

						});

						el.addEventListener('mousemove', function (e) {
							let rect = el.getBoundingClientRect(),
								x = e.clientX - rect.left,
								y = e.clientY - rect.top,
								rx = -(y / rect.height) + 0.5,
								ry = (x / rect.width) - 0.5,
								rMax = 30;

							TweenMax.to(el, 0.1, { rotationX: rx * rMax, rotationY: ry * rMax });
						});

						el.addEventListener('mouseout', function (e) {
							if (mouseOutTween) mouseOutTween.kill();
							mouseOutTween = TweenMax.to(el, 0.25, { delay: 0.25, rotationX: 0, rotationY: 0 });
						});

					})

					document.querySelectorAll('[data-type="timeline-info"] .creatorWork').forEach( (el) => {
						el.addEventListener('click', goToPersonPage)
					})

					function goToPersonPage(event){
						console.log(event.target);
						window.scrollTo(0, 0); 
						document.querySelector('[data-view="person"]').style = "display: block;"
						document.querySelector('[data-view="timeline"]').style = "display: none;"
						app.onTimeline = false;
						const personData = result[Object.keys(result).find(key => key.includes(event.target.querySelector('h2').textContent))]
						console.log(personData);
						getPersonData(personData)
					}

					function getPersonData(personData) {
						const creatorData = personData
						const nameWithoutAlias = creatorData[0].creatorName.value.split(',')
						document.querySelector('#title').textContent = nameWithoutAlias[0];
						document.querySelector('#title').setAttribute('aria-label', creatorData[0].creatorName.value.split(','))
						document.querySelector('.birthDate').textContent = creatorData[0].birthYear.value
						document.querySelector('.deathDate').textContent = creatorData[0].deathYear.value

						const workDuringLifetime = creatorData.filter(checkLifetime);

						function checkLifetime(work) {
							return work.werkYear.value >= creatorData[0].birthYear.value && work.werkYear.value <= creatorData[0].deathYear.value;
						}

						const sortedByYear = workDuringLifetime.sort(function (a, b) {
							return Number(a.werkYear.value) - Number(b.werkYear.value);
						});

						sortedByYear.forEach((work, i) => {
							if (work.werkTitle.value.length < 80) {
								const werkTitleCleaned = work.werkTitle.value.split('(')
								document.querySelector('[data-type="info"]').insertAdjacentHTML('beforeend',
									`   
								<div class="creatorWorkYear" aria-label="Year of work is ${work.werkYear.value}">
									<p>${work.werkYear.value}</p>
								</div>

								<div class="creatorWork" tabindex="0">
									<h2 lang="nl">${werkTitleCleaned[0]}</h2>
									<img class="timeline-image" src="${work.werkImg.value}" alt="Image of the artists work">
								</div>
							`
								)
							}
						})

						initialAnimation()
						document.querySelector('[data-toggle="timeline"]').addEventListener('click', function(){
							event.preventDefault()
							const personView = document.querySelector('[data-view="person"]')
							personView.style = "display: none;"
							personView.querySelector('[data-type="timeline"]').remove()
							personView.insertAdjacentHTML('beforeend', 
							`
							<section data-type="timeline" aria-label="Vertical timeline of artists with their birthyear">
								<article data-type="years">
									<p>year</p>
								</article>
								<div data-type="line">
									<div data-type="point"></div>
								</div>
								<article data-type="info">
								</article>
							</section>
							`
							)

							const timelineView = document.querySelector('[data-view="timeline"]')
							timelineView.style = "display: block;"
							console.log(window.location.hash);
							document.querySelector(window.location.hash).scrollIntoView()
							document.querySelector(window.location.hash).focus()
						})
					}
				}
			})
			.catch(function (error) {
				// if there is any error you will catch them here
				console.log(error);
			});
		
	}

}

app.checkPageAndFetch()

(function () {
	const keyshortcutElements = document.querySelectorAll('[aria-keyshortcuts]')
		console.log(keyshortcutElements);
	function checkKey(event) {
		console.log(event);
		const eventKey = event.key.toUpperCase()
		const accesskeys = []
		keyshortcutElements.forEach((elem) => {
			const key = elem.getAttribute('accesskey').toUpperCase()
			accesskeys.push(key)
		})
		accesskeys.forEach((accesskey) => {
			if (event.ctrlKey && eventKey === accesskey
				|| event.ctrlKey && event.altKey && eventKey === accesskey
				|| event.altKey && eventKey === accesskey
				|| event.altKey && event.shiftKey && eventKey === accesskey
			) {
				const focussedElem = document.querySelector(`[accesskey="${accesskey}"]`)
				focussedElem.focus()
			}
		})
	}

	window.addEventListener('keydown', checkKey)
})()
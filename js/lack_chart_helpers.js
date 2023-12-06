

export function createLackExceedingBarGraphs( graphs, displayExceedings, getText )
{
	let r = [];
	let tooltips = {};

	for( let i = 0 ; i < graphs.length ; i += 2 ) 
	{
		let pair = createLackExceedingBarPair( 
			[ graphs[i], graphs[i+1] ], displayExceedings, getText, i/2, tooltips
		);
		if( pair === null ) continue;

		for( let p of pair ) {
			r.push( p );
		}
	}
	return [ r, tooltips ];
}

function createLackExceedingBarPair( graphs, displayExceedings, getText, stackId, tooltips )
{
	let gActual= {
		Name: graphs[0].Name,
		Color : graphs[0].Color,
		f_ColorInc : graphs[0].Color,
		stackId: stackId,
		Array: []
	};
	let gLack={
		Name: graphs[0].Name + "-" + getText('lackText'),
		Color : graphs[0].f_ColorInc,
		f_ColorInc : graphs[0].f_ColorInc,
		stackId: stackId,
		Array: []
	};
	let gExceedings={
		Name: graphs[0].Name + "-" + getText('exceedText'),
		Color : graphs[0].f_RowColor,
		stackId: stackId,
		Array: []
	};

	let required = graphs[0].Array;
	let actual = graphs[1].Array; 
	for( let i = 0 ; i < actual.length - 1 ; i++ ) 
	{
		let exceeding = actual[i][1] - required[i][1];
		if( exceeding >= 0 ) 
		{
			gActual.Array.push( [ actual[i][0], (exceeding >= 0) ? required[i][1] : 0 ] );
			gLack.Array.push( [ actual[i][0], 0 ] );
			gExceedings.Array.push( [ 
				actual[i][0], (exceeding > 0) ? (actual[i][1] - required[i][1]) : 0 
			] );
		} else // if( actual[i][1] < required[i][1] )
		{
			gActual.Array.push( actual[i] );
			gLack.Array.push( [ actual[i][0], (required[i][1] - actual[i][1]) ] );
			gExceedings.Array.push( [ actual[i][0], 0 ] );
		}

		if( !( actual[i][0] in tooltips ) ) {
			tooltips[ actual[i][0] ] = [];
		}
		tooltips[ actual[i][0] ].push(
			{ 
				timeRange: [ actual[i][0],  actual[i+1][0] ], 
				title: graphs[0].Name, 
				value: actual[i][1],
				color: graphs[0].Color,
				exceeding: (exceeding > 0) ? exceeding : null, // (getText('exceedText') + ': +' + exceeding) : null,
				exceedingTitle: getText('exceedText'),
				exceedingColor: graphs[0].f_RowColor,
				lack: (exceeding < 0) ? -exceeding : null, // (getText('lackText') + ": " + exceeding) : null,
				lackTitle: getText('lackText'),
				lackColor: graphs[0].f_ColorInc,
			}
		)
	}

	let r = [];
	r.push( gActual );
	r.push( gLack );
	if( displayExceedings ) {
		r.push( gExceedings ); 
	} 

	return r;
}


export function createLackExceedingLineGraphs( graphs, displayExceedings, getText )
{
	let r = [];
	for( let i = 0 ; i < graphs.length ; i += 2 ) 
	{
		let gs = doLackExceedingLinePair( [ graphs[i], graphs[i+1] ], displayExceedings, i/2 );
		for( let g of gs ) {
			r.push(g);
		}
	}
	return r;
}

function doLackExceedingLinePair(graphs, displayExceedings, index )
{
	let dashArrays = [ '2 2 2 2', '0 2 2' ];
	let gRequired= {
		Name: graphs[0].Name,
		Color : graphs[0].Color,
		f_ColorInc : graphs[0].Color,
		stepAfter: true,
		dashArray: dashArrays[index%2],
		Array: []
	};
	let gActual={
		Name: graphs[1].Name,
		Color : graphs[0].f_ColorInc,
		f_ColorInc : graphs[0].f_ColorInc,
		stepAfter: false,
		Array: []
	};
	// --__--__
	// __--__-- 0 2 2
	let required = graphs[0].Array;
	let actual = graphs[1].Array; 
	for( let i = 0 ; i < actual.length ; i++ ) 
	{
		let title = graphs[0].Name;
		let toPush;
		toPush = { 
			x: required[i][0], 
			y: ( i < actual.length-1) ? required[i][1] : required[i-1][1], 
			title: title, 
			showTooltip: true
		};
		if( i > 0 )
		{			
			let exceeding = actual[i-1][1] - required[i-1][1];
			let timeRange = { start: actual[i-1][0], end: actual[i][0] };
			toPush.left = { 
				exceeding: exceeding, timeRange: timeRange, 
				required: required[i-1][1], actual: actual[i-1][1]
			};
		}
		if( i < actual.length - 1)
		{
			let exceeding = actual[i][1] - required[i][1];
			let timeRange = { start: actual[i][0], end: actual[i+1][0] };
			toPush.right = { 
				exceeding: exceeding, timeRange: timeRange, 
				required: required[i][1], actual: actual[i][1]
			};
		}
		//if( gRequired.Array.length > 0 ) gRequired.Array.push({x:null, y:null});
		gRequired.Array.push( toPush );
		/*
		toPush = { 
			x: actual[i+1][0], y: required[i][1], timeRange: timeRange, 
			exceeding: exceeding,
			title: title
		};
		gRequired.Array.push( toPush );
		*/
	
		title = graphs[1].Name;
		toPush = {
			x: actual[i][0], y: actual[i][1], showTooltip: false
			// timeRange: timeRange, exceedingOf: required[i][1], title: title
		}  				
		if( gActual.Array.length > 0 ) gActual.Array.push({x:null, y:null});
		gActual.Array.push( toPush ); 
		if( i < actual.length - 1 ) {
			toPush = {
				x: actual[i+1][0], y: actual[i][1], showTooltip: false
				//timeRange: timeRange, exceedingOf: required[i][1], title: title
			}  				
			gActual.Array.push( toPush );
		}
	}
	let r = [];
	if( displayExceedings ) {
		r.push( gActual );
	}
	r.push( gRequired );

	return r;
}
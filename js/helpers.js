import Settings from './Settings';

export function convertSourceData(sourceData) {
	let data = {};
	data.lang = sourceData.Lang;
	data.title = sourceData.Project.Name;
	data.projectVersion = sourceData.Project.Version;
	data.projectTime = secondsToDate(sourceData.Project.CurTime);
	data.charts = [];
	if( !('DashPages' in sourceData) ) {
		return data;
	}

	for( let idashpage = 0 ; idashpage < sourceData.DashPages.length ; idashpage++ ) {
		if( !('DashItems' in sourceData.DashPages[idashpage]) ) {
			continue;
		}
		let dashitems = sourceData.DashPages[idashpage].DashItems;	
		for( let idashitem = 0 ; idashitem < dashitems.length ; idashitem++ ) {		
			let chartsSettings = {};
			let chartsCharts = null;
			let chartsData = null;
			let d = dashitems[idashitem];

			if( d.Type == 'diagram') {
				// To know what to draw: a line chart or a bar chart
				let lineChart = false, areaChart = false, barChart = false, isStacked = false;
				if( d.SubType == 'graphs' ) {		
					if( d.Form === 'line' ) {		// Drawing a line chart if it is a line
						lineChart = true; 
					} else if( d.Form === 'bar' ) {
						if( d.Graphs.length === 1 ) {		// Drawing a bar chart 
							areaChart = true;
						} else if( d.Graphs.length === 2 ) {	
							if( 'hidden' in d.Graphs[1] && d.Graphs[1].hidden !== 0 ) {
								areaChart = true; 	// If one barchart must serve as a backgournd for another one 
								let temp;
								temp = d.Graphs[0];						// Switching the barcharts so that 
								d.Graphs[0] = d.Graphs[1];		// the 2nd became the 1st and 
								d.Graphs[1] = temp;						// serve as a background 
								//d.Graphs[0].Name = 'background.barchart';	// Setting the name to make sure it is not duplicated 
							} else {
								lineChart = true;	// Drawing a line chart otherwise
							}
						}
						else if( d.Graphs.length > 2 ) {
							lineChart = true;		// If there are more than 2 barcharts - drawing line charts instead
						} 
					} else if( d.Form === 'barchart' ) {
						barChart = true;
					} else if( d.Form === 'stackedbarchart' ) {
						barChart = true;
						isStacked = true;
					} 
				}

				// A line chart
				if( lineChart ) 
				{
					chartsData = {};
					chartsCharts = {};
					let xAxisKey = 'x';
					let yAxisKey = 'value';
					chartsSettings = { 
						id: idashpage* 100+idashitem, page:idashpage, type: 'linePlot', title: d.Title, 
						startYAtZero: ( typeof(d.FromZero) !== 'undefined' && d.FromZero == 'yes') ? true : false,
						lineType: (d.Form === 'bar' && d.Graphs.length > 1) ? 'stepAfter' : undefined, 
						referenceLine: sourceData.Project.CurTime,
						xAxisKey: xAxisKey, yAxisKey:yAxisKey, 
						xAxisType: ( typeof(d.XType) !== 'undefined') ? d.XType : 'date', 
						decimalPlacesAfterDotAtAxis: (typeof(d.Decimals) !== 'undefined') ? d.Decimals : undefined,
						xPct: d.Position[0], yPct: d.Position[1], 
						widthPct: d.Position[2] - d.Position[0], heightPct: d.Position[3] - d.Position[1] 
					};
					for( let igraph = 0 ; igraph < d.Graphs.length ; igraph++ ) 
					{
						let graph = d.Graphs[igraph];
						chartsCharts[graph.Name] = { stroke: graph.Color };
						chartsData[graph.Name] = [];
						let iLast = graph.Array.length - 1;
						for( let i = 0 ; i <= iLast ; i++ ) 
						{
							let toPush = {};
							let x = graph.Array[i][0];
							let y = graph.Array[i][1];
							if( i === iLast && i > 0 ) {	// To fix the last zero y if found
								if( y === 0 ) y = graph.Array[i-1][1];
							}
							toPush[xAxisKey] = (y !== null) ? x : null;
							toPush[yAxisKey] = (y !== null) ? y : null;
							chartsData[graph.Name].push( toPush );
							//chartsData[graph.Name].push( { x: graph.Array[i][0], value: graph.Array[i][1] } );
						}
					}
				} 
				else if( areaChart ) {
					chartsData = {};
					chartsCharts = {};
					let xAxisKey = 'x';
					chartsSettings = { 
						id: idashpage*100+idashitem, page:idashpage, type: 'areaChart', title: d.Title, 
    				startYAtZero: ( typeof(d.FromZero) !== 'undefined' && d.FromZero == 'yes') ? true : false, 
						areaType: 'stepAfter', 
						referenceLine: sourceData.Project.CurTime,
						xAxisKey: xAxisKey, xAxisType: ( typeof(d.XType) !== 'undefined') ? d.XType : 'date', 
						decimalPlacesAfterDotAtAxis: (typeof(d.Decimals) !== 'undefined') ? d.Decimals : undefined,
						xPct: d.Position[0], yPct: d.Position[1], 
            widthPct: d.Position[2] - d.Position[0], heightPct: d.Position[3] - d.Position[1]
          };
					chartsData = [];
					for( let igraph = 0 ; igraph < d.Graphs.length ; igraph++ ) {
						let graph = d.Graphs[igraph];

						chartsCharts[graph.Name] = { stroke: graph.Color };
						if( typeof(graph.NegColor) !== 'undefined') {
								chartsCharts[graph.Name].negStroke = graph.NegColor;
						} else {
								//chartsCharts[graph.Name].negStroke = graph.Color;
						}
						for( let i = 0 ; i < graph.Array.length ; i++ ) {
							let toPush = {};
							toPush[xAxisKey] = graph.Array[i][0];
							toPush[graph.Name] = graph.Array[i][1];
							chartsData.push( toPush );							
							//chartsData.push( { name: graph.Array[i][0], value: graph.Array[i][1] } );
						}
					}
				} 
				else if( barChart ) 
				{
					chartsData = {};
					chartsCharts = {};
					let xAxisKey = 'x';
					chartsSettings = { 
						id: idashpage*100+idashitem, page:idashpage, type: 'barChart', title: d.Title, 
    				startYAtZero: ( typeof(d.FromZero) !== 'undefined' && d.FromZero == 'yes') ? true : false, 
						referenceLine: sourceData.Project.CurTime,
						xAxisKey: xAxisKey, xAxisType: ( typeof(d.XType) !== 'undefined') ? d.XType : 'date', 
						decimalPlacesAfterDotAtAxis: (typeof(d.Decimals) !== 'undefined') ? d.Decimals : undefined,
						xPct: d.Position[0], yPct: d.Position[1], 
            widthPct: d.Position[2] - d.Position[0], heightPct: d.Position[3] - d.Position[1],
						isStacked: isStacked
          };
					chartsData = [];
					for( let igraph = 0 ; igraph < d.Graphs.length ; igraph++ ) {
						let graph = d.Graphs[igraph];
						if( typeof( graph.hidden ) !== 'undefined' && graph.hidden === 1 ) continue;
						
						chartsCharts[graph.Name] = { fill: graph.Color };
						if( typeof(graph.NegColor) !== 'undefined') {
								chartsCharts[graph.Name].negStroke = graph.NegColor;
						} else {
								//chartsCharts[graph.Name].negStroke = graph.Color;
						}
						if( igraph == 0 ) {
							for( let i = 0 ; i < graph.Array.length ; i++ ) {
								let toPush = {};
								toPush[xAxisKey] = graph.Array[i][0];
								toPush[graph.Name] = graph.Array[i][1];
								//chartsData.push( { name: graph.Array[i][0], value: graph.Array[i][1] } );
								chartsData.push( toPush );							
							}
						} else {
							for( let i = 0 ; i < graph.Array.length ; i++ ) {
								chartsData[i][graph.Name] = graph.Array[i][1];
							}
						}
					}
				}
				else if( d.SubType == 'pie' ) { 	// later it should be checked for being a graph plot
					chartsSettings = { id: idashpage*100+idashitem, page:idashpage, type: 'pieChart', title: d.Title, 
						xPct: d.Position[0], yPct: d.Position[1], 
						widthPct: d.Position[2] - d.Position[0], heightPct: d.Position[3] - d.Position[1],
						colors:[] };
					if( !('Graphs' in d) )
						continue;					
					chartsData = [];
					for( let i = 0 ; i < d.Graphs[0].Array.length ; i++ ) {
						let item = d.Graphs[0].Array[i];
						chartsData.push( { name:item[1], value: round( item[0], d.Decimals) } );
						chartsSettings.colors.push( item[2] );
					}
				} 
				else if( d.SubType === 'tornado' ) {
					chartsSettings = { id: idashpage*100+idashitem, page:idashpage, type: 'barRLChart', title: d.Title, 
						xPct: d.Position[0], yPct: d.Position[1], 
						widthPct: d.Position[2] - d.Position[0], heightPct: d.Position[3] - d.Position[1],
						referenceLineColor: '#af8f8f',
						colors:[] };
					if( !('Graphs' in d) )
						continue;		
					//let value = Settings.valueText[ data.lang ];			
					//chartsCharts = {};
					chartsCharts = { value: { stroke:'#cf7fef', name:'Indicators' } };
					chartsData = [];
					for( let i = 0 ; i < d.Graphs[0].Array.length ; i++ ) {
						let item = d.Graphs[0].Array[i];
						chartsData.push( { name:item[1], value: round(item[0], d.Decimals) } );
						chartsSettings.colors.push( item[2] );
					}
				} 
				if( chartsData === null )
					continue; 
				data.charts.push( { settings: chartsSettings, charts: chartsCharts, data: chartsData } );
			}
			else if( d.Type === 'text' ) {
				let settings = { id: idashpage*100+idashitem, page: idashpage, type: 'text',
					title: d.Title, fontSizeScale: true, fontFamily: d.FontFamily, fontSize: d.FontSize,
					xPct: d.Position[0], yPct: d.Position[1], 
					widthPct: d.Position[2] - d.Position[0], heightPct: d.Position[3] - d.Position[1], };				
				data.charts.push( { settings:settings, text: d.Body } );
			} 
			else if( d.Type === 'picture' ) {  
				let settings = { id: idashpage*100+idashitem, page: idashpage, type: 'image',
					title: d.Title, xPct: d.Position[0], yPct: d.Position[1], 
					widthPct: d.Position[2] - d.Position[0], heightPct: d.Position[3] - d.Position[1], };				
				data.charts.push( { settings:settings, fileName: d.File } );
			} 
		}
	}
	return data;
}


export function calculateXDomain( data, marginFactor=0.1, key='x' ) {
	let r = [0,0];
	let lowest=null, highest=null;

	if( marginFactor === null ) {
		marginFactor=Settings.domainMarginFactor;
	}

	if( !Array.isArray(data) ) { 	// Ensuring the type is valid
		return null;
	}
	if( data.length == 0 ) { 		// Checking non-empty
		return null;
	}
	if( Array.isArray(data[0]) ) { 	// Is array of arrays?
		for( let d = 0 ; d < data.length ; d++ ) {
			for( let i = 0 ; i < data[d].length ; i++ ) {
				if( key in data[d][i] ) {
					let v = data[d][i][key];
					if( typeof(v) !== 'number') {
						continue;
					}
					if( lowest === null ) {
						lowest = v;
						highest = v;
						continue;
					}
					if( v < lowest ) 
						lowest = v;
					if( v > highest )
						highest = v;
				}
			}
		}		                 	
	} else {
		for( let i = 0 ; i < data.length ; i++ ) {
			if( key in data[i] ) {
				let v = data[i][key];
				if( typeof(v) !== 'number') {
					continue;
				}
			if( lowest === null ) {
					lowest = v;
					highest = v;
					continue;
				}
				if( v < lowest )
					lowest = v;
				if( v > highest )
					highest = v;
			}
		}
	}	
	if( lowest === null || highest === null ) {
		return null;
	}
	let margin = (highest - lowest) * marginFactor;
	r[0] = lowest - margin;
	r[1] = highest + margin;
	return r;
};

export function calculateYDomain( dataSource, marginFactor=0.1, excludeKey='name', includeKey=null ) {
	let r = [0,0];
	let lowest=null, highest=null;

	if( marginFactor === null ) {
		marginFactor=Settings.domainMarginFactor;
	}

	let data=[];
	if( !Array.isArray(dataSource) ) { 	// Ensuring the type is valid
		return r;
	}
	if( dataSource.length == 0 ) { 		// Checking non-empty
		return r;
	}
	if( Array.isArray(dataSource[0]) ) { 	// Is array of arrays?
		data = [];
		for( let d = 0 ; d < dataSource.length ; d++ ) {
			for( let i = 0 ; i < dataSource[d].length ; i++ ) {
				data.push( dataSource[d][i] );		
			}
		}		                 	
	} else {
		data = dataSource;
	}
	for( let i = 0 ; i < data.length ; i++ ) {
		for( let k in data[i] ) {
			if( excludeKey !== null ) {
				if( k === excludeKey ) {
					continue;
				}
			}
			if( includeKey !== null ) {
				if( k !== includeKey ) {
					continue;
				}
			}
			let v = data[i][k];
			if( lowest === null ) {
				lowest = v;
				highest = v;
				continue;
			}
			if( v < lowest ) {
				lowest = v;
			}
			if( v > highest ) {
				highest = v;
			}
		}
	}	
	if( lowest !== null && highest !== null ) {
		let highestLessLowest = highest - lowest;
		let margin = highestLessLowest * marginFactor;
		if( highestLessLowest > 0.0 && lowest > 0.0 && lowest / highestLessLowest < 0.2 ) {
			// Make the lowest equal to "0" anyway   
			r[0] = 0.0;
		} else {
			r[0] = lowest - margin;
		}
		r[1] = highest + margin;
	}
	return r;
};

export function round( num, radix=0) {
	if( typeof(radix) === 'undefined' || radix === null ) return num;
  let epsilon = (num > 0) ? Number.EPSILON : -Number.EPSILON;
  let mult = Math.pow( 10, radix );
  return Math.round((num + epsilon) * mult) / mult;
}

var _windowInnerWidth = window.innerWidth;
var _windowInnerHeight = window.innerHeight;

const _pctToWindowTopMargin = 0;
const _pctToWindowBottomMargin = Settings.windowTitleHeight + Settings.windowScrollBarWidth+9;
const _pctToWindowLeftMargin = 0;
const _pctToWindowRightMargin = Settings.windowScrollBarWidth+9;

export function	pctToWindowX( xPct ) {
	return _pctToWindowLeftMargin + 
		Math.floor( (_windowInnerWidth - _pctToWindowLeftMargin - _pctToWindowRightMargin - 1) * xPct / 100.0);
}

export function	pctToWindowY( yPct ) {
	return _pctToWindowTopMargin + 
		Math.floor( (_windowInnerHeight - _pctToWindowTopMargin - _pctToWindowBottomMargin - 1) * yPct / 100.0);
}


function calcMaxPageNumberHelper(charts) {
	let maxPageNumber = 0;
	for( let i = 0 ; i < charts.length ; i++ ) {
		if( !('settings' in charts[i]) )
			continue;
		if( !('page' in charts[i].settings) )	// Pagination is not used
			continue;
		if( charts[i].settings.page > maxPageNumber ) {
			maxPageNumber = charts[i].settings.page;
		}
	}
	return maxPageNumber;
}


export function zoomChartWindowsCoordsHelper( charts, coords ) {
	for( let i = 0 ; i < charts.length ; i++ ) {
		coords[i].x = pctToWindowX( 0 );
		coords[i].y = pctToWindowY( 100 * i );
		coords[i].width = pctToWindowX( 100 );
		coords[i].height = pctToWindowY( 100 );
	}
}

export function	tileChartWindowsCoords( charts, coords, wiw=null, wih=null ) {
	if( wiw !== null && wih !== null ) {
		_windowInnerWidth = wiw;
		_windowInnerHeight = wih;		
	}
	if( _windowInnerWidth < Settings.lowResolutionWindowWidth ) {
		zoomChartWindowsCoordsHelper( charts, coords);		
	} else {
		let maxPageNumber = calcMaxPageNumberHelper(charts);
		for( let i = 0 ; i <= maxPageNumber ; i++ ) {
			tileChartWindowsCoordsHelper( charts, coords, i );
		}
	}
}

function tileChartWindowsCoordsHelper( charts, coords, pageNumber=null ) {
	if( pageNumber === null )
		pageNumber = 0;
	let l=0;
	for( let i = 0 ; i < charts.length ; i++ ) {
		if( 'page' in charts[i].settings ) {
			if( charts[i].settings.page !== pageNumber ) {
				continue;
			}
		}
		l++;
	}
	if( l === 0 ) 
		return;
	let nRows=1, nCols=1;
	if( l === 2 ) {
		nCols=2;
	} else if( l === 3 ) {
		nCols=3;
	} else if( l === 4 ) {
		nRows=2;
		nCols=2;
	} else if( l > 4 ) {
		if( l%3 == 0 || l%2 == 1 ) {
			nRows = Math.ceil(l / 3);
			nCols = 3;
		} else { 
			nRows = Math.ceil(l / 4);
			nCols = 4;
		}
	}
	let width = Math.floor(100.0 / nCols); // - 0.05;
	let height = Math.floor(100.0 / nRows); // - 0.05;
	let ir=0, ic=0;
	for( let i = 0 ; i < charts.length ; i++ ) {
		if( 'page' in charts[i].settings ) {
			if( charts[i].settings.page !== pageNumber )
				continue;
		}
		let x = Math.floor(ic * 100.0 / nCols);		
		let y = Math.floor(ir * 100.0 / nRows);		

		coords[i].x = pctToWindowX( x );
		coords[i].y = pctToWindowY( y + 105 * pageNumber);
		coords[i].width = pctToWindowX( x + width ) - coords[i].x;
		coords[i].height = pctToWindowY( y + height + 105 * pageNumber ) - coords[i].y;
		if( ic === nCols-1 ) {
			ic=0;		
			ir+=1;
		} else {
			ic += 1;
		}			
	}
}

export function	calcChartWindowsCoords( charts, coords, wiw=null, wih=null ) {
	if( wiw !== null && wih !== null ) {
		_windowInnerWidth = wiw;
		_windowInnerHeight = wih;		
	}
	let l = charts.length;
	if( l === 0 ) {
		return;
	}
	for( let i = 0 ; i < l ; i++ ) {
		if( !('settings' in charts[i]) ) {
			coords.error = 'Error!';
			continue;
		}
		let stt = charts[i].settings;
		if( !('xPct' in stt && 'yPct' in stt && 'widthPct' in stt && 'heightPct' in stt) ) {
			coords.error = 'Error!';
			continue;
		}

		let pageNumber = 0;
		if( 'page' in charts[i].settings ) { 	// If pagination is used
			pageNumber = charts[i].settings.page;
		}

		let x = pctToWindowX( stt.xPct ); 
		let y = pctToWindowY( stt.yPct + 105 * pageNumber);
		let width = pctToWindowX( stt.xPct + stt.widthPct ) - x; 
		let height = pctToWindowY( stt.yPct + stt.heightPct + 105 * pageNumber) - y; 

		coords[i].x = x;
		coords[i].y = y;
		coords[i].width = width;
		coords[i].height = height;
	}
}


export function setCookie( cname, cvalue ) {
	if( !document || !window ) { 	// Not a browser?
		return;
	}
	document.cookie = `${cname}=${cvalue}; path=/`; // ''
}


export function deleteCookie( cname ) {
	if( !document || !window ) { 	// Not a browser?
		return;
	}
	document.cookie = 'cname=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/';
}


export function getCookie( cname, type='string' ) {
	if( !document || !window ) { 	// Not a browser?
		return null;
	}
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for( let i = 0 ; i < ca.length ; i++ ) {
		let c = ca[i];
		while( c.charAt(0) == ' ' ) {
			c = c.substring(1);
		}
		if( c.indexOf(name) == 0 ) {
			let value = c.substring(name.length, c.length);
			if( type == 'string' ) {
				return value;
			}
			if( type == 'int' ) {
				let intValue = parseInt(value);
				if( !isNaN(intValue) ) {
					return intValue;
				}
			}
			if( type == 'float' ) {
				let floatValue = parseFloat(value);
				if( !isNaN(floatValue) ) {
					return floatValue;
				}
			}
			return null;
		}
	}
	return null;
}


export function secondsToDate( seconds ) {
	let date = new Date(seconds * 1000);
	let year = date.getFullYear();
	if( year >= 2000 ) {
		year -= 2000;
		if( year < 10 ) {
			year = '0' + year;
		}
	} else {
		year -= 1900;		
	}
	let month = date.getMonth() + 1;
	if( month < 10 ) {
		month = '0' + month;
	}
	let day = date.getDate();
	if( day < 10 ) {
		day = '0' + day;
	}
	let hours = date.getHours();
	if( hours < 10 ) {
		hours = "0" + hours;
	}
	let minutes = date.getMinutes();
	if( minutes < 10 ) {
		minutes = "0" + minutes;
	}

	return day + '.' + month + '.' + year + ' ' + hours + ":" +  minutes;
}

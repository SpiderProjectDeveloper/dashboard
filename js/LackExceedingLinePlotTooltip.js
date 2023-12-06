import React, { Component } from 'react';
import { secondsToDate } from './helpers'

function createTimeRangeText(timeRange, isTime)
{
	let startTime = secondsToDate(timeRange.start, isTime);
	let endTime = secondsToDate(timeRange.end, isTime);
	let time = startTime + " - " + endTime;
	return time;
}

export const LackExceedingLinePlotTooltip = function(params) 
{
	if( !params.data || !params.payload ) return null;
	let payload = params.payload;
  if( !params.active || !payload || !payload.length ) return null;
	//if( params.label === params.data[0].x ) return null;
	let isTime = params.isTime;

	let divStyle = { 
		backgroundColor: '#ffffff', opacity: 0.90, 
		borderRadius: '4px', border: '1px solid #dfdfdf', padding: '8px' 
	};
	let timeStyle = { padding: '4px', fontWeight: 'bold', color: '#4f4f4f' };

	let entries = [];
	for( let i = 0 ; i < payload.length ; i++ )
	{
		let pld = payload[i];
		if( pld.dataKey !== 'y' ) continue;
		if( !pld.payload.showTooltip ) continue;
		
		let texts = [];
		if( 'left' in pld.payload )
		{
			let key = 'laskExceedingLinePlotTooltipLeft';
			let time = createTimeRangeText( pld.payload.left.timeRange, isTime );
			texts.push( <div key={key+'Time'+i}>{time}</div> );

			let y = ((params.toFixed !== undefined) ? 
				pld.payload.left.required.toFixed(params.toFixed) : pld.payload.left.required); 

			let e = pld.payload.left.exceeding;
			if( e !== 0 ) {
				let sign = ( e > 0 ) ? '+' : '-';
				e = Math.abs( (params.toFixed !== undefined) ? e.toFixed(params.toFixed) : e );
				y += ' (' + sign + e + ')';
			}
			texts.push( <div key={key+'Value'+i}>{y}</div> );
		}

		if( 'right' in pld.payload )
		{
			let key = 'laskExceedingLinePlotTooltipRight';
			let time = createTimeRangeText( pld.payload.right.timeRange, isTime );
			texts.push( <div key={key+'Time'+i}>{time}</div> );

			let y = ((params.toFixed !== undefined) ? 
				pld.payload.right.required.toFixed(params.toFixed) : pld.payload.right.required); 
				
			let e = pld.payload.right.exceeding;
			if( e !== 0 ) {
				let sign = ( e > 0 ) ? '+' : '-';
				e = Math.abs( (params.toFixed !== undefined) ? e.toFixed(params.toFixed) : e );
				y += ' (' + sign + e + ')';
			}
			texts.push( <div key={key+'Value'+i}>{y}</div> );
		}

		entries.push(
			<div style={{ padding: '4px' }} key={'laskExceedingLinePlotTooltipContentDiv' + i}>
				<div style={{ display: 'block', color: pld.color }}>
					{pld.payload.title + ":  "}
				</div>
				<div style={{ display: 'block', color: '#4f4f4f' }}>
					{	texts }
				</div>
			</div>
		);
	}
			//<div style={timeStyle}>{time}</div>

	return (
		<div style={divStyle}>
			<div>{entries}</div>
		</div>
	);
};

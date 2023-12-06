import React, { Component } from 'react';
import { secondsToDate } from './helpers'

export const PeriodTooltip = function(params) 
{
	if( !params.data || !params.payload ) return null;
	let payload = params.payload;
  if( !params.active || !payload || !payload.length ) return null;
	//if( params.label === params.data[0].x ) return null;
	let periodStart, periodEnd;
	let isTime = params.isTime; 
	for( let i = 0 ; i < params.data.length ; i++ ) 
	{
		if( params.data[i].x === params.label ) 
		{
			if( i < params.data.length - 1 ) {
				periodStart = secondsToDate(params.label, isTime); 
				periodEnd = secondsToDate(params.data[i+1].x, isTime);
			} else {
				if( params.endOfLastPeriod ) {
					periodStart = secondsToDate(params.data[i].x, isTime);
					periodEnd = secondsToDate(params.endOfLastPeriod, isTime); 						
				} else {
					periodStart = secondsToDate(params.data[i-1].x, isTime);
					periodEnd = secondsToDate(params.label, isTime); 	
				}
			}
		}
	}

	let divStyle = { 
		backgroundColor: '#ffffff', opacity: 0.90, 
		borderRadius: '4px', border: '1px solid #dfdfdf', padding: '8px' 
	};
	let periodStyle = { color: '#4f4f4f' };
	let valueStyle = { display: "inline-block", padding: 10 };

	let values = [];
	for( let i = 0 ; i < payload.length ; i++ )
	{
		let pld = payload[i];
		values.push(
			<div style={valueStyle} key={'PeriodTooltipContentDiv' + i}>
				<div style={{ color: pld.fill }}>{pld.dataKey + ":"}</div>
				<div style={{ color: pld.fill }}>
					{ 
						(params.toFixed !== undefined) ? 
							pld.payload[pld.dataKey].toFixed(params.toFixed) : pld.payload[pld.dataKey] 
					}
				</div>
			</div>
		);
	}

	return (
		<div className="custom-tooltip" style={divStyle}>
			<p style={periodStyle}>{`${periodStart} - ${periodEnd}`}</p>
			<div>{values}</div>
		</div>
	);
};

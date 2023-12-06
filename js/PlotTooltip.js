import React, { Component } from 'react';
import { secondsToDate } from './helpers'

export const PlotTooltip = function(params) 
{
	if( !params.data || !params.payload ) return null;
	let payload = params.payload;
  if( !params.active || !payload || !payload.length ) return null;
	//if( params.label === params.data[0].x ) return null;
	let isTime = params.isTime;
	let time = secondsToDate(params.label, isTime);
	let divStyle = { 
		backgroundColor: '#ffffff', opacity: 0.90, 
		borderRadius: '4px', border: '1px solid #dfdfdf', padding: '8px' 
	};
	let timeStyle = { padding: '4px', fontWeight: 'bold', color: '#4f4f4f' };

	let values = [];
	for( let i = 0 ; i < payload.length ; i++ )
	{
		let pld = payload[i];
		let text = pld.name + ": " + 
			((params.toFixed !== undefined) ? 
				pld.payload[pld.dataKey].toFixed(params.toFixed) : pld.payload[pld.dataKey]); 

		values.push(
			<div style={{ padding: '4px' }} key={'PlotTooltipContentDiv' + i}>
				<div style={{ display: 'inline-block', color: pld.color }}>
					{pld.name + ":  "}
				</div>
				<div style={{ display: 'inline-block', color: '#4f4f4f' }}>
					{			
						((params.toFixed !== undefined) ? 
							pld.payload[pld.dataKey].toFixed(params.toFixed) : pld.payload[pld.dataKey]) 
					}
				</div>
			</div>
		);
	}

	return (
		<div style={divStyle}>
			<div style={timeStyle}>{time}</div>
			<div>{values}</div>
		</div>
	);
};

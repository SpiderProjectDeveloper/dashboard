import React, { Component } from 'react';
import { secondsToDate } from './helpers'

export const LackExceedingBarChartTooltip = function(params) 
{
	if( !params.data || !params.payload ) return null;
	let payload = params.payload;
  if( !params.active || !payload || !payload.length ) return null;
	//if( params.label === params.data[0].x ) return null;
	let isTime = params.isTime; 

	let tooltip = params.customTooltips[ params.label ];
	if( !tooltip ) return null;
	if( !tooltip.length ) return null;

	let timeStart = secondsToDate(tooltip[0].timeRange[0], isTime);
	let timeEnd = secondsToDate(tooltip[0].timeRange[1], isTime); 						

	/*
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
	*/

	let timeRangeStyle = { color: '#4f4f4f' };
	let divStyle = { 
		backgroundColor: '#ffffff', opacity: 0.90, 
		borderRadius: '4px', border: '1px solid #dfdfdf', padding: '8px' 
	};
	let valueStyle = { display: "inline-block", padding: 10 };

	let values = [];
	for( let i = 0 ; i < tooltip.length ; i++ )
	{
		let tt = tooltip[i];
		values.push(
			<div style={valueStyle} key={'lackExceedingBarChartTooltipContentDiv' + i}>
				<div style={{ color: tt.color }}>{tt.title + ":"}</div>
				<div style={{ color: tt.color }}>
					{ (params.toFixed !== undefined) ? tt.value.toFixed(params.toFixed) : tt.value }
				</div>
				{ 
					( tt.lack !== null ) &&
					<div style={{ color: tt.lackColor }}>
						{ 
						 tt.lackTitle + ": " + ((params.toFixed !== undefined) ? tt.lack.toFixed(params.toFixed) : tt.lack) 
						}
					</div>
				}
				{ 
					( tt.exceeding !== null ) &&
					<div style={{ color: tt.exceedingColor }}>
						{ 
							tt.exceedingTitle + ": " + ((params.toFixed !== undefined) ? tt.exceeding.toFixed(params.toFixed) : tt.exceeding) 
						}
					</div>
				}
			</div>
		);
	}

	return (
		<div className="custom-tooltip" style={divStyle}>
			<p style={timeRangeStyle}>{`${timeStart} - ${timeEnd}`}</p>
			<div>{values}</div>
		</div>
	);
};

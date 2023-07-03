import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import { calculateYDomain, secondsToDate } from './helpers'

class DBarChart extends React.Component 
{
	constructor(props) 
	{
		super(props);

		this.state = {
			width:this.props.width, height: this.props.height
		};
	}

	render() 
	{
		let stt = this.props.chart.settings;
		let keys = Object.keys(this.props.chart.charts);
		let xAxisKey = this.props.chart.settings.xAxisKey;
		if( keys.length > 0 ) 
		{
			let charts = [];
			charts.push( <CartesianGrid key={'cgrid.'+stt.id} strokeDasharray="3 3" /> );
			let xFormatter = undefined;
			if( typeof(stt.xAxisType) !== 'undefined' && stt.xAxisType === 'date' )
			{ // Consider x-values (integers) as dates? 
				xFormatter = function(e) { return secondsToDate(e); }; 			
			}
  		charts.push( <XAxis 
				key={'xaxis.'+stt.id} dataKey={xAxisKey} style={{fontSize:'12px'}} 
				tickFormatter={xFormatter} 
			/> ); 
			let ydomain = calculateYDomain( this.props.chart.data, 0.0, xAxisKey );
			if( ydomain[0] > 0.0 ) { 
				ydomain[0] = 0.0 
			};
			charts.push( <YAxis key={'yaxis.'+stt.id} domain={ydomain} style={{fontSize:'12px'}} /> );
  		charts.push( <Tooltip key={'tooltip.'+stt.id} labelFormatter={ xFormatter } /> );
			charts.push( <Legend key={'legend.'+stt.id} style={{fontSize:'11px'}} /> );
			for( let i in keys ) {
				let k = keys[i];
				let barKey = 'bar.' + stt.id + '.' + i;
				let barFill = this.props.chart.charts[k].fill;
				if( stt.isStacked === false ) {
					charts.push( <Bar key={barKey} dataKey={k} fill={barFill} /> );
				} else {
					charts.push( <Bar stackId='a' key={barKey} dataKey={k} fill={barFill} /> );
				}
			}
			if( typeof(stt.referenceLine) === 'number' ) {
				charts.push( 
					<ReferenceLine key={'refline.'+stt.id}  x={stt.referenceLine} stroke={'#af4f4f'} /> 
				);
			}
			let margin = { top: 10, left: 0, right: 20, bottom: 30 };
			let style= { fontSize: '12px', color: '#7f7f7f' };	
			return (
				<BarChart key={'chart.'+stt.id} width={this.props.width} height={this.props.height} data={this.props.chart.data} style={style} margin={margin}>
					{charts}
				</BarChart>
			);
		} else {
			return( <div>NO DATA</div> );
		}
	}
}

export default DBarChart;

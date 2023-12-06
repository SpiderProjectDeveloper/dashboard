import React, { Component } from 'react';
import {  LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import { calculateXDomain, calculateYDomain, secondsToDate } from './helpers'
import { Settings } from './Settings'
import { LackExceedingLinePlotTooltip } from './LackExceedingLinePlotTooltip';

class DLackExceedingLinePlot extends React.Component 
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
		if( !(keys.length > 0) ) {
			return( <div>NO DATA</div> );
		} 

		let charts = [];
		charts.push( <CartesianGrid key={'cgrid'+stt.id} strokeDasharray="3 3" /> );

		let data = [];
		for( let i in keys ) {
			data.push( this.props.chart.data[ keys[i] ] );
		}

		let isTime = false;

		let xdomain = calculateXDomain( data, null, 'x' );

		// If refer min Y to zero... 
		if( typeof(stt.startXAtZero) !== 'undefined' && stt.startXAtZero && xdomain !== null ) {
			xdomain[0] = 0; 
		}
		let xFormatter = undefined;
		// If refer min Y to zero... 
		if( typeof(stt.xAxisType) !== 'undefined' && stt.xAxisType === 'date' ) {
			xFormatter = function(e) { return secondsToDate(e, isTime); }; 			
		}	
		let xAxisType = typeof((stt.xAxisType) === 'undefined' || stt.xAxisType === 'date' ) ?  'number' : stt.xAxisType; 
		let xAxisKey = 'x'; //(typeof(stt.xAxisKey)!=='undefined') ? stt.xAxisKey : 'x';	
		charts.push( 
			<XAxis key={'xaxis'+stt.id} allowDuplicatedCategory={false}
				dataKey={xAxisKey} type={xAxisType} style={{fontSize: Settings.axisFontSize+'px'}} 
				domain={xdomain !== null ? xdomain: undefined} 
				tickFormatter={xFormatter} /> 
		);

		let ydomain = calculateYDomain( data, 0, null, 'value' );
		if( typeof(stt.startYAtZero) !== 'undefined' && stt.startYAtZero && ydomain !== null ) 	// If refer min Y to zero... 
			ydomain[0] = 0;				
		let yFormatter = undefined;
		if( typeof(stt.decimalPlacesAfterDotAtAxis) !== 'undefined' ) {
			yFormatter = function(e) { return e.toFixed(stt.decimalPlacesAfterDotAtAxis); };
		}
		charts.push( <YAxis key={'yaxis'+stt.id} style={{fontSize:Settings.axisFontSize+'px'}} 
			dataKey={'y'}
			domain={(ydomain!==null) ? ydomain : undefined }
			tickFormatter={yFormatter} /> );

		charts.push( <Legend key={'legend'+stt.id}  style={{fontSize:Settings.legendFontSize+'px'}} /> );

		for( let i in keys ) 
		{
			let k = keys[i];
			let kdata = this.props.chart.data[k];
			let kstroke = this.props.chart.charts[k].stroke;
			let stepAfter = this.props.chart.charts[k].stepAfter;
			/* For dedugging purposes 
			for( let idata = 0 ; idata < kdata.length ; idata++ ) 
			{
				if( kdata[idata].value === null ) 
				{
					//kdata[idata] = { x: null, value: null};
					//continue;
					kdata = kdata.slice( 0, idata );
					kstroke = kstroke.slice( 0, idata );
					break;
				}
			}
			console.log(kdata);
			*/
			charts.push( 
				<Line key={'lackExceedingLinePlot.'+stt.id+'.'+i} 
					dataKey={'y'}
					type={ (stepAfter) ? 'stepAfter' : "linear" }
					name={k} 
					dot={false}
					data = {kdata} // data={this.props.chart.data[k]}
					fill = {kstroke} //stroke={this.props.chart.charts[k].stroke}
					stroke = {kstroke} //stroke={this.props.chart.charts[k].stroke}
					strokeWidth = {3}
					// strokeDasharray={ this.props.chart.charts[k].dashArray }
				/> 
			);
		}
		let referenceLine = ('referenceLine' in stt) ? 
			(<ReferenceLine x={stt.referenceLine} stroke='#af4f4f' strokeDasharray={"2 4"} />) : null;

			let tooltip = 
			<Tooltip 
				key={'lackExceedingLinePlotTooltip'} 
				content={
					<LackExceedingLinePlotTooltip 
						key={'lackExceedingLinePlotTooltipContent'} 
						toFixed={stt.decimalPlacesAfterDotAtAxis}
						isTime={isTime}
						data={this.props.chart.data} />
				} 
			/>;

		let margin = { top:10, left:30, right:0, bottom:30 };
		let style= { fontSize:Settings.chartFontSize+'px', color: '#7f7f7f' };	
		return (
			<LineChart 
				key={'lackExceedingLinePlot.'+stt.id} 
				width={this.props.width} height={this.props.height} 
				style={style} margin={margin}
			>
				{tooltip}
				{charts}
				{referenceLine}
			</LineChart>
		);

	}
}

export default DLackExceedingLinePlot;

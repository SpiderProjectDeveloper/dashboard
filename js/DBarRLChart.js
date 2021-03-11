import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, Cell, ReferenceLine } from 'recharts';
import { calculateYDomain } from './helpers'
import Settings from './Settings';

class DBarRLChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width:this.props.width, height: this.props.height
		};
	}

	render() {
		let stt = this.props.chart.settings;
		let keys = Object.keys(this.props.chart.charts);
		if( keys.length > 0 ) {
			let charts = [];
			charts.push( <CartesianGrid key={'cgrid.'+stt.id} strokeDasharray="3 3" /> );
			let orientation = ('orientation' in stt ) ? stt.orientation : 'vertical';
			let domain = calculateYDomain( this.props.chart.data, 0.05 );
			let fontSize = this.props.height * 0.7 / this.props.chart.data.length;
			if( fontSize > Settings.axisFontSize) 
				fontSize = Settings.axisFontSize;
			if( fontSize < 6 )
				fontSize=6;
			if( orientation === 'vertical' ) {
				charts.push( <XAxis key={'xaxis.'+stt.id} domain={domain} type="number" style={{fontSize:Settings.axisFontSize+'px'}} /> );
	  			charts.push( <YAxis key={'yaxis.'+stt.id} dataKey="name" type="category" axisLine={false} style={{fontSize:fontSize+'px'}} /> ); 
				charts.push( <ReferenceLine key={'refline.'+stt.id} x={0} stroke={stt.referenceLineColor} /> );
			} else {	
	  			charts.push( <XAxis key={'xaxis.'+stt.id} dataKey="name" type="category" style={{fontSize:Settings.axisFontSize+'px'}} /> ); 
				charts.push( <YAxis key={'yaxis.'+stt.id} domain={domain} type="number" style={{fontSize:fontSize+'px'}} /> );
				charts.push( <ReferenceLine key={'refline.'+stt.id} y={0} stroke={stt.referenceLineColor} /> );
			}
			charts.push( <Tooltip key={'tooltip.'+stt.id} 
			  	formatter = { (value, name, props) => { return [value, props.payload.name] } } 
				labelFormatter = { () => { return null; } } /> );

			let colorMapping = null;
			let colors = this.props.chart.settings.colors;
			if( colors !== undefined && colors !== null ) {
				colorMapping = this.props.chart.data.map((entry, index) => <Cell key={`cell.${stt.id}.${index}`} fill={colors[index % colors.length]} />);
			}

			for( let i in keys ) {
				let k = keys[i];
				charts.push( <Bar key={'bar.'+stt.id+'.'+i} dataKey={k} fill={this.props.chart.charts[k].fill}>{colorMapping}</Bar> );
			}
			let margin = { top:10, left:40, right:0, bottom:10 };
			let style= { fontSize:Settings.chartFontSize+'px', color: '#7f7f7f' };	
			return (
				<BarChart layout={orientation} key={'chart.'+stt.id} width={this.props.width} 
				 height={this.props.height} data={this.props.chart.data} 
				 style={style} margin={margin}>
					{charts}
				</BarChart>
			);
		} else {
			return( <div>NO DATA</div> );
		}
	}
}

export default DBarRLChart;

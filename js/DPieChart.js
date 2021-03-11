import React, { PureComponent, Component } from 'react';
import { PieChart, Pie, Legend, Tooltip, Sector, Cell } from 'recharts';
import Settings from './Settings';

/*
{ 
	"type":"rect", 
	"value":"Показатель 4", 
	"color":"#7777ff", 
	"payload":
	{ 
		"percent":0.1836734693877551,
		"name":"Показатель 4",
		"tooltipPayload":
		[
			{ 
				"name":"Показатель 4","value":9,
				"payload": 
				{
					"payload":{"name":"Показатель 4","value":9},
					"fill":"#7777ff","stroke":"#fff","name":"Показатель 4","value":9
				},
				"dataKey":"value"
			}
		],
		"midAngle":326.9387755102041,"middleRadius":54.400000000000006,
		"tooltipPosition":{"x":141.67011790611616,"y":180.67709862585383},
		"payload":
		{
			"payload":{"name":"Показатель 4","value":9},
			"fill":"#7777ff","stroke":"#fff","name":"Показатель 4","value":9
		},
		"fill":"#7777ff","stroke":"#fff",
		"value":9,
		"cx":96.078125,
		"cy":151,
		"innerRadius":0,
		"outerRadius":108.80000000000001,
		"maxRadius":167.85775184219412,"startAngle":293.8775510204082,"endAngle":360,"paddingAngle":0
	}
}
*/
class DPieChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width:this.props.width, height: this.props.height
		};
	}

	render() {
		let stt = this.props.chart.settings;
		let colorMapping = null;
		let colors = this.props.chart.settings.colors;
		if( colors !== undefined && colors !== null ) {
			colorMapping = this.props.chart.data.map((entry, index) => <Cell key={`cell.${stt.id}.${index}`} fill={colors[index % colors.length]} />);
		}
		let wrapperStyle = { right:0, bottom:5 }; 
		let radius; // = (this.props.width > this.props.height) ? (this.props.height * 0.35) : (this.props.width * 0.35);
		let cx; // = Math.floor( this.props.width / 2 );
		let cy; // = Math.floor( this.props.height / 2 );
		let layout;
		if( this.props.width > this.props.height ) {
			radius = Math.floor( 0.6 * this.props.height / 2 );
			if( this.props.width > this.props.height*1.4 ) {
				cx = Math.floor( radius + this.props.width * 0.1 );
				cy = Math.floor( this.props.height * 0.5 );	
				layout = 'vertical';
				wrapperStyle.right = 5;
			} else {
				cx = Math.floor( radius + 40 );
				cy = Math.floor( radius + 40 );	
				layout = 'horizontal';
			}
		} else {
			radius = Math.floor( 0.6 * this.props.width / 2 );
			if( this.props.height > this.props.width * 1.4 ) {
				cx = Math.floor( this.props.width * 0.5 );
				cy = Math.floor( radius + this.props.height * 0.1 );			
				layout = 'vertical';
				wrapperStyle.right = 5;
			} else {
				cx = Math.floor( radius + 40 );
				cy = Math.floor( radius + 40 );		
				layout = 'horizontal';
			}
		}

		let fontSize = this.props.height * 0.7 / this.props.chart.data.length;
		if( fontSize > Settings.axisFontSize) 
			fontSize = Settings.axisFontSize;
		if( fontSize < 6 )
			fontSize=6;

		let legend = <Legend key={'legend.'+stt.id} layout={layout} style={{fontSize:fontSize}}
			wrapperStyle={wrapperStyle}		 
			formatter={ (v,e,i) => { return `${e.payload.value} - ${v}`; } } />					
		let style= { fontSize:Settings.chartFontSize+'px', color: '#7f7f7f' };
		return (
			<PieChart key={'piechart.'+stt.id} style={style} width={this.props.width} height={this.props.height} >
				{legend}
				<Pie key={'pie.'+stt.id} data={this.props.chart.data} dataKey="value" 
				 nameKey="name" cx={cx} cy={cy} isAnimationActive={false} 
				 outerRadius={radius} fill={this.props.chart.settings.fill} label>
					{colorMapping}
				</Pie>
				<Tooltip/>
			</PieChart>
		);
	}
}

export default DPieChart;

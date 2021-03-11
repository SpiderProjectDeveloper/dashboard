import React, { PureComponent, Component } from 'react';
import { PieChart, Pie, Legend, Sector, Cell } from 'recharts';

class DDialGaugeChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width:this.props.width, height: this.props.height
		};
	}

	render() {
		let stt = this.props.chart.settings;
		let radius = (this.props.width > this.props.height ) ? (this.props.height * 0.4) : (this.props.width * 0.4);

		let dataSource = this.props.chart.data;
		let data = []
		let colors = [];
		if( dataSource.scheduled.value > dataSource.actual.value ) {
			data.push( { name: stt.titles.actual, value: dataSource.actual.value } );
			colors.push( stt.colors.actual );
			data.push( { name: stt.titles.lag, value: dataSource.scheduled.value - dataSource.actual.value } );
			colors.push( stt.colors.lag );
			data.push( { name: stt.titles.unfinished, value: dataSource.target.value - dataSource.scheduled.value } );
			colors.push( stt.colors.unfinished );
		} else if( dataSource.scheduled.value < dataSource.actual.value ) {
			data.push( { name: stt.titles.scheduled, value: dataSource.scheduled.value } );
			colors.push( stt.colors.actual );
			data.push( { name: stt.titles.outrun, value: dataSource.actual.value - dataSource.scheduled.value } );
			colors.push( stt.colors.outrun );
			data.push( { name: stt.titles.unfinished, value: dataSource.target.value - dataSource.actual.value } );
			colors.push( stt.colors.unfinished );
		} else {
			data.push( { name: stt.titles.actual, value: dataSource.actual.value } );
			colors.push( stt.colors.actual );
			data.push( { name: stt.titles.unfinished, value: dataSource.target.value - dataSource.actual.value } );
			colors.push( stt.colors.unfinished );
		}
		let colorMapping = null;
		colorMapping = data.map((entry, index) => <Cell key={`cell.${stt.id}.${index}`} fill={colors[index % colors.length]} />);
		let legend = <Legend key={'legend.'+stt.id}  />					
		let style= { fontSize:'12px', color: '#7f7f7f' };	
		return (
			<PieChart key={'piechart.'+stt.id} style={style} width={this.props.width} height={this.props.height} 
			 margin={{ top: 15, right: 15, left: 15, bottom: 40 }}>
				{legend}
				<Pie key={'pie.'+stt.id} data={data} dataKey="value" nameKey="name" cx="50%" cy="75%" 
				 outerRadius={radius} fill={this.props.chart.settings.fill}           
				 startAngle={180} endAngle={0} innerRadius={radius*0.75} outerRadius={radius} label>
					{colorMapping}
				</Pie>
			</PieChart>
		);
	}
}

export default DDialGaugeChart;

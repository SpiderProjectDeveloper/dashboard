import React, { Component } from 'react';
import { Rnd } from 'react-rnd';
import DLineChart from './DLineChart';
import DLinePlot from './DLinePlot';
import DBarChart from './DBarChart';
import DBarRLChart from './DBarRLChart';
import DAreaChart from './DAreaChart';
import DPieChart from './DPieChart';
import DDialGaugeChart from './DDialGaugeChart';
import DTable from './DTable';
import DText from './DText';
import DImage from './DImage';
import styles from './../css/dwindow.css'; 
import Settings from './Settings.js';

class DWindow extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			x: this.props.x, y: this.props.y, width: this.props.width, height: this.props.height, chart: this.props.chart,
			fontSizeScale: 0,
			titleMouseOver: false,
			titleHeight: Settings.windowTitleHeight
		};

		this.setWindowCoords = this.setWindowCoords.bind(this);		
		this.titleMouseOver = this.titleMouseOver.bind(this);
		this.titleMouseOut = this.titleMouseOut.bind(this);
	} 

	setWindowCoords( x, y, width, height ) {
		this.setState( { x: x, y: y, width: width, height: height } );
	}
  
	titleMouseOver(e) {
		this.setState( { titleMouseOver: true } );
	}
	titleMouseOut(e) {
		this.setState( { titleMouseOver: false } );
	}
  
	render() {				
		let chartHeight = this.state.height - this.state.titleHeight;
		let chartJSX = null;
		if( this.props.chart.settings.type === 'lineChart' ) {
			chartJSX = <DLineChart width={this.state.width} height={chartHeight} chart={this.props.chart} />;
		}
		else if( this.props.chart.settings.type === 'linePlot' ) {
			chartJSX = <DLinePlot width={this.state.width} height={chartHeight} chart={this.props.chart} />;
		}
		else if( this.props.chart.settings.type === 'barChart' ) {
			chartJSX = <DBarChart width={this.state.width} height={chartHeight} chart={this.props.chart} />;
		}
		else if( this.props.chart.settings.type === 'barRLChart' ) {
			chartJSX = <DBarRLChart width={this.state.width} height={chartHeight} chart={this.props.chart} />;
		}
		else if( this.props.chart.settings.type === 'areaChart' ) {
			chartJSX = <DAreaChart width={this.state.width} height={chartHeight} chart={this.props.chart} />;
		}
		else if( this.props.chart.settings.type === 'pieChart' ) {
			chartJSX = <DPieChart width={this.state.width} height={chartHeight} chart={this.props.chart} />;
		}
		else if( this.props.chart.settings.type === 'dialGaugeChart' ) {
			chartJSX = <DDialGaugeChart width={this.state.width} height={chartHeight} chart={this.props.chart} />;
		}
		else if( this.props.chart.settings.type === 'table' ) {
			chartJSX = <DTable width={this.state.width} height={chartHeight} table={this.props.chart}
				fontSizeScale={this.state.fontSizeScale} />;
		}
		else if( this.props.chart.settings.type === 'text' ) {
			chartJSX = <DText width={this.state.width} height={chartHeight} text={this.props.chart}
				fontSizeScale={this.state.fontSizeScale} />;
		}
		else if( this.props.chart.settings.type === 'image' ) {
			chartJSX = <DImage width={this.state.width} height={chartHeight} image={this.props.chart} />;
		}
		else {
			return( <div>INVALID CHART TYPE</div> ); 
		}

		let controlsJSX=[];
		if( this.props.chart.settings.type === 'table' || this.props.chart.settings.type === 'text' ) {
			controlsJSX.push( 
				<span className={styles.control} key = {'title.plus.'+this.props.chart.settings.id} 
					onClick={ (e) => { this.setState({ fontSizeScale: this.state.fontSizeScale+1 }); } }>
					T{String.fromCharCode(43)}</span>);
			controlsJSX.push( 
				<span className={styles.control} key = {'title.minus.'+this.props.chart.settings.id}  
					onClick={ (e) => { this.setState({ fontSizeScale: this.state.fontSizeScale-1 }); } }>
					T{String.fromCharCode(8722)}</span>);
		}
		controlsJSX.push( 
			<span className={styles.control} key = {'title.expand.'+this.props.chart.settings.id} 
				onClick={ (e) => { this.setState({ titleHeight: this.state.titleHeight+12 }); } }>
				{String.fromCharCode(8615)}</span>);
		controlsJSX.push( 
			<span className={styles.control} key = {'title.collapse.'+this.props.chart.settings.id} 
				onClick={ (e) => { this.setState({ titleHeight: (this.state.titleHeight>Settings.windowTitleHeight/2) ? this.state.titleHeight-12 : this.state.titleHeight }); } }>
				{String.fromCharCode(8613)}</span>);

		// Setting hide title property
		let contentStyle = { 
			top: this.state.titleHeight + 'px',
			width: this.state.width+'px', 
			height: (this.state.height - Settings.windowTitleHeight) + 'px' 
		};
		let titleStyle = {};		
		if( 'hideTitle' in this.props.chart.settings && this.props.chart.settings.hideTitle ) {
			titleStyle.display = (this.state.mouseOver) ? 'block' : 'none';
		}
		//titleStyle.overflow = (this.state.mouseOver) ? 'visible' : 'hidden'; // To display a hidden part of title if exists
		let titleLength = this.props.chart.settings.title.length;
		if( titleLength === 0 ) {
			titleStyle.height = 0;
			contentStyle.top = 0;
		} else {
			titleStyle.height = this.state.titleHeight + 'px';
			titleStyle.maxHeight = this.state.titleHeight + 'px';
			let fontSize  = parseInt(this.state.width * 4 / titleLength);
			if( fontSize < 14 ) {
				if( fontSize < 8 )
					fontSize=8;
				titleStyle.fontSize = fontSize + 'px';
			}
			if( this.state.titleMouseOver ) {
				titleStyle.overflow='visible';
			} else {
				titleStyle.overflow='hidden';
			}
		}

		return (
			<Rnd key={'win.'+this.props.chart.settings.id} className={styles.window} ref={c => { this.rnd = c; }} 
				size = {{ width: this.state.width, maxWidth: this.state.width, height: this.state.height, maxHeight: this.state.height }} 
			 	position = {{ x: this.state.x, y: this.state.y }} 
				enableResizing = {{ bottomRight: true, topLeft: true }}
				style = {{ zIndex: this.props.zIndex }}
				onDragStart={ (e,d) => {
					this.props.bringFront(this.props.index);
				}}
		        onDragStop={(e, d) => {
					this.setState({ x: d.x, y: d.y });
				}}
				onResize={(e, d, ref, delta, position) => {
					this.setState({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), 
						x:parseInt(position.x), y:parseInt(position.y) });
				}}				
				onResizeStop={(e, d, ref, delta, position) => {
					this.setState({ width: parseInt(ref.style.width), height: parseInt(ref.style.height), 
						x:parseInt(position.x), y:parseInt(position.y) });
				}} >
				<div className={styles.title} style={titleStyle} 
					onMouseOver={this.titleMouseOver} onMouseOut={this.titleMouseOut}>
					<div className={styles.titleControls} style={{display:(this.state.titleMouseOver?'block':'none')}}>
						{controlsJSX}
					</div>
					<div className={styles.titleText}>{this.props.chart.settings.title}</div>
				</div>
				<div className={styles.content} style={contentStyle}>				
					{chartJSX}
				</div>
			</Rnd>
		);
	} // end of render()
}

export default DWindow;

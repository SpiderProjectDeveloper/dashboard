import React, { Component } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ReferenceLine } from 'recharts';
import { calculateXDomain, calculateYDomain, secondsToDate } from './helpers'
import Settings from './Settings';

function gradientOffset(data,key) {
    if( data.length == 0 || !(key in data[0]) )
        return 0;
    let dataMin=data[0][key], dataMax=data[0][key];
    for( let i=0 ; i < data.length ; i++ ) {
        if( dataMin > data[i][key] )
            dataMin = data[i][key];
        if( dataMax < data[i][key] )
            dataMax = data[i][key];
    }
    if (dataMax <= 0) {
        return 0;
    } else if (dataMin >= 0) {
        return 1;
    } else {
        return dataMax / (dataMax - dataMin);
    }
  }

class DAreaChart extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width:this.props.width, height: this.props.height
		};
	}

	render() {
		let stt = this.props.chart.settings;
    let data = this.props.chart.data;
		let keys = Object.keys(this.props.chart.charts);
		if( keys.length > 0 ) {
			let charts = [];
			charts.push( <CartesianGrid key={'cgrid'+stt.id} strokeDasharray="3 3" /> );

			let xdomain = calculateXDomain( data, null, (typeof(stt.xAxisKey)!=='undefined') ? stt.xAxisKey : 'name' );
			if( typeof(stt.startXAtZero) !== 'undefined' && stt.startXAtZero && xdomain !== null ) 	// If refer min Y to zero... 
				xdomain[0] = 0; 
			let xFormatter = undefined;
			if( typeof(stt.xAxisType) !== 'undefined' && stt.xAxisType === 'date' ) 	// If refer min Y to zero... 
				xFormatter = function(e) { return secondsToDate(e); }; 			
			let xAxisType = typeof((stt.xAxisType) === 'undefined' || stt.xAxisType === 'date' ) ?  'number' : stt.xAxisType; 
			let xAxisKey = (typeof(stt.xAxisKey)!=='undefined') ? stt.xAxisKey : 'x';	
			charts.push( <XAxis key={'xaxis'+stt.id} allowDuplicatedCategory={false} 
				dataKey={xAxisKey} type={xAxisType} style={{fontSize: Settings.axisFontSize+'px'}} 
				domain={xdomain!==null ? xdomain: undefined} 
				tickFormatter={xFormatter} /> );

			let ydomain = calculateYDomain( data, null, (typeof(stt.xAxisKey) !== undefined) ? stt.xAxisKey : null );
			if( typeof(stt.startYAtZero) !== 'undefined' && 
					stt.startYAtZero && ydomain[0] > 0.0 && ydomain !== null ) 	// If refer min Y to zero... 
					ydomain[0] = 0;				
			let zeroReferenceLine = null;
			if( ydomain[0] < 0.0 && ydomain[1] > 0.0 ) {
					zeroReferenceLine = <ReferenceLine y={0} stroke='#af4f4f' />
			}
			let yFormatter = undefined;
			if( stt.decimalPlacesAfterDotAtAxis !== undefined ) {
				yFormatter = function(e) { return e.toFixed(stt.decimalPlacesAfterDotAtAxis); };
			}
			charts.push( <YAxis key={'yaxis'+stt.id} style={{fontSize:Settings.axisFontSize+'px'}} 
				domain={(ydomain!==null) ? ydomain : undefined } 
				tickFormatter={yFormatter} /> );

			charts.push( <Tooltip key={'tooltip'+stt.id}  labelFormatter={ xFormatter } /> );
			charts.push( <Legend key={'legend'+stt.id}  style={{fontSize:Settings.legendFontSize+'px'}} /> );

			for( let i in keys ) {
				let k = keys[i];

				if( ydomain[0] < 0.0 && typeof(this.props.chart.charts[k].negStroke) !== 'undefined' ) 
				{
					//console.log("this.props.chart.charts[k].stroke=", this.props.chart.charts[k].stroke);
					//console.log('data=', data[k]);
					charts.push(
						<defs key={'def.'+stt.id+'.'+i}>
							<linearGradient key={'lineGrad.'+stt.id+'.'+i} id={`splitColor${i}`} x1="0" y1="0" x2="0" y2="1">
								<stop offset={gradientOffset(this.props.chart.data, k)} 
									stopColor={this.props.chart.charts[k].stroke} stopOpacity={1}/>
								<stop offset={gradientOffset(this.props.chart.data, k)} 
									stopColor={this.props.chart.charts[k].negStroke} stopOpacity={1}/>
							</linearGradient>
						</defs>
					);
					charts.push(
						<Area key={'area.'+stt.id+'.'+i} type={stt.areaType} dataKey={k} 
							stroke="#000" fill={`url(#splitColor${i})`} />
					);                   
				} 
				else {
					//console.log('this.props.chart.charts[k].stroke=', this.props.chart.charts[k].stroke);
					charts.push( <Area type={(typeof(stt.areaType) !== 'undefined') ? stt.areaType : "monotone"} 
						key={'area.'+stt.id+'.'+i} dataKey={k} fill={this.props.chart.charts[k].stroke} /> );
				}        
			}
			let referenceLine = ('referenceLine' in stt) ? 
				(<ReferenceLine key={'refline.'+stt.id} x={stt.referenceLine} 
					stroke='#af4f4f' strokeDasharray={"2 4"} />) : null;
			let margin = { top:10, left:30, right:0, bottom:30 };
    	let style= { fontSize:Settings.chartFontSize+'px', color: '#7f7f7f' };	

			return (
				<AreaChart key={'chart.'+stt.id} width={this.props.width} height={this.props.height} 
				 data={this.props.chart.data} style={style} margin={margin}>
					{charts}
					{referenceLine}
          {zeroReferenceLine}
        </AreaChart>
			);
		} else {
			return( <div>NO DATA</div> );
		}
	}
}

export default DAreaChart;

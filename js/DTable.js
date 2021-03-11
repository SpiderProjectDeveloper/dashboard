import React, { Component } from 'react';
import styles from './../css/dtable.css'; 

class DTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width: this.props.width, 
			height: this.props.height,
			fontSizeScale: this.props.fontSizeScale
		};
	}

	render() {
		let t = this.props.table;
		let stt = t.settings;
		
		let style = { minWidth: this.props.width, maxWidth: this.props.width };
		if( this.props.fontSizeScale != 0 ) {
			style.fontSize = 100 + this.props.fontSizeScale*5 + '%';
		}
		return (
			<table key={`table.${stt.id}`} style={style} className={styles.table} cellSpacing={0}>
				<thead key={`thead.${stt.id}`}>
					<tr key={`thead.tr.${stt.id}`}>					
					{
						t.head.map( function( col, icol ) {
							return(<td key={`thead.td.${stt.id}.${icol}`}>{col.name}</td>);
						})							
					}
					</tr>
				</thead>
				<tbody key={`tbody.${stt.id}`}>
					{
						t.body.map( function( row, irow ) {							
							return(
								<tr key={`tr.${stt.id}.${irow}`}>
									{ 
										t.head.map( function( col, icol ) {
											return(<td key={`td.${stt.id}.${icol}.${irow}`}>{row[col.key]}</td>)
										})
									}
								</tr>
							)
						})							

					}
				</tbody>
			</table>
		);
	}
}

export default DTable;

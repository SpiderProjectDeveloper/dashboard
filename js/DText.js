import React, { Component } from 'react';
import styles from './../css/dtext.css'; 

class DText extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width: this.props.width, 
			height: this.props.height,
			fontSizeScale: this.props.fontSizeScale
		};
	}

	render() {
		let style = { 
			minWidth: this.props.width, maxWidth: this.props.width, 
			minHeight: this.props.height, maxHeight: this.props.height 
		};
		if( typeof( this.props.text.settings.font.size ) !== 'undefined' ) {
			style.fontSize = this.props.text.settings.font.size + this.props.fontSizeScale + 'px';
		}
		else if( this.props.fontSizeScale != 0 ) {
			style.fontSize = (100 + this.props.fontSizeScale*5).toString() + '%';
		}
		if( typeof( this.props.text.settings.font.family ) !== 'undefined' ) {
			style.fontFamily = this.props.text.settings.font.family;
		}
		if( typeof( this.props.text.settings.font.weight ) !== 'undefined' ) {
			style.fontWeight = this.props.text.settings.font.weight;
		}
		if( typeof( this.props.text.settings.font.italic ) !== 'undefined' ) {
			style.fontStyle = (this.props.text.settings.font.italic === 1 ) ? 'italic' : 'normal';
		}
		return (
			<div style={style} className={styles.container}>
				{this.props.text.text}
			</div>
		);
	}
}

export default DText;

import React, { Component } from 'react';
//import styles from './../css/dimage.css'; 
import Settings from './Settings';

class DImage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			width: this.props.width, 
			height: this.props.height,
		};
	}

	render() {
		//let divStyle = { minWidth: this.props.width, maxWidth: this.props.width };
		let imgStyle = { 
			width: this.props.width, height: this.props.height - Settings.windowTitleHeight, 
			left:0, top: Settings.windowTitleHeight+'px' };
        let url = Settings.imagesDirectory + this.props.image.fileName;
		return (
			<img src={url} style={imgStyle} draggable={false} />
		);
	}
}

export default DImage;

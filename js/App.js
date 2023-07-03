import 'react-app-polyfill/ie11'; 			// Support for ie11
import React from 'react';
import styles from './../css/app.css'; 
import DWindow from './DWindow';
import { convertSourceData, calcChartWindowsCoords, tileChartWindowsCoords, getCookie, setCookie } from './helpers'
import Settings from './Settings';

class App extends React.Component 
{
	constructor(props) 
	{
		super(props);
		this.state = { 
			data: { 'error': '...'},
			childZIndexes: [],
			childRefs: [],
			lang: 'en',
			userName: String.fromCharCode(8230),
			userLogin: String.fromCharCode(8230),
			title: String.fromCharCode(8230),
			projectVersion: String.fromCharCode(8230),
			projectTime: String.fromCharCode(8230),
		};
		this.windowsPositioningMode = 1;
		this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

		this.changeLang = this.changeLang.bind(this);
		this.positionWindows = this.positionWindows.bind(this);
		this.bringFront = this.bringFront.bind(this);
		this.printPage = this.printPage.bind(this);
		this.onResize = this.onResize.bind(this);

		window.addEventListener('resize', this.onResize );
	}

	printPage() 
	{
		window.print();		
	}

	positionWindows( mode=null ) 
	{
		if( this.state.data === null || !('charts' in this.state.data) || this.state.data.charts.length === 0 ) {
			return;
		}
		if( mode !== null ) {
			this.windowsPositioningMode = mode;
		} else {
			mode = this.windowsPositioningMode;
		}
		let l = this.state.data.charts.length;
		let coords = new Array(l);
		for( let i = 0 ; i < l ; i++ ) {
			coords[i] = {};
		} 
		if( this.windowsPositioningMode === 1 && !(this.innerWidth < Settings.lowResolutionWindowWidth) ) { 
			calcChartWindowsCoords( this.state.data.charts, coords, this.innerWidth, this.innerHeight );
		} else {
			tileChartWindowsCoords( this.state.data.charts, coords, this.innerWidth, this.innerHeight );
		}
		let z = new Array(l);
		for( let i = 0 ; i < l ; i++ ) {
			z[i] = Settings.minChildWindowZIndex + i;
			if( 'error' in coords ) {
				continue;
			}
			this.state.childRefs[i].current.setWindowCoords( coords[i].x, coords[i].y, coords[i].width, coords[i].height );
		}
		if( mode == 1 ) {
			this.setState( { childZIndexes:z } );
		}
	}

	changeLang( e ) 
	{
		for( let i = 0 ; i < Settings.langs.length ; i++ ) {
			if( Settings.langs[i] === this.state.lang ) {
				let lang = ( i < Settings.langs.length-1 ) ? Settings.langs[i+1] : Settings.langs[0];  		
				this.setState( { lang: lang } );
				setCookie( 'lang', lang );
				break;
			}
		}
	}

	bringFront(indexOfClicked) 
	{
		let l = this.state.childZIndexes.length;
		let z = new Array(l);
		let indexOfMaxZ = 0;
		for( let i = 0 ; i < l ; i++ ) {
			z[i] = this.state.childZIndexes[i];
			if( i > 0 && z[i] > z[indexOfMaxZ] ) {	
				indexOfMaxZ = i;
			}
		}
		if( indexOfClicked == indexOfMaxZ )
			return;
		let zOfClicked = z[indexOfClicked];
		z[indexOfClicked] = z[indexOfMaxZ];						
		for( let i = 0 ; i < l ; i++ ) {
			if( i != indexOfClicked && z[i] > zOfClicked )
				z[i]--;
		}
		this.setState( { childZIndexes:z } );
	}

	onResize(e) 
	{
		var resizeTimer = null;
		if(resizeTimer) clearTimeout(resizeTimer);
		resizeTimer = setTimeout( function() {
			this.innerWidth = window.innerWidth;
			this.innerHeight = window.innerHeight;
			this.positionWindows();
			}.bind(this), 100 );
	}	  

	componentDidMount() 
	{
		if( Settings.isPhpAuth ) {   // A "_userName" defined signals the app is running at an FTP
				this.setState( {userName: Settings.phpAuthUserName } );
		} else {    // Trying to get the lang setting from cookie
			let lang = getCookie('lang');
			if( lang !== null ) {
					this.setState( { lang:lang } );
			}		
			let userLogin = getCookie('user');
			if( userLogin !== null ) {
					this.setState( {userLogin: userLogin } );
			}
		}
		fetch(Settings.htmlDirectory + Settings.dataUrl).then(data=> data.json()).then( 
			(data) => { 
				data = convertSourceData(data);		
				this.setState({ 
					lang: (typeof(data.lang) !== 'undefined') ? data.lang : this.state.lang,
					userName: (typeof(data.user) !== 'undefined') ? data.user : this.state.userName, 
					title: data.title, projectVersion: data.projectVersion, projectTime: data.projectTime
				}); 
				
				document.title=data.title; // Setting window title
				
				if( !('charts' in data) ) {
					this.setState( { data: { 'error': Settings.noDataText[data.lang] } } );
					return;
				}
				if( data.charts.length === 0 ) {
					this.setState( { data: { 'error': Settings.noDataText[data.lang] } } );
					return;
				}
				let z = [];
				let r = [];
				for( let i = 0 ; i < data.charts.length ; i++ ) {
					z.push( Settings.minChildWindowZIndex + i );
					r.push( React.createRef() );
				}
				this.setState( { data: data, childZIndexes: z, childRefs: r } );
		
			} 
		).catch(
			function(e) { 
				this.setState( { data: { 'error': Settings.failedToLoadText[this.state.lang] } } );
				return;
			}.bind(this)
		);
  }

	render() 
	{				
		let headerUser;     // It depends whether is it run at an FTP or via the SP-server
		if(Settings.isPhpAuth) {         // FTP and PHP Auth?
				headerUser = 
						<div className={styles.headerUser}>
								<a className={styles.headerUserNameA} href={Settings.exitURL}>{this.state.userName}</a><br/>
								<a className={styles.headerLogoutA} href={Settings.exitURL}>{Settings.exitText[this.state.lang]}</a>
						</div>;
		} else {        // otherwise it is the server - full user name and no logout button 
				headerUser = 
						<div className={styles.headerUser}>
								{this.state.userName}<br/>
								{this.state.userLogin}
						</div>;
		} 

		let header = (		
			<div className={styles.headerContainer}>
				<div className={styles.headerControls}>
					<span onClick={this.changeLang}>{ Settings.lang[ this.state.lang ] }</span>
					<span style={ { display:(this.innerWidth < Settings.lowResolutionWindowWidth) ? 'none':'inline' } }
						onClick={ (e) => this.positionWindows(1) }>{ String.fromCharCode(8634) }</span>
					<span style={ { display:(this.innerWidth < Settings.lowResolutionWindowWidth) ? 'none':'inline' } }
						onClick={ (e) => this.positionWindows(2) }>{ String.fromCharCode(9783) }</span>
					<span style={ { display:(this.innerWidth < Settings.lowResolutionWindowWidth) ? 'none':'inline', fontVariant:'small-caps' } }
						onClick={ (e) => this.printPage() }>P</span>
				</div>
				<div className={styles.headerTitle}>
					{ this.state.title }
					<div className={styles.headerDetails}>
						{Settings.versionText[this.state.lang]} {this.state.projectVersion} :: {this.state.projectTime} 
					</div>
				</div>
                {headerUser}
			</div>
		);

		let data = this.state.data;
		if( 'error' in data ) {
			return( 
				<div className={styles.appContainer}>
					{header}
					<div className={styles.waitContainer}>{data.error}</div>
				</div> );
		}

		let charts = [];
		let nCharts = data.charts.length;
		if( nCharts > 0 ) 
		{
			try {
				let coords = new Array( nCharts );
				for( let i = 0 ; i < nCharts ; i++ ) {
					coords[i] = {};
				}
				if( this.windowsPositioningMode === 1 && !(this.innerWidth < Settings.lowResolutionWindowWidth) ) { 
					calcChartWindowsCoords( data.charts, coords, this.innerWidth, this.innerHeight );
				} else {
					tileChartWindowsCoords( data.charts, coords, this.innerWidth, this.innerHeight );
				}

				for( let i = 0 ; i < nCharts ; i++ ) {
					if( 'error' in coords[i] ) {
						continue;
					}
					charts.push( <DWindow key={'chart.window.'+i} ref={this.state.childRefs[i]} 
						index={i} zIndex={this.state.childZIndexes[i]} bringFront={this.bringFront}  
						x={coords[i].x} y={coords[i].y} width={coords[i].width} height={coords[i].height} chart={data.charts[i]} /> );		
				}
				return (
					<div className = {styles.appContainer}>
						{header}
						<div className = {styles.contentContainer}> 
							{charts}
						</div>
					</div>
				);
			} catch(e) {
				; //console.log(e);
			}
		}
		return( 
			<div className={styles.appContainer}>
				{header}
				<div className={styles.waitContainer}>{Settings.failedToParseText[this.state.lang]}</div>
			</div> 
		);
	}
}

export default App;


/**** A possible substitution for "fetch"
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() 
	{
		if (xhttp.readyState == 4 ) {
			if( xhttp.status == 200 ) {
			let data=null;
			let errorParsingStatusData = false;
			try {
				data = JSON.parse(xhttp.responseText);
			} catch(e) {
				errorParsingStatusData = true;
								}
			if( !errorParsingStatusData ) {
				data = convertSourceData(data);		
				this.setState({ lang: data.lang, title: data.title, projectVersion: data.projectVersion, 
					projectTime: data.projectTime, userName: (typeof(_userName) !== 'undefined') ? _userName : '?' });
		
				document.title=data.title; 
				if( ('charts' in data) && data.charts.length > 0 ) {
					let z = [];
					let r = [];
					for( let i = 0 ; i < data.charts.length ; i++ ) {
						z.push( Settings.minChildWindowZIndex + i );
						r.push( React.createRef() );
					}
												this.setState( { data: data, childZIndexes: z, childRefs: r } );
												return;
				}
				this.setState( { data: { 'error': Settings.noDataText[data.lang] } } );
					} else {
				this.setState( { data: { 'error': Settings.failedToLoadText[this.state.lang] } } );
					}
		} else {
			this.setState( { data: { 'error': Settings.failedToLoadText[this.state.lang] } } );
		}
				} 
	}.bind(this);
	xhttp.open( 'GET', Settings.htmlDirectory + Settings.dataFile, true );
	xhttp.send();
****/

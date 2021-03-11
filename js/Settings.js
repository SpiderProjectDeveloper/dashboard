function getScrollBarWidth() {
	// Creating invisible container
	const outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.overflow = 'scroll'; // forcing scrollbar to appear
	outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
	document.body.appendChild(outer);
  
	// Creating inner element and placing it in the container
	const inner = document.createElement('div');
	outer.appendChild(inner);
  
	// Calculating difference between container's full width and the child width
	const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);
  
	// Removing temporary elements from the DOM
	outer.parentNode.removeChild(outer);
  
	return scrollbarWidth;
}

function getPhpUser() {
	let phpuser;
	let el = document.getElementById('app');
	if( el ) {
		if( 'phpuser' in el.dataset ) {
			phpuser = el.dataset.phpuser;
		}		
	}
    return phpuser;

}

function isPhpAuth() {
	return (typeof(getPhpUser()) !== 'undefined') ? true : false;
}

function phpAuthUserName() {
	let phpuser = getPhpUser();
	return (typeof(phpuser) !== 'undefined') ? phpuser : '';
}


var Settings = {
	langs: ['en', 'ru' ],
	lang: { en: 'EN', ru: 'РУ' },
	exitText: { en: 'exit', ru:'выход' },
	exitURL: 'logout.php',
	versionText: { en: 'Version', ru:'Версия' },
	valueText: { en: 'Value', ru:'Значение' },
	windowTitleHeight: 34,
	windowScrollBarWidth: getScrollBarWidth(), 
	domainMarginFactor: 0.1,
	chartFontSize: 12,
	axisFontSize: 12,
	legendFontSize: 11,
	lowResolutionWindowWidth: 740,
	dataFile: 'data.php',
	dataUrl: (!isPhpAuth() ? '/.dashboard_data' + window.location.search : 'data.php'),
	htmlDirectory: '',
	imagesDirectory: (!isPhpAuth() ? '/.get_image?' : 'files/'),
	notAuthorizedText: { 'en': 'Not authorized', 'ru': 'Нет авторизации' },
	waitLoadingText: { en: 'Please wait while loading data...', ru:'Пожалуйста, подождите, пока загружаются данные' },
	failedToLoadText: { en: 'Failed to load data...', ru:'Ошибка при загрузке данных' },
	failedToParseText: { en: 'Error while handling data. The data are incorrect?', ru:'Ошибка при обработке данных. Данные искажены?' },
	noDataText: { en: 'No data available', ru:'Нет данных' },
    minChildWindowZIndex: 1000,
    phpAuthUserName: phpAuthUserName(),
    isPhpAuth: isPhpAuth(),
};

export default Settings;
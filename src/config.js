/**
 * Custom configuration
 */

var Config = {};

// flag to activate debug code
Config.debug = false;


// GUI
Config.gui = {
  hideShareButton: false,
  hideLoginButton: true,
  useLayertreeGroupCheckboxes: true
};


// login (if hideLoginButton is false)
Config.login = new Login();

// enable this to redirect to HTTPS before login
Config.sslLogin = false;

/* Configuration for Mapfish Appserver:
Config.login = new MapfishLogin();
*/


// data configuration
Config.data = {};

Config.data.topicsUrl = "data/topics.json";

Config.data.layersUrl = function(topicName) {
  return "data/layers/layers_" + topicName + ".json";
};

/* Configuration for Mapfish Appserver:
Config.data.topicsUrl = "/topics.json?gbapp=default";

Config.data.layersUrl = function(topicName) {
return "/layers.json?topic=" + topicName;
}
*/

Config.data.initialTopic = "geo_admin_pk";


// default properties
Config.defaultProperties = {
  following: false,
  orientation: false,
  scalebar: true
};


// feature info
Config.featureInfo = {};

// feature info format ('text/xml' or 'text/html')
Config.featureInfo.format = 'text/xml';

// enable this to use WMS GetFeatureInfo requests
Config.featureInfo.useWMSGetFeatureInfo = false;

// max number of features per layer for WMS GetFeatureInfo requests (null to use WMS default)
Config.featureInfo.wmsMaxFeatures = null;

/**
 * Tolerances for WMS GetFeatureInfo requests on QGIS Server
 *
 * tolerance values are in pixels at map dpi and will be scaled with
 * the actual pixel ratio value for high resolution rendering
 */
Config.featureInfo.tolerances = {
  point: 16,
  line: 8,
  polygon: 4
};

/**
 * custom feature info URL when not using WMS GetFeatureInfo
 *
 * topicName: current topic
 * coordinate: clicked position as [x, y]
 * layers: array of visible WMS layer names
 */
Config.featureInfo.url = function(topicName, coordinate, layers) {
  // DEBUG: sample static files for demonstration purposes
  if (Config.featureInfo.format === 'text/xml') {
    // sample QGIS Server XML query results
    return "data/get_feature_info_response.xml";
  }
  else {
    // sample HTML results
    return "data/get_feature_info_response.html";
  }
};

/* Configuration for Mapfish Appserver:
Config.featureInfo.format = 'text/html';
Config.featureInfo.useWMSGetFeatureInfo = false;
Config.featureInfo.url = function(topicName, coordinate, layers) {
  return "/topics/query?" + $.param({
    bbox: [coordinate[0], coordinate[1], coordinate[0], coordinate[1]].join(','),
    infoQuery: '{"queryTopics":[{"topic":"' + topicName + '","divCls":"legmain","layers":"' + layers.join(',') + '"}]}',
    mobile: 1
  });
}
// add styles for feature info results HTML to custom.css
*/


// map configuration
Config.map = {};

// DPI for scale calculations and WMS requests
Config.map.dpi = 96;

// ol.Extent [<minx>, <miny>, <maxx>, <maxy>]
Config.map.extent = [420000, 30000, 900000, 350000];

Config.map.scaleDenoms = [2000000, 1000000, 400000, 200000, 80000, 40000, 20000, 10000, 8000, 6000, 4000, 2000, 1000, 500, 250, 100];

Config.map.init = {
  center: [660000, 190000],
  zoom: 1
};

// ol.proj.Projection
Config.map.projection = ol.proj.get('EPSG:21781');
Config.map.projection.setExtent(Config.map.extent);

// calculate resolutions from scales
Config.map.scaleDenomsToResolutions = function(scales) {
  var resolutions = $.map(scales, function(scale, index) {
    return scale / (Config.map.projection.getMetersPerUnit() * (Config.map.dpi / 0.0254));
  });
  return resolutions;
};

// ol.View options
Config.map.viewOptions = {
  projection: Config.map.projection,
  resolutions: Config.map.scaleDenomsToResolutions(Config.map.scaleDenoms),
  center: Config.map.init.center,
  zoom: Config.map.init.zoom
};

// WMS server type ('geoserver', 'mapserver', 'qgis'), used for adding WMS dpi parameters
Config.map.wmsServerType = 'qgis';

Config.map.wmsParams = {
  'FORMAT': 'image/png; mode=8bit',
  'TRANSPARENT': null
};

Config.map.useTiledBackgroundWMS = true;
Config.map.useTiledOverlayWMS = false;

// limit max zoom to this scale (e.g. minScaleDenom=500 for 1:500)
Config.map.minScaleDenom = {
  map: 1000, // if topic.minscale is not set
  geolocation: 10000, // on location following
  search: 10000 // jump to search results
};

// limit min zoom to this scale on the initial geolocation update (null to disable)
Config.map.initialGeolocationMaxScale = null;


// search configuration

/**
 * SwissSearch
 *
 * services: SwissSearch services
 * queryPostfix: append this to the query string to limit search results e.g. to a canton ("ZH")
 */
//Config.search = new SwissSearch('swissnames', "");


/**
 * Mapfish Appserver search
 */

// create query URL from search params
Config.mapfishSearchUrl = function(searchParams) {
  // DEBUG: sample static file for demonstration purposes
  return "data/mapfish_search_response.json";
/*
  return "/search/fullsearch.json?" + $.param({
    begriff: searchParams
  });
*/
};

// return category, feature name, highlighting data and bbox=[<minx>, <miny>, <maxx>, <maxy>]
Config.mapfishParseFeature = function(feature) {
  return {
    category: feature.kategorie,
    name: feature.begriff,
    highlight: {
      fid: feature.fid,
      layer: "FullSearch" + feature.kategorie
    },
    bbox: [feature.bbox_xmin, feature.bbox_ymin, feature.bbox_xmax, feature.bbox_ymax]
  };
};

// WMS URL for highlighting the selected search result
Config.mapfishHighlightWmsUrl = "/wms/FullSearch";

//Config.search = new MapfishSearch(Config.mapfishSearchUrl, Config.mapfishParseFeature, Config.mapfishHighlightWmsUrl);


/**
 * WSGI search
 */
Config.search = new WsgiSearch("/wsgi/search.wsgi", "/wsgi/getSearchGeom.wsgi", true);


// permalink configuration
Config.permalink = new CustomPermalink();


/**
 * Mapfish Appserver permalink
 */

// create locate URL from locate and locations params
Config.mapfishLocateUrl = function(locate, locations) {
  return "/locate/" + locate + "?" + $.param({
    locations: locations
  });
};

//Config.permalink = new MapfishPermalink(Config.mapfishLocateUrl);


/**
 * QGIS Web Client permalink
 */
//Config.permalink = new QgisPermalink();


/**
 * Printing from browser
 */
Config.print = {
  hires: false, // enable high resolution printing
  dpi: 300 // target print resolution
};


/**
 * called after viewer init
 *
 * e.g. setup custom click handlers here
 */
Config.customInitViewer = function() {
  WOBGui.initViewer();
  WOBUmkreissuche.initClickHandler();
  WOBCoordinates.initClickHandler();
  WOBPermalink.initClickHandler();
};

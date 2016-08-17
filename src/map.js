/**
 * OpenLayers 3 map
 *
 * events:
 *   maprotation({rotation: <rad>})
 */

var Map = {};

// topics (key = topic name)
Map.topics = {};
// current topic
Map.topic = null;
// ordered layers (key = layer name)
Map.layers = {};
// current background topic
Map.backgroundTopic = null;
// current background WMS layers
Map.backgroundLayers = null;
// OpenLayers 3 map object
Map.map = null;
// min resolution to limit max zoom
Map.minResolution = null;
// OpenLayers 3 layer objects
Map.topicLayer = null;
Map.backgroundLayer = null;
Map.selectionLayer = null;
Map.redliningLayer = null;
Map.highlightLayer = null;
// overlay layers (key = topic name)
Map.overlayLayers = {};
// OpenLayers 3 geolocation object
Map.geolocation = null;
// OpenLayers 3 DeviceOrientation object
Map.deviceOrientation = null;
// device window orientation
Map.windowOrientation = undefined;
// OpenLayers 3 ScaleLine control
Map.scaleLine = null;
// last click position
Map.lastClickPos = null;
// click marker
Map.clickMarker = null;
// ignore clicks on map
Map.ignoreClick = false;
// map click handlers (key = handler name)
Map.singleClickHandlers = {};

Map.useTiledWMS = false;

Map.createMap = function() {
  // override from URL params
  if (Config.permalink.useTiledWMS != null) {
    Map.useTiledWMS = Config.permalink.useTiledWMS;
  }

  Map.map = new ol.Map({
    layers: [],
    target: 'map',
    view: new ol.View(Config.map.viewOptions),
    controls:[]
  });

  Map.map.getView().on('change:rotation', function() {
    $.event.trigger({type: 'maprotation', rotation: Map.map.getView().getRotation()});
  });

  Map.setMinScaleDenom(Config.map.minScaleDenom.map);
  Map.map.getView().on('change:resolution', function() {
    // limit max zoom
    if (Map.map.getView().getResolution() < Map.minResolution) {
      Map.map.getView().setResolution(Map.minResolution);
    }
  });

  Map.map.on('singleclick', function(e) {
    if (!Map.ignoreClick) {
      Map.lastClickPos = e.coordinate;

      for (var name in Map.singleClickHandlers) {
        var handler = Map.singleClickHandlers[name];
        if (handler.isActive()) {
          handler.handleEvent(e);
        }
      }
    }
  });
};

Map.clearLayers = function() {
  Map.map.getLayers().clear();
  Map.topicLayer = null;
  Map.backgroundLayer = null;
  Map.backgroundTopic = null;
  Map.backgroundLayers = null;
  Map.selectionLayer = null;
  Map.redliningLayer = null;
  Map.highlightLayer = null;
  Map.overlayLayers = {};
};

Map.setTopicLayer = function() {
  // add new layer
  var wmsParams = $.extend({}, Config.map.wmsParams, {
    'LAYERS': Map.visibleLayers().join(','),
    'OPACITIES': Map.layerOpacities()
  });
  if (Map.backgroundTopic) {
    // use transparent layer with background
    wmsParams['TRANSPARENT'] = true;
  }
  var wmsOptions = {
    url: Map.topics[Map.topic].wms_url,
    params: wmsParams,
    extent: Config.map.extent,
    serverType: Config.map.wmsServerType,
    dpi: Config.map.dpi
  };
  Map.topicLayer = null;
  if (Map.useTiledWMS) {
    Map.topicLayer = new ol.layer.Tile({
      source: new ol.source.TileWMS(wmsOptions)
    });
  }
  else {
    wmsOptions['ratio'] = 1;
    Map.topicLayer = new ol.layer.Image({
      source: new ol.source.ImageWMS(wmsOptions)
    });
  }
  Map.topicLayer.name = 'topic';

  Map.map.addLayer(Map.topicLayer);
};

Map.setBackgroundLayer = function() {
  var wmsParams = $.extend({}, Config.map.wmsParams, {
    'LAYERS': Map.backgroundLayers
  });
  var wmsOptions = {
    url: Map.topics[Map.backgroundTopic].wms_url,
    params: wmsParams,
    extent: Config.map.extent,
    serverType: Config.map.wmsServerType,
    dpi: Config.map.dpi
  };
  Map.backgroundLayer = null;
  if (Config.map.useTiledBackgroundWMS) {
    Map.backgroundLayer = new ol.layer.Tile({
      source: new ol.source.TileWMS(wmsOptions)
    });
  }
  else {
    Map.backgroundLayer = new ol.layer.Image({
      source: new ol.source.ImageWMS(wmsOptions)
    });
  }
  Map.backgroundLayer.name = 'background';

  // add background as base layer
  Map.map.getLayers().insertAt(0, Map.backgroundLayer);
};

Map.toggleBackgroundLayer = function(visible) {
  if (Map.backgroundLayer != null) {
    Map.backgroundLayer.setVisible(visible);
  }
};

Map.clearOverlayLayers = function() {
  for (var layer in Map.overlayLayers) {
    // remove overlay layer
    Map.map.removeLayer(layer);
  }
  Map.overlayLayers = {};
};

Map.addOverlayLayer = function(overlayTopic, overlayLayers) {
  var wmsParams = $.extend({}, Config.map.wmsParams, {
    'LAYERS': overlayLayers.join(','),
    'TRANSPARENT': true
  });
  var wmsOptions = {
    url: Map.topics[overlayTopic].wms_url,
    params: wmsParams,
    extent: Config.map.extent,
    serverType: Config.map.wmsServerType,
    dpi: Config.map.dpi
  };
  var overlayLayer = null;
  if (Config.map.useTiledOverlayWMS) {
    overlayLayer = new ol.layer.Tile({
      source: new ol.source.TileWMS(wmsOptions)
    });
  }
  else {
    overlayLayer = new ol.layer.Image({
      source: new ol.source.ImageWMS(wmsOptions)
    });
  }
  overlayLayer.name = 'overlay_' + overlayTopic;

  if (Map.overlayLayers[overlayTopic] != undefined) {
    // remove any existing layer for this overlay topic
    Map.map.removeLayer(Map.overlayLayers[overlayTopic]);
  }
  Map.overlayLayers[overlayTopic] = overlayLayer;
  Map.map.addLayer(overlayLayer);
};

Map.toggleOverlayLayer = function(overlayTopic, visible) {
  if (Map.overlayLayers[overlayTopic] != undefined) {
    Map.overlayLayers[overlayTopic].setVisible(visible);
  }
};

Map.setSelectionLayer = function(layer) {
  if (Map.selectionLayer != null) {
    // remove selection layer
    Map.map.removeLayer(Map.selectionLayer);
    Map.selectionLayer = null;
  }

  if (layer != null) {
    // add new selection layer on top
    Map.selectionLayer = layer;
    Map.map.addLayer(Map.selectionLayer);
  }
};

Map.toggleSelectionLayer = function(visible) {
  if (Map.selectionLayer != null) {
    Map.selectionLayer.setVisible(visible);
  }
};

Map.setRedliningLayer = function(layer) {
  if (Map.redliningLayer != null) {
    // remove redlining layer
    Map.map.removeLayer(Map.redliningLayer);
    Map.redliningLayer = null;
  }

  if (layer != null) {
    // add new redlining layer on top
    Map.redliningLayer = layer;
    Map.map.addLayer(Map.redliningLayer);
  }
};

Map.toggleRedliningLayer = function(visible) {
  if (Map.redliningLayer != null) {
    Map.redliningLayer.setVisible(visible);
  }
};

Map.setHighlightLayer = function(layer) {
  if (Map.highlightLayer != null) {
    // remove highlight layer
    Map.map.removeLayer(Map.highlightLayer);
    Map.highlightLayer = null;
  }

  if (layer != null) {
    // add new highlight layer on top
    Map.highlightLayer = layer;
    Map.map.addLayer(Map.highlightLayer);
  }
};

Map.setLayerVisible = function(layername, visible, updateMap) {
  Map.layers[layername].visible = visible;
  if (updateMap) {
    Map.mergeWmsParams({
      'LAYERS': Map.visibleLayers().join(',')
    });
  }

  WOBMap.setAttributions();
};

Map.visibleLayers = function() {
  // collect visible layers
  var visibleLayers = [];
  for (var key in Map.layers) {
    if (Map.layers[key].visible) {
      visibleLayers.push(key);
    }
  }
  return visibleLayers;
};

Map.featureInfoLayers = function() {
  // collect visible layers for current scale
  var featureInfoLayers = [];
  var currentRes = Map.map.getView().getResolution();
  for (var key in Map.layers) {
    var layer = Map.layers[key];
    if (layer.visible) {
      var visible = true;

      // check if layer is in scale range
      if (layer.minscale != undefined) {
        visible = (currentRes >= Map.scaleDenomToResolution(layer.minscale, false));
      }
      if (visible && layer.maxscale != undefined) {
        visible = (currentRes <= Map.scaleDenomToResolution(layer.maxscale, false));
      }

      if (visible) {
        featureInfoLayers.push(key);
      }
    }
  }
  return featureInfoLayers;
};

// coordinate: [x, y]
Map.getGetFeatureInfoUrl = function(coordinate, params) {
  var view = Map.map.getView();
  return Map.topicLayer.getSource().getGetFeatureInfoUrl(
    coordinate,
    view.getResolution(),
    view.getProjection(),
    params
  );
};

// transparency between 0 and 100
Map.setLayerTransparency = function(layername, transparency, updateMap) {
  Map.layers[layername].transparency = transparency;
  if (updateMap) {
    Map.mergeWmsParams({
      'OPACITIES': Map.layerOpacities()
    });
  }
};

Map.layerOpacities = function() {
  var layerOpacities = [];
  var opacitiesActive = false;
  for (var key in Map.layers) {
    if (Map.layers[key].visible) {
      // scale transparency[0..100] to opacity[255..0]
      var opacity = Math.round((100 - Map.layers[key].transparency) / 100 * 255);
      layerOpacities.push(opacity);
      opacitiesActive = opacitiesActive || (opacity != 255);
    }
  }
  if (opacitiesActive) {
    return layerOpacities.join(',');
  }
  else {
    // remove OPACITIES param
    return null;
  }
};

Map.refresh = function() {
  var visibleLayers = Map.visibleLayers();
  if (visibleLayers.length > 0) {
    Map.mergeWmsParams({
      'LAYERS': visibleLayers.join(','),
      'OPACITIES': Map.layerOpacities()
    });
  }
  // hide map layer if there are no visible layers
  Map.topicLayer.setVisible(visibleLayers.length > 0);
};

// force redraw
Map.redraw = function() {
  Map.mergeWmsParams({t: new Date().getTime()});
};

Map.mergeWmsParams = function(params) {
  var source = Map.topicLayer.getSource();
  var newParams = $.extend({}, source.getParams(), params);
  source.updateParams(newParams);
};

// set map rotation in rad
Map.setRotation = function(rotation) {
  Map.map.getView().setRotation(rotation);
};

// get resolution for a scale
// set closest to get closest view resolution
Map.scaleDenomToResolution = function(scaleDenom, closest) {
  // resolution = scaleDenom / (metersPerUnit * dotsPerMeter)
  var res = scaleDenom / (Map.map.getView().getProjection().getMetersPerUnit() * (Config.map.dpi / 0.0254));
  if (closest) {
    return Map.map.getView().constrainResolution(res);
  }
  else {
    return res;
  }
};

// set max zoom of map
Map.setMinScaleDenom = function(scaleDenom) {
  Map.minResolution = Map.scaleDenomToResolution(scaleDenom, true);
  Map.clampToScale(scaleDenom);
};

// adjust max zoom
Map.clampToScale = function(scaleDenom) {
  var minRes = Map.scaleDenomToResolution(scaleDenom, true);
  if (Map.map.getView().getResolution() < minRes) {
    Map.map.getView().setResolution(minRes);
  }
};

// zoom to extent and clamp to max zoom level
// extent as [<minx>, <miny>, <maxx>, maxy>]
Map.zoomToExtent = function(extent, minScaleDenom) {
  Map.map.getView().fit(extent, Map.map.getSize());
  if (minScaleDenom != null) {
    Map.clampToScale(minScaleDenom);
  }
};

// center map
// center as [<x>, <y>]
Map.setCenter = function(center) {
  Map.map.getView().setCenter(center);
};

// zoom to scale
Map.setScale = function(scaleDenom) {
  var res = Map.scaleDenomToResolution(scaleDenom, true);
  Map.map.getView().setResolution(res);
};

// zoom to zoom level
Map.setZoom = function(zoom) {
  Map.map.getView().setZoom(zoom);
};

Map.toggleTracking = function(enabled) {
  if (Map.geolocation == null) {
    // create geolocation
    Map.geolocation = new ol.Geolocation({
      trackingOptions: {
        enableHighAccuracy: true
      }
    });
    Map.geolocation.setProjection(Map.map.getView().getProjection());

    Map.geolocation.on('error', function(error) {
      if (error.code == error.PERMISSION_DENIED) {
        alert(I18n.geolocation.permissionDeniedMessage);
      }
    });

    // add geolocation marker
    var marker = new ol.Overlay({
      element: ($('<div id="locationMarker"></div>')),
      positioning: 'center-center'
    });
    Map.map.addOverlay(marker);
    Map.geolocation.on('change:position', function() {
      marker.setPosition(Map.geolocation.getPosition());
    });
  }

  Map.geolocation.setTracking(enabled);
  $('#locationMarker').toggle(enabled);

  if (enabled) {
    // always jump to first geolocation
    Map.geolocation.on('change:position', Map.initialCenterOnLocation);
  }
};

Map.toggleFollowing = function(enabled) {
  if (Map.geolocation != null) {
    if (enabled) {
      Map.geolocation.on('change:position', Map.centerOnLocation);
    }
    else {
      Map.geolocation.un('change:position', Map.centerOnLocation);
    }
  }
};

Map.initialCenterOnLocation = function() {
  Map.centerOnLocation();
  if (Config.map.initialGeolocationMaxScale != null) {
    var maxRes = Map.scaleDenomToResolution(Config.map.initialGeolocationMaxScale, true);
    if (Map.map.getView().getResolution() > maxRes) {
      Map.map.getView().setResolution(maxRes);
    }
  }
  // disable after first update
  Map.geolocation.un('change:position', Map.initialCenterOnLocation);
};

Map.centerOnLocation = function() {
  Map.map.getView().setCenter(Map.geolocation.getPosition());
  Map.clampToScale(Config.map.minScaleDenom.geolocation);
};

Map.setWindowOrientation = function(orientation) {
  Map.windowOrientation = orientation;
  if (Map.deviceOrientation != null && Map.deviceOrientation.getTracking() && Map.deviceOrientation.getHeading() != undefined) {
    Map.setRotation(Map.adjustedHeading(-Map.deviceOrientation.getHeading()));
  }
};

Map.adjustedHeading = function(heading) {
  if (Map.windowOrientation != undefined) {
    // include window orientation (0, 90, -90 or 180)
    heading -= Map.windowOrientation * Math.PI / 180.0;
  }
  return heading;
};

Map.toggleOrientation = function(enabled) {
  if (Map.deviceOrientation == null) {
    Map.deviceOrientation = new ol.DeviceOrientation();

    Map.deviceOrientation.on('change:heading', function(event) {
      var heading = Map.adjustedHeading(-event.target.getHeading());
      if (Math.abs(Map.map.getView().getRotation() - heading) > 0.0175) {
        Map.setRotation(heading);
      }
    });
  }

  Map.deviceOrientation.setTracking(enabled);
};

Map.toggleClickMarker = function(enabled) {
  if (Map.clickMarker == null) {
    Map.clickMarker = new ol.Overlay({
      element: ($('<div id="clickMarker"></div>')),
      positioning: 'center-center'
    });
    Map.map.addOverlay(Map.clickMarker);
  }
  Map.clickMarker.setPosition(enabled ? Map.lastClickPos : undefined);
};

Map.toggleScalebar = function(enabled) {
  if (Map.scaleLine == null) {
    Map.scaleLine = new ol.control.ScaleLine({
      units: 'metric',
    });
  }
  if (enabled && Map.scaleLine.getMap() == null) {
    Map.map.addControl(Map.scaleLine);
  }
  else {
    Map.map.removeControl(Map.scaleLine);
  }
};

// do not forward click events to click handlers if disabled
Map.toggleClickHandling = function(enabled) {
  Map.ignoreClick = !enabled;
};

// register a MapClickHandler under a name
Map.registerClickHandler = function(name, handler) {
  Map.singleClickHandlers[name] = handler;
};

// unregister a MapClickHandler by name
Map.unregisterClickHandler = function(name) {
  if (Map.singleClickHandlers[name]) {
    Map.singleClickHandlers[name].toggle(false);
    delete Map.singleClickHandlers[name];
  }
};

// activate a MapClickHandler by name (null to deactivate all)
Map.activateClickHandler = function(name) {
  // deactivate other handlers
  for (var key in Map.singleClickHandlers) {
    var handler = Map.singleClickHandlers[key];
    handler.toggle(false);
  }

  // activate requested handler
  if (name != null && Map.singleClickHandlers[name]) {
    Map.singleClickHandlers[name].toggle(true);
  }
};

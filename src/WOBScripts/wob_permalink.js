/**
 * Erzeugt einen Permalink mit optionaler Positionsmarkierung
 */

var WOBPermalink = {};

// Funktion aktiv
WOBPermalink.active = false;

// Positionsmarkierung
WOBPermalink.marker = null;

// Letzte Klickposition
WOBPermalink.lastClickPos = null;

// Funktion aktiviert
WOBPermalink.enable = false;

// Parameter des Permalinks
WOBPermalink.data = {};

// Permalink / URL
WOBPermalink.permalink = "";

/**
 * Klick-Handler zum Setzten der Positionsmarkierung
 */
function WOBPermalinkClickHandler() {}

WOBPermalinkClickHandler.prototype = new MapClickHandler();

/**
 * Setzt die Positionsmarkierung
 */
WOBPermalinkClickHandler.prototype.handleEvent = function(e) {
  if(WOBPermalink.enable) {
    WOBPermalink.lastClickPos = Map.lastClickPos;
    WOBPermalink.toggleMarker(true);
  }
};

/**
 * Den Klick-Handler initialisieren
 */
WOBPermalink.initClickHandler = function () {
  var handler = new WOBPermalinkClickHandler();
  Map.registerClickHandler("wobPermalinkClickHandler", handler);
};

/**
 * Den Klick-Handler aktivieren
 */
WOBPermalink.activate = function() {
  WOBMap.saveActiveClickHandler();
  Map.activateClickHandler("wobPermalinkClickHandler");
  if(WOBPermalink.enable) {
    WOBPermalink.initMarkerPosition();
  }
  WOBPermalink.active = true;
};

/**
 * Den Klick-Handler deaktivieren
 */
WOBPermalink.deactivate = function() {
  WOBPermalink.toggleMarker(false);
  WOBMap.restoreSavedClickHandler();
  WOBPermalink.active = false;

  WOBPermalink.lastClickPos = null;
};

/**
 * Die Positionsmarkierung aktivieren/deaktivieren
 */
WOBPermalink.toggleMarker = function(enabled) {
  if(WOBPermalink.marker) {
    WOBPermalink.initMarkerPosition();
    WOBPermalink.setMarkerPosition(enabled ? WOBPermalink.lastClickPos : undefined);
  }
};

/**
 * Die Positionsmarkierung erzeugen
 */
WOBPermalink.initMarker = function() {
  if (WOBPermalink.marker == null) {
    WOBPermalink.marker = new ol.Overlay({
      element: ($('<div id="sharePositionMarker"></div>')),
      positioning: 'center-center',
      stopEvent: false
    });
    Map.map.addOverlay(WOBPermalink.marker);
  }
};

/**
 * Die Positionsmarkierung auf den Kartenmittelpunkt setzten oder
 * wenn vorhanden auf eine vorherige Position
 */
WOBPermalink.initMarkerPosition = function(position) {
  if(WOBPermalink.lastClickPos) {
    WOBPermalink.setMarkerPosition(WOBPermalink.lastClickPos);
  } else {
    WOBPermalink.setMarkerPosition(Map.map.getView().getCenter());
  }
};

/**
 * Die Positionsmarkierung auf die angegebene Position verschieben
 * und den Permalink aktualisieren
 */
WOBPermalink.setMarkerPosition = function(position) {
  WOBPermalink.initMarker();

  if(position) {
    WOBPermalink.lastClickPos = position;
  }

  WOBPermalink.marker.setPosition(position);

  if(position) {
    WOBPermalink.updatePermalinkMarkerPosition();
  }
};

/**
 * Gibt die aktuelle Position der Positionsmarkierung zurück
 */
WOBPermalink.getMarkerPosition = function() {
  if(WOBPermalink.marker != null) {
    return WOBPermalink.marker.getPosition();
  } else {
    return undefined;
  }
};

/**
 * Die Positionsmarkierung aktivieren
 */
WOBPermalink.enableMarker = function() {
  WOBPermalink.enable = true;
  WOBPermalink.toggleMarker(true);
};

/**
 * Die Positionsmarkierung deaktivieren
 */
WOBPermalink.disableMarker = function() {
  WOBPermalink.enable = false;
  WOBPermalink.toggleMarker(false);
};

/**
 * Generiert die URL-Parameter des Permalinks
 */
WOBPermalink.generatePermalinkData = function() {
  var activeLayers = [];
  var inactiveLayers = [];
  var opacities = {};

  for(layer in Map.layers) {
    if (Map.layers[layer].visible) {
      activeLayers.push(layer);
    } else {
      inactiveLayers.push(layer);
    }
    opacities[layer] = Math.round(255 - (Map.layers[layer].transparency / 100 * 255));
  }

  var extent = Map.map.getView().calculateExtent(Map.map.getSize());

  WOBPermalink.data.topic = Map.topic;
  WOBPermalink.data.extent = extent.join(',');
  WOBPermalink.data.activeLayers = activeLayers.join(',');
  WOBPermalink.data.inactiveLayers = inactiveLayers.join(',');
  WOBPermalink.data.opacities = JSON.stringify(opacities);

  var markerPosition = WOBPermalink.getMarkerPosition();
  if(WOBPermalink.enable && markerPosition) {
    WOBPermalink.data.markerPosition = markerPosition[0] + ',' + markerPosition[1];
  }

  WOBPermalink.data.servername = location.href.split('?')[0];
};

/**
 * Erstellt einen Permalink der aktuellen Kartendarstellung/-einstellungen
 */
WOBPermalink.createPermalink = function(refreshAllData) {
  if (refreshAllData === undefined) {
    refreshAllData = true;
  }

  if(refreshAllData) {
    WOBPermalink.generatePermalinkData();
  }

  var permalink = "";
  permalink += "?topic=" + encodeURIComponent(WOBPermalink.data.topic);
  permalink += "&extent=" + encodeURIComponent(WOBPermalink.data.extent);
  //permalink += "&activeLayers=" + encodeURIComponent(WOBPermalink.data.activeLayers);
  //permalink += "&inactiveLayers=" + encodeURIComponent(WOBPermalink.data.inactiveLayers);
  //permalink += "&opacities=" + encodeURIComponent(WOBPermalink.data.opacities);

  if(WOBPermalink.enable && WOBPermalink.data.markerPosition) {
    permalink += "&markerPosition=" + encodeURIComponent(WOBPermalink.data.markerPosition);
  }

  WOBPermalink.permalink = "" + WOBPermalink.data.servername + permalink;
};

/**
 * Gibt den Permalink zurück und aktualisert wenn gewünscht alle Parameter
 */
WOBPermalink.getPermalink = function(refreshAllData) {
  WOBPermalink.createPermalink(refreshAllData);
  return WOBPermalink.permalink;
};

/**
 * Aktualisiert die Position der Positionsmarkierung im Permalink
 */
WOBPermalink.updatePermalinkMarkerPosition = function() {
  if(WOBPermalink.enable) {
    var markerPosition = WOBPermalink.getMarkerPosition();
    WOBPermalink.data.markerPosition = markerPosition[0] + ',' + markerPosition[1];
  } else {
    WOBPermalink.data.markerPosition = undefined;
  }
  WOBGui.updatePermalink(false);
};

/**
 * Aktualisiert den Kartenausschnitt (Extend) im Permalink
 */
WOBPermalink.updatePermalinkExtent = function() {
  var extent = Map.map.getView().calculateExtent(Map.map.getSize());
  WOBPermalink.data.extent = extent.join(',');
  WOBGui.updatePermalink(false);
};
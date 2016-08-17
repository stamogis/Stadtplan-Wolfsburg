/**
 * Umkreissuche
 */

var WOBUmkreissuche = {};

// Ist die Umkreissuche aktiviert?
WOBUmkreissuche.activated = false;

// Layer der Umkreissuche
WOBUmkreissuche.layer = null;

// Letzte Klick-Position in der Krte
WOBUmkreissuche.lastClickPos = null;

// Der aktuelle Radius der Umkreissuche
WOBUmkreissuche.currentRadius = null;

// Der aktuelle Mittelpunkt der Umkreissuche
WOBUmkreissuche.currentCenter = null;

// Die Interaction zum Verschieben der Umkreissuche
WOBUmkreissuche.dargInteraction = null;

// Wurde die Umkreissuche verändert?
WOBUmkreissuche.changed = false;

/**
 * Klick-Handler der Umkreissuche
 */
function WOBUmkreissucheClickHandler() {}

WOBUmkreissucheClickHandler.prototype = new MapClickHandler();

/**
 * Setzt die Position der Umkreissuche bei der letzten Klickkoordinate
 */
WOBUmkreissucheClickHandler.prototype.handleEvent = function(e) {
  WOBUmkreissuche.setPosition();
};

/**
 * Initialisiert den Klick-Handler
 */
WOBUmkreissuche.initClickHandler = function () {
  var handler = new WOBUmkreissucheClickHandler();
  Map.registerClickHandler("wobUmkreissucheHandler", handler);
};

/**
 * Aktiviert den Klick-Handler
 */
WOBUmkreissuche.activateHandler = function (){
  Map.toggleClickHandling(true);
  WOBMap.saveActiveClickHandler();
  Map.activateClickHandler("wobUmkreissucheHandler");

  WOBUmkreissuche.activateDragInteraction();
};

/**
 * Deaktiviert den Klick-Handler
 */
WOBUmkreissuche.deactivateHandler = function() {
  WOBUmkreissuche.deactivateDragInteraction();
  if(Map.singleClickHandlers["wobUmkreissucheHandler"].isActive()) {
    WOBMap.restoreSavedClickHandler();
    Map.toggleClickMarker(false);
  }

};

/**
 * Aktiviert die Interaction zum Verschieben der Umkreissuche
 */
WOBUmkreissuche.activateDragInteraction = function (){
  if (WOBUmkreissuche.layer != null) {

    WOBUmkreissuche.dragInteraction = new WOBDragInteraction.Drag({
      features: new ol.Collection([WOBUmkreissuche.layer.getSource().getFeatures()[0], WOBUmkreissuche.layer.getSource().getFeatures()[1]])
    });

    WOBUmkreissuche.dragInteraction.on('dragend',  WOBSearch.umkreissucheChanged);

    // Die Interaction nach der Interaction zum Verschieben der Karte hinzufügen
    var dragPanIndex = 0;
    Map.map.getInteractions().forEach(function(interaction, index) {
      if (interaction instanceof ol.interaction.DragPan) {
        dragPanIndex = index;
      }
    });
    Map.map.getInteractions().insertAt(dragPanIndex + 1, WOBUmkreissuche.dragInteraction);
  }
};

/**
 * Deaktiviert die Interaction zum Verschieben der Umkreissuche
 */
WOBUmkreissuche.deactivateDragInteraction = function (){
  if(WOBUmkreissuche.dragInteraction != null) {
    WOBUmkreissuche.dragInteraction.un('dragend',  WOBSearch.umkreissucheChanged);

    Map.map.removeInteraction(WOBUmkreissuche.dragInteraction);
  }
};

/**
 * Aktiviert die Umkreissuche
 */
WOBUmkreissuche.activate = function (){
  // Erzeugt den Layer der Umkreissuche
  if (WOBUmkreissuche.layer == null) {
    WOBUmkreissuche.layer = new ol.layer.Vector({
      source: new ol.source.Vector({
          features: []
      }),
      projection: "EPSG:25832",
      visible: true
    });

    Map.map.addLayer(WOBUmkreissuche.layer);
    WOBUmkreissuche.createGeometry(WOBUmkreissuche.currentCenter, WOBUmkreissuche.currentRadius);
  }

  WOBUmkreissuche.activated = true;
  WOBUmkreissuche.show();
  WOBUmkreissuche.activateHandler();

  WOBSearch.umkreissucheChanged();
};

/**
 * Deaktiviert die Umkreissuche
 */
WOBUmkreissuche.deactivate = function () {
    WOBUmkreissuche.activated = false;
    WOBUmkreissuche.hide();
    WOBUmkreissuche.deactivateHandler();
};

/**
 * Aktiviert den Layer der Umkreissuche
 */
WOBUmkreissuche.show = function () {
  if (WOBUmkreissuche.layer != null && WOBUmkreissuche.activated) {
    WOBUmkreissuche.layer.setVisible(true);
  }
};

/**
 * Deaktiviert den Layer der Umkreissuche
 */
WOBUmkreissuche.hide = function () {
  if (WOBUmkreissuche.layer != null) {
    WOBUmkreissuche.layer.setVisible(false);
  }
};

/**
 * Setzt die Umkreissuche auf die letzte Klickposition
 */
WOBUmkreissuche.setPosition = function() {
  WOBUmkreissuche.createGeometry(Map.lastClickPos, WOBUmkreissuche.currentRadius);
};

/**
 * Erzeugt die Geometrie der Umkreissuche
 */
WOBUmkreissuche.createGeometry = function(center, radius) {
  // Wurde die Umkreissuche verändert?
  if(WOBUmkreissuche.currentCenter == center && WOBUmkreissuche.currentRadius == radius){
    WOBUmkreissuche.changed = false;
  } else {
    WOBUmkreissuche.changed = true;
  }

  // Ist keine Klickposition vorhanden, wird der Mittelpunkt der Karte verwendet.
  if(center == null) {
    WOBUmkreissuche.currentCenter = Map.map.getView().getCenter();
  } else {
    WOBUmkreissuche.currentCenter = center;
  }

  // Ist kein Radius vorhanden, wird der Standartradius verwendet.
  if(radius == null) {
    WOBUmkreissuche.currentRadius = WOBConfig.umkreissuche.startRadius;
  } else {
    WOBUmkreissuche.currentRadius = radius;
  }

  // Wenn noch nicht vorhanden, wird eine Geometrie/Feature des Umkreises erzeugt
  if (WOBUmkreissuche.layer != null && WOBUmkreissuche.layer.getSource().getFeatures().length == 0) {
    centerGeometry = new ol.Feature();
    circleGeometry = new ol.Feature();

    // Mittelpunkt
    centerGeometry.setGeometryName('centerGeometry');
    centerGeometry.setGeometry(new ol.geom.Circle(WOBUmkreissuche.currentCenter, 3));

    // Äußerer Kreis
    circleGeometry.setGeometryName('circleGeometry');
    circleGeometry.setGeometry(new ol.geom.Circle(WOBUmkreissuche.currentCenter, WOBUmkreissuche.currentRadius));

    centerGeometry.setStyle(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 1)'
       }),
      stroke: new ol.style.Stroke({
        width: 3,
        color: 'rgba(255, 0, 0, 1)'
      })
    }));

    circleGeometry.setStyle(new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.1)'
      }),
      stroke: new ol.style.Stroke({
        width: 3,
        color: 'rgba(255, 0, 0, 1)'
      })
    }));

    WOBUmkreissuche.layer.getSource().clear();
    WOBUmkreissuche.layer.getSource().addFeatures([centerGeometry, circleGeometry]);
  } else {
    if(!WOBUmkreissuche.isEmpty()) {
      WOBUmkreissuche.getCenterGeometry().setCenter(WOBUmkreissuche.currentCenter);
      WOBUmkreissuche.getCircleGeometry().setCenterAndRadius(WOBUmkreissuche.currentCenter, WOBUmkreissuche.currentRadius);
    }
  }

  if(WOBUmkreissuche.changed) {
    WOBSearch.umkreissucheChanged();
  }
};

/**
 * Gibt die Geometrie des Mittelpunktes zurück
 */
WOBUmkreissuche.getCenterGeometry = function (){
  if(WOBUmkreissuche.layer.getSource().getFeatures()[0].getGeometryName() == 'centerGeometry') {
    return WOBUmkreissuche.layer.getSource().getFeatures()[0].getGeometry();
  } else {
    return WOBUmkreissuche.layer.getSource().getFeatures()[1].getGeometry();
  }
};

/**
 * Gibt die Geometrie des äußeren Kreises zurück
 */
WOBUmkreissuche.getCircleGeometry = function (){
  if(WOBUmkreissuche.layer.getSource().getFeatures()[0].getGeometryName() == 'circleGeometry') {
    return WOBUmkreissuche.layer.getSource().getFeatures()[0].getGeometry();
  } else {
    return WOBUmkreissuche.layer.getSource().getFeatures()[1].getGeometry();
  }
};

/**
 * Ist die Umkreissuche leer?
 */
WOBUmkreissuche.isEmpty = function (){
  if(WOBUmkreissuche.layer == null) {
    return true;
  } else if(WOBUmkreissuche.layer.getSource().getFeatures().length == 0) {
    return true;
  } else if(WOBUmkreissuche.getCenterGeometry() == null) {
    return true;
  } else if(WOBUmkreissuche.getCircleGeometry() == null) {
    return true;
  } else {
    return false;
  }
};

/**
 * Aktualisiert den Radius der Umkreissuche
 */
WOBUmkreissuche.updateRadius = function(radius){
  if(!WOBUmkreissuche.isEmpty()) {
    if(!isNaN(parseInt(radius))){
      WOBUmkreissuche.currentRadius = parseInt(radius);
      WOBUmkreissuche.getCircleGeometry().setRadius(WOBUmkreissuche.currentRadius);
    }
  }
};

/**
 * Wurde die Umkreissuche aktiviert?
 */
WOBUmkreissuche.isActivated = function () {
  return WOBUmkreissuche.activated;
};

/**
 * Setzt die Umkreissuche zurück
 */
WOBUmkreissuche.clear = function () {
  WOBUmkreissuche.deactivate();

  WOBUmkreissuche.currentCenter = null;
  WOBUmkreissuche.currentRadius = null;

  if (WOBUmkreissuche.layer != null) {
    WOBUmkreissuche.layer.getSource().clear();

    Map.map.removeLayer(WOBUmkreissuche.layer);

    WOBUmkreissuche.layer = null;
  }

  if(WOBUmkreissuche.dragInteraction != null) {
    WOBUmkreissuche.dragInteraction.resetCursor();
  }
};
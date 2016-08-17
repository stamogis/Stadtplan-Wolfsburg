/**
 * Funktion zum Messen von Strecken und Flächen
 */

var WOBMeasure = {};

// Source
WOBMeasure.measureSource = null;

// Vektor
WOBMeasure.measureVector = null;

// Skizze
WOBMeasure.measureSketch = null;

// ChangeListener der geometrie
WOBMeasure.measureGeometryChangeListener = null;

// Interaction zum Zeichnen
WOBMeasure.drawInteraction = null;

// Array aller Tooltips
WOBMeasure.tooltips = null;

// Tooltip (z.B. das Messergebnis)
WOBMeasure.measureTooltip = null;

// Tooltip-Element
WOBMeasure.measureTooltipElement = null;

// Messart
WOBMeasure.measureType = 'length';

/**
 * Das Messen initialisieren
 */
WOBMeasure.init = function() {

  // Source anlegen
  WOBMeasure.measureSource = new ol.source.Vector();

  // Vektor anlegen
  WOBMeasure.measureVector = new ol.layer.Vector({
    source: WOBMeasure.measureSource,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.1)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(255, 0, 0, 1)',
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({
          color: '#ffcc33'
        })
      })
    })
  });

  // Interaction zum Zeichnen erzeugen
  WOBMeasure.drawInteraction = new ol.interaction.Draw({
    source: WOBMeasure.measureSource,
    type: (WOBMeasure.measureType),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
         color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });

  WOBMeasure.tooltips = [];

  // Wenn das Messen gestartet wird
  WOBMeasure.drawInteraction.on('drawstart', function(evt) {
    WOBMeasure.measureSketch = evt.feature;

    var tooltipCoord = evt.coordinate;

    // ChangeListener wenn die Geometrie verändert wird
    WOBMeasure.measureGeometryChangeListener = WOBMeasure.measureSketch.getGeometry().on('change', function(evt) {
      WOBMeasure.measureSource.clear();
      WOBMeasure.createMeasureTooltip();

      var geom = evt.target;
      var output;

      if (geom instanceof ol.geom.Polygon) {
        output = WOBMeasure.getArea((geom));
        tooltipCoord = geom.getInteriorPoint().getCoordinates();
      } else if (geom instanceof ol.geom.LineString) {
        output = WOBMeasure.getLength((geom));
        tooltipCoord = geom.getLastCoordinate();
      }

      WOBMeasure.measureTooltipElement.innerHTML = output;
      WOBMeasure.measureTooltip.setPosition(tooltipCoord);
    });
  }, this);

  // Wenn das Messen beendet wird
  WOBMeasure.drawInteraction.on('drawend', function(evt) {
    WOBMeasure.measureTooltipElement.className = 'tooltip tooltip-static';
    WOBMeasure.measureTooltip.setOffset([0, -7]);

    WOBMeasure.measureSketch = null;
    WOBMeasure.measureTooltipElement = null;
    ol.Observable.unByKey(WOBMeasure.measureGeometryChangeListener);
  }, this);
};

/**
 * Tooltip erzeugen
 */
WOBMeasure.createMeasureTooltip = function() {
  if (WOBMeasure.measureTooltipElement) {
    WOBMeasure.measureTooltipElement.parentNode.removeChild(WOBMeasure.measureTooltipElement);
  }

  WOBMeasure.measureTooltipElement = document.createElement('div');
  WOBMeasure.measureTooltipElement.className = 'tooltip tooltip-measure';

  if(!WOBMeasure.measureTooltip) {
    WOBMeasure.measureTooltip = new ol.Overlay({
      element: WOBMeasure.measureTooltipElement,
      offset: [0, -15],
      positioning: 'bottom-center'
    });
    Map.map.addOverlay(WOBMeasure.measureTooltip);
  } else {
    WOBMeasure.measureTooltip.setElement(WOBMeasure.measureTooltipElement);
    WOBMeasure.measureTooltip.setOffset([0, -15]);
    WOBMeasure.measureTooltip.setPositioning('bottom-center');
  }
};

/**
 * Länge der Strecke berechnen
 */
WOBMeasure.getLength = function(line) {
  var length = 0;
  var coordinates = line.getCoordinates();
  var sourceProj = Map.map.getView().getProjection();
  var wgs84Sphere = new ol.Sphere(6378137);

  for (var i = 0; i < coordinates.length - 1; ++i) {
    var c1 = ol.proj.transform(coordinates[i], sourceProj, 'EPSG:4326');
    var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, 'EPSG:4326');
    length += wgs84Sphere.haversineDistance(c1, c2);
  }

  var result;
  if (length > 100) {
    result = (Math.round(length / 1000 * 100) / 100) + ' ' + 'km';
  } else {
    result = (Math.round(length * 100) / 100) + ' ' + 'm';
  }

  return result;
};

/**
 * Flächeninhalt berechnen
 */
WOBMeasure.getArea = function(polygon) {
  var sourceProj = Map.map.getView().getProjection();
  var geom = (polygon.clone().transform(sourceProj, 'EPSG:4326'));
  var coordinates = geom.getLinearRing(0).getCoordinates();
  var wgs84Sphere = new ol.Sphere(6378137);
  var area = Math.abs(wgs84Sphere.geodesicArea(coordinates));

  var result;
  if (area > 10000) {
    result = (Math.round(area / 1000000 * 100) / 100) + ' ' + 'km<sup>2</sup>';
  } else {
    result = (Math.round(area * 100) / 100) + ' ' + 'm<sup>2</sup>';
  }
  return result;
};

/**
 * Das Messen aktivieren
 */
WOBMeasure.activate = function() {
  if(!WOBMeasure.measureVector) {
    WOBMeasure.init();
  }

  Map.map.addLayer(WOBMeasure.measureVector);
  Map.map.addInteraction(WOBMeasure.drawInteraction);

  Map.toggleClickHandling(false);
};

/**
 * Das Messen deaktivieren
 */
WOBMeasure.deactivate = function() {
  WOBMeasure.measureSource.clear();

  Map.map.removeLayer(WOBMeasure.measureVector);
  Map.map.removeInteraction(WOBMeasure.drawInteraction);

  Map.map.removeOverlay(WOBMeasure.measureTooltip);
  Map.map.removeOverlay(WOBMeasure.helpTooltip);

  WOBMeasure.measureTooltipElement = null;
  WOBMeasure.measureTooltip = null;
  ol.Observable.unByKey(WOBMeasure.measureGeometryChangeListener);

  Map.toggleClickHandling(true);
};

/**
 * Die Messart setzen
 */
WOBMeasure.setMeasureType = function(measureType) {
  WOBMeasure.measureType = (measureType== 'area' ? 'Polygon' : 'LineString');
};

/**
 * Die Messart aktualisieren
 */
WOBMeasure.updateMeasureType = function(measureType) {
  WOBMeasure.setMeasureType(measureType);

  WOBMeasure.measureVector = null;
  WOBMeasure.deactivate();
  WOBMeasure.activate();
};
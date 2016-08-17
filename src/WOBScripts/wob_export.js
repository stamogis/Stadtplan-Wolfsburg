/**
 * PDF-Druck
 *
 * Erzeugt aus einem Kartenausschnitt eine PDF-Datei
 */

var WOBExport = {};

// Ist die Exportfunktion aktiviert
WOBExport.activated = false;

// Interaction zum Verschieben des Exportbereichs
WOBExport.dragInteraction = null;

// Layer des Exportbereichs
WOBExport.extentLayer = null;

// Feature/Geometrie des Exportbereichs
WOBExport.extentFeature = null;

// Layoutname
WOBExport.layoutName = null;

// Breite des Layouts
WOBExport.layoutWidth = null;

// Höhe des Layouts
WOBExport.layoutHeight = null;

// DPI-Wert des Exports
WOBExport.dpi = null;

// Maßstab des Exports
WOBExport.scale = null;

/**
 * Die Exportfunktion aktivieren
 */
WOBExport.activate = function() {
  if(WOBProjectSettings.data.composerTemplates != null && WOBProjectSettings.data.composerTemplates.length > 0) {
    WOBExport.initExtent();
    return true;
  } else {
    WOBExport.noLayoutFoundInfo();
    return false;
  }
};

/**
 * Die Exportfunktion zurücksetzen
 */
WOBExport.clear = function() {
  WOBExport.deactivate();

  WOBExport.dragInteraction = null;
  WOBExport.extentLayer = null;
  WOBExport.extentFeature = null;
  WOBExport.layoutName = null;
  WOBExport.layoutWidth = null;
  WOBExport.layoutHeight = null;
  WOBExport.dpi = null;
  WOBExport.scale = null;
};

/**
 * Den Exportbereich erzeugen
 */
WOBExport.initExtent = function() {

  WOBExport.activated = true;

  WOBExport.layoutName = $('#exportLayout').val();
  WOBExport.dpi = WOBConfig.export.initDpiValue;
  WOBExport.scale = $('#exportScale').val();

  // Wurde noch keine Breite/Höhe des Layout ermittelt
  if(WOBExport.layoutWidth == null || WOBExport.layoutHeight == null) {

    // Default-Werte
    WOBExport.layoutWidth = 150 / 1000;
    WOBExport.layoutHeight = 150 / 1000;

    // Wenn vorhanden die Breite/Höhe des Layout aus den ProjectSettings der Themenkarte ermitteln
    if(WOBProjectSettings.data.composerTemplates) {
      var composerTemplates = WOBProjectSettings.data.composerTemplates;
      var composerTemplate;
      var composerMap;

      for (i = 0; i < composerTemplates.length; i++) {
        composerTemplate = composerTemplates[i];
        composerMap = composerTemplate.composerMaps[0];

        if(composerTemplate.name == WOBExport.layoutName) {
          break;
        }
      }

      if(composerMap != null) {
        WOBExport.layoutWidth = composerMap.width / 1000;
        WOBExport.layoutHeight = composerMap.height / 1000;
      }
    }
  }

  // Wenn der Layer des Exportbereichs noch nicht vorhanden ist, wird dieser erzeugt und der Karte hinzugefügt
  if(WOBExport.extentLayer == null) {
    var extentCoordinates = WOBExport.getExtentCoordinates(Map.map.getView().getCenter(), WOBExport.layoutWidth, WOBExport.layoutHeight, WOBExport.scale, Config.map.dpi);
    WOBExport.createExtentLayer(extentCoordinates);
  } else {
    Map.map.addLayer(WOBExport.extentLayer);
  }

  // Interaction zum Verschieben des Exportbereichs
  WOBExport.dragInteraction = new WOBDragInteraction.Drag({
    features: new ol.Collection([WOBExport.extentLayer.getSource().getFeatures()[0]])
  });

  // Die erzeugte Interaction nach der Interaction zum Verschieben der Karte hinzufügen
  var dragPanIndex = 0;
  Map.map.getInteractions().forEach(function(interaction, index) {
    if (interaction instanceof ol.interaction.DragPan) {
      dragPanIndex = index;
    }
  });
  Map.map.getInteractions().insertAt(dragPanIndex + 1, WOBExport.dragInteraction);

  Map.toggleClickHandling(false);
};

/**
 * Koordinaten des Exportbereichs erzeugen
 */
WOBExport.getExtentCoordinates = function(center, layoutWidth, layoutHeight, scale, mapDpi) {
  var meters_per_feet = ol.proj.METERS_PER_UNIT['ft'];
  var meters_per_inch  = meters_per_feet / 12;
  var inches_per_meter  = 1 / meters_per_inch;

  var resolution = 1 / ((1 / scale) * inches_per_meter * mapDpi);

  // In Pixel
  var width = layoutWidth / meters_per_inch * mapDpi;
  var height = layoutHeight / meters_per_inch * mapDpi;

  width = (width * resolution) / 2;
  height = (height * resolution) / 2;

  var extentCoordinates = {
    "left": center[0] - width,
    "bottom": center[1] - height,
    "right": center[0] + width,
    "top": center[1] + height
  };

  return extentCoordinates;
};

/**
 * Layer und Feature des Exportbereichs erstellen
 */
WOBExport.createExtentLayer = function(extentCoordinates) {

  var extentPoints = [
    [extentCoordinates.left, extentCoordinates.bottom],
    [extentCoordinates.right, extentCoordinates.bottom],
    [extentCoordinates.right, extentCoordinates.top],
    [extentCoordinates.left, extentCoordinates.top],
    [extentCoordinates.left, extentCoordinates.bottom]];

  WOBExport.extentFeature = new ol.Feature({
    geometry: new ol.geom.Polygon([extentPoints]),
    name: 'extentFeature'
  });

  WOBExport.extentLayer = new ol.layer.Vector({
    source: new ol.source.Vector({
        features: [WOBExport.extentFeature]
    }),
    projection: "EPSG:25832",
    visible: true,
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 0, 0, 0.1)'
      }),
      stroke: new ol.style.Stroke({
        width: 3,
        color: 'rgba(255, 0, 0, 1)'
      })
    })
  });

  Map.map.addLayer(WOBExport.extentLayer);
};

/**
 * Exportbereich deaktivieren
 */
WOBExport.deactivate = function() {
  if(WOBExport.dragInteraction != null) {
    Map.map.removeInteraction(WOBExport.dragInteraction);
  }

  if(WOBExport.extentLayer != null) {
    Map.map.removeLayer(WOBExport.extentLayer);
  }

  if(WOBExport.activated ) {
    Map.toggleClickHandling(true);
    WOBExport.activated = false;
  }
};

/**
 * Den Exportmaßstab aktualisieren
 */
WOBExport.updateScale = function(scale) {
  WOBExport.scale = scale;

  if(WOBExport.extentLayer != null) {
    WOBExport.updateExtentFeature();
  }
};

/**
 * Das Exportlayout aktualisieren
 */
WOBExport.updateLayout = function(layout) {
  WOBExport.layoutName = $('#exportLayout').val();

  if(WOBExport.extentLayer != null) {
    if(WOBProjectSettings.data.composerTemplates) {
      var composerTemplates = WOBProjectSettings.data.composerTemplates;
      var composerTemplate;
      var composerMap;

      for (i = 0; i < composerTemplates.length; i++) {
        composerTemplate = composerTemplates[i];
        composerMap = composerTemplate.composerMaps[0];

        if(composerTemplate.name == WOBExport.layoutName) {
          break;
        }
      }

      if(composerMap != null) {
        WOBExport.layoutWidth = composerMap.width / 1000;
        WOBExport.layoutHeight = composerMap.height / 1000;

        if(WOBExport.extentLayer != null) {
          WOBExport.updateExtentFeature();
        }
      }
    }
  }
};

/**
 * Das Feature des Exportbereichs aktualisieren
 */
WOBExport.updateExtentFeature = function() {
  var extent = WOBExport.extentLayer.getSource().getFeatures()[0].getGeometry().getExtent();
  var center = ol.extent.getCenter(extent);

  var extentCoordinates = WOBExport.getExtentCoordinates(center, WOBExport.layoutWidth, WOBExport.layoutHeight, WOBExport.scale, Config.map.dpi);

  var extentPoints = [
    [extentCoordinates.left, extentCoordinates.bottom],
    [extentCoordinates.right, extentCoordinates.bottom],
    [extentCoordinates.right, extentCoordinates.top],
    [extentCoordinates.left, extentCoordinates.top],
    [extentCoordinates.left, extentCoordinates.bottom]];

  WOBExport.extentLayer.getSource().getFeatures()[0].setGeometry(new ol.geom.Polygon([extentPoints]));
};

/**
 * Die Druck-URL für den QGIS Server erzeugen und aufrufen (window.open())
 */
WOBExport.export = function() {
  var urlParams = WOBGui.getUrlParams(Map.topicLayer.getSource().getUrl());
  var srs = Config.map.projection.getCode();
  var rotation = 0;
  var layers = encodeURIComponent(WOBMap.getVisibleLayers().join(','));

  var server = urlParams.server;
  var uri = server + "?map=" + urlParams.map + "&";
  var url = uri + 'SERVICE=WMS&VERSION=1.3&REQUEST=GetPrint&FORMAT=pdf&EXCEPTIONS=application/vnd.ogc.se_inimage&TRANSPARENT=true';

  var extent = WOBExport.extentLayer.getSource().getFeatures()[0].getGeometry().getExtent().join(',');

  url = url + '&SRS=' + srs;
  url = url + '&DPI=' + WOBExport.dpi;
  url = url + '&TEMPLATE=' + WOBExport.layoutName;
  url = url + '&map0:extent=' + extent;
  url = url + '&map0:rotation=' + rotation;
  url = url + '&map0:scale=' + WOBExport.scale;

  if(WOBConfig.export.exportGridInterval) {
    var gridInterval = WOBExport.getGridInterval(WOBExport.scale);
    url = url + '&map0:grid_interval_x=' + gridInterval;
    url = url + '&map0:grid_interval_y=' + gridInterval;
  }

  url = url + '&LAYERS=' + layers;

  if(WOBConfig.export.exportOpacities) {
    var layersOpacities = encodeURIComponent(WOBMap.getVisibleLayersOpacities().join(','));
    url = url + '&OPACITIES=' + layersOpacities;
  }

  if(!WOBConfig.export.showResult) {
    url = url + '&FILE_NAME=' + WOBExport.layoutName + '.pdf';
  }

  window.open(url);
};

/**
 * Intervall des Koordinatengitters erzeugen
 */
WOBExport.getGridInterval = function(scale) {
  var grid_interval = 10;

  if (scale > 100 && scale <= 250) {
    grid_interval = 25;
  } else if (scale > 250 && scale <= 1000) {
    grid_interval = 50;
  } else if (scale > 1000 && scale <= 2500) {
    grid_interval = 100;
  } else if (scale > 2500 && scale <= 5000) {
    grid_interval = 250;
  } else if (scale > 5000 && scale <= 12000) {
    grid_interval = 500;
  } else if (scale > 12000 && scale <= 25000) {
    grid_interval = 1000;
  } else if (scale > 25000 && scale <= 50000) {
    grid_interval = 2000;
  } else if (scale > 50000 && scale <= 100000) {
    grid_interval = 5000;
  } else if (scale > 100000 && scale <= 500000) {
    grid_interval = 10000;
  } else if (scale > 500000 && scale <= 1000000) {
    grid_interval = 50000;
  } else if (scale > 1000000 && scale <= 5000000) {
    grid_interval = 100000;
  } else if (scale > 5000000 && scale <= 10000000) {
    grid_interval = 250000;
  } else if (scale > 10000000 && scale <= 50000000) {
    grid_interval = 2500000;
  } else if (scale > 50000000 && scale <= 100000000) {
    grid_interval = 5000000;
  } else if (scale > 100000000) {
    grid_interval = 10000000;
  }

  return grid_interval;
};

/**
 * Popup-Meldung, mit der Info, dass kein Exportlayout gefunden wurde.
 */
WOBExport.noLayoutFoundInfo = function() {
  $('#popupContent').empty();
  $('#popupContent').append(WOBTranslation.panelExport.noExportLayoutFound[WOBGui.currentLanguage]);

  $('#popup').popup(); // initialisieren
  $('#popup').popup('open', {history: false, positionTo: "window"});
};
/**
 * Stadt- und Ortsteilsuche
 */

var WOBSearchByArea = {};

// Die Liste der Stadt- und Ortsteile neu erzeugen
WOBSearchByArea.rebuildAreas = true;

// Wird die Stadt- und Ortsteilsuche verwendet?
WOBSearchByArea.isUsed = false;

// Layer des ausgewählten Stadt- oder Ortsteils
WOBSearchByArea.layer = null;

/**
 * Erzeugt die Liste der auswählbaren Stadt- und Ortsteile
 */
WOBSearchByArea.createAreas = function() {
  var html = "";
  var i = 1;

  html = html + '<form>';
  html = html + '  <fieldset id="searchAreaControlgroup" data-role="controlgroup">';

  // Gesamtes Gebiet
  html = html + '    <input name="searchArea" id="searchArea-' + i + '" value="' + WOBConfig.search.fullAreaName + '" checked="checked" type="radio">';
  html = html + '    <label for="searchArea-' + i + '">' + WOBConfig.search.fullAreaName + '</label>';

  i = i + 1;

  // Stadt- und Ortsteile
  for (var area in WOBConfig.search.areaNames) {
      html = html + '    <input name="searchArea" id="searchArea-' + i + '" value="' + WOBConfig.search.areaNames[area] + '" type="radio">';
      html = html + '    <label for="searchArea-' + i + '">' + WOBConfig.search.areaNames[area] + '</label>';
      i = i + 1;
  }

  html = html + '  </fieldset>';
  html = html + '</form>';

  $('#searchAreas').html(html);
  $('#searchAreas').trigger('create');

  $('#searchAreaControlgroup .ui-radio:first-of-type label').addClass("ui-last-child");
  $('#searchAreaControlgroup .ui-radio:nth-of-type(2) label').addClass("ui-first-child");
};

/**
 * Gibt den ausgewählten Stadt- oder Ortsteil zurück
 */
WOBSearchByArea.getSelectedArea = function() {
  var selected = $("#searchAreas input:checked").val();
  return selected;
};

/**
 * Wenn die Auswahl des Stadt- oder Ortsteils verändert wurde
 * wird auf die neue Fläche gezoomt.
 */
WOBSearchByArea.change = function() {
  var selected = WOBSearchByArea.getSelectedArea();

  if(WOBConfig.search.fullAreaName != selected) {
    WOBSearchByArea.isUsed = true;

    WOBSearchByArea.searchArea(selected);

  } else {
    if(WOBSearchByArea.layer != null) {
      Map.zoomToExtent(WOBConfig.search.fullAreaExtent, Config.map.minScaleDenom.search);
    }

    WOBSearchByArea.hideAreaLayer();
    WOBSearchByArea.layer = null;
    WOBSearchByArea.isUsed = false;
  }

  WOBSearch.updateSearch = true;
  WOBGui.refreshButtonIconStatus();
};

/**
 * Führt eine Suche nach dem Stadt- oder Ortsteil aus und
 * zeigt anschließend diesen in der Karte.
 */
WOBSearchByArea.searchArea = function(areaName) {
  Map.map.removeLayer(WOBSearchByArea.layer);

  // Setzt die Suchfilter
  Config.search.setSearchTables(JSON.stringify([WOBConfig.search.searchAreaTable]));
  Config.search.setSearchFilters(JSON.stringify([""]));
  Config.search.setSearchArea("");
  Config.search.setSearchCenterAndRadius("", "");

  Config.search.submit(areaName, WOBSearchByArea.showArea);
};

/**
 * Zeigt die Highlight-Geometrie des Stadt- oder Ortsteils aus dem Suchergebnis und zoomt auf
 * dessen Extent/BBOX.
 */
WOBSearchByArea.showArea = function(results) {
  var highlight;
  var bbox;

  if(results.length > 0) {
    var categoryResults = results[0];

    if(categoryResults.results.length > 0) {
      highlight = categoryResults.results[0].highlight;
      bbox = categoryResults.results[0].bbox;
    }
  }

  if(highlight != undefined) {
    WOBSearchByArea.createAreaLayer(highlight);
  }

  if(bbox != undefined) {
    Map.zoomToExtent(bbox, Config.map.minScaleDenom.search);
  }
};

/**
 * Erzeugt einen Layer mit der Geometrie eines Stadt- oder Ortsteils
 */
WOBSearchByArea.createAreaLayer = function(highlight) {
  var geomUrl = Config.search.geomUrl;

  // get geometry
  var request = $.ajax({
    url: geomUrl,
    data: {
      searchtable: highlight.searchtable,
      showlayer: highlight.showlayer,
      displaytext: highlight.displaytext,
      id: highlight.id
    },
    dataType: 'text',
  });

  request.done(function(data, status) {
    // convert WKT to features
    var format = new ol.format.WKT({splitCollection: true});
    var features = format.readFeatures(data);

    var style = new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(0, 48, 130, 0.4)'
      }),
      stroke: new ol.style.Stroke({
        width: 3,
        color: 'rgba(0, 48, 130, 1)'
      })
    });

    WOBSearchByArea.layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: features
      }),
      style: style
    });

    WOBSearchByArea.layer.name = 'SearchByArea';

    Map.map.addLayer(WOBSearchByArea.layer);
  });
};

/**
 * Aktiviert den Layer mit einem Stadt- oder Ortsteil
 */
WOBSearchByArea.showAreaLayer = function() {
  if(WOBSearchByArea.layer != null) {
    WOBSearchByArea.layer.setVisible(true);
  }
};

/**
 * Deaktiviert den Layer mit einem Stadt- oder Ortsteil
 */
WOBSearchByArea.hideAreaLayer = function() {
  if(WOBSearchByArea.layer != null) {
    WOBSearchByArea.layer.setVisible(false);
  }
};

/**
 * Setzt die Stadt- und Ortsteilsuche zurück (wählt "Gesamte Stadt" aus)
 */
WOBSearchByArea.reset = function() {
  if(WOBSearchByArea.layer != null) {
    Map.map.removeLayer(WOBSearchByArea.layer);
  }

  WOBSearchByArea.layer = null;

  var firstRadioButton = $("#searchAreas input[type='radio']:first");
  firstRadioButton.prop('checked', true).checkboxradio('refresh').trigger('change');
};
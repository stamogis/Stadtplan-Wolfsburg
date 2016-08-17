/**
 * WSGI search from QGIS Web Client
 */

function WsgiSearch(url, geomUrl, showHighlightLabel) {
  // search URL
  this.url = url;
  // geometry URL for highlighting
  this.geomUrl = geomUrl;
  // show highlight label
  this.showHighlightLabel = showHighlightLabel;

  // Neue Suchparameter
  this.parameters = {
    // Die Tabellen, die von der Suche verwendet werden sollen
    "searchTables": JSON.stringify([]),
    // Themen/Kategorien der Tabellen, die nicht berücksichtigt werden sollen
    "searchFilters": JSON.stringify([]),
    // Mittelpunkt der Umkreissuche
    "searchCenter": "",
    // Radius der Umkreissuche
    "searchRadius": "",
    // Flächenname (Stadt- oder Ortsteil) zur eingrenzung der Suche auf diese Fläche
    "searchArea": "",
    // Limitierung der gesamten Suchergebnisse
    "resultLimitCategory": ""
  };
}

// inherit from Search
WsgiSearch.prototype = new Search();

/**
 * Setzt die Tabellen, die von der Suche verwendet werden sollen
 */
WsgiSearch.prototype.setSearchTables = function(searchTables) {
  this.parameters.searchTables = searchTables;
};

/**
 * Setzt die Themen/Kategorien der Tabellen, die nicht berücksichtigt werden sollen
 */
WsgiSearch.prototype.setSearchFilters = function(searchFilters) {
  this.parameters.searchFilters = searchFilters;
};

/**
 * Setzt den Mittelpunkt und den Radius der Umkreissuche
 */
WsgiSearch.prototype.setSearchCenterAndRadius = function(searchCenter, searchRadius) {
  this.parameters.searchCenter = searchCenter;
  this.parameters.searchRadius = searchRadius;
};

/**
 * Setzt den Flächenname (Stadt- oder Ortsteil) zur eingrenzung der Suche auf diese Fläche
 */
WsgiSearch.prototype.setSearchArea = function(searchArea) {
  this.parameters.searchArea = searchArea;
};

/**
 * submit search query
 */
WsgiSearch.prototype.submit = function(query, callback) {

  // Drehender Ladekreis während der Verarbeitung der Suche
  var showLoadingTimer;

  // Fügt den Suchbegriff als Suchparameter hinzu und entfernt dabei überflüssige Leerzeichen
  this.parameters.query = $.trim(query);

  // Fügt die Limitierung für das gesamte Suchergebnis als Suchparameter hinzu
  this.parameters.resultLimit = WOBConfig.search.resultLimit;

  var request = $.ajax({
    // Den Ladekreis erst nach 100 Millisekunden starten, um
    // ihn bei schnellen Suchanfragen nicht zu berücksichtigen
    beforeSend: function() {
      showLoadingTimer = setTimeout(function () {
        $.mobile.loading( "show", {
          text: "Lädt ...",
          textVisible: false,
          theme: "a"
        });
      }, 100 );
    },
    url: this.url,
    data: this.parameters,
    dataType: 'json',
    context: this,
    traditional: true
  });

  request.done(function(data, status) {
    this.parseResults(data, status, callback);
    clearTimeout(showLoadingTimer);
    $.mobile.loading( "hide");
  });

  request.fail(function(jqXHR, status) {
    // Den Timeout des Ladekreises zurücksetzen und den Ladekreis ausblenden
    clearTimeout(showLoadingTimer);
    $.mobile.loading( "hide");

    alert(I18n.search.failed + "\n" + jqXHR.status + ": " + jqXHR.statusText);
  });
};

/**
 * parse query result and invoke the callback with search result features
 *
 * [
 *   {
 *     category: <category>, // null to hide
 *     results: [
 *       {
 *         name: <visible name>,
 *         highlight: {
 *           searchtable: <search table>,
 *           displaytext: <string for search>,
 *         },
 *         bbox: [<minx>, <miny>, <maxx>, <maxy>]
 *       }
 *     ]
 *   }
 * ]
 */
WsgiSearch.prototype.parseResults = function(data, status, callback) {
  // group by category
  var categories = {};
  var category = null;
  for (var i=0; i<data.results.length; i++) {
    var result = data.results[i];
    if (result.bbox == null) {
      // add category
      category = result.displaytext;
      if (categories[category] === undefined) {
        categories[category] = [];
      }
    }
    else {
      // add result to current category
      categories[category].push({
        name: result.displaytext,
        highlight: {
          searchtable: result.searchtable,
          showlayer: result.showlayer,
          displaytext: result.displaytext,
          id: result.id
        },
        bbox: result.bbox
      });
    }
  }

  // convert to search results
  var results = $.map(categories, function(features, category) {
    return {
      category: category,
      results: features
    };
  });
  callback(results);

  // Falls aktiviert, wird ein Popup-Fenster aufgerufen, wenn
  // die Anzahl der Ergebnisse größer oder gleich des Suchlimits ist
  if(WOBConfig.search.resultLimitInfo) {
    if(WOBConfig.search.resultLimit != "" && data.results.length >= WOBConfig.search.resultLimit) {
      WOBSearch.SearchLimitedInfo();
    }
  }
};

/**
 * create and add a highlight layer for the selected search result
 *
 * request geometry and add vector layer for highlighting
 *
 * highlight = {
 *   searchtable: <search table>,
 *   displaytext: <string for search and optional highlight label>,
 * }
 * callback(<OL3 layer>): add highlight layer to map
 */
WsgiSearch.prototype.highlight = function(highlight, callback) {
  // get geometry
  var request = $.ajax({
    url: this.geomUrl,
    data: {
      searchtable: highlight.searchtable,
      showlayer: highlight.showlayer,
      displaytext: highlight.displaytext,
      id: highlight.id
    },
    dataType: 'text',
  });

  var showHighlightLabel = this.showHighlightLabel;
  request.done(function(data, status) {
    // convert WKT to features
    var format = new ol.format.WKT({splitCollection: true});
    var features = format.readFeatures(data);

    // Enthält die Beschriftungen für MultiLineStrings
    var multiLineStringLabelsFeatures = [];

    if (showHighlightLabel && highlight.displaytext != null) {
      for (var featureIndex in features) {
        // adjust label text (remove last part in brackets)
        var labelstring = highlight.displaytext.replace(/ \([^\)]+\)$/, '');
        features[featureIndex].set('labelstring', labelstring);

        // Übernimmt bei MultiLineString nur die Beschriftungen des mittleren LineStrings,
        // um die Beschriftung aller einzelnen Teilstücke der Geometrie zu verhindern.
        if(features[featureIndex].getGeometry().getType() == 'MultiLineString') {
          var geometry = features[featureIndex].getGeometry();
          var centerCoordinate = ol.extent.getCenter(geometry.getExtent());
          var closestPointCoordinate = geometry.getClosestPoint(centerCoordinate);

          var closestPointExtent = new ol.geom.Point(closestPointCoordinate).getExtent();
          var lineStrings = geometry.getLineStrings();
          var closestLineString = null;

          for (var lineStringIndex in lineStrings) {
            if(lineStrings[lineStringIndex].intersectsExtent(closestPointExtent)) {
              closestLineString = lineStrings[lineStringIndex];
              break;
            }
          }

          var labelGeometry;

          if(closestLineString != null){
            labelGeometry = closestLineString;
          } else {
            labelGeometry = new ol.geom.LineString([closestPointCoordinate, closestPointCoordinate]);
          }

          var feature = features[featureIndex].clone();
          feature.set('labelGeometry', labelGeometry);
          feature.setGeometryName('labelGeometry');
          multiLineStringLabelsFeatures.push(feature);
        }
      }
    }

    for (var featureIndex in multiLineStringLabelsFeatures) {
      features.push(multiLineStringLabelsFeatures[featureIndex]);
    }

    // feature style
    var style = function(feature, resolution) {
      var stroke = new ol.style.Stroke({
        color: 'rgba(218, 0, 0, 1.0)',
        width: 5
      });
      var fill = new ol.style.Fill({
        color: 'rgba(218, 0, 0, 0.01)'
      });

      var text = null;
      if (feature.get('labelstring') && feature.getGeometry().getType() != 'MultiLineString') {
        // label (NOTE: every subgeometry of a multigeometry is labeled)
        text = new ol.style.Text({
          text: feature.get('labelstring'),
          textAlign: 'center',
          textBaseline: 'top',
          offsetY: 30,
          font: 'bold 25px Helvetica,Arial,sans-serif',
          fill: new ol.style.Fill({
            color: 'rgba(218, 0, 0, 1.0)'
          }),
          stroke: new ol.style.Stroke({
            color: 'rgba(255, 255, 255, 1.0)',
            width: 2
          })
        });
      }

      return [new ol.style.Style({
        image: new ol.style.Circle({
          radius: 20,
          fill: fill,
          stroke: stroke
        }),
        fill: fill,
        stroke: stroke,
        text: text
      })];
    };

    // add highlight layer
    var layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: features
      }),
      style: style
    });
    layer.name = 'highlight';
    callback(layer);
  });
};

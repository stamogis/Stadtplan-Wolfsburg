/**
 * Lädt die Projekteinstellungen (GetProjectSettings) der aktuellen Themenkarte.
 * Passt aus den geladenen Daten die Druckformate und Copyright-Hinweise an.
 */

var WOBProjectSettings = {};

// Zwischengespeicherte Daten
WOBProjectSettings.data = {};

/**
 * Projekteinstellungen (GetProjectSettings) laden
 */
WOBProjectSettings.getProjectSettings = function() {
    var url = Map.topicLayer.getSource().getUrl();

    if(url.indexOf('?') == -1) {
      url += '?';
    } else {
      url += '&';
    }

    url += 'SERVICE=WMS&VERSION=1.3&REQUEST=GetProjectSettings';

    var request = $.ajax({
      url: url,
      dataType: 'text',
      context: this
    });

    request.done(function(data, status) {
      WOBProjectSettings.parseResults([data]);

      // Druckformate anpassen
      WOBGui.createExportLayoutElements();

      // Copyright-Hinweise setzen
      if(WOBConfig.map.useQGISattributions) {
        WOBProjectSettings.initAttributions();
      }
    });

    request.fail(function(jqXHR, status) {
      WOBMap.setAttributions();
      console.log(WOBTranslation.projectSettings.requestFailed[WOBGui.currentLanguage] + "\n" + status + ": " + jqXHR.statusText);
    });
};

/**
 * Elemente der Projekteinstellungen aus dem XMl des GetProjectSettings-Aufrufs laden
 */
WOBProjectSettings.parseResults = function(data) {

  for (var i=0; i<data.length; i++) {
    var xml = $.parseXML(data[i]);

    // composerTemplates (Druckformate)
    var composerTemplates = [];
    $(xml).find('Capability > ComposerTemplates > ComposerTemplate').each(function() {
      var composerMaps = [];
      $(this).find('ComposerMap').each(function() {
        composerMaps.push({
          width: $(this).attr('width'),
          height: $(this).attr('height'),
          name: $(this).attr('name')
        });
      });
      composerTemplates.push({
        width: $(this).attr('width'),
        height: $(this).attr('height'),
        name: $(this).attr('name'),
        composerMaps: composerMaps
      });
    });
    WOBProjectSettings.data.composerTemplates = composerTemplates;

    // Layer-Attribution (Copyright-Hinweise)
    if(WOBConfig.map.useQGISattributions) {
      var topLayers = [];
      $(xml).find('Capability > Layer > Layer').each(function() {
        var layerGroups = [];
        $(this).children('Layer').each(function() {
          var layerGroupTitle = $(this).children('Name').text();
          var layers = [];
          $(this).children('Layer').each(function() {
            layers.push({
              title: $(this).children('Name').text(),
              layerGroupTitle: layerGroupTitle,
              attribution: $(this).children('Attribution').children('Title').text()
            });
          });
          layerGroups.push({
            title: $(this).children('Name').text(),
            attribution: $(this).children('Attribution').children('Title').text(),
            layers: layers
          });
        });
        topLayers.push({
          title: $(this).children('Name').text(),
          attribution: $(this).children('Attribution').children('Title').text(),
          layerGroups: layerGroups
        });
      });
      WOBProjectSettings.data.layers = topLayers;
    }
  }
};

/**
 * Fügt die Copyright-Hinweise den Layern hinzu
 */
WOBProjectSettings.initAttributions = function() {
  for (var layer in Map.layers) {
    // Copyright-Hinweise aus den Metadaten
    var attribution = WOBProjectSettings.getAttribution(Map.layers[layer].layername);

    if(attribution != "" && attribution.length > 0) {
      Map.layers[layer].attribution = attribution;
    }
  }

  WOBMap.setAttributions();
};

/**
 * Ermittelt den Copyright-Hinweise des angegebenen Layers
 */
WOBProjectSettings.getAttribution = function(layerName) {
  var attribution = [];

  for (var topLayer in WOBProjectSettings.data.layers) {
    if(layerName == WOBProjectSettings.data.layers[topLayer].title) {
      attribution.push(WOBProjectSettings.data.layers[topLayer].attribution);
    }
    for (var layerGroup in WOBProjectSettings.data.layers[topLayer].layerGroups) {
      if(layerName == WOBProjectSettings.data.layers[topLayer].layerGroups[layerGroup].title) {
        attribution.push(WOBProjectSettings.data.layers[topLayer].layerGroups[layerGroup].attribution);
      }
      for (var layer in WOBProjectSettings.data.layers[topLayer].layerGroups[layerGroup].layers) {
        if(layerName == WOBProjectSettings.data.layers[topLayer].layerGroups[layerGroup].layers[layer].layerGroupTitle) {
          attribution.push(WOBProjectSettings.data.layers[topLayer].layerGroups[layerGroup].layers[layer].attribution);
        }
      }
    }
  }
  return attribution;
};

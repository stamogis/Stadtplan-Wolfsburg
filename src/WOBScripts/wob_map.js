/**
 * Weitere Funktionen für die Karte
 */

var WOBMap = {};

// Der letzte aktivierte Klick-Handler
WOBMap.activeClickHandler = "";

// Zeit bis der HighlightLayer der Suchergebnisse deaktiviert wird.
WOBMap.highlightTimeout = null;

// Letzter berechneter Kartenmaßstab
WOBMap.currentScaleDenom = null;

/**
 * Speichert den aktuell aktivierten Klick-Handler
 */
WOBMap.saveActiveClickHandler = function() {
  for (var key in Map.singleClickHandlers) {
    if(Map.singleClickHandlers[key].isActive()){
      WOBMap.activeClickHandler = key;
      break;
    }
  }
};

/**
 * Aktiviert den Klick-Handler, der vorher gespeichert wurde
 */
WOBMap.restoreSavedClickHandler = function() {
  if(WOBMap.activeClickHandler != "") {
    Map.activateClickHandler(WOBMap.activeClickHandler);
  }
};

/**
 * Schaltet den übergebenen Layer ein.
 * Wenn ein Array (history) angegeben wird, kann der Layername zwischengespeichert werden.
 */
WOBMap.showLayer = function(layer, history) {
  var grouplayer = true;

  // Überprüft alle normalen Checkboxen
  $('#panelLayerAll').find(':checkbox').each(function(index) {
    if($(this).data('layer') == layer) {
      grouplayer = false;
      var checkbox = $('#panelLayerAll :checkbox[data-layer="' + layer + '"]');
      if (checkbox.is(':checked') != true) {
        checkbox.prop('checked', true).checkboxradio().checkboxradio('refresh').trigger('change');

        if(history) {
          history.push(layer);
        }
        // Schleife verlassen
        return false;
      }
    }
  });

  // Überprüft alle Gruppen-Checkboxen
  if(grouplayer) {
    $('#panelLayerAll').find('.ui-collapsible[data-groupcheckbox=true]').each(function(index) {
      var collapsible = $(this);

      var title = ""
      collapsible.find('h3 a.ui-collapsible-heading-toggle:first').contents().each(function(){
        if(this.nodeType === 3){
          title = this.wholeText;
          return false;
        }
      });

      if(title == layer){
        var checkbox = collapsible.find('h3 a.ui-collapsible-groupcheckbox:first');
        if (checkbox.is('.ui-collapsible-groupcheckbox-button-checked') != true || checkbox.is('.ui-collapsible-groupcheckbox-button-somechecked') == true) {

          $(collapsible).find(':checkbox').each(function(index) {
            var checkbox = $(this);
            if (checkbox.is(':checked') != true) {
              if(history) {
                history.push(checkbox.data('layer'));
              }
            }
          });

          checkbox.trigger('checkgroup', true);

          // Schleife verlassen
          return false;
        }
      }
    });
  }
};

/**
 * Schaltet den übergebenen Layer aus.
 * Wenn ein Array (history) angegeben wird, kann der Layername aus diesem entfernt werden.
 */
WOBMap.hideLayer = function(layer, history) {
  var grouplayer = true;

  // Überprüft alle normalen Checkboxen
  $('#panelLayerAll').find(':checkbox').each(function(index) {
    if($(this).data('layer') == layer) {
      grouplayer = false;
      var checkbox = $('#panelLayerAll :checkbox[data-layer="' + layer + '"]');
      if (checkbox.is(':checked') != false) {
        checkbox.prop('checked', false).checkboxradio().checkboxradio('refresh').trigger('change');

        if(history) {
          var historyIndex = history.indexOf(layer);

          if(historyIndex != -1) {
            history.splice(historyIndex, 1);
          }
        }
        // Schleife verlassen
        return false;
      }
    }
  });

  // Überprüft alle Gruppen-Checkboxen
  if(grouplayer) {
    $('#panelLayerAll').find('.ui-collapsible[data-groupcheckbox=true]').each(function(index) {
      var collapsible = $(this);

      var title = ""
      collapsible.find('h3 a.ui-collapsible-heading-toggle:first').contents().each(function(){
        if(this.nodeType === 3){
          title = this.wholeText;
          return false;
        }
      });

      if(title == layer){
        var checkbox = collapsible.find('h3 a.ui-collapsible-groupcheckbox:first');
        if (checkbox.is('.ui-collapsible-groupcheckbox-button-checked') != false) {
          checkbox.trigger('checkgroup', false);

          if(history) {
            var historyIndex = history.indexOf(layer);

            if(historyIndex != -1) {
              history.splice(historyIndex, 1);
            }
          }
          // Schleife verlassen
          return false;
        }
      }
    });
  }

};

/**
 * Schaltet alle übergebenen Layer aus.
 * Wenn ein Array (history) angegeben wird, können die Layernamen aus diesem entfernt werden.
 */
WOBMap.hideLayers = function(layers, history) {
  for(var i = 0; i < layers.length; i++) {
    WOBMap.hideLayer(layers[i], history);
  }
};

/**
 * Blendet den HighlightLayer des Suchergebnisses nach einer bestimmten Zeit aus.
 * Die Zeitdauer kann in der wob_config.js angepasst werden.
 */
WOBMap.highlightTimer = function() {
 if(WOBConfig.map.highlightTimeout != null) {
    WOBMap.highlightTimeout = setTimeout(function() {
      WOBSearch.clearMapSearchResults(true, false, false, false);
    }, WOBConfig.map.highlightTimeout);
  }
};

/**
 * Gibt den aktuellen Kartenmaßstab zurück
 */
WOBMap.getCurrentScaleDenom = function() {
  WOBMap.currentScaleDenom = currentScaleDenom = Map.map.getView().getResolution() * (Map.map.getView().getProjection().getMetersPerUnit() * (Config.map.dpi / 0.0254));
  return WOBMap.currentScaleDenom;
};

/**
 * Lädt die Copyright-Hinweise aus der wob_config.js
 */
WOBMap.initAttributions = function() {
  for (var layer in Map.layers) {
    var attribution = [];
    for (var i in WOBConfig.map.attributions) {
      if (WOBConfig.map.attributions.hasOwnProperty(i)) {
        if (WOBConfig.map.attributions[i].topic != "" && WOBConfig.map.attributions[i].topic != Map.topic) {
          continue;
        } else {
          for (var attributionLayer in WOBConfig.map.attributions[i].layers) {
            if(WOBConfig.map.attributions[i].layers[attributionLayer] == layer) {
              attribution.push(WOBConfig.map.attributions[i].attribution);
            }
          }
        }
      }
    }

    if(attribution != "" && attribution.length > 0) {
      Map.layers[layer].attribution = attribution;
    }
  }

  WOBMap.setAttributions();
};

/**
 * Setzt die Copyright-Hinweise in der Karte
 */
WOBMap.setAttributions = function() {
  if(Map.map.getLayers().getLength() > 0) {
    var layers = Map.map.getLayers().getArray();
    var source = layers[0].getSource();

    var attributions = [];

    var visibleLayers = Map.visibleLayers();

    for(var i = visibleLayers.length - 1; i >= 0; i--){
      var layerAttribution = Map.layers[visibleLayers[i]].attribution;

      if(layerAttribution != undefined && layerAttribution.length > 0) {
        for(attribution in layerAttribution) {
          if(attributions.indexOf(layerAttribution[attribution]) == -1 && layerAttribution[attribution] != "") {
            attributions.push(layerAttribution[attribution]);
          }
        }
      }
    }
    attributions.push(WOBTranslation.map.copyright[WOBGui.getCurrentLanguage()]);

    $("#attributions").html(attributions.join(', '));

    WOBGui.updateMapLayout();
  }
};

/**
 * Gibt ein Array aller sichtbaren Layer zurück
 */
WOBMap.getVisibleLayers = function() {
  var layers = [];

  for(var layer in Map.layers) {
    if (Map.layers[layer].visible) {
      layers.push(layer);
    }
  }

  return layers;
};

/**
 * Gibt ein Array der Transparenzwerte aller sichtbaren Layer zurück
 */
WOBMap.getVisibleLayersOpacities = function() {
  var opacities = [];

  for(layer in Map.layers) {
    if (Map.layers[layer].visible) {
      opacities.push(Math.round(255 - (Map.layers[layer].transparency / 100 * 255)));
    }
  }

  return opacities;
};

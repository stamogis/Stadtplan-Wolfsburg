/**
 * Suchfunktionen
 */

var WOBSearch = {};

// Die durch die Suche aktivierten Layer
WOBSearch.activatedLayers = [];

// Soll das Suchergebnis aktualisiert werden?
WOBSearch.updateSearch = false;

/**
 * Setzt die Suchparameter und startet die Suche.
 * Parameter:
 * Der zu suchenden Begriff, die Suchthemen (Filter), die Position und Radius der Umkreissuche
 * und die Fläche der Stadt- und Ortsteilsuche
 */
WOBSearch.submitSearch = function() {
  // Alle Layer, die durch eine vorherige Suche aktiviert wurden, wieder deaktivieren
  if(WOBConfig.search.hideActivatedLayers) {
    WOBSearch.hideActivatedLayers();
  }

  // Ergebnissliste zum Anfang scrollen
  $("#searchResultsListScroll").scrollTop(0);

  // Ergebnis ausblenden
  $('#searchResults').hide();
  // HighlightLayer ausblenden
  Map.setHighlightLayer(null);

  // Die eingegebenen Begriffe
  var searchString = $('#searchInput').val();

  // Die aktuell ausgewählten Suchfilter
  var selectedFilters = WOBSearchFilter.getSelectedFilters();

  // Der ausgewählte Stadt- oder Ortsteil
  var selectedSearchByArea = WOBSearchByArea.getSelectedArea();

  var searchTables = [];
  var searchFilters = [];

  for (var table in selectedFilters) {
    searchTables.push(table);
    searchFilters.push(selectedFilters[table]);
  }

  // Setzt die Suchparameter
  Config.search.setSearchTables(JSON.stringify(searchTables));
  Config.search.setSearchFilters(JSON.stringify(searchFilters));
  Config.search.setSearchArea(selectedSearchByArea);

  // Wenn die Umkreissuche aktiviert wurde, wird die Position und der Radius gesetzt.
  if(!WOBUmkreissuche.isEmpty() && WOBUmkreissuche.isActivated()) {
    var center = WOBUmkreissuche.getCircleGeometry().getCenter();
    var radius = WOBUmkreissuche.getCircleGeometry().getRadius();

    Config.search.setSearchCenterAndRadius(center[0] + ", " + center[1], radius);
  } else {
    Config.search.setSearchCenterAndRadius("", "");
  }

  // Startet die Suche
  Config.search.submit(searchString, Gui.showSearchResults);

  // Blendet die virtuelle Tastatur der Sucheingabe aus
  $('#searchInput').blur();

  // Ergebnissliste zum Anfang scrollen
  $("#searchResultsListScroll").scrollTop(0);

  WOBSearch.updateSearch = false;
};

/**
 * Schaltet alle Layer aus, die bei der Suche aktiviert wurden.
 */
WOBSearch.hideActivatedLayers = function() {
  WOBMap.hideLayers(WOBSearch.activatedLayers, WOBSearch.activatedLayers);
};

/**
 * Entfernt alle gewünschten Kartenelemente (HighlightLayer, Umkreissuche, ...) die bei der Suche hinzugefügt wurden.
 */
WOBSearch.clearMapSearchResults = function(deactivateHighlightLayer, deactivateActivatedLayers, deactivateUmkreissuche, deactivateSearchByArea) {
  if(deactivateHighlightLayer) {
    Map.setHighlightLayer(null);
  }

  if(deactivateActivatedLayers) {
    WOBSearch.hideActivatedLayers();

    WOBSearch.activatedLayers = [];
  }

  if(deactivateUmkreissuche) {
    if(WOBUmkreissuche.layer && WOBUmkreissuche.layer.getVisible()){
      WOBUmkreissuche.hide();
    }
  }

  if(deactivateSearchByArea) {
    WOBSearchByArea.hideAreaLayer();
  }
};

/**
 * Setzt die Suche zurück
 */
WOBSearch.resetSearch = function() {
  // Kartenelemente zurücksetzen
  if(WOBConfig.search.hideActivatedLayers) {
    WOBSearch.clearMapSearchResults(true, true, true, true);
  } else {
    WOBSearch.clearMapSearchResults(true, false, true, true);
  }

  // GUI-Elemente der Suche zurücksetzen
  $('#searchInput').val("");

  $('#searchResultsList').empty();
  $('#searchResults').hide();

  // Umkreissuche zurücksetzen
  WOBUmkreissuche.clear();

  // Sucheinstellungen zurücksetzen
  WOBGui.initSearchPanel();

  WOBSearch.updateSearch = false;
};

/**
 * PopUp-Fenster, wenn das Suchlimit erreicht wurde
 */
WOBSearch.SearchLimitedInfo = function() {
  $('#popupContent').empty();
  $('#popupContent').append(WOBTranslation.panelSearch.resultIsLimited[WOBGui.currentLanguage]);

  $('#popup').popup(); // initialisieren
  $('#popup').popup('open', {history: false, positionTo: "window"});
};

/**
 * PopUp-Fenster, wenn kein Ergebnis gefunden wurden.
 */
WOBSearch.emptyResultsInfo = function() {
  $('#popupContent').empty();

  var searchString = $('#searchInput').val();

  // Filter deaktiviert
  if(WOBSearchFilter.nothingChecked()) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundFilterNothingChecked[WOBGui.currentLanguage]);

  // Input + Deaktivierter Umkreisuche + unveränderte Filter
  } else if(searchString != "" && (!WOBUmkreissuche.isActivated() && !WOBSearchFilter.isChanged() && !WOBSearchByArea.isUsed)) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundInput[WOBGui.currentLanguage]);

  // Filter + Kein Input
  } else if(searchString == "" && WOBSearchFilter.isChanged()) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundFilter[WOBGui.currentLanguage]);
  // Filter + Input
  } else if(searchString != "" && WOBSearchFilter.isChanged()) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundInputAndFilter[WOBGui.currentLanguage]);

  // Umkreissuche + Kein Input
  } else if(searchString == "" && WOBUmkreissuche.isActivated()) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundUmkreissuche[WOBGui.currentLanguage]);
  // Umkreissuche + Input
  } else if(searchString != "" && WOBUmkreissuche.isActivated()) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundInputAndUmkreissuche[WOBGui.currentLanguage]);

  // Stadt- und Ortsteilsuche + Kein Input
  } else if(searchString == "" && WOBSearchByArea.isUsed) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundSearchByArea[WOBGui.currentLanguage]);
  // Stadt- und Ortsteilsuche + Input
  } else if(searchString != "" && WOBSearchByArea.isUsed) {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundInputAndSearchByArea[WOBGui.currentLanguage]);

  } else {
    $('#popupContent').append(WOBTranslation.panelSearch.noFeatureFoundInput[WOBGui.currentLanguage]);
  }

  $('#popup').popup(); // initialisieren
  $('#popup').popup('open', {history: false, positionTo: "window"});
};

/**
 * Wenn die Position der Umkreissuche verändert wurde, die Suche erneut ausführen
 */
WOBSearch.umkreissucheChanged = function() {
  WOBSearch.updateSearch = true;
  if(WOBSubPanel.isSubPanelSelected('#panelSearch', '#searchPanelContent') && $('#panelSearch').hasClass('ui-panel-open')) {
    WOBSearch.submitSearch();
  }
};
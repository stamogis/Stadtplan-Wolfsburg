/**
 * Erweiterungen des GUIs
 *
 * Wird zum Schluss in der Gui.initViewer() Methode der GUI.js geladen.
 * Dafür muss die WOBGui.initViewer() in der config.js unter Config.customInitViewer() eingetragen werden.
 */

var WOBGui = {};

// Aktuell verwendete Sprache
WOBGui.currentLanguage = "";

// Wird ein kleiner Bildschirm verwendet
WOBGui.useSmallDeviceGui = null;

/**
 * Initialisierung des GUIs.
 * Wird automatisch in der Gui.initViewer() der GUI.js geladen,
 * wenn ein entsprechender Eintrag in der Config.customInitViewer() existiert.
 */
WOBGui.initViewer = function() {

  // GUI-Elemente und die verschachtelten Fenster (SubPanels) initialisieren
  WOBGui.initSearchPanel();
  WOBGui.initPropertiesPanel();
  WOBGui.initToolsPanel();
  WOBSubPanel.initSubPanels();

  // Das GUI-Layout an die aktuelle Fenstergröße an anpassen.
  WOBGui.updateLayout();

  // Bevor ein Panel geschlossen wird
  $('.ui-panel').on('panelbeforeclose', function(e) {
    var panel = $(this);

    // Ist das zu schließende Panel minipanel (z.B. die Werkzeuge)
    if(panel.hasClass("ui-minimized-sub-panel") && panel.hasClass("force-full-screen")){
      // Animation stoppen und das Panel schließen
      $(panel).panel( "option", "animate", false );
    }
  });

  // Wird ein Panel geschloßen
  $('.ui-panel').on('panelclose', function(e) {
    var panel = $(this);

    // Wenn ein Mini-Panel aktiviert ist, soll wieder zum Startpanel gewechselt werden
    if(panel.hasClass("ui-minimized-sub-panel")){
      var panelName = '#' + panel.attr("id");
      var previousSubPanelName = WOBSubPanel.getPreviousSubPanelName(panelName);
      WOBSubPanel.panelSelect(panelName, previousSubPanelName);

      // Animation wieder starten
      $(panel).panel( "option", "animate", true );
    }
  });

  // Bevor das Suchfenster geöffnet wird
  $('#panelSearch').on('panelbeforeopen', function(e) {
    // Den (vorherigen) Umkreis der Umkreissuche anzeigen
    WOBUmkreissuche.show();
    // Den (vorherigen) Stadt- oder Ortsteil der Stadt- und Ortsteilsuche anzeigen
    WOBSearchByArea.showAreaLayer();
  });

  // Wenn das Suchfenster geöffnet wird
  $('#panelSearch').on('panelopen', function(e) {
    // Löschen den Timer zum ausblenden des HighlightLayers eines Suchergebnisses
    clearTimeout(WOBMap.highlightTimeout);
  });

  // Bevor das Suchfenster geschloßen wird
  $('#panelSearch').on('panelbeforeclose', function(e) {
    // Deaktiviert den HighlightLayers der Suchergebnisse, den Umkreis der Umkreissuche
    // und den Stadt- oder Ortsteil der Stadt- und Ortsteilsuche
    WOBSearch.clearMapSearchResults(true, false, true, true);

    // Die virtuelle Tastatur ausblenden
    $('#searchInput').blur();
  });

  // Wenn der Button "Zurücksetzen" gedrückt wird, wird die Suche zurückgesetzt
  $('#buttonResetSearch').on('tap', function(e) {
    WOBGui.buttonFix(e);
    WOBSearch.resetSearch();
  });

  // Eingabefeld der Suche
  $('#searchInput').keyup( function (e) {
    // Enter/Return Taste löst die Suche aus
    if (e.keyCode == 13) {
      WOBSearch.submitSearch();
    }
  });

  // Suchbutton
  $('#buttonSearch').on('tap', function(e) {
    // Suche ausführen
    WOBSearch.submitSearch();
  });

  // Löschbutton in der Sucheingabe
  $('#searchBar .ui-input-clear').on('tap', function(e) {
    // Eingabe löschen
    $('#searchInput').val("");
    // Suchergebnis löschen
    $('#searchResultsList').empty();
    $('#searchResults').hide();
  });

  // Deaktiviert das Standard "submit"-Verhalten des Form-Elements der Suche
  $('#searchForm').bind('submit', function(e) {
    WOBGui.buttonFix(e);
  });

  // Markiert das vom Nutzer ausgewählte Suchergebnis in der Ergebnisliste
  $('#searchResultsList').on('tap', 'li:not(.category-title)', function(e) {
    var select = $(this);
    $('#searchResultsList li:not(.category-title)').removeClass("search-results-select");
    select.addClass("search-results-select");
  });

  // Wenn die Suchfilter verändert werden
  $('#seachFilter').change( function(e) {
    if(WOBSearchFilter.changeEvent) {
      WOBSearch.updateSearch = true;

      // Markiert die entsprechenden Menü-Buttons der "Erweiterten Suche"
      WOBSearchFilter.changed = true;
      WOBGui.refreshButtonIconStatus();
    }
  });

  // Wenn eine CheckBox bei einem untergliederten Suchfilter verändert wird
  $('#seachFilter').on('groupchange', function(e) {
    if(WOBSearchFilter.changeEvent) {
      WOBSearch.updateSearch = true;

      // Aktiviert den Suchbutton und markiert die entsprechenden Menü-Buttons der "Erweiterten Suche"
      WOBSearchFilter.changed = true;
      WOBGui.refreshButtonIconStatus();
    }
  });

  // Wenn der Schieberegler des Radius der Umkreissuche verändert wird, dann wird der Umkreis in der Karte angepasst
  $('#sliderUmkreissuche').change( function(e) {
    WOBUmkreissuche.updateRadius($(this).val());
    WOBSearch.updateSearch = true;
  }).parent().on('swiperight',function(e,ui) {
    // Verhindert das Schließen des Panels beim Swipe über den Schieberegler
    e.stopPropagation();
  });

  // Button zum Setzen des Umkreisses auf den aktuellen Standort bei aktivierter Ortung
  $('#buttonUmkreissucheOnLocation').on('tap', function(e) {
    if(Map.geolocation != null) {
      WOBUmkreissuche.createGeometry(Map.geolocation.getPosition(), WOBUmkreissuche.currentRadius);
    }
  });

  // Wenn die Auswahl der Stadt- und Ortsteilsuche verändert wurde,
  // wird der entsprechende Stadt- und Ortsteil angezeigt
  $('#searchAreas').change( function(e) {
    WOBSearchByArea.change();
  });

  // Auswahlfeld zum wechseln der Sprache
  $('#languageSelection').on('change', function(e) {
    WOBGuiTranslation.update($(this).val());

    // URL-Parameter für die aktuelle Sprache hinzufügen
    UrlParams.params.lang = WOBGui.currentLanguage;
    location.assign('//' + location.host + location.pathname + '?' + $.param(UrlParams.params));
  }).parent().on('swiperight',function(e,ui) {
    // Verhindert das Schließen des Panels beim Swipe über das Auswahlfeld
    e.stopPropagation();
  });

  // Bevor ein Popup-Fenster geschlossen wird
  $('#popup').on('popupafterclose', function() {
    Map.toggleClickMarker(false);
  });

  // Nach dem Verschieben/Zoomem des Kartenausschnitts
  Map.map.on('moveend', function(e) {
    // Passt die Einheiten des Radius-Schiebereglers bei der Umkreissuche dem neuen Kartenmaßstab an
    WOBGui.updateSliderMaxValue();

    // Aktualisiert den Permalink
    if(WOBPermalink.active) {
      WOBPermalink.updatePermalinkExtent();
    }
  });

  // Wurde die Fenstergröße geändert (z.B. Bildschirm gedreht)
  $(window).on('resize', function(e) {
    // Passt das Layout der Panels an die neue Fenstergröße an.
    WOBGui.updateLayout();

    // Aktualisiert den Permalink
    if(WOBPermalink.active) {
      WOBPermalink.updatePermalinkExtent();
    }
  });

  // Button zum öffnen des Impressum
  $('#buttonLogo').on('tap', function(e) {
    $('#dlgAbout').popup('open');
    WOBGui.buttonFix(e);
  });

  // Button zum Versenden der aktuellen Kartenausschnitts (Permalink)
  $('#buttonSendURL').on('tap', function(e) {
    var permalink = WOBPermalink.getPermalink();

    var mailToText = "mailto:?subject=" + WOBTranslation.panelShare.sendTitle[WOBGui.currentLanguage] + "&body=" + encodeURIComponent(permalink);
    var mailWindow = window.open(mailToText);
    if (mailWindow){
      mailWindow.close();
    }
  });

  // Button zum öffnen des Suchfensters
  $('#btnSearching').on('tap', function(e) {
    $('#panelSearch').panel('open');
    WOBGui.buttonFix(e);
  });

  // Button zum öffnen des Kartenfensters
  $('#btnLayers').on('tap', function(e) {
    $('#panelLayer').panel('open');
    WOBGui.buttonFix(e);
  });

  // Button zum öffnen des Einstellungsfensters
  $('#btnProperties').on('tap', function(e) {
    $('#panelProperties').panel('open');
    WOBGui.buttonFix(e);
  });

  // Button zum öffnen des Werkzeugsfensters
  $('#btnTools').on('tap', function(e) {
    $('#panelTools').panel('open');
    WOBGui.buttonFix(e);
  });

  // Button zum öffnen des Fensters für den PDF-Druck
  $('#buttonPDFExport').on('tap', function(e) {
    WOBExport.export();
    WOBGui.buttonFix(e);
  });

  // Auswahfeld für den Maßstab beim PDF-Druck
  $('#exportScale').on('change', function(e) {
    // Aktualisiert den Exportbereich
    WOBExport.updateScale($(this).val());
  }).parent().on('swiperight',function(e,ui) {
    // Verhindert das Schließen des Panels beim Swipe über das Auswahlfeld
    e.stopPropagation();
  });

  // Auswahfeld für das Layout beim PDF-Druck
  $('#exportLayout').on('change', function(e) {
    // Aktualisiert den Exportbereich
    WOBExport.updateLayout($(this).val());
  }).parent().on('swiperight',function(e,ui) {
    // Verhindert das Schließen des Panels beim Swipe über das Auswahlfeld
    e.stopPropagation();
  });

  // Auswahfeld der Messart beim Messen
  $('#measureType').on('change', function(e) {
    // Aktualisiert die Messart
    WOBMeasure.updateMeasureType($(this).val());
  }).parent().on('swiperight',function(e,ui) {
    // Verhindert das Schließen des Panels beim Swipe über das Auswahlfeld
    e.stopPropagation();
  });

  // Schalter zum aktivieren/deaktivieren der Positionsmarkierung
  // beim Werkzeug "Kartenausschnitt teilen"
  $('#switchSharePosition').change( function(e) {
    if($(this).val() == 'on') {
      WOBPermalink.enableMarker();
      WOBPermalink.updatePermalinkMarkerPosition();
    } else {
      WOBPermalink.disableMarker();
      WOBPermalink.updatePermalinkMarkerPosition();
    }
  }).parent().on('swiperight',function(e,ui) {
    // Verhindert das Schließen des Panels beim Swipe über den Schalter
    e.stopPropagation();
  });

  // Button zum Kartenausschnitt vergrößern (zoom in)
  $('#btnZoomIn').on('tap', function(e) {
    Map.map.beforeRender(ol.animation.zoom({
        resolution: Map.map.getView().getResolution(),
        duration: 250
    }));
    Map.setZoom(Map.map.getView().getZoom() + 1);
    WOBGui.buttonFix(e);
  });

  // Button zum Kartenausschnitt verkleinern (zoom out)
  $('#btnZoomOut').on('tap', function(e) {
    Map.map.beforeRender(ol.animation.zoom({
        resolution: Map.map.getView().getResolution(),
        duration: 250
    }));
    Map.setZoom(Map.map.getView().getZoom() - 1);
    WOBGui.buttonFix(e);
  });

  // Schalter zum aktivieren/deaktivieren der Zoombuttons
  $('#switchZoom').change( function(e) {
    if($(this).val() == 'on') {
      WOBGui.showZoomButtons(true);
    } else {
      WOBGui.showZoomButtons(false);
    }
  }).parent().on('swiperight',function(e,ui) {
    // Verhindert das Schließen des Panels beim Swipe über den Schalter
    e.stopPropagation();
  });

  // Wenn die Karte vollständig geladen ist
  $(document).on('topiclayersloaded', function(e) {
    // Copyright-Hinweise setzen
    if(!WOBConfig.map.useQGISattributions) {
      WOBMap.initAttributions();
    }

    // Die Projekteinstellungen (GetProjectSettings-Aufruf) laden
    WOBProjectSettings.getProjectSettings();
  });
};

/**
 * Startzustand der GUI-Elemente im Suchfenster setzen
 */
WOBGui.initSearchPanel = function() {
  // Elemente der Stadt- und Ortsteilsuche erzeugen
  if(WOBSearchByArea.rebuildAreas) {
    WOBSearchByArea.createAreas();
  }

  // Markiert alle Suchfilter
  if(WOBSearchFilter.changed) {
    WOBSearchFilter.selectAll();
  }

  // Reset der Stadt- und Ortsteilsuche (wählt "Gesamte Stadt" aus)
  WOBSearchByArea.reset();

  // Aktualisiert die Button-Markierungen der erweiterten Suche
  WOBGui.refreshButtonIconStatus();

  // Setzt den Radius-Schiebereglers der Umkreissuche auf den Standardwert
  $('#sliderUmkreissuche').val(WOBConfig.umkreissuche.startRadius);
  WOBGui.updateSliderMaxValue();

  // Deaktiviert den Button zum Setzen des Umkreises auf den aktuellen Standort
  $('#buttonUmkreissucheOnLocation').addClass('ui-disabled');

  // Wenn in der wob_config.js angegeben, werden die Funktionen/Button der
  // "Erweiterten Suche" ausgeblendet
  $('#buttonExtendedSearch').toggle(!WOBConfig.gui.hideExtendedSearchButton);
  $('#buttonExtendedSearchHelpText').toggle(!WOBConfig.gui.hideExtendedSearchButton);
  $('#buttonSearchFilter').toggle(!WOBConfig.gui.hideFilterButton);
  $('#buttonSearchFilterHelpText').toggle(!WOBConfig.gui.hideFilterButton);
  $('#buttonSearchByArea').toggle(!WOBConfig.gui.hideSearchByAreaButton);
  $('#buttonSearchByAreaHelpText').toggle(!WOBConfig.gui.hideSearchByAreaButton);
  $('#buttonUmkreissuche').toggle(!WOBConfig.gui.hideUmkreissucheButton);
  $('#buttonUmkreissucheHelpText').toggle(!WOBConfig.gui.hideUmkreissucheButton);

  WOBSearch.updateSearch = false;

  // Das Startfenster des Suchfensters aktivieren
  WOBSubPanel.panelSelect('#panelSearch', '#searchPanelContent');
};

/**
 * Startzustand der GUI-Elemente im Einstellungsfenster setzen
 */
WOBGui.initPropertiesPanel = function() {
  // Im Fenster der Hilfe zum Anfang scrollen
  WOBGui.scrollToElement("#help", 0);

  // Startzustand der Zoombuttons setzen
  $('#switchZoom').val(WOBConfig.properties.zoomButtons ? 'on' : 'off').flipswitch("refresh");
  if($('#switchZoom').val() == 'on') {
    WOBGui.showZoomButtons(true);
  } else {
    WOBGui.showZoomButtons(false);
  }

  // Wenn in der wob_config.js angegeben, werden die Funktionen/Button der
  // der Sprachauswahl oder der Hilfe ausgeblendet
  $('#languageSelectionFieldContain').toggle(!WOBConfig.gui.hideLanguageSelection);
  $('#buttonHelp').toggle(!WOBConfig.gui.hideHelpButton);

  // Das Startfenster des Einstellungsfenster aktivieren
  WOBSubPanel.panelSelect('#panelProperties', '#propertiesPanelContent');
};

/**
 * Startzustand der GUI-Elemente im Werkzeugfenster setzen
 */
WOBGui.initToolsPanel = function() {
  // Erzeugt die Auswahlmöglichkeiten im Exportfenster für den Maßstab
  WOBGui.createExportScaleElements();

  // Wenn in der wob_config.js oder config.js angegeben, werden die Funktionen/Button
  // der entsprechenden Werkzeuge ausgeblendet
  $('#buttonShare').toggle(!WOBConfig.gui.hideShareButton);
  $('#buttonShareHelpText').toggle(!WOBConfig.gui.hideShareButton);
  $('#buttonCoordinates').toggle(!WOBConfig.gui.hideCoordinatesButton);
  $('#buttonCoordinatesHelpText').toggle(!WOBConfig.gui.hideCoordinatesButton);
  $('#buttonMeasure').toggle(!WOBConfig.gui.hideMeasureButton);
  $('#buttonMeasureHelpText').toggle(!WOBConfig.gui.hideMeasureButton);
  $('#buttonExport').toggle(!WOBConfig.gui.hideExportButton);
  $('#buttonExportHelpText').toggle(!WOBConfig.gui.hideExportButton);

  // Startzustand des Auswahlfeldes der Messart setzen
  $('#measureType').val(WOBConfig.measure.initType).selectmenu("refresh");
  WOBMeasure.setMeasureType($('#measureType').val());

  // Startzustand der Positionsmarkierung beim Permalink
  $('#switchSharePosition').val(WOBConfig.share.markerOn ? 'on' : 'off').flipswitch("refresh");
  if(WOBConfig.share.markerOn) {
    WOBPermalink.enableMarker();
  }

  // Das Startfenster des Werkzeugfensters aktivieren
  WOBSubPanel.panelSelect('#panelTools', '#toolsPanelContent');
};

/**
 * Passt das GUI-Layout der Panels an die aktuelle Fenstergröße an
 */
WOBGui.updateLayout = function() {
  // Höhe des Inhalts im Fenster der Einstellungen
  $('#properties').height(window.innerHeight - 80);

  // Höhe des Inhalts im Fenster der Hilfe
  $('#help').height(window.innerHeight - 80);

  // Höhe des Inhalts im Fenster der Kartenthemen
  $('#panelTopics .ui-listview').height(window.innerHeight - 140);

  // Höhe des Inhalts im Fenster der Legende
  $('#legend').height(window.innerHeight - 80);

  // Höhe des Inhalts im Fenster der Kartenebenen
  $('#panelLayerAllDiv').height(window.innerHeight - 100);
  $('#panelLayerAll').height(window.innerHeight - 130);

  // Höhe des Inhalts im Fenster der Layer-Reihenfolge
  $('#panelLayerOrder').height(window.innerHeight - 100);
  $('#panelLayerOrder .ui-listview').height(window.innerHeight - 225);

  // Höhe des Inhalts im Fenster der FeatureInfo-Abfrage
  $('#featureInfoResults').height(window.innerHeight - 70);

  // Höhe des Inhalts im Fenster der Suche
  $('#search').height(window.innerHeight - 120);
  $('#searchResultsList').height(window.innerHeight - 265);

  // Höhe des Inhalts im Fenster der "Erweiterten Suche"
  $('#panelExtendedSearch .panel-content').height(window.innerHeight - 80);

  // Höhe des Inhalts im Fenster der Filter
  $('#panelSearchFilter .panel-content').height(window.innerHeight - 80);
  $('#seachFilter').height(window.innerHeight - 100);

  // Höhe des Inhalts im Fenster der Stadt- und Ortsteilsuche
  $('#panelSearchByArea .panel-content').height(window.innerHeight - 80);
  $('#searchAreas').height(window.innerHeight - 100);

  // Höhe des Inhalts im Fenster der Umkreissuche
  $('#panelUmkreissuche .panel-content').height('auto');

  // Höhe des Inhalts im Fenster der Werkzeuge
  $('#panelTools .panel-content').height(window.innerHeight - 80);

  // Höhe des Inhalts im Fenster des Kartenausschnitts teilen
  $('#panelShare .panel-content').height('auto');

  // Höhe des Inhalts im Fenster der Koordinatenabfrage
  $('#panelCoordinates .panel-content').height('auto');

  // Höhe des Inhalts im Fenster des Messens
  $('#panelMeasure .panel-content').height('auto');

  // Höhe des Inhalts im Fenster PDF-Druck
  $('#panelExport .panel-content').height('auto');

  // Anpassungen der Gui-Elemente der Karte
  WOBGui.updateMapLayout();
};

/**
 * Erzeugt die Auswahlmöglichkeiten für den Maßstab der Exporteinstellungen anhand der Angaben in der wob_config.js
 */
WOBGui.createExportScaleElements = function() {
  var html;

  if($('#exportScale').is(':empty')) {
    html = "";

    for (i = 0; i < WOBConfig.export.scales.length; i++) {
      html = html + '<option value="' + WOBConfig.export.scales[i]["value"] + '">' + WOBConfig.export.scales[i]["name"] + '</option>';
    }

    $('#exportScale').html(html);
    $('#exportScale').trigger('create');
  }

  $('#exportScale').val(WOBConfig.export.initScaleValue).selectmenu("refresh");
};

/**
 * Erzeugt die Auswahlmöglichkeiten für das Layout der Exporteinstellungen anhand der
 * QGIS-Projekteinstellungen
 */
WOBGui.createExportLayoutElements = function() {
  var html = "";

  var composerTemplates = WOBProjectSettings.data.composerTemplates;

  for (i = 0; i < composerTemplates.length; i++) {
    html = html + '<option value="' + composerTemplates[i].name + '">' + composerTemplates[i].name + '</option>';
  }

  $('#exportLayout').html(html);
  $('#exportLayout').trigger('create');

  // 1. Element auswählen
  $("#exportLayout")[0].selectedIndex = 0;
  $("#exportLayout").selectmenu("refresh");
};

/**
 * Soll die Umkreissuche aktiviert oder deaktiviert werden.
 */
WOBGui.statusUmkreissuche = function(activate) {
  if(activate) {
    WOBUmkreissuche.activate();

    // Wenn die Positionierung (Ortung) aktiviert ist, wird der Button zum Positionieren
    // der Umkreissuche auf den aktuellen Standort aktiviert
    if(Gui.tracking) {
      $('#buttonUmkreissucheOnLocation').removeClass('ui-disabled');
    }
  } else {
    // Deaktiviert die Umkreissuche und dessen Klick-Handler
    WOBUmkreissuche.clear();

    // Setzt den Radius-Schiebereglers der Umkreissuche auf den Standardwert
    $('#sliderUmkreissuche').val(WOBConfig.umkreissuche.startRadius);
    WOBGui.updateSliderMaxValue();

    WOBSearch.updateSearch = false;

    // Deaktiviert den Button zum Positionieren der Umkreissuche auf den aktuellen Standort
    $('#buttonUmkreissucheOnLocation').addClass('ui-disabled');
  }

  // Aktualisiert die Button Markierungen der Erweiterten Suche
  WOBGui.refreshButtonIconStatus();
};

/**
 * Passt den Schieberegler des Radius der Umkreissuche entsprechend dem aktuellen Kartenmaßstab an.
 */
WOBGui.updateSliderMaxValue = function() {
  // Der aktuelle Kartenmaßstab
  var lastScaleDenom = WOBMap.currentScaleDenom;
  var currentScaleDenom = WOBMap.getCurrentScaleDenom();

  var isLimited = false;

  if(lastScaleDenom != currentScaleDenom) {
    var scaleDenom;
    var maxRadius;
    var minRadius;
    var halfRadius;

    for (i = 0; i < WOBConfig.umkreissuche.scaleDenoms.length; i++) {
      scaleDenom = WOBConfig.umkreissuche.scaleDenoms[i][0];
      maxRadius = WOBConfig.umkreissuche.scaleDenoms[i][1];
      minRadius = WOBConfig.umkreissuche.minRadius;
      halfRadius = Math.round(((maxRadius-minRadius) / 2) + minRadius);

      if(currentScaleDenom <= scaleDenom && WOBUmkreissuche.currentRadius <= maxRadius) {
        // Markierungen unterhalb des Schiebereglers
        var ticks  = '<div class="sliderTickmarks "><span>' + minRadius + '&nbsp;m</span></div>';
        ticks += '<div class="sliderTickmarks "><span>' + halfRadius + '&nbsp;m</span></div>';
        ticks += '<div class="sliderTickmarks "><span>' + maxRadius + '&nbsp;m</span></div>';
        $("#sliderTickmarksUmkreissuche .sliderTickmarks").remove();
        $("#sliderTickmarksUmkreissuche .ui-slider-track").prepend(ticks);

        // Der maximale Wert des Schiebereglers
        $('#sliderUmkreissuche').attr("max", maxRadius);
        $('#sliderUmkreissuche').slider("refresh");
        isLimited = true;
        return;
      }
    }
  }

  // Maßstab größer
  if(!isLimited) {
    var ticks  = '<div class="sliderTickmarks "><span>100&nbsp;m</span></div>';
    ticks += '<div class="sliderTickmarks "><span>2500&nbsp;m</span></div>';
    ticks += '<div class="sliderTickmarks "><span>5000&nbsp;m</span></div>';
    $("#sliderTickmarksUmkreissuche .sliderTickmarks").remove();
    $("#sliderTickmarksUmkreissuche .ui-slider-track").prepend(ticks);

    $( "#sliderUmkreissuche" ).attr("max", 5000);
    $('#sliderUmkreissuche').slider("refresh");
  }
};

/**
 * Wird ein kleiner Bildschirm verwendet?
 */
WOBGui.isSmallDevice = function() {
  return !$.mobile.media("screen and (min-width : 1024px)");
};

/**
 * Markiert das Statusicon eines Buttons der Erweiterten Suche, wenn dessen Funktion verwendet wurde
 */
WOBGui.refreshButtonIconStatus = function() {
  // Wurde ein Suchfilter verwendet
  if(WOBSearchFilter.isChanged()) {
    WOBGui.setButtonIconStatus("#buttonSearchFilter", true);
  } else {
    WOBGui.setButtonIconStatus("#buttonSearchFilter", false);
  }

  // Wurde die Umkreissuche verwendet
  if(WOBUmkreissuche.isActivated()) {
    WOBGui.setButtonIconStatus("#buttonUmkreissuche", true);
  } else {
    WOBGui.setButtonIconStatus("#buttonUmkreissuche", false);
  }

  // Wurde die Stadt- und Ortsteilsuche verwendet
  if(WOBSearchByArea.isUsed) {
    WOBGui.setButtonIconStatus("#buttonSearchByArea", true);
  } else {
    WOBGui.setButtonIconStatus("#buttonSearchByArea", false);
  }

  // Wurden mindestens eine Funktion verwendet
  if(WOBSearchFilter.isChanged() || WOBUmkreissuche.isActivated() || WOBSearchByArea.isUsed) {
    WOBGui.setButtonIconStatus("#buttonExtendedSearch", true);
  } else {
    WOBGui.setButtonIconStatus("#buttonExtendedSearch", false);
  }
};

/**
 * Setzt den Status eines Buttons der Erweiterten Suche
 */
WOBGui.setButtonIconStatus = function(button, active) {
  if(active) {
    $(button).addClass('ui-icon-active');
    $(button + ' .ui-block-b').addClass('activeStatus');
    $(button + ' .ui-block-b').html(WOBTranslation.general.buttonStatusActivated[WOBGui.currentLanguage]);
  } else {
    $(button).removeClass('ui-icon-active');
    $(button + ' .ui-block-b').removeClass('activeStatus');
    $(button + ' .ui-block-b').html(WOBTranslation.general.buttonStatusDeactivated[WOBGui.currentLanguage]);
  }
};

/**
 * Gibt die aktuelle Sprache des GUIs zurück
 */
WOBGui.getCurrentLanguage = function() {
  if(WOBGui.currentLanguage == "") {
    return WOBConfig.gui.initLanguage;
  } else {
    return WOBGui.currentLanguage;
  }
};

/**
 * Scrollt ein div-Element (divID) zu einem Zielelement (targetId)
 */
WOBGui.scrollToElement = function(divID, targetId) {
  if(targetId == 0) {
    $(divID).scrollTop(0);
  } else {
    $(divID).scrollTop($(targetId).offset().top);
  }
};

/**
 * Fix für die Buttons auf einen mobilen Geräten.
 * Entfernt z.B. die Klick-Verzögerung
 */
WOBGui.buttonFix = function(e) {
  // Verhindert das zweimalige Ausführen des Tap-Events beim iPad
  e.preventDefault();
  // Verhindert, dass der Button als "gedrückt" Angezeigt wird.
  e.stopPropagation();
};

/**
 * Passt das GUI-Layout der Karte an die aktuelle Fenstergröße an
 */
WOBGui.updateMapLayout = function() {
  var attributions = $('#attributions');
  var scaleLine = $('#map .ol-scale-line');
  var compass = $('#btnCompass');

  var attributionsHeight = attributions.outerHeight(true);

  scaleLine.css("bottom", (attributionsHeight + 15) + "px" );
  compass.css("bottom", (attributionsHeight + 5) + "px" );
};

/**
 * Aktualisiert den Permalink im Textfeld
 */
WOBGui.updatePermalink = function(refreshAllData) {
  $('#shareURL').val(WOBPermalink.getPermalink(refreshAllData));
};

/**
 * Aktiviert/Deaktiviert die Zoombuttons
 */
WOBGui.showZoomButtons = function(show) {
  if(show) {
    $('#btnZoomIn').removeClass("btnHide");
    $('#btnZoomOut').removeClass("btnHide");
  } else {
    $('#btnZoomIn').addClass("btnHide");
    $('#btnZoomOut').addClass("btnHide");
  }
};

/**
 * Gibt die Prameter der übergebenen URL getrennt in einem Objekt zurück
 */
WOBGui.getUrlParams = function(url) {
  var urlParams = {};

  try {
    var urlArray = url.split('?');

    urlParams["server"] = urlArray[0];

    urlArray = urlArray[urlArray.length - 1].split('&');

    for (var i = 0; i < urlArray.length; i++) {
      var parameter = urlArray[i].split('=');
      urlParams[parameter[0]] = parameter[1];
    }
  }
  catch(err) {
    console.log("Fehler getUrlParams");
  }

  return urlParams;
};

/**
 * Funktion der verschachtelten Fenster (subPanel)
 */

var WOBSubPanel = {};

// Die aktuell aktivierten verschachtelten Fenster
WOBSubPanel.selectedPanel = {};

/**
 * Initialisierung die verschachtelten Fenster.
 */
WOBSubPanel.initSubPanels = function() {

  // Verhindert das Schließen eines mini-Panels durch Swipen
  $('[data-minipanel="true"]').on('swiperight', function(e) {
    WOBGui.buttonFix(e);
  });

  // Button zu der "Erweiterten Suche"
  $('#buttonExtendedSearch').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    // Die virtuelle Tastatur ausblenden
    $('#searchInput').blur();

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));
  });

  // Button zu den Suchfiltern
  $('#buttonSearchFilter').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));
  });

  // Button zu der Umkreissuche
  $('#buttonUmkreissuche').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));

    // Aktivieren die Umkreissuche
    WOBGui.statusUmkreissuche(true);
    // Zeigt die Umkreis in der Karte
    WOBUmkreissuche.show();
  });

  // Button zum Abbrechen der Umkreissuche
  $('#buttonCancelUmkreissuche').on('tap', function(e) {
    // Deaktiviert die Umkreissuche
    WOBGui.statusUmkreissuche(false);
  });

  // Button zur Stadt- und Ortsteilsuche
  $('#buttonSearchByArea').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));
  });

  // Button zur Hilfe
  $('#buttonHelp').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    var fileName = 'help_' + WOBGui.currentLanguage + '.html';

    // Die HTML-Datei mit dem Hilfe-Text laden
    $("#help").load(fileName + ' #helpContent', function () {
      $(this).trigger('create');

      $('.helpAnchor').on('tap', function(e) {
        var button = $(this);
        var headerHeight = $("#panelHelp .ui-header").outerHeight(true);
        $('#help').scrollTop($(WOBSubPanel.getName(button)).offset().top - headerHeight);
      });

    });

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));
    $("#help").scrollTop(0);
  });

  // Button zum Kartenausschnitt teilen
  $('#buttonShare').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));

    WOBPermalink.activate();
    WOBGui.updatePermalink ();
  });

  // Button zum PDF-Druck
  $('#buttonExport').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    var activated = WOBExport.activate();
    if(activated) {
      WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));
    }
  });

  // Button zum Messfenster
  $('#buttonMeasure').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));

    WOBMeasure.activate();
  });

  // Button zur Koordinatenabfrage
  $('#buttonCoordinates').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    WOBSubPanel.panelSelect(WOBSubPanel.getParentPanelName(button), WOBSubPanel.getName(button));

    WOBCoordinates.activate();
  });

  // Wird ein SubPanel geschloßen
  $('.subPanelClose').on('tap', function(e) {
    var button = $(this);
    WOBGui.buttonFix(e);

    // Wird das Fenster durch einen Ergebnisbutton geschlossen,
    // dann wird die Sucher neu ausgeführt
    if($(this).data('rel') == 'results') {
      WOBSearch.updateSearch = true;
      WOBSearch.submitSearch();
    }

    var parentPanelName = WOBSubPanel.getParentPanelName(button);

    // Wenn die letzte Ebene der verschachtelten Fenster erreicht wurde und das Hauptfenster geschlossen werden soll
    if(WOBSubPanel.getName(button) == "#") {
        $(parentPanelName).panel("close");
    } else {
      // Öffnet das Fenster, das im Attribut "href" des Schließen-Buttons steht
      WOBSubPanel.panelSelect(parentPanelName, WOBSubPanel.getName(button));
    }
  });
};

/**
 * Aktiviert das gewünschte verschachtelte Fenster und deaktiviert alle Anderen
 * panelName: das Hauptfenster
 * subPanelName: das verschachtelte Fenster
 */
WOBSubPanel.panelSelect = function(panelName, subPanelName) {
  subPanelName = subPanelName || panelName;

  // Fenster "Suche"
  if(panelName == '#panelSearch') {
    // Hauptfenster öffnen
    if(subPanelName == '#panelSearch' || subPanelName == '#') {
      subPanelName = '#searchPanelContent';
    }
    $('#searchPanelContent').toggle(subPanelName === '#searchPanelContent');
    $('#panelExtendedSearch').toggle(subPanelName === '#panelExtendedSearch');
    $('#panelSearchFilter').toggle(subPanelName === '#panelSearchFilter');
    $('#panelUmkreissuche').toggle(subPanelName === '#panelUmkreissuche');
    $('#panelSearchByArea').toggle(subPanelName === '#panelSearchByArea');
  // Fenster "Einstellungen"
  } else if(panelName == '#panelProperties') {
    // Hauptfenster öffnen
    if(subPanelName == '#panelProperties' || subPanelName == '#') {
      subPanelName = '#propertiesPanelContent';
    }
    $('#propertiesPanelContent').toggle(subPanelName === '#propertiesPanelContent');
    $('#panelHelp').toggle(subPanelName === '#panelHelp');
  // Fenster "Werkzeuge"
  } else if(panelName == '#panelTools') {
    // Hauptfenster öffnen
    if(subPanelName == '#panelTools' || subPanelName == '#') {
      subPanelName = '#toolsPanelContent';
    }
    $('#toolsPanelContent').toggle(subPanelName === '#toolsPanelContent');
    $('#panelShare').toggle(subPanelName === '#panelShare');
    $('#panelExport').toggle(subPanelName === '#panelExport');
    $('#panelMeasure').toggle(subPanelName === '#panelMeasure');
    $('#panelCoordinates').toggle(subPanelName === '#panelCoordinates');
  }

  // Wird das Fenster der Umkreissuche geschlossen
  if(WOBSubPanel.selectedPanel[panelName] == '#panelUmkreissuche' && subPanelName != '#panelUmkreissuche') {
    // Die Handler der Umkreissuche deaktivieren
    WOBUmkreissuche.deactivateHandler();
  }

  // Wird das Fenster zum Teilen des Kartenausschnitts geschlossen
  if(WOBSubPanel.selectedPanel[panelName] == '#panelShare' && subPanelName != '#panelShare') {
    // Positionsmarkierung deaktivieren
    WOBPermalink.deactivate();
  }

  // Wird das Fenster zum PDF-Druck geschlossen
  if(WOBSubPanel.selectedPanel[panelName] == '#panelExport' && subPanelName != '#panelExport') {
    // Die Exportfunktion zurücksetzen
    WOBExport.clear();

    // Standarteinstellung wiederherstellen
    $('#exportScale').val(WOBConfig.export.initScaleValue).selectmenu("refresh");
    // 1. Layout auswählen
    $("#exportLayout")[0].selectedIndex = 0;
    $("#exportLayout").selectmenu("refresh");
  }

  // Wird das Fenster zum Messen geschlossen
  if(WOBSubPanel.selectedPanel[panelName] == '#panelMeasure' && subPanelName != '#panelMeasure') {
    // Messfunktion deaktivieren
    WOBMeasure.deactivate();
  }

  // Wird das Fenster der Koordinatenabfrage geschlossen
  if(WOBSubPanel.selectedPanel[panelName] == '#panelCoordinates' && subPanelName != '#panelCoordinates') {
    // Koordinatenabfrage deaktivieren
    WOBCoordinates.deactivate();
  }

  // Das aktuell ausgewählte verschachtelte Fenster für
  // das eigentliche Hauptfenster (Panel) zwischenspeichern
  WOBSubPanel.selectedPanel[panelName] = subPanelName;

  // Soll das Fenster als Vollbild angezeigt werden?
  if(WOBSubPanel.isForceFullScreen(subPanelName)) {
    $(panelName).addClass('force-full-screen');
  } else {
    $(panelName).removeClass('force-full-screen');
  }

  // Ist das Fenster eine minimierte Version (z.B. die Werkzeuge)
  if(WOBSubPanel.isMinimizedSubPanel(subPanelName)) {
    $(panelName).addClass('ui-minimized-sub-panel');
    $('.ui-panel-dismiss').addClass("disable-dismiss");
    $('#map .ui-btn-icon-notext:not(#btnCompass)').css({"visibility": "hidden"});
    $('#map .ui-btn-icon-top:not(#btnCompass)').css({"visibility": "hidden"});
  } else {
    $(panelName).removeClass('ui-minimized-sub-panel');
    $('.ui-panel-dismiss').removeClass("disable-dismiss");
    $('#map .ui-btn-icon-notext:not(#btnCompass)').css({"visibility": "visible"});
    $('#map .ui-btn-icon-top:not(#btnCompass)').css({"visibility": "visible"});
  }
};

/**
 * Gibt das Panel zurück, das im Attribut "href" des übergebenen Buttons steht.
 */
WOBSubPanel.getName = function(button) {
  return button.attr('href');
};

/**
 * Gibt das Panel des übergebenen Buttons zurück.
 */
WOBSubPanel.getParentPanelName = function(button) {
  return "#" + button.closest('[data-role="panel"]').attr("id");
};

/**
 * Ist das Panel ein minipanel? (z.B. die Werkzeuge)
 */
WOBSubPanel.isMinimizedSubPanel = function(subPanelName) {
  if($(subPanelName).attr("data-minipanel") == "true") {
    return true;
  } else {
    return false;
  }
};

/**
 * Soll das SubPanel im Vollbild gestartet werden?
 */
WOBSubPanel.isForceFullScreen = function(subPanelName) {
  if($(subPanelName).attr("data-forcefullscreen") == "true") {
    return true;
  } else {
    return false;
  }
};

/**
 * Gibt das subPanel aus dem nächsten Zurück/Schließen-Buttons zurück
 */
WOBSubPanel.getPreviousSubPanelName = function(panelName) {
  var previousSubPanelName = panelName;

  if(WOBSubPanel.selectedPanel.hasOwnProperty(panelName)) {
    var subPanelName = WOBSubPanel.selectedPanel[panelName];

    previousSubPanelName = $(subPanelName + ' .ui-header [data-rel="close"]').first().attr("href");

    if(!previousSubPanelName) {
      previousSubPanelName = $(subPanelName + ' .ui-header [data-rel="back"]').first().attr("href");
    }

    if(!previousSubPanelName) {
      previousSubPanelName = panelName;
    }
  }
  return previousSubPanelName;
};

/**
 * Ist ein SubPanel aktuell aktiviert?
 */
WOBSubPanel.isSubPanelSelected = function(panelName, subPanelName) {
  if(WOBSubPanel.selectedPanel.hasOwnProperty(panelName)) {
    if(WOBSubPanel.selectedPanel[panelName] == subPanelName) {
      return true;
    }
  }
  return false;
};
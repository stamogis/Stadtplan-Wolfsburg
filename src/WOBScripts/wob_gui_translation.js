/**
 * Passt die Bezeichnungen bzw. Übersetzungen der einzelnen Elemente der GUI an
 */

var WOBGuiTranslation = {};

// Aktuelle Sprache
WOBGuiTranslation.currentLanguage = "";

/**
 * Setzt die aktuell verwendete Sprache
 */
WOBGuiTranslation.setCurrentLanguage = function(lang) {
  WOBGuiTranslation.currentLanguage = lang;
  WOBGui.currentLanguage = lang;
};

/**
 * Bezeichnungen bzw. Übersetzungen der GUI-Elemente anpassen
 */
WOBGuiTranslation.update = function(lang) {

  // Ist die angegebene Sprache nicht vorhanden, dann wird auf die Standartsprache gewechselt
  var language = "";
  if(lang != undefined && WOBTranslation.availableLanguages.indexOf(lang) != -1) {
    language = lang;
  } else {
    language = WOBConfig.gui.initLanguage;
  }

  // (Browser) Titel
  document.title = WOBTranslation.title[language];

  // Allgemeine Elemente
  $('[data-rel="close"]').html(WOBTranslation.general.buttonClose[language]);
  $('[data-rel="back"]').html(WOBTranslation.general.buttonBack[language]);

  // Elemente der Karte
  $('#btnSearching').html(WOBTranslation.map.btnSearching[language]);
  $('#btnLocation').html(WOBTranslation.map.btnLocation[language]);
  $('#btnTools').html(WOBTranslation.map.btnTools[language]);
  $('#btnProperties').html(WOBTranslation.map.btnProperties[language]);
  $('#btnLayers').html(WOBTranslation.map.btnLayers[language]);

  // Elemente des Einstellungsfensters
  $('#panelProperties h1').html(WOBTranslation.panelProperties.header[language]);
  $('#buttonHelp').html(WOBTranslation.panelProperties.buttonHelp[language]);
  $('#buttonLogo').html(WOBTranslation.panelProperties.buttonAbout[language]);

  // Elemente des Einstellungsfensters - Sprachauswahl
  $('#panelProperties label[for=languageSelection]').html(WOBTranslation.panelProperties.languageSelectionLabel[language]);
  $('#languageSelection option[value="de"]').html(WOBTranslation.language.de[language]);
  $('#languageSelection option[value="en"]').html(WOBTranslation.language.en[language]);
  $('#languageSelection').selectmenu( "refresh" );

  // Elemente des Einstellungsfensters  - Kartennachführung
  $('#panelProperties label[for=switchFollow]').html(WOBTranslation.panelProperties.switchFollowLabel[language]);
  $('#switchFollow').flipswitch( "option", "offText", WOBTranslation.general.switchOff[language]);
  $('#switchFollow').flipswitch( "option", "onText", WOBTranslation.general.switchOn[language]);

  // Elemente des Einstellungsfensters  - Kartenausrichtung
  $('#panelProperties label[for=switchOrientation]').html(WOBTranslation.panelProperties.switchOrientationLabel[language]);
  $('#switchOrientation').flipswitch( "option", "offText", WOBTranslation.general.switchOff[language]);
  $('#switchOrientation').flipswitch( "option", "onText", WOBTranslation.general.switchOn[language]);

  // Elemente des Einstellungsfensters  - Maßstabsbalken
  $('#panelProperties label[for=switchScale]').html(WOBTranslation.panelProperties.switchScaleLabel[language]);
  $('#switchScale').flipswitch( "option", "offText", WOBTranslation.general.switchOff[language]);
  $('#switchScale').flipswitch( "option", "onText", WOBTranslation.general.switchOn[language]);

  // Elemente des Einstellungsfensters  - Zoombuttons
  $('#panelProperties label[for=switchZoom]').html(WOBTranslation.panelProperties.switchZoomLabel[language]);
  $('#switchZoom').flipswitch( "option", "offText", WOBTranslation.general.switchOff[language]);
  $('#switchZoom').flipswitch( "option", "onText", WOBTranslation.general.switchOn[language]);

  // Elemente des Hilfefensters
  $('#panelHelp h1').html(WOBTranslation.panelHelp.header[language]);

  // Elemente des Layerfensters
  $('#panelLayer h1').html(WOBTranslation.panelLayer.header[language]);
  $('#buttonTopics').html(WOBTranslation.panelLayer.buttonTopics[language]);
  $('#buttonLayerAll').html(WOBTranslation.panelLayer.buttonLayerAll[language]);
  $('#buttonLayerOrder').html(WOBTranslation.panelLayer.buttonLayerOrder[language]);

  // Elemente des Fensters "Themen"
  $('#panelTopicsHelpText').html(WOBTranslation.panelTopics.panelTopicsHelpText[language]);

  // Elemente des Fensters "Ebenen"
  $('#panelLayerAllHelpText').html(WOBTranslation.panelLayerAll.panelLayerAllHelpText[language]);

  // Elemente des Fensters "Reihenfolge"
  $('#panelLayerOrderHelpText').html(WOBTranslation.panelLayerOrder.panelLayerOrderHelpText[language]);
  $('#sliderTransparency-label').html(WOBTranslation.panelLayerOrder.sliderTransparencyLabel[language]);
  $('#sliderTransparencyHelpText').html(WOBTranslation.panelLayerOrder.sliderTransparencyHelpText[language]);

  // Elemente des Suchfensters
  $('#panelSearch h1').html(WOBTranslation.panelSearch.header[language]);
  $('#buttonResetSearch').html(WOBTranslation.panelSearch.buttonResetSearch[language]);
  $('#panelSearch [data-rel="results"]').html(WOBTranslation.panelSearch.buttonSearchResults[language]);
  $('#searchInput').attr("placeholder", WOBTranslation.panelSearch.searchInputPlaceholder[language]);
  $('#buttonExtendedSearch .ui-block-a').html(WOBTranslation.panelSearch.buttonExtendedSearch[language]);
  $('#buttonExtendedSearch .ui-block-b').html($('#buttonExtendedSearch .ui-block-b').hasClass('activeStatus') ? WOBTranslation.general.buttonStatusActivated[language] : WOBTranslation.general.buttonStatusDeactivated[language]);
  $('#buttonExtendedSearchHelpText').html(WOBTranslation.panelSearch.buttonExtendedSearchHelpText[language]);
  $('#panelSearch #searchResults b').html(WOBTranslation.panelSearch.searchResults[language]);

  // Elemente der Fensters "Erweiterte Suche"
  $('#panelExtendedSearch h1').html(WOBTranslation.panelExtendedSearch.header[language]);
  $('#buttonSearchFilter .ui-block-a').html(WOBTranslation.panelExtendedSearch.buttonSearchFilter[language]);
  $('#buttonSearchFilter .ui-block-b').html($('#buttonSearchFilter .ui-block-b').hasClass('activeStatus') ? WOBTranslation.general.buttonStatusActivated[language] : WOBTranslation.general.buttonStatusDeactivated[language]);
  $('#buttonSearchFilterHelpText').html(WOBTranslation.panelExtendedSearch.buttonSearchFilterHelpText[language]);
  $('#buttonSearchByArea .ui-block-a').html(WOBTranslation.panelExtendedSearch.buttonSearchByArea[language]);
  $('#buttonSearchByArea .ui-block-b').html($('#buttonSearchByArea .ui-block-b').hasClass('activeStatus') ? WOBTranslation.general.buttonStatusActivated[language] : WOBTranslation.general.buttonStatusDeactivated[language]);
  $('#buttonSearchByAreaHelpText').html(WOBTranslation.panelExtendedSearch.buttonSearchByAreaHelpText[language]);
  $('#buttonUmkreissuche .ui-block-a').html(WOBTranslation.panelExtendedSearch.buttonUmkreissuche[language]);
  $('#buttonUmkreissuche .ui-block-b').html($('#buttonUmkreissuche .ui-block-b').hasClass('activeStatus') ? WOBTranslation.general.buttonStatusActivated[language] : WOBTranslation.general.buttonStatusDeactivated[language]);
  $('#buttonUmkreissucheHelpText').html(WOBTranslation.panelExtendedSearch.buttonUmkreissucheHelpText[language]);

  // Elemente des Fensters "Filter"
  $('#panelSearchFilter h1').html(WOBTranslation.panelSearchFilter.header[language]);
  $('#panelSearchFilterHelpText').html(WOBTranslation.panelSearchFilter.panelSearchFilterHelpText[language]);

  // Elemente des Fensters "Stadt- und Ortsteilsuche"
  $('#panelSearchByArea h1').html(WOBTranslation.panelSearchByArea.header[language]);
  $('#panelSearchByAreaHelpText').html(WOBTranslation.panelSearchByArea.panelSearchByAreaHelpText[language]);

  // Elemente des Fensters "Umkreissuche"
  $('#panelUmkreissuche h1').html(WOBTranslation.panelUmkreissuche.header[language]);
  $('#buttonCancelUmkreissuche').html(WOBTranslation.panelUmkreissuche.buttonCancelUmkreissuche[language]);
  $('#panelUmkreissucheHelpText').html(WOBTranslation.panelUmkreissuche.panelUmkreissucheHelpText[language]);
  $('#buttonUmkreissucheOnLocation').html(WOBTranslation.panelUmkreissuche.buttonUmkreissucheOnLocation[language]);

  // Elemente des Fensters "Werkzeuge"
  $('#panelTools h1').html(WOBTranslation.panelTools.header[language]);
  $('#buttonShare').html(WOBTranslation.panelTools.buttonShare[language]);
  $('#buttonShareHelpText').html(WOBTranslation.panelTools.buttonShareHelpText[language]);
  $('#buttonCoordinates').html(WOBTranslation.panelTools.buttonCoordinates[language]);
  $('#buttonCoordinatesHelpText').html(WOBTranslation.panelTools.buttonCoordinatesHelpText[language]);
  $('#buttonMeasure').html(WOBTranslation.panelTools.buttonMeasure[language]);
  $('#buttonMeasureHelpText').html(WOBTranslation.panelTools.buttonMeasureHelpText[language]);
  $('#buttonExport').html(WOBTranslation.panelTools.buttonExport[language]);
  $('#buttonExportHelpText').html(WOBTranslation.panelTools.buttonExportHelpText[language]);

  // Elemente des Fensters "Versenden"
  $('#panelShare h1').html(WOBTranslation.panelShare.header[language]);
  $('#buttonSendURL').html(WOBTranslation.panelShare.buttonSendURL[language]);
  $('#panelShareHelpText').html(WOBTranslation.panelShare.panelShareHelpText[language]);
  $('#panelShare label[for=shareURL]').html(WOBTranslation.panelShare.shareURLLabel[language]);

  // Elemente des Fensters "Versenden" - Positionsmarkierung
  $('#panelShare label[for=switchSharePosition]').html(WOBTranslation.panelShare.switchSharePositionLabel[language]);
  $('#switchSharePosition').flipswitch( "option", "offText", WOBTranslation.general.switchOff[language]);
  $('#switchSharePosition').flipswitch( "option", "onText", WOBTranslation.general.switchOn[language]);

  // Elemente des Fensters "Koordinatenabfrage"
  $('#panelCoordinates h1').html(WOBTranslation.panelCoordinates.header[language]);
  $('#panelCoordinatesHelpText').html(WOBTranslation.panelCoordinates.panelCoordinatesHelpText[language]);
  $('#panelCoordinates label[for=coordinates]').html(WOBTranslation.panelCoordinates.coordinatesLabel[language]);
  $('#coordinates').attr("placeholder", WOBTranslation.panelCoordinates.coordinatesInputPlaceholder[language]);
  $('#coordinatesFormat').html(WOBTranslation.panelCoordinates.coordinatesFormat[language]);

  // Elemente des Fensters "Messen"
  $('#panelMeasure h1').html(WOBTranslation.panelMeasure.header[language]);
  $('#panelMeasureHelpText').html(WOBTranslation.panelMeasure.panelMeasureHelpText[language]);

  // Elemente des Fensters "Messen" - Messart
  $('#panelMeasure label[for=measureType]').html(WOBTranslation.panelMeasure.measureTypeLabel[language]);
  $('#measureType option[value="length"]').html(WOBTranslation.panelMeasure.measureTypeLength[language]);
  $('#measureType option[value="area"]').html(WOBTranslation.panelMeasure.measureTypeArea[language]);

  // Elemente des Fensters "Export"
  $('#panelExport h1').html(WOBTranslation.panelExport.header[language]);
  $('#buttonPDFExport').html(WOBTranslation.panelExport.buttonPDFExport[language]);
  $('#panelExportHelpText').html(WOBTranslation.panelExport.panelExportHelpText[language]);
  $('#panelExport label[for=exportLayout]').html(WOBTranslation.panelExport.exportLayoutLabel[language]);
  $('#panelExport label[for=exportScale]').html(WOBTranslation.panelExport.exportScaleLabel[language]);

  // Elemente des Popup-Fensters
  $('#popup h1').html(WOBTranslation.popup.header[language]);

  // Elemente des Fensters der GetFeatureInfo-Abfrage
  $('#panelFeatureInfo h1').html(WOBTranslation.panelFeatureInfo.header[language]);

  // Die neue Sprache setzen
  WOBGuiTranslation.setCurrentLanguage(language);

  // Das Auswahlfeld der Sprache aktualisieren
  // (z.B. für den Fall, wenn auf die Standartsprache gewechselt werden musste)
  $('#languageSelection').val(language).selectmenu("refresh");
};
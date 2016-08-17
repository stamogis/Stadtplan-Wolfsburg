/**
 * Bezeichbnungen und Übersetzungen der GUI-Elemente
 */

// Verfügbare Sprachen
var WOBTranslation = {
  availableLanguages: ["de", "en"]
};

/**
 * Sprachen
 */
WOBTranslation.language = {
  de: {
    de: "Deutsch",
    en: "German"
  },
  en: {
    de: "Englisch",
    en: "English"
  }
};

/**
 * Allgemein
 */
WOBTranslation.general = {
  buttonClose: {
    de: "Schließen",
    en: "Close"
  },
  buttonBack: {
    de: "Zurück",
    en: "Back"
  },
  switchOn: {
    de: "Ein",
    en: "On"
  },
  switchOff: {
    de: "Aus",
    en: "Off"
  },
  buttonStatusActivated: {
    de: "Aktiviert",
    en: "Activated"
  },
  buttonStatusDeactivated: {
    de: "Deaktiviert",
    en: "Deactivated"
  }
};

/**
 * Webseiten-Titel
 */
WOBTranslation.title = {
  de: "Mobile Viewer (OL3)",
  en: "Mobile Viewer (OL3)"
};

/**
 * Elemente der Karte
 */
WOBTranslation.map = {
  copyright: {
    de: '&copy; Copyright-Hinweis, <a href="" target="_blank">Impressum</a>',
    en: '&copy; Copyright-Info, <a href="" target="_blank">Impressum</a>'
  },
  btnSearching: {
    de: "Suche",
    en: "Search"
  },
  btnLocation: {
    de: "Ortung",
    en: "Location"
  },
  btnTools: {
    de: "Werkzeuge",
    en: "Tools"
  },
  btnProperties: {
    de: "Einstellungen",
    en: "Settings"
  },
  btnLayers: {
    de: "Karten",
    en: "Maps"
  }
};

/**
 * Elemente des Einstellungsfensters
 */
WOBTranslation.panelProperties = {
  header: {
    de: "Einstellungen",
    en: "Settings"
  },
  languageSelectionLabel: {
    de: "Sprache",
    en: "Language"
  },
  switchFollowLabel: {
    de: "Kartennachf&uuml;hrung",
    en: "Map following"
  },
  switchOrientationLabel: {
    de: "Kartenausrichtung",
    en: "Map rotation"
  },
  switchScaleLabel:  {
    de: "Maßstabsbalken",
    en: "Scale"
  },
  switchZoomLabel:  {
    de: "Vergrößern / Verkleinern",
    en: "Zoom in / out"
  },
  buttonHelp: {
    de: "Hilfe",
    en: "Help"
  },
  buttonAbout: {
    de: "Impressum",
    en: "Impressum"
  }
};

/**
 * Elemente des Layerfensters
 */
WOBTranslation.panelHelp = {
  header: {
    de: "Hilfe",
    en: "Help"
  }
};

/**
 * Elemente des Layerfensters
 */
WOBTranslation.panelLayer = {
  header: {
    de: "Themen & Ebenen",
    en: "Topics & Layers"
  },
  buttonTopics: {
    de: "Themen",
    en: "Topics"
  },
  buttonLayerAll: {
    de: "Ebenen",
    en: "Layers"
  },
  buttonLayerOrder: {
    de: "Reihenfolge",
    en: "Order"
  }
};

/**
 * Elemente des Fensters "Themen"
 */
WOBTranslation.panelTopics = {
  panelTopicsHelpText: {
    de: "Wählen Sie eine Karte aus den verschiedenen Themenbereichen aus.",
    en: "Select a map from different topics."
  }
};

/**
 * Elemente des Fensters "Ebenen"
 */
WOBTranslation.panelLayerAll = {
  panelLayerAllHelpText: {
    de: "Schalten Sie einzelne Kartenebenen ein oder aus.",
    en: "Switch layers On / Off."
  }
};

/**
 * Elemente des Fensters "Reihenfolge"
 */
WOBTranslation.panelLayerOrder = {
  panelLayerOrderHelpText: {
   de: "Ordnen Sie die Ebenen durch Verschieben neu an.",
    en: "Change the order of the layers."
  },
  sliderTransparencyLabel: {
    de: "Transparenz",
    en: "Transparency"
  },
  sliderTransparencyHelpText: {
    de: "Passen Sie die Transparenz der Ebene an.",
    en: "Adjust the transparency of the layer."
  }
};

/**
 * Elemente des Suchfensters
 */
WOBTranslation.panelSearch = {
  header: {
    de: "Suche",
    en: "Search"
  },
  buttonResetSearch: {
    de: "Neue Suche",
    en: "New search"
  },
  buttonSearchResults: {
    de: "Ergebnisse",
    en: "Results"
  },
  searchInputPlaceholder: {
    de: "Suchbegriff",
    en: "Search term"
  },
  buttonSearch: {
    de: "Suchen",
    en: "Search"
  },
  buttonExtendedSearch: {
    de: "Erweiterte Suche",
    en: "Advanced search"
  },
  buttonExtendedSearchHelpText: {
    de: "Suche nach Themen, Stadt- oder Ortsteilen oder innerhalb eines Umkreises.",
    en: "Search for topics, districts or within a defined area"
  },
  searchResults: {
    de: "Suchergebnis",
    en: "Search result"
  },
  // Fehlermeldungen
  failed: {
    de: "Kein Suchergebnis",
    en: "No search result"
  },
  resultIsLimited: {
    de: 'Es werden nur die ersten ' + WOBConfig.search.resultLimit + ' Ergebnisse angezeigt.<br/>Bitte verfeinern Sie Ihre Suche.',
    en: 'Only the first ' + WOBConfig.search.resultLimit + ' results are displayed.<br/>Please narrow your search."'
  },
  // Fehlermeldungen: Sucheingabe
  noFeatureFoundInput: {
    de: "Für Ihre Suchanfrage wurde kein Suchergebnis gefunden.<br/>Bitte ändern Sie Ihren Suchbegriff.",
    en: "No search result found. Please change your search term."
  },
  // Fehlermeldungen: Umkreissuche
  noFeatureFoundUmkreissuche: {
    de: "Es wurde kein Suchergebnis in Ihrem Umkreis gefunden.<br/>Bitte vergrößern Sie den Radius Ihrer Umkreissuche.",
    en: "No search result found.<br/>Please extend your search area."
  },
  // Fehlermeldungen: Alle Filter deaktiviert
  noFeatureFoundFilterNothingChecked: {
    de: "Kein Filter aktiviert.<br/>Bitte aktivieren Sie mindestens einen Filter unter der &quot;Erweiterten Suche&quot;.",
    en: "No filter activated.<br/>Please activate at least one filter in &quot;Advanced search&quot;."
  },
  // Fehlermeldungen: Filter
  noFeatureFoundFilter: {
    de: "Es wurde kein übereinstimmendes Suchergebnis zu Ihren Suchfiltern gefunden.<br/>Bitte ändern Sie Ihre Suchfilter.",
    en: "No search result found.<br/>Please change your filter."
  },
  // Fehlermeldungen: Stadt- und Ortsteilsuche
  noFeatureFoundSearchByArea: {
    de: "Es wurde kein Suchergebnis zu Ihrer Stadt- und Ortsteilsuche gefunden.",
    en: "No search result found.<br/>Please change your district."
  },
  // Fehlermeldungen: Sucheingabe & Umkreissuche
  noFeatureFoundInputAndUmkreissuche: {
    de: "Es wurde kein übereinstimmendes Suchergebnis in Ihrem Umkreis gefunden.<br/>Bitte vergrößern Sie den Radius Ihrer Umkreissuche oder ändern Sie Ihren Suchbegriff.",
    en: "No search result found.<br/>Please extend your search area or change your search term."
  },
  // Fehlermeldungen: Sucheingabe & Filter
  noFeatureFoundInputAndFilter: {
    de: "Es wurde kein übereinstimmendes Suchergebnis gefunden.<br/>Bitte ändern Sie Ihren Suchbegriff oder Ihre Suchfilter.",
    en: "No search result found.<br/>Please change your search term or filter."
  },
  // Fehlermeldungen: Sucheingabe & Stadt- und Ortsteilsuche
  noFeatureFoundInputAndSearchByArea: {
    de: "Es wurde kein übereinstimmendes Objekt in Ihrem ausgewählten Stadt- oder Ortsteil gefunden.<br/>Bitte ändern Sie Ihren Suchbegriff oder wählen Sie einen anderen Stadt- oder Ortsteil aus.",
    en: "No search result found in the district you have selected.<br/>Please change your search term or district."
  },
  // Fehlermeldung
  requestFailed: {
    de: "Die Suchanfrage ist fehlgeschlagen:",
    en: "The search request failed:"
  }
};

/**
 * Elemente der Fensters "Erweiterte Suche"
 */
WOBTranslation.panelExtendedSearch = {
  header: {
    de: "Erweiterte Suche",
    en: "Advanced search"
  },
  buttonSearchFilter: {
    de: "Filter",
    en: "Filter"
  },
  buttonSearchFilterHelpText: {
    de: "Suchergebnisse auf einzelne Themenbereiche begrenzen.",
    en: "Limit search results to topics."
  },
  buttonSearchByArea: {
    de: "Stadt- und Ortsteilsuche",
    en: "District based search"
  },
  buttonSearchByAreaHelpText: {
    de: "Suchergebnisse auf einen Stadt- oder Ortsteil begrenzen.",
    en: "Limit search results to one district."
  },
  buttonUmkreissuche: {
    de: "Umkreissuche",
    en: "Search radius"
  },
  buttonUmkreissucheHelpText: {
    de: "Suchergebnisse auf einen selbstdefinerten Umkreis festlegen.",
    en: "Define search results to one radius."
  }
};

/**
 * Elemente des Fensters "Filter"
 */
WOBTranslation.panelSearchFilter = {
  header: {
    de: "Filter",
    en: "Filter"
  },
  panelSearchFilterHelpText: {
    de: "Auswahl einer oder mehrerer Themen für die Suche.",
    en: "Select one or more topics for your search."
  }
};

/**
 * Elemente des Fensters "Stadt- und Ortsteilsuche"
 */
WOBTranslation.panelSearchByArea = {
  header: {
    de: "Stadt- und Ortsteilsuche",
    en: "Search by district"
  },
  panelSearchByAreaHelpText: {
    de: "Wählen Sie einen Stadt- oder Ortsteil aus.",
    en: "Choose a district."
  }
};

/**
 * Elemente des Fensters "Umkreissuche"
 */
WOBTranslation.panelUmkreissuche = {
  header: {
    de: "Umkreissuche",
    en: "Search radius"
  },
  buttonCancelUmkreissuche: {
    de: "Abbrechen",
    en: "Cancel"
  },
  panelUmkreissucheHelpText: {
    de: "Positionieren Sie den Umkreis durch Klicken/Tippen in die Karte.",
    en: "Position the perimeter by clicking/tap the map."
  },
  buttonUmkreissucheOnLocation: {
    de: "Auf Standort positionieren",
    en: "Position by location"
  }
};

/**
 * Elemente des Fensters "Werkzeuge"
 */
WOBTranslation.panelTools = {
  header: {
    de: "Werkzeuge",
    en: "Tools"
  },
  buttonShare: {
    de: "Kartenausschnitt teilen",
    en: "Share map"
  },
  buttonShareHelpText: {
    de: "Versenden der aktuellen Kartendarstellung.",
    en: "Send current map view."
  },
  buttonCoordinates: {
    de: "Koordinaten abfragen",
    en: "Get coordinates"
  },
  buttonCoordinatesHelpText: {
    de: "Koordinaten aus der Karte ermitteln.",
    en: "Get coordinates of one position."
  },
  buttonMeasure: {
    de: "Messen",
    en: "Measure"
  },
  buttonMeasureHelpText: {
    de: "Strecken oder Flächen messen.",
    en: "Measure distance or area."
  },
  buttonExport: {
    de: "PDF-Druck",
    en: "Print PDF"
  },
  buttonExportHelpText: {
    de: "Den aktuellen Kartenausschnitt als PDF-Dokument ausgeben.",
    en: "Export current map as PDF."
  }
};

/**
 * Elemente des Fensters "Teilen"
 */
WOBTranslation.panelShare = {
  header: {
    de: "Teilen",
    en: "Share"
  },
  buttonSendURL: {
    de: "Versenden",
    en: "Send"
  },
  panelShareHelpText: {
   de: "Mit dem unten stehenden Link kann der aktuelle Kartenausschnitt mit oder ohne Stecknadel per Mail versendet werden. Durch Klick/Tip in die Karte, wird die Stecknadel neu positioniert.",
    en: "With this URL you can send the current map with or without the pin by email. Click/Tap in the map to change the position of the pin."
  },
  switchSharePositionLabel: {
    de: "Stecknadel",
    en: "Pin"
  },
  shareURLLabel: {
    de: "URL",
    en: "URL"
  },
  sendTitle: {
    de: "Link vom Mobile Viewer (OL3)",
    en: "URL from Mobile Viewer (OL3)"
  }
};

/**
 * Elemente des Fensters "Koordinatenabfrage"
 */
WOBTranslation.panelCoordinates = {
  header: {
    de: "Koordinaten",
    en: "Coordinates"
  },
  panelCoordinatesHelpText: {
    de: "Klicken/Tippen Sie in die Karte, um die Koordinate dieser Position zu ermitteln.",
    en: "Click/Tap in the map to get the coordinates of this position."
  },
  coordinatesLabel: {
    de: "Koordinate:",
    en: "Coordinate:"
  },
  coordinatesInputPlaceholder: {
    de: "Ostwert Nordwert",
    en: "easting northing"
  },
  coordinatesFormat: {
    de: "Koordinaten (Ostwert, Nordwert)",
    en: "coordinates (easting, northing)"
  }
};

/**
 * Elemente des Fensters "Messen"
 */
WOBTranslation.panelMeasure = {
  header: {
    de: "Messen",
    en: "Measure"
  },
  panelMeasureHelpText: {
    de: "Wählen Sie Ihre gewünschte Messart aus und klicken/tippen Sie in die Karte, um das Messen zu starten. Jeder weitere Klick/Tip fügt einen weiteren Messpunkt hinzu und ein Doppelklick/Doppeltip beendet das Messen.",
    en: "Choose your measure type and click/tap in the map to start measuring. Click/Tap to ad a new measure point and double click/tap to finish."
  },
  measureTypeLabel: {
    de: "Messart:",
    en: "Measure type:"
  },
  measureTypeLength: {
    de: "Strecke",
    en: "Length"
  },
  measureTypeArea: {
    de: "Fläche",
    en: "Area"
  }
};

/**
 * Elemente des Fensters "PDF-Druck"
 */
WOBTranslation.panelExport = {
  header: {
    de: "Druckeinstellungen",
    en: "Print settings"
  },
  buttonPDFExport: {
    de: "Drucken",
    en: "Print"
  },
  panelExportHelpText: {
    de: "Wählen Sie zunächst Druckformat und Maßstab aus und positionieren Sie anschließend den Druckrahmen.",
    en: "Select print size and scale first. Then position the print frame."
  },
  exportLayoutLabel: {
    de: "Format",
    en: "Format"
  },
  exportScaleLabel: {
    de: "Maßstab",
    en: "Scale"
  },
  noExportLayoutFound: {
    de: "Das Drucken dieses Themas ist nicht möglich.",
    en: "Printing is not possible for this topic."
  }
};

/**
 * Elemente des Popup-Fensters
 */
WOBTranslation.popup = {
  header: {
    de: "Hinweis",
    en: "Information"
  }
};

/**
 * Elemente des Fensters der GetFeatureInfo-Abfrage
 */
WOBTranslation.panelFeatureInfo = {
  header: {
    de: "Information",
    en: "Information"
  },
  noFeatureFoundInfo: {
    de: "Kein Objekt gefunden.",
    en: "No feature found."
  }
};

/**
 * Elemente der Ortung
 */
WOBTranslation.geolocation = {
  permissionDeniedMessage: {
    de: "Die Geolokalisierung ist für diese Seite deaktiviert.\n\nBitte überprüfen Sie Ihre Browser-Einstellung, um die Berechtigung zu ändern.",
    en: "The geolocation for this site is deactivated.\n\nPlease check your browser setting to change the permission."
  }
};

/**
 * Elemente der Projekteinstellungen
 */
WOBTranslation.projectSettings = {
  // Fehlermeldung
  requestFailed: {
    de: "Die GetProjectSettings-Anfrage (Projekteinstellungen) ist fehlgeschlagen:",
    en: "The GetProjectSettings request failed:"
  }
};

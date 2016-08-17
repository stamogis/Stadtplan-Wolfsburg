/**
 * Erweiterte Einstellungen
 */

var WOBConfig = {};

// GUI
WOBConfig.gui = {
  // Standartsprache (z.B. "de" oder "en")
  initLanguage: "de",
  // Button "Sprachauswahl" ausblenden
  hideLanguageSelection: false,
  // Button "Hilfe" ausblenden
  hideHelpButton: false,
  // Button "Erweiterte Suche" ausblenden
  hideExtendedSearchButton: false,
  // Button "Hilfe" ausblenden
  hideFilterButton: false,
  // Button "Stadt- und Ortsteilsuche" ausblenden
  hideSearchByAreaButton: false,
  // Button "Umkreissuche" ausblenden
  hideUmkreissucheButton: false,
  // Button "Kartenausschnitt teilen" ausblenden
  hideShareButton: false,
  // Button "Koordinaten abfragen" ausblenden
  hideCoordinatesButton: false,
  // Button "Messen"
  hideMeasureButton: false,
  // Button "PDF-Druck" ausblenden
  hideExportButton: false
};

// Einstellungen
WOBConfig.properties = {
  // Zoombuttons beim Start automatisch aktivieren
  zoomButtons: false
};

// Karte
WOBConfig.map = {
  // Zeit in ms bis das "Highlight" eines Suchergebnisses ausgeblendet wird. (Deaktivieren mit "null" Wert)
  highlightTimeout: 10000,
  // Verwendet die Copyright-Hinweise aus dem QGIS-Metadatenfeld "Attribution" des jeweiligen Layers
  useQGISattributions: false,
  // Copyright-Hinweise
  attributions: [
    //{
    //  "topic": "openstreetmap",
    //  "layers": ["osm_farbig", "osm_hell", "osm_grau"],
    //  "attribution": '© "OpenStreetMap-Mitwirkende - Veröffentlicht unter Open Database License (ODbL)"'
    //}
  ]
};

// Koordinatenabfrage
WOBConfig.coordinates = {
  // In welcher Projektion sollen die Koordinaten angezeigt werden
  projection: ol.proj.get('EPSG:21781')
};

// Suche
WOBConfig.search = {
  // Die Tabellennamen (Schlüsselwörter) in denen gesucht werden soll.
  // Diese Tabellennamen müssen entsprechend auch in der wsgi/qwc_connect.py angegeben werden.
  // Optional können auch Filter (Suchkategorien) angegeben werden, mit denen das Suchergebnisse
  // mithilfe der "Erweiterte Suche" auf einzelne Themenbereiche begrenzt werden kann.
  // Wenn für einzelne Themenkarten nur bestimmmte Suchtabellen genutzt werden sollen, können diese auch
  // in der topic.json angegeben werden. In diesem fall wird die Angabe in der wob_config.js ignoriert.
  // searchTableKeyword: "search_category_1, search_category_2, ..."
  searchtables: {
    //"searchTableKeyword1": "",
    //"searchTableKeyword2": "search_category_1, search_category_2"
  },
  // Der Tabellennamen (Schlüsselwort) der Tabelle mit den Stadt- und Ortsteilen
  searchAreaTable: "Stadt- und Ortsteile",
  // Maximale Anzahl an Suchergebnissen. (Deaktivieren mit dem Wert "")
  resultLimit: 100,
  // Popup-Fenster anzeigen, wenn das Suchlimit erreicht wurde
  resultLimitInfo: true,
  // Popup-Fenster anzeigen, wenn kein Suchergebnis gefunden wurde
  noFeatureFoundInfo: true,
  // Schlüsselwort für die deaktivierte "Stadt- und Ortsteilsuche"
  fullAreaName: "Gesamte Stadt",
  // Extend auf dem, beim deaktivierten der "Stadt- und Ortsteilsuche" gezoomt wird
  fullAreaExtent: [420000, 30000, 900000, 350000],
  // Schlüsselwörter der auswählbaren Stadt- und Ortsteile in der GUI.
  areaNames: [
    //"Stadtteil 1",
    //"Stadtteil 2",
    //"Ortsteil 1"
  ],
  // Die Kartenebenen, die durch die Suche aktiviert wurden, nach dem zurücksetzen der Suche wieder ausblenden
  hideActivatedLayers: true
};

// Umkreissuche
WOBConfig.umkreissuche = {
  // Startradius in m
  startRadius: 250,
  // Minimaler Radius in m
  minRadius: 100,
  // Maximaler Radius in m
  maxRadius: 5000,
  // Beschränkung des maximal möglichen Radius pro Maßstab.
  // Start beim kleinsten Radius. [[Maßstab, max. Radius], [Maßstab, max. Radius], ...]
  scaleDenoms: [[2500, 250], [5000, 500], [10000, 1000], [20000, 2000]]
};

// FeatureInfo-Abfrage
WOBConfig.featureInfo = {
  // Das Ergebnis als Tabelle (Attributname: Attributwert) anzeigen
  showAsTable: false,
  // Doppelte Ergebnisse entfernen
  filterFeatureInfoResult: false,
  // Attribut anhand dem geprüft wird, ob ein Ergebnis doppelt vorhanden ist:
  // "topic": Name der Themenkarte
  // "layers": [Kartenebene 1, Kartenebene 2, ...]
  // "attributes": [Attribut der Kartenebene 1, Attribut der Kartenebene 2, ...]
  filterFeatureInfoResultLayer: [
    //{
    //  "topic": "fahrradstadtplan",
    //  "layers": ["Radwege"],
    //  "attributes": ["Fahrradroute"]
    //}
  ],
  // Weitere statische Informationen, die bei einer Abfrage einer Kartenebene hinzugefügt werden können:
  // "topic": Name der Themenkarte
  // "layers": [Kartenebene 1, Kartenebene 2, ...]
  // "info_title": Überschrift
  // "info": Textinhalt
  additionalInfos: [
    //{
    //  "topic": "solarkataster",
    //  "layers": ["geeignete Fläche", "gesamtes Gebäude"],
    //  "info_title": "Haftungsbeschränkung",
    //  "info": "Die Stadt übernimmt keine Gewähr für die Richtigkeit, die Vollständigkeit und die Aktualität der bereitgestellten Daten."
    //}
  ]
};

// PDF-Druck
WOBConfig.export = {
  // DPI-Wert
  initDpiValue: 300,
  // Maßstab beim Start
  initScaleValue: 5000,
  // Auswählbare Maßstäbe
  scales: [
    //{"name":"1:100","value":"100"},
    //{"name":"1:200","value":"200"},
    {"name":"1:250","value":"250"},
    {"name":"1:500","value":"500"},
    {"name":"1:1.000","value":"1000"},
    {"name":"1:2.000","value":"2000"},
    {"name":"1:2.500","value":"2500"},
    {"name":"1:3.000","value":"3000"},
    {"name":"1:5.000","value":"5000"},
    {"name":"1:7.500","value":"7500"},
    {"name":"1:10.000","value":"10000"},
    {"name":"1:12.000","value":"12000"},
    {"name":"1:15.000","value":"15000"},
    {"name":"1:20.000","value":"20000"},
    {"name":"1:25.000","value":"25000"},
    {"name":"1:30.000","value":"30000"},
    {"name":"1:50.000","value":"50000"},
    {"name":"1:75.000","value":"75000"},
    {"name":"1:100.000","value":"100000"},
    {"name":"1:150.000","value":"150000"},
    {"name":"1:200.000","value":"200000"}
    //{"name":"1:250.000","value":"250000"},
    //{"name":"1:500.000","value":"500000"},
    //{"name":"1:750.000","value":"750000"},
    //{"name":"1:1.000.000","value":"1000000"},
    //{"name":"1:2.500.000","value":"2500000"},
    //{"name":"1:5.000.000","value":"5000000"},
    //{"name":"1:7.500.000","value":"7500000"},
    //{"name":"1:10.000.000","value":"10000000"},
    //{"name":"1:15.000.000","value":"15000000"},
    //{"name":"1:20.000.000","value":"20000000"},
    //{"name":"1:25.000.000","value":"25000000"},
    //{"name":"1:30.000.000","value":"30000000"},
    //{"name":"1:35.000.000","value":"35000000"},
    //{"name":"1:50.000.000","value":"50000000"},
    //{"name":"1:60.000.000","value":"60000000"},
    //{"name":"1:75.000.000","value":"75000000"},
    //{"name":"1:100.000.000","value":"100000000"},
    //{"name":"1:125.000.000","value":"125000000"},
    //{"name":"1:150.000.000","value":"150000000"}
  ],
  // Koordinatengitter exportieren
  exportGridInterval: false,
  // Transparenz berücksichtigen
  exportOpacities: true,
  // PDF anzeigen oder speichern
  showResult: true
};

// Messen
WOBConfig.measure = {
  // Messart beim Start: Streckenmessung (length) oder Flächenmessung (area)
  initType: 'length'
};

// Versenden
WOBConfig.share = {
  // Stecknadel beim Start aktivieren
  markerOn: true
};
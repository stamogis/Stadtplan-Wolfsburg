/**
 * Koordinatenabfrage
 */

var WOBCoordinates = {};

WOBCoordinates.coordinatesTextInputID = 'coordinates';

/**
 * Klick-Handler
 */
function WOBCoordinatesClickHandler() {}

WOBCoordinatesClickHandler.prototype = new MapClickHandler();

/**
 * Funktion beim Klicken
 */
WOBCoordinatesClickHandler.prototype.handleEvent = function(e) {
  WOBCoordinates.getCoordinates();
};

/**
 * Klick-Handler initialisieren
 */
WOBCoordinates.initClickHandler = function () {
  var handler = new WOBCoordinatesClickHandler();
  Map.registerClickHandler("wobCoordinatesHandler", handler);
};

/**
 * Setzt die Koordinaten der letzten Klick-Position in ein Textfeld
 */
WOBCoordinates.getCoordinates = function() {
  // Koordinatentransformation
  var coordinates = ol.proj.transform(Map.lastClickPos, Config.map.projection.getCode(), WOBConfig.coordinates.projection.getCode());

  // Nachkommastellen entfernen
  var rw = coordinates[0].toFixed(0);
  var hw = coordinates[1].toFixed(0);

  $('#' + WOBCoordinates.coordinatesTextInputID).val(rw + " " + hw);

  Map.toggleClickMarker(true);
};

/**
 * Koordinatenabfrage (Klick-Handler) aktivieren
 */
WOBCoordinates.activate = function() {
  // Den aktuellen Klick-Handler speichern
  WOBMap.saveActiveClickHandler();

  // Textfeld leeren
  $('#' + WOBCoordinates.coordinatesTextInputID).val("");

  // Klick-Handler aktivieren
  Map.activateClickHandler("wobCoordinatesHandler");
};

/**
 * Koordinatenabfrage (Klick-Handler) deaktivieren
 */
WOBCoordinates.deactivate = function() {
  Map.toggleClickMarker(false);

  // Den vorherigen Klick-Handler wieder aktivieren
  WOBMap.restoreSavedClickHandler();
};
/**
 * Interaction zum Verschieben von Objekten
 * 
 * Die original OL3 Funktion wird nicht verwendet, da dessen Verschiebemöglichkeit von Objekten unter
 * bestimmten Voraussetzungen nicht mehr Funktioniert. Stattdessen kann nur noch die Karte verschoben werden.
 * Dies passiert z.B. beim Wischen mit 2 Fingern in der Karte, wenn ein Finger in der Geometrie und der andere außerhalb der Geometrie liegt.
 */

var WOBDragInteraction = {};

WOBDragInteraction.Drag = function(options) {

  ol.interaction.Pointer.call(this, {
    handleDownEvent: WOBDragInteraction.Drag.prototype.handleDownEvent,
    handleDragEvent: WOBDragInteraction.Drag.prototype.handleDragEvent,
    handleMoveEvent: WOBDragInteraction.Drag.prototype.handleMoveEvent,
    handleUpEvent: WOBDragInteraction.Drag.prototype.handleUpEvent
  });

  this.previousCursor_ = undefined;
  this.lastCoordinate_ = null;
  this.features_ = options.features !== undefined ? options.features : null;
  this.lastFeature_ = null;

  this.cursor_ = 'pointer';
};

ol.inherits(WOBDragInteraction.Drag, ol.interaction.Pointer);

WOBDragInteraction.Drag.prototype.handleDownEvent = function(evt) {
  var map = evt.map;
  var pixel = evt.pixel;

  this.lastFeature_ = this.featuresAtPixel(pixel, map);

  if (!this.lastCoordinate_ && this.lastFeature_) {
  //if (this.lastFeature_) {

    this.lastCoordinate_ = evt.coordinate;

    WOBDragInteraction.Drag.prototype.handleMoveEvent.call(this, evt);

    return true;
  }

  if (this.lastCoordinate_) {
    this.lastCoordinate_ = null;
  }

  return false;
};

WOBDragInteraction.Drag.prototype.handleDragEvent = function(evt) {

  if (this.lastCoordinate_) {

    var newCoordinate = evt.coordinate;
    var deltaX = newCoordinate[0] - this.lastCoordinate_[0];
    var deltaY = newCoordinate[1] - this.lastCoordinate_[1];

    if (this.features_) {

      this.features_.forEach(function(feature) {
        var geom = feature.getGeometry();
        geom.translate(deltaX, deltaY);
        feature.setGeometry(geom);
      });

    } else if (this.lastFeature_) {

      var geom = this.lastFeature_.getGeometry();
      geom.translate(deltaX, deltaY);
      this.lastFeature_.setGeometry(geom);
    }

    this.lastCoordinate_ = newCoordinate;
  }
};

WOBDragInteraction.Drag.prototype.handleMoveEvent = function(evt) {
  if (this.cursor_) {
    var element = evt.map.getTargetElement();
    var intersectingFeature = evt.map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        });

    if (intersectingFeature) {
      if (element.style.cursor != this.cursor_) {

        this.previousCursor_ = element.style.cursor;
        element.style.cursor = this.cursor_;
      }
    } else if (this.previousCursor_ !== undefined) {
      element.style.cursor = this.previousCursor_;
      this.previousCursor_ = undefined;
    }
  }
};

WOBDragInteraction.Drag.prototype.handleUpEvent = function(evt) {

  if (this.lastCoordinate_) {

    this.lastCoordinate_ = null;

    WOBDragInteraction.Drag.prototype.handleMoveEvent.call(this, evt);

    this.dispatchEvent('dragend');

    return true;
  }
  return false;
};

WOBDragInteraction.Drag.prototype.featuresAtPixel = function(pixel, map) {
  var found = null;

  var intersectingFeature = map.forEachFeatureAtPixel(pixel,
      function(feature) {
        return feature;
      });

  if (this.features_ && this.features_.getArray().indexOf(intersectingFeature) >= 0) {
    found = intersectingFeature;
  }

  return found;
};

/**
 * Das Symbol des Mauszeigers zurücksetzten
 */
WOBDragInteraction.Drag.prototype.resetCursor = function() {
  if ($('#map').css('cursor') == 'pointer')  {
      $('#map').css('cursor', "");
  }
};
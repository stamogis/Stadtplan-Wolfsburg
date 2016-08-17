# Stadtplananwendung der Stadt Wolfsburg

Die Stadtplananwendung der Stadt Wolfsburg ist eine mobilfähige Kartenanwendung, die auf den [OL3 Mobile Viewer](https://github.com/sourcepole/ol3-mobile-viewer) aufbaut:

www.wolfsburg.de/stadtplan

Änderungen und neue Funktionen:
* Angepasste Benutzeroberfläche
* Aktualisierte Bibliotheken (OpenLayers 3, jQuery Mobile, ...)
* Erweiterte Suchmöglichkeiten
  * Themenfilter
  * Stadt- und Ortsteilsuche
  * Umkreissuche
* Neue Werkzeuge
  * Kartenausschnitt teilen
  * Koordinaten abfragen
  * Messen von Strecken oder Flächen
  * PDF-Druck

## WSGI Suche

Als Suche wird ein Python WSGI Script verwendet (siehe [QGIS-Web-Client](https://github.com/qgis/QGIS-Web-Client#62-wsgi-search)).

Die jeweilige PostgreSQL Tabelle/View muss hierfür folgende Spalten besitzen:

| Spalte | Beschreibung |
| --- | --- |
| id | ID zur eindeutigen Identifikation der Suchergebnisse |
| displaytext | Der Text, der im Suchergebnis angezeigt werden soll |
| ordertext | Der Text, der zum Sortieren der Suchergebnisse verwendet wird |
| searchstring | Der Suchstring zum Abgleich mit der Sucheingabe, z.B. "Porschestraße 47A" |
| searchstring_keywords | Weitere Schlüsselwörter, die mit der Sucheingabe verglichen werden sollen, wenn es für ein Suchergebnis mehrere Bezeichnungen gib, wie z.B. "Kindertagesstätte Kita Kindergarten" |
| search_category | Bezeichnung des Suchthemas beginnend mit zwei Zahlen zur Angabe der Reihenfolge, z.B. "03_Schulen" |
| showlayer | Die Kartenebene, die angezeigt werden soll, wenn das Suchergebnis ausgewählt wurde |
| the_geom | Die Geometrie |
| geometry_type | Der zurückgegebene Geometrietyp der Funktion ST_GeometryType(the_geom) |
| searchstring_tsvector | Der Suchstring als PostgreSQL tsvector |

## README: OL3 Mobile Viewer

OL3 Mobile Viewer is a basic map viewer based on OpenLayers 3 and jQuery Mobile.

Features:

* Topic and layer selection
* Search
* Feature info requests
* Map follows current location
* Manual and compass controlled map orientation

### Customization

* src/config.js
* src/custom.css

### Runtime configuration

* topics.json
* layers.json

#### URL parameters

* tiledWms=1|0 : force tiled/untiled WMS
* topic=TOPIC_NAME : initial topic
* background=BACKGROUND_TOPIC_NAME : initial background topic
* overlays=COMMA_SEPARATED_OVERLAY_TOPIC_NAMES : initial overlay topics
* extent=MINX,MINY,MAXX,MAXY : initial map extent
* center=X,Y : initial map center
* scale=SCALE : initial map scale
* zoom=ZOOM_LEVEL : initial map zoom level
* activeLayers=COMMA_SEPARATED_LAYER_NAMES : initially visible layers in that order
* inactiveLayers=COMMA_SEPARATED_LAYER_NAMES : initially invisible layers
* opacities={LAYER_NAME:OPACITY[255..0]} as JSON : initial layer opacities
    e.g. opacities={"Pixelkarte 25":192,"BBFlaechen_farbig":128}

Parameter precedence:

* extent before center, scale, zoom
* scale before zoom
* activeLayers before inactiveLayers

### Screencast

[![OL3 Mobile Viewer Screencast](http://img.youtube.com/vi/htphVHMkCOo/0.jpg)](http://youtu.be/htphVHMkCOo)

### Contributions

Fork this repository and send us a pull request.

### License

OL3 Mobile viewer is released under the [MIT License](http://www.opensource.org/licenses/MIT).


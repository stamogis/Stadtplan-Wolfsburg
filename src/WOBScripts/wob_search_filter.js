/**
 * Suchfilter
 */

var WOBSearchFilter = {};

// Suchfilter (Tabelle + Unterkategorien)
WOBSearchFilter.filters =  {};

// Wurde die Auswahl der Suchfilter geändert
WOBSearchFilter.changed = false;

// Ist der changeEvent aktiv
WOBSearchFilter.changeEvent = true;

/**
 * Erzeugt die CheckBoxen der Suchfilter anhand des ausgewählten Kartenthemas bzw. der topics.json
 */
WOBSearchFilter.initFilters = function() {
  // Suchfilter-Objekt leeren
  for (var filter in WOBSearchFilter.filters) {
    if (WOBSearchFilter.filters.hasOwnProperty(filter)) {
      delete WOBSearchFilter.filters[filter];
    }
  }

  var searchtables;
  if(Map.topics[Map.topic].searchtables != undefined) {
    searchtables = Map.topics[Map.topic].searchtables;
  } else {
    searchtables = WOBConfig.search.searchtables
  }

  // Für jede Tabelle
  for(var key in searchtables) {
    // Ein Objekt mit dem Tabellennamen anlegen
    WOBSearchFilter.filters[key] = [];

    // Den String mit den Unterkategorien an den Kommas trennen
    var categories = searchtables[key].split(',');

    // Jede Unterkategorie
    for(var i in categories) {
      // in das entsprechende Array des Objekts mit dem Tabellennamen hinzufügen.
      // Mit der Funktion trim() werden Leerzeichen am Anfang und Ende des Names entfernt
      WOBSearchFilter.filters[key].push(categories[i].trim());
    }
  }

  // CheckBoxen erzeugen
  WOBSearchFilter.createCheckBoxes();

  // Selektiert alle Filter
  WOBSearchFilter.selectAll();
};

/**
 * Erzeugt dynamisch alle CheckBoxen für die Filter
 */
WOBSearchFilter.createCheckBoxes = function() {
  var html = '';
  var indexTable = 1;
  var indexCategory = 1;

  for (var table in WOBSearchFilter.filters) {
    // Wenn keine Unterkategorien vorhanden sind
    if(WOBSearchFilter.filters[table] == "") {
      html += '<label><input type="checkbox" name="search-' + indexTable + '" data-theme="c" value="' + table +'">' + table + '</label>';
    // Wenn Unterkategorien vorhanden sind
    } else {
      // Titel (Tabellenname)
      html += '<div data-role="collapsible" data-theme="c" data-groupcheckbox="true" data-content-theme="false">';
      html += '<h3>' + table + '</h3>';

      indexCategory = 1;

      // Unterkategorien
      for (var category in WOBSearchFilter.filters[table]) {
        html += '<label><input type="checkbox" data-table="' + table + '" name="search-' + indexTable + '-' + indexCategory + '" data-theme="c" value="' + WOBSearchFilter.filters[table][category] +'">' + WOBSearchFilter.filters[table][category] +'</label>';
        indexCategory++;
      }
      html += '</div>';
    }
    indexTable++;
  }

  // Den changeEvent deaktiviern
  WOBSearchFilter.changeEvent = false;

  $("#seachFilter").empty();

  $(html).appendTo("#seachFilter");
  $("#seachFilter").trigger('create');

  // Den changeEvent wieder aktiviern
  WOBSearchFilter.changeEvent = true;
};

/**
 * Gibt die aktuell ausgewählten Suchtfilter zurück
 */
WOBSearchFilter.getSelectedFilters = function() {

  var selection = { };

  $('#seachFilter').find(':checkbox').each(function(index) {
    var checkbox = $(this);
    if (checkbox.is(':checked') == true) {

      var table = $(this).attr('data-table');

      // Wenn keine Unterkategorien vorhanden sind
      if (typeof table === "undefined") {
        table = checkbox.val();

        // Wenn die Tabelle noch nicht gespeichert wurde
        if (typeof selection[table] === "undefined") {
          selection[table] = "";
        }
      // Wenn Unterkategorien vorhanden sind
      } else {
        // Wenn die Tabelle noch nicht gespeichert wurde
        if (typeof selection[table] === "undefined") {
          selection[table] = "";
        }

        var category = checkbox.val();

        // Fügt die Unterkategorien für die entsprechende Tabelle ein
        if(selection[table].indexOf(category) == -1) {
          if(selection[table] == "") {
            selection[table] = "" + category;
          } else {
             selection[table] = selection[table] + "," + category;
          }
        }
      }
    }
  });

  if(WOBSearchFilter.isSelectionEmpty(selection)) {
    selection[""] = "";
  }

  return selection;
};

/**
 * Ist die übergebene Auswahl leer?
 */
WOBSearchFilter.isSelectionEmpty = function(selection) {
  for(var key in selection) {
    if(selection.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
};

/**
 * Wurde die Auswahl der Suchfilter geändert?
 */
WOBSearchFilter.isChanged = function () {
  if(WOBSearchFilter.changed) {
    if(WOBSearchFilter.allChecked()) {
      WOBSearchFilter.changed = false;
    }
  }

  return WOBSearchFilter.changed;
};

/**
 * Sind alle Suchfilter ausgewählt?
 */
WOBSearchFilter.allChecked = function () {
  var allChecked = true;

  $('#seachFilter').find(':checkbox').each(function(index) {
    if ($(this).is(':checked') != true) {
      allChecked = false;
      return;
    }
  });

  return allChecked;
};

/**
 * Ist kein Suchfilter ausgewählt?
 */
WOBSearchFilter.nothingChecked = function () {
  var checked = false;

  $('#seachFilter').find(':checkbox').each(function(index) {
    if ($(this).is(':checked') == true) {
      checked = true;
      return;
    }
  });

  return !checked;
};

/**
 * Können mit den ausgewählten Suchfiltern eine Suche durchgeführt werden?
 * Dafür muss die Auswahl der Suchfilter geändert und mindestens
 * ein Suchthema ausgewählt worden sein.
 */
WOBSearchFilter.isSearchable = function () {

  if(WOBSearchFilter.isChanged() && WOBSearchFilter.nothingChecked() != true) {
    return true;
  } else {
    return false;
  }
};

/**
 * Selektiert alle Suchfilter
 */
WOBSearchFilter.selectAll = function () {
  WOBSearchFilter.changeEvent = false;
  $('#seachFilter').find(':checkbox').each(function(index) {
    var checkbox = $(this);
    if (checkbox.is(':checked') != true) {
      checkbox.prop('checked', true).checkboxradio('refresh').trigger('change');
    }
  });
  WOBSearchFilter.changeEvent = true;
};
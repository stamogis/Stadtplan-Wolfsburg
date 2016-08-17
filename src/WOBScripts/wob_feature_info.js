/**
 * Stellt eine Funktion bereit, die einen HTML-Code-String erzeugt, in dem die Attribute des Ergebnis der FeatureInfo-Abfrage
 * abhängig von Karte und Typ in verschiedene Blöcke aufgeteilt und sortiert werden.
 * Zum Beispiel können die einzelnen Attribute einer Adresse als gesammelter Block ausgegeben werden.
 */

var WOBFeatureInfo = {};

// Abgefragte Themenkarte
WOBFeatureInfo.topicname = "";
// Abgefragte Kartenebene
WOBFeatureInfo.layername = "";

// Besondere Attribute
WOBFeatureInfo.attributes = {
  "Typ": undefined,
  "TypWithoutLetterSpacing": undefined,
  "Name": undefined,
  "NameWithoutHeading": undefined,
  "NameWithoutHeadingBold": undefined,
  "Links": [],
  "Kontakt": undefined,
  "Straße": undefined,
  "Hausnummer": undefined,
  "Hausnummernzusatz": undefined,
  "PLZ": undefined,
  "Ort": undefined,
  "Telefon": undefined,
  "Email": undefined,
  "WeitereInformationen": undefined
};

// Alle anderen Attribute
WOBFeatureInfo.otherAttributes = [];

/**
 * Erzeugt dynamisch einen HTML-Code-String und gibt diesen für die FeatureInfo-Abfrage zurück.
 */
WOBFeatureInfo.generateHTMLFeatureInfoResults = function(attributes, hiddenAttributes, hiddenValues, topicname, layername) {

  WOBFeatureInfo.topicname = topicname;
  WOBFeatureInfo.layername = layername;

  WOBFeatureInfo.sortAttributes(attributes, hiddenAttributes, hiddenValues);

  var html = "";

  html += WOBFeatureInfo.createTypeBlock();
  html += WOBFeatureInfo.createTypeWithoutLetterSpacingBlock();
  html += WOBFeatureInfo.createNameBlock();
  html += WOBFeatureInfo.createNameWithoutHeadingBlock();
  html += WOBFeatureInfo.createNameWithoutHeadingBoldBlock();
  html += WOBFeatureInfo.createLinksBlock();
  html += WOBFeatureInfo.createContactPersonBlock();
  html += WOBFeatureInfo.createAdressBlock();
  html += WOBFeatureInfo.createContactBlock();
  html += WOBFeatureInfo.createOtherAttributesBlock();
  html += WOBFeatureInfo.createFurtherInformationBlock();
  html += WOBFeatureInfo.createAdditionalInfosBlock();

  return html;
};

/**
 * Ordnet die einzelnen Attribute speziellen Elementen zu oder speichert diese als Sonstige Attribute ab.
 */
WOBFeatureInfo.sortAttributes = function(attributes, hiddenAttributes, hiddenValues) {

  WOBFeatureInfo.clearAttributes();

  for (var i = 0; i < attributes.length; i++) {
    var attribute = attributes[i];

    // skip hidden attributes and hidden values
    if ($.inArray(attribute.name, hiddenAttributes) == -1 && $.inArray(attribute.value, hiddenValues) == -1) {

      switch(attribute.name) {
        case "Typ":
        case "typ":
          WOBFeatureInfo.attributes["Typ"] = attribute;
          break;
        case "Name":
        case "name":
          WOBFeatureInfo.attributes["NameWithoutHeadingBold"] = attribute;
          break;
        case "Straße":
        case "strasse":
          WOBFeatureInfo.attributes["Straße"] = attribute;
          break;
        case "Hausnummer":
        case "hausnr":
          WOBFeatureInfo.attributes["Hausnummer"] = attribute;
          break;
        case "Hausnummernzusatz":
        case "zusatz":
          WOBFeatureInfo.attributes["Hausnummernzusatz"] = attribute;
          break;
        case "PLZ":
        case "plz":
          WOBFeatureInfo.attributes["PLZ"] = attribute;
          break;
        case "Ort":
        case "ort":
        case "ORT":
          WOBFeatureInfo.attributes["Ort"] = attribute;
          break;
        case "Telefon":
        case "telefonnr":
          WOBFeatureInfo.attributes["Telefon"] = attribute;
          break;
        case "Homepage":
        case "homepage":
          WOBFeatureInfo.attributes["WeitereInformationen"] = attribute;
          break;
        case "Email":
        case "email":
        case "E-Mail":
          WOBFeatureInfo.attributes["Email"] = attribute;
          break;
        case "Ansprechpartner/in":
          WOBFeatureInfo.attributes["Kontakt"] = attribute;
          break;
        case "Link zur Internetseite":
        case "Link zum Flyer":
          WOBFeatureInfo.attributes["Links"].push(attribute);
          break;
        default:
         WOBFeatureInfo.otherAttributes.push(attribute);
      }
    }
  }
};

/**
 * Entfernt alle bereits zugeordneten Attribute
 */
WOBFeatureInfo.clearAttributes = function() {
  for (var key in WOBFeatureInfo.attributes) {
    if (WOBFeatureInfo.attributes.hasOwnProperty(key)) {
      WOBFeatureInfo.attributes[key] = undefined;
    }
  }
  WOBFeatureInfo.attributes["Links"] = [];
  WOBFeatureInfo.otherAttributes = [];
};

/**
 * Erzeugt den Block für den Typ
 */
WOBFeatureInfo.createTypeBlock = function() {
  var html = "";

  if(WOBFeatureInfo.attributes["Typ"] !== undefined) {
    html += '<p>';
    html += '<span class="type letterSpacing">' + WOBFeatureInfo.attributes["Typ"].value + '</span>';
    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für den Typ ohne ohne einen größeren Zeichenabstand (Letter-Spacing)
 */
WOBFeatureInfo.createTypeWithoutLetterSpacingBlock = function() {
  var html = "";

  if(WOBFeatureInfo.attributes["TypWithoutLetterSpacing"] !== undefined) {
    html += '<p>';
    html += '<span class="type">' + WOBFeatureInfo.attributes["TypWithoutLetterSpacing"].value + '</span>';
    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für den Namen/Titel mit Überschrift
 */
WOBFeatureInfo.createNameBlock = function() {
  var html = "";

  if(WOBFeatureInfo.attributes["Name"] !== undefined) {
    html += '<p>';
    html += '<span class="name">' + WOBFeatureInfo.attributes["Name"].name + ':</span>' + '<br>';
    html += '<span class="value">' + WOBFeatureInfo.attributes["Name"].value + '</span>';
    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für den Namen/Titel ohne Überschrift
 */
WOBFeatureInfo.createNameWithoutHeadingBlock = function() {
  var html = "";

  if(WOBFeatureInfo.attributes["NameWithoutHeading"] !== undefined) {
    html += '<p>';
    html += '<span class="value">' + WOBFeatureInfo.attributes["NameWithoutHeading"].value + '</span>';
    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für den Namen/Titel in Fettdruck ohne Überschrift
 */
WOBFeatureInfo.createNameWithoutHeadingBoldBlock = function() {
  var html = "";

  if(WOBFeatureInfo.attributes["NameWithoutHeadingBold"] !== undefined) {
    html += '<p>';
    html += '<span class="name">' + WOBFeatureInfo.attributes["NameWithoutHeadingBold"].value + '</span>';
    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für die Links
 */
WOBFeatureInfo.createLinksBlock = function() {
  var html = "";

  if(WOBFeatureInfo.attributes["Links"].length > 0) {
    html += '<p>';

    for (var i = 0; i < WOBFeatureInfo.attributes["Links"].length; i++) {
      var name = WOBFeatureInfo.attributes["Links"][i].name;
      var value = WOBFeatureInfo.attributes["Links"][i].value;

      if(i > 0) {
        html += '<br>';
        html += '<span class="customLineBreak"></span>';
      }

      html += '<a href="' + WOBFeatureInfo.attributes["Links"][i].value + '" target="_blank" class="link">' + WOBFeatureInfo.attributes["Links"][i].name + '</a>';
    }

    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für den Ansprechpartner/in
 */
WOBFeatureInfo.createContactPersonBlock = function() {
  var html = "";

  // Ansprechpartner/in
  if(WOBFeatureInfo.attributes["Kontakt"] !== undefined) {
    html += '<p>';
    html += '<span class="name">Kontakt:</span>' + '<br>';
    html += '<span class="value">' + WOBFeatureInfo.attributes["Kontakt"].value + '</span>';
    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für die Adresse
 */
WOBFeatureInfo.createAdressBlock = function() {
  var html = "";

  // Straße + Hausnummer + Hausnummernzusatz
  if(WOBFeatureInfo.attributes["Straße"] !== undefined) {
    html += '<span class="value">' + WOBFeatureInfo.attributes["Straße"].value;

    if(WOBFeatureInfo.attributes["Hausnummer"] !== undefined && WOBFeatureInfo.attributes["Hausnummernzusatz"] !== undefined) {
      html += " " + WOBFeatureInfo.attributes["Hausnummer"].value + WOBFeatureInfo.attributes["Hausnummernzusatz"].value;
    } else if(WOBFeatureInfo.attributes["Hausnummer"] !== undefined) {
      html += " " + WOBFeatureInfo.attributes["Hausnummer"].value;
    } else if(WOBFeatureInfo.attributes["Hausnummernzusatz"] !== undefined) {
      html += " " + WOBFeatureInfo.attributes["Hausnummernzusatz"].value;
    }

    html += '</span>';
  }

  if(html != "") {
    html += '<br>';
  }

  // PLZ + Ort
  if(WOBFeatureInfo.attributes["PLZ"] !== undefined && WOBFeatureInfo.attributes["Ort"] !== undefined) {
    html += '<span class="value">' + WOBFeatureInfo.attributes["PLZ"].value + " " + WOBFeatureInfo.attributes["Ort"].value + '</span>';
  } else if(WOBFeatureInfo.attributes["PLZ"] !== undefined) {
    html += '<span class="value">' + WOBFeatureInfo.attributes["PLZ"].value + '</span>';
  } else if(WOBFeatureInfo.attributes["Ort"] !== undefined) {
    html += '<span class="value">' + WOBFeatureInfo.attributes["Ort"].value + '</span>';
  }

  if(html != "") {
    html = '<p>' + html + '</p>'
  }

  return html;
};

/**
 * Erzeugt den Block für die Kontakdaten
 */
WOBFeatureInfo.createContactBlock = function() {
  var html = "";

  if(WOBFeatureInfo.attributes["Telefon"] !== undefined || WOBFeatureInfo.attributes["Email"] !== undefined) {
    html += '<table cellspacing="0" cellpadding="0">'
      // Tel.-Nr.
      if(WOBFeatureInfo.attributes["Telefon"] !== undefined) {
        html += '<tr">'
          html += '<td><span class="value">' + "Tel.-Nr.: " + '</span></td>'
          html += '<td><span class="value">' + WOBFeatureInfo.attributes["Telefon"].value + '</span></td>'
        html += '</tr>'
      }
      //E-Mail
      if(WOBFeatureInfo.attributes["Email"] !== undefined) {
        var email = WOBFeatureInfo.createMailTo(WOBFeatureInfo.attributes["Email"].value);
        html += '<tr>'
          html += '<td><span class="value">' + "E-Mail: " + '</span></td>'
          html += '<td><span class="value">' + email + '</span></td>'
        html += '</tr>'
      }
    html += '</table>'
  }

  return html;
};

/**
 * Erzeugt den Block für die sonstigen Attribute
 */
WOBFeatureInfo.createOtherAttributesBlock = function() {
  var html = "";

  for (var j = 0; j < WOBFeatureInfo.otherAttributes.length; j++) {
    var name = WOBFeatureInfo.otherAttributes[j].name;
    var value = WOBFeatureInfo.otherAttributes[j].value;

    if($.isNumeric(value)) {
      value = value.replace(".", ",")
    }

    value = WOBFeatureInfo.createLink(value);

    html += '<p>';
    html += '<span class="name">' + name + ': </span>' + '<br>';
    html += '<span class="value">' + value + '</span>';
    html += '</p>';
  }

  return html;
};

/**
 * Erzeugt den Block für weitere Informationen (z.B Haftungsbeschränkung).
 * Diese können in der wob_config.js unter WOBConfig.featureInfo.additionalInfos angegeben werden.
 */
WOBFeatureInfo.createAdditionalInfosBlock = function() {
  var html = "";

  for (var topic in WOBConfig.featureInfo.additionalInfos) {
    if (WOBConfig.featureInfo.additionalInfos.hasOwnProperty(topic)) {
      if(WOBConfig.featureInfo.additionalInfos[topic].topic == WOBFeatureInfo.topicname) {
        for (var layer in WOBConfig.featureInfo.additionalInfos[topic].layers) {
          if(WOBConfig.featureInfo.additionalInfos[topic].layers[layer] == WOBFeatureInfo.layername) {
            html += '<p>';
            html += '<span class="name small">' + WOBConfig.featureInfo.additionalInfos[topic].info_title + ': </span>' + '<br>';
            html += '<span class="value small">' + WOBConfig.featureInfo.additionalInfos[topic].info + '</span>';
            html += '</p>';
          }
        }
      }
    }
  }

  return html;
};

/**
 * Erzeugt den Block für weitere Informationsquellen (z.B. Homepage)
 */
WOBFeatureInfo.createFurtherInformationBlock = function() {
  var html = "";

  // Homepage
  if(WOBFeatureInfo.attributes["WeitereInformationen"] !== undefined) {

    var link = WOBFeatureInfo.addHttp(WOBFeatureInfo.attributes["WeitereInformationen"].value);
    link = WOBFeatureInfo.createLink(link);
    html += '<span class="value">' + link + '</span>';
  }

  if(html != "") {
    html = '<span class="name">' + "Weitere Informationen:" + '</span>' + '<br>' + html;
    html = '<p>' + html + '</p>'
  }

  return html;
};

/**
 * Erzeugt aus dem übergebenen Features-Array ein neues Array, das keine doppelten Einträge enthählt
 * und gibt dieses zurück. Der Vergleich, ob ein Feature doppelt ist, wird anhand des übergebenen
 * Attributenamens geprüft.
 */
WOBFeatureInfo.featureInfoResultsFilter = function(features, attributeName) {
  var filteredFeatures = [];

  for (var i = 0; i < features.length; i++) {
    var feature = features[i];

    for (var j = 0; j < feature.attributes.length; j++) {
      var attribute = feature.attributes[j];

      if(attribute.name == attributeName) {
        if(!WOBFeatureInfo.isInFeatures(filteredFeatures, attributeName, attribute.value)) {
          filteredFeatures.push(feature);
        }
        break;
      }
    }
  }

  return filteredFeatures;
};

/**
 * Überprüft, ob ein Feature mit dem übergebenen Attributnamen und dem Attributwert vorhanden ist.
 */
WOBFeatureInfo.isInFeatures = function(features, attributeName, value) {
  for (var i = 0; i < features.length; i++) {
    var feature = features[i];

    for (var j = 0; j < feature.attributes.length; j++) {
      var attribute = feature.attributes[j];

      if(attribute.name == attributeName) {
        if(attribute.value == value) {
          return true;
        }
        break;
      }
    }
  }
  return false;
};

/**
 * Erzeugt einen mailTo-Link
 */
WOBFeatureInfo.createMailTo = function(value) {
  return '<a href="mailto:' + value + '" target="_blank" class="link">' + value + '</a>';
};

/**
 * Erzeugt einen Link, wenn die URL mit "http://", "https://" oder "www." beginnt
 */
WOBFeatureInfo.createLink = function(value) {
  if (value.match(/^https?:\/\/.+\..+/i)) {
    return '<a href="' + value + '" target="_blank" class="link">' + value.replace(/^(https?:\/\/)/,"") + '</a>';
  } else if (value.match(/^http?:\/\/.+\..+/i)) {
    return '<a href="' + value + '" target="_blank" class="link">' + value.replace(/^(http?:\/\/)/,"") + '</a>';
  } else if (value.match(/^www/i)) {
    return '<a href="http://' + value + '" target="_blank" class="link">' + value + '</a>';
  } else {
    return value;
  }
};

/**
 * Fügt vor einem Link "http://" hinzu
 */
WOBFeatureInfo.addHttp = function(value) {
  if (!value.match(/^https?:\/\/.+\..+/i) && !value.match(/^http?:\/\/.+\..+/i) && !value.match(/^www/i)){
    return 'http://' + value;
  } else {
    return value;
  }
};

function onOpen(e) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

function onInstall(e) {
  onOpen(e);
}

function showSidebar() {
  var ui = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setTitle('Latin Helper');
  DocumentApp.getUi().showSidebar(ui);
}

function getSelectedText() {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var text = [];
    var elements = selection.getSelectedElements();
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();

        text.push(element.getText().substring(startIndex, endIndex + 1));
      } else {
        var element = elements[i].getElement();
        if (element.editAsText) {
          var elementText = element.asText().getText();
          if (elementText != '') {
            text.push(elementText);
          }
        }
      }
    }
    if (text.length == 0) {
      throw 'Please select some text.';
    }
    return text;
  } else {
    throw 'Please select some text.';
  }
}

function getPreferences() {
  var userProperties = PropertiesService.getUserProperties();
  var languagePrefs = {
    originLang: userProperties.getProperty('originLang'),
    destLang: userProperties.getProperty('destLang')
  };
  return languagePrefs;
}

function runTranslation(origin, dest, savePrefs) {
  var text = getSelectedText();
  if (savePrefs == true) {
    var userProperties = PropertiesService.getUserProperties();
    userProperties.setProperty('originLang', origin);
    userProperties.setProperty('destLang', dest);
  }

  var translated = [];
  for (var i = 0; i < text.length; i++) {
    translated.push(LanguageApp.translate(text[i], origin, dest));
  }

  return translated.join('\n');
}
function insertText(newText) {
  var selection = DocumentApp.getActiveDocument().getSelection();
  if (selection) {
    var replaced = false;
    var elements = selection.getSelectedElements();
    if (elements.length == 1 &&
        elements[0].getElement().getType() ==
        DocumentApp.ElementType.INLINE_IMAGE) {
      throw "Can't insert text into an image.";
    }
    for (var i = 0; i < elements.length; i++) {
      if (elements[i].isPartial()) {
        var element = elements[i].getElement().asText();
        var startIndex = elements[i].getStartOffset();
        var endIndex = elements[i].getEndOffsetInclusive();

        var remainingText = element.getText().substring(endIndex + 1);
        element.deleteText(startIndex, endIndex);
        if (!replaced) {
          element.insertText(startIndex, newText);
          replaced = true;
        } else {
          var parent = element.getParent();
          parent.getPreviousSibling().asText().appendText(remainingText);
          if (parent.getNextSibling()) {
            parent.removeFromParent();
          } else {
            element.removeFromParent();
          }
        }
      } else {
        var element = elements[i].getElement();
        if (!replaced && element.editAsText) {
          element.clear();
          element.asText().setText(newText);
          replaced = true;
        } else {
          if (element.getNextSibling()) {
            element.removeFromParent();
          } else {
            element.clear();
          }
        }
      }
    }
  } else {
    var cursor = DocumentApp.getActiveDocument().getCursor();
    var surroundingText = cursor.getSurroundingText().getText();
    var surroundingTextOffset = cursor.getSurroundingTextOffset();
    if (surroundingTextOffset > 0) {
      if (surroundingText.charAt(surroundingTextOffset - 1) != ' ') {
        newText = ' ' + newText;
      }
    }
    if (surroundingTextOffset < surroundingText.length) {
      if (surroundingText.charAt(surroundingTextOffset) != ' ') {
        newText += ' ';
      }
    }
    cursor.insertText(newText);
  }
}


function inserta() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("ā");
}
function inserte() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("ē");
}
function inserti() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("ī");
}
function inserto() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("ō");
}
function insertu() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("ū");
}
function insertcapa() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("Ā");
}
function insertcape() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("Ē");
}
function insertcapi() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("Ī");
}
function insertcapo() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("Ō");
}
function insertcapu() {
  var cursor = DocumentApp.getActiveDocument().getCursor();
  cursor.insertText("Ū");
}
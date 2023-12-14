function fetchDataFromWeb() {
  // Get the active spreadsheet
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getActiveSheet();
  
  // Get the range of URLs in column A and the corresponding range in column B
  var urls = sheet.getRange("A1:A").getValues();
  var outputRange = sheet.getRange("B1:B");

  // Iterate through each URL
  for (var i = 0; i < urls.length; i++) {
    var url = urls[i][0];
    
    // Skip empty cells
    if (url) {
      // Add "https://" to the URL if not already present
      if (!url.startsWith("https://") && !url.startsWith("http://")) {
        url = "https://" + url;
      }

      try {
        // Make a request to the URL
        var response = UrlFetchApp.fetch(url);
        
        // Get the content of the page
        var content = response.getContentText();

        // Find occurrences of "tel:" and collect the 15 characters that follow
        var telMatches = content.match(/tel:(.{15})/);

        if (telMatches && telMatches.length > 1) {
          var telValue = telMatches[1];
          
          // Write the tel value to the corresponding cell in column B
          outputRange.offset(i, 0, 1, 1).setValue(telValue);
          
          Logger.log('Tel value for URL ' + (i + 1) + ': ' + telValue);
        } else {
          Logger.log('No "tel:" value found for URL ' + (i + 1));
        }
      } catch (e) {
        Logger.log('Error fetching URL ' + (i + 1) + ': ' + e);
      }
    }
  }
}

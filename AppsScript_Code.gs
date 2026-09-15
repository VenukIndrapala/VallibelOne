/**
 * Google Apps Script Web App to receive registration form submissions
 * and append them as rows to the "Registrations" sheet.
 *
 * Setup:
 * 1. Paste this into Extensions > Apps Script on your Google Sheet.
 * 2. Make sure your sheet has a tab named exactly "Registrations".
 * 3. Deploy > New deployment > Web app.
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL into app.js (SCRIPT_URL constant).
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp
      .getActiveSpreadsheet()
      .getSheetByName("Registrations");

    var p = e.parameter;

    sheet.appendRow([
      new Date(),                 // Timestamp
      p.category || "",           // school / university
      p.fullName || "",
      p.nic || "",
      p.email || "",
      p.phone || "",
      p.institution || "",
      p.detail || "",             // degree/year or A/L stream
      p.emergencyName || "",
      p.emergencyPhone || "",
      p.consentParticipation || "",
      p.consentPhoto || "",
      p.guardianConsent || ""
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ result: "success" }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: "error", message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: lets you sanity-check the deployment by visiting the
 * Web App URL directly in a browser (GET request).
 */
function doGet(e) {
  return ContentService
    .createTextOutput("Registration endpoint is live. Use POST to submit data.")
    .setMimeType(ContentService.MimeType.TEXT);
}

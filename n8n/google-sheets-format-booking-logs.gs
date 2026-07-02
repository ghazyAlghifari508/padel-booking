const SHEET_NAME = 'booking_logs';
const HEADERS = [
  'timestamp',
  'event',
  'booking_id',
  'user_name',
  'user_email',
  'court_name',
  'date',
  'start_time',
  'end_time',
  'status',
  'total_price',
];

function setupBookingLogsSheet() {
  const ss = SpreadsheetApp.getActive();
  const sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  // Keep the log schema tight: A-K only.
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  const extraCols = sheet.getMaxColumns() - HEADERS.length;
  if (extraCols > 0) sheet.deleteColumns(HEADERS.length + 1, extraCols);

  const lastRow = Math.max(sheet.getLastRow(), 2);
  const table = sheet.getRange(1, 1, lastRow, HEADERS.length);
  const header = sheet.getRange(1, 1, 1, HEADERS.length);

  sheet.setFrozenRows(1);
  header
    .setBackground('#0f172a')
    .setFontColor('#ffffff')
    .setFontWeight('bold')
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle');

  table
    .setFontFamily('Inter')
    .setFontSize(10)
    .setVerticalAlignment('middle')
    .setBorder(true, true, true, true, true, true, '#e5e7eb', SpreadsheetApp.BorderStyle.SOLID);

  sheet.setRowHeight(1, 36);
  sheet.setColumnWidth(1, 170); // timestamp
  sheet.setColumnWidth(2, 150); // event
  sheet.setColumnWidth(3, 95);  // booking_id
  sheet.setColumnWidth(4, 150); // user_name
  sheet.setColumnWidth(5, 220); // user_email
  sheet.setColumnWidth(6, 190); // court_name
  sheet.setColumnWidth(7, 110); // date
  sheet.setColumnWidth(8, 95);  // start_time
  sheet.setColumnWidth(9, 95);  // end_time
  sheet.setColumnWidth(10, 150); // status
  sheet.setColumnWidth(11, 130); // total_price

  sheet.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
  sheet.getRange('G:G').setNumberFormat('yyyy-mm-dd');
  sheet.getRange('H:I').setNumberFormat('@');
  sheet.getRange('K:K').setNumberFormat('"Rp"#,##0');
  sheet.getRange(2, 3, Math.max(sheet.getMaxRows() - 1, 1), 1).setHorizontalAlignment('center');
  sheet.getRange(2, 8, Math.max(sheet.getMaxRows() - 1, 1), 2).setHorizontalAlignment('center');
  sheet.getRange(2, 11, Math.max(sheet.getMaxRows() - 1, 1), 1).setHorizontalAlignment('right');

  if (sheet.getFilter()) sheet.getFilter().remove();
  table.createFilter();

  sheet.getBandings().forEach((b) => b.remove());
  sheet
    .getRange(1, 1, Math.max(sheet.getMaxRows(), 100), HEADERS.length)
    .applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY)
    .setHeaderRowColor('#0f172a')
    .setFirstRowColor('#ffffff')
    .setSecondRowColor('#f8fafc');

  const statusRange = sheet.getRange(2, 10, Math.max(sheet.getMaxRows() - 1, 1), 1);
  const rules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('confirmed')
      .setBackground('#dcfce7')
      .setFontColor('#166534')
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('Menunggu')
      .setBackground('#fef9c3')
      .setFontColor('#854d0e')
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('cancelled')
      .setBackground('#fee2e2')
      .setFontColor('#991b1b')
      .setRanges([statusRange])
      .build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextContains('expired')
      .setBackground('#e5e7eb')
      .setFontColor('#374151')
      .setRanges([statusRange])
      .build(),
  ];
  sheet.setConditionalFormatRules(rules);

  SpreadsheetApp.flush();
}

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('CourtFlow')
    .addItem('Format booking logs', 'setupBookingLogsSheet')
    .addToUi();
}

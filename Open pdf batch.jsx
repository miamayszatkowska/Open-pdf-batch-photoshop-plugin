
var pluginName = "Open pdf batch";

var licenceAuthor = "00"

// enable double clicking from the Macintosh Finder or the Windows Explorer
#target photoshop

// debug level: 0-2 (0:disable, 1:break on error, 2:break at beginning)
$.level = 0;
//debugger; // launch debugger on next line

// on localized builds we pull the $$$/Strings from a .dat file, see documentation for more details
$.localize = true;

var gScriptResult;

//open config
var inputPaths = Folder.selectDialog("Choose folder / Wybierz folder", false, false);;

//open config
var c = new File((new File($.fileName)).parent + "/Config/resolution.txt");
var res = "";
c.open('r');
while(!c.eof) res += c.readln();
c.close();
res = parseFloat(res);

var d = new File((new File($.fileName)).parent + "/Config/skala.txt");
var scale = "";
d.open('r');
while(!d.eof) scale += d.readln();
d.close();
scale = parseFloat(scale);
// alert(scale);

var samplesFolder = new Folder(inputPaths);

//Get the files
var inputNames = samplesFolder.getFiles();

// app.preferences.rulerUnits = Units.CM;
app.displayDialogs = DialogModes.NO;
var extension, splitPath;

var pdfOpenOptions = new PDFOpenOptions();

pdfOpenOptions.antiAlias = true;
pdfOpenOptions.mode = OpenDocumentMode.CMYK;
pdfOpenOptions.bitsPerChannel = BitsPerChannelType.EIGHT;

pdfOpenOptions.resolution = res;
pdfOpenOptions.supressWarnings = true;
pdfOpenOptions.cropPage = CropToType.TRIMBOX;

var new_layer_from_file;
var new_background_from_file;
var Path;
var scaleWidth, scaleHeight, tempDoc, factor, scaleFactor;

if (scale !== 100) {

  for (var i = 0; i < inputNames.length; i++) {

          splitPath = inputNames[i].toString().split(".");
          extension = splitPath[splitPath.length-1];
          if (
          extension=='PDF'      ||
          extension=='pdf'
          ) {
            tempDoc = open( inputNames[i], pdfOpenOptions);
            app.activeDocument.flatten();

            factor = 100 / scale;
            scaleWidth = Math.round(app.activeDocument.width.value * factor);
            scaleHeight = Math.round(app.activeDocument.height.value * factor);

            scaleFactor = mapIt ( (scaleWidth + scaleHeight), 0, 2800, 0, 150  );

            app.activeDocument.resizeImage(
            scaleWidth,
            scaleHeight,
            scaleFactor,
            ResampleMethod.BICUBIC
            );
          }

  }

} else {
  for (var i = 0; i < inputNames.length; i++) {

          splitPath = inputNames[i].toString().split(".");
          extension = splitPath[splitPath.length-1];
          if (
          extension=='PDF'      ||
          extension=='pdf'
          ) {
            open( inputNames[i], pdfOpenOptions);
            app.activeDocument.flatten();
          }

  }
}

function mapIt (num, in_min, in_max, out_min, out_max) {
      if (num > 1200) {
        return 40;
      } else {
        return Math.round((num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min);
      }
}

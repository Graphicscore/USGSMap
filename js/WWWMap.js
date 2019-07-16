// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");

WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

// Create and add layers to the WorldWindow.
var layers = [
    // Imagery layers.
    { layer: new WorldWind.BMNGLayer(), enabled: true, visibleInMenu: false },
    //{layer: new WorldWind.BMNGLandsatLayer(), enabled: false},
    { layer: new WorldWind.BingAerialLayer(null), enabled: true, visibleInMenu: true },
    { layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true, visibleInMenu: true },
    { layer: new WorldWind.BingRoadsLayer(null), enabled: false, visibleInMenu: true },

    //{layer: new WorldWind.RenderableLayer("Markers"), enabled: false, visibleInMenu: true},
    //{layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
    // Add atmosphere layer on top of all base layers.
    { layer: new WorldWind.AtmosphereLayer(), enabled: true, visibleInMenu: false },
    // WorldWindow UI layers.
    //{layer: new WorldWind.CompassLayer(), enabled: true},
    { layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true, visibleInMenu: false },
    //{layer: new WorldWind.ViewControlsLayer(wwd), enabled: true}
];

for (var l = 0; l < layers.length; l++) {
    layers[l].layer.enabled = layers[l].enabled;
    layers[l].layer.hide = !layers[l].visibleInMenu;
    wwd.addLayer(layers[l].layer);
}

/*var renderLayer = new WorldWind.RenderableLayer("Markers");
renderLayer.enabled = true;
renderLayer.visibleInMenu =  true;

var attributes = new WorldWind.ShapeAttributes(null);
attributes.outlineColor = WorldWind.Color.RED;
attributes.interiorColor = new WorldWind.Color(0, 1,1, 1);

// Create common highlight attributes. These are displayed whenever the user hovers over the shapes.
var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
highlightAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 1);


    //var circle = new WorldWind.SurfaceCircle(WorldWind.Location.fromRadians(entry.geometry.coordinates[0], entry.geometry.coordinates[1]), 25e3, attributes);
    var circle = new WorldWind.SurfaceCircle(new WorldWind.Location(28.5145, 104.9461), 200e3, attributes);

    circle.highlightAttributes = highlightAttributes;

    renderLayer.addRenderable(circle);



wwd.addLayer(renderLayer);

var layerManager = new LayerManager(wwd);*/

requestUSGSData(USGS_TimeSpan.PAST_DAY, USGS_Intensity.ALL, function (res) {
    var result = res.body;
    //console.log(result);
    if (result) {
        var renderLayer = new WorldWind.RenderableLayer("Markers");
        renderLayer.enabled = true;
        renderLayer.visibleInMenu = true;

        var attributes = new WorldWind.ShapeAttributes(null);
        attributes.outlineColor = WorldWind.Color.RED;
        attributes.interiorColor = new WorldWind.Color(0, 1, 1, 1);

        // Create common highlight attributes. These are displayed whenever the user hovers over the shapes.
        var highlightAttributes = new WorldWind.ShapeAttributes(attributes);
        highlightAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 1);

        result.features.forEach(function (entry) {
            var circle = new WorldWind.SurfaceCircle(new WorldWind.Location(entry.geometry.coordinates[1], entry.geometry.coordinates[0]), 25e3, attributes);
            circle.highlightAttributes = highlightAttributes;
            renderLayer.addRenderable(circle);
        });
        wwd.addLayer(renderLayer);
    }
}, function (err) {
    console.error(err);
});


//layers[4].layer.addRenderable(circle);


// Add a placemark
/*var placemarkLayer = new WorldWind.RenderableLayer();
wwd.addLayer(placemarkLayer);

var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

placemarkAttributes.imageOffset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.3,
    WorldWind.OFFSET_FRACTION, 0.0);

placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
    WorldWind.OFFSET_FRACTION, 0.5,
    WorldWind.OFFSET_FRACTION, 1.0);

placemarkAttributes.imageSource = WorldWind.configuration.baseUrl + "images/pushpins/plain-red.png";

var position = new WorldWind.Position(55.0, -106.0, 100.0);
var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

placemark.label = "Placemark\n" +
    "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
    "Lon " + placemark.position.longitude.toPrecision(5).toString();
placemark.alwaysOnTop = true;

placemarkLayer.addRenderable(placemark);*/

// Add a polygon
/*var polygonLayer = new WorldWind.RenderableLayer();
wwd.addLayer(polygonLayer);

var polygonAttributes = new WorldWind.ShapeAttributes(null);
polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
polygonAttributes.outlineColor = WorldWind.Color.BLUE;
polygonAttributes.drawOutline = true;
polygonAttributes.applyLighting = true;

var boundaries = [];
boundaries.push(new WorldWind.Position(20.0, -75.0, 700000.0));
boundaries.push(new WorldWind.Position(25.0, -85.0, 700000.0));
boundaries.push(new WorldWind.Position(20.0, -95.0, 700000.0));

var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
polygon.extrude = true;
polygonLayer.addRenderable(polygon);*/

// Add a COLLADA model
/*var modelLayer = new WorldWind.RenderableLayer();
wwd.addLayer(modelLayer);

var position = new WorldWind.Position(10.0, -125.0, 800000.0);
var config = {dirPath: WorldWind.configuration.baseUrl + 'examples/collada_models/duck/'};

var colladaLoader = new WorldWind.ColladaLoader(position, config);
colladaLoader.load("duck.dae", function (colladaModel) {
    colladaModel.scale = 9000;
    modelLayer.addRenderable(colladaModel);
});*/

// Add WMS imagery

/*var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
var layerName = "MOD_LSTD_CLIM_M";

var createLayer = function (xmlDom) {
    var wms = new WorldWind.WmsCapabilities(xmlDom);
    var wmsLayerCapabilities = wms.getNamedLayer(layerName);
    var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
    var wmsLayer = new WorldWind.WmsLayer(wmsConfig);
    wwd.addLayer(wmsLayer);
};

var logError = function (jqXhr, text, exception) {
    console.log("There was a failure retrieving the capabilities document: " +
        text +
    " exception: " + exception);
};

$.get(serviceAddress).done(createLayer).fail(logError);*/



// UI STUFF

function hidePanel() {
    $("#control-panel").hide("slide", { direction: "left" }, "slow", function () {
        $("#show-panel").show("fade", "fast");
    });
}

function showPanel() {
    $("#show-panel").hide("fade", "fast", function () {
        $("#control-panel").show("slide", { direction: "left" }, "slow");
    });
}

$(document).ready(function () {
    $("#btn-hide-panel").click(function () {
        hidePanel();
    });
    $("#btn-show-panel").click(function () {
        showPanel();
    });
}); 
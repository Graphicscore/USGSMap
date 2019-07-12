/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @exports LayerManager
 */

/**
 * Constructs a layer manager for a specified {@link WorldWindow}.
 * @alias LayerManager
 * @constructor
 * @classdesc Provides a layer manager to interactively control layer visibility for a WorldWindow.
 * @param {WorldWindow} worldWindow The WorldWindow to associated this layer manager with.
 */
var LayerManager = function (worldWindow) {
    var thisExplorer = this;

    this.wwd = worldWindow;

    this.roundGlobe = this.wwd.globe;

    // this.createProjectionList();
    $("#projection-toggle-button").click(function () {
        thisExplorer.onProjectionClick();
    });



    this.synchronizeLayerList();

    $("#searchBox").find("button").on("click", function (e) {
        thisExplorer.onSearchButton(e);
    });

    this.geocoder = new WorldWind.NominatimGeocoder();
    this.goToAnimator = new WorldWind.GoToAnimator(this.wwd);
    $("#searchText").on("keypress", function (e) {
        thisExplorer.onSearchTextKeyPress($(this), e);
    });

    //
    //this.wwd.redrawCallbacks.push(function (worldWindow, stage) {
    //    if (stage == WorldWind.AFTER_REDRAW) {
    //        thisExplorer.updateVisibilityState(worldWindow);
    //    }
    //});
};

LayerManager.prototype.onProjectionClick = function (event) {
    var projectionName = $("#projection-toggle-button").val();
    //$("#projectionDropdown").find("button").html(projectionName + ' <span class="caret"></span>');

    if (projectionName === "3D") {
        $("#projection-toggle-button")[0].value = "2D";
        $("#projection-toggle-button").find("i").html("texture");
        if (!this.roundGlobe) {
            this.roundGlobe = new WorldWind.Globe(new WorldWind.EarthElevationModel());
        }

        if (this.wwd.globe !== this.roundGlobe) {
            this.wwd.globe = this.roundGlobe;
        }
    } else {
        $("#projection-toggle-button")[0].value = "3D";
        $("#projection-toggle-button").find("i").html("3d_rotation");
        if (!this.flatGlobe) {
            this.flatGlobe = new WorldWind.Globe2D();
        }

        if (projectionName === "Equirectangular") {
            this.flatGlobe.projection = new WorldWind.ProjectionEquirectangular();
        } else if (projectionName === "2D") {
            this.flatGlobe.projection = new WorldWind.ProjectionMercator();
        } else if (projectionName === "North Polar") {
            this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("North");
        } else if (projectionName === "South Polar") {
            this.flatGlobe.projection = new WorldWind.ProjectionPolarEquidistant("South");
        } else if (projectionName === "North UPS") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("North");
        } else if (projectionName === "South UPS") {
            this.flatGlobe.projection = new WorldWind.ProjectionUPS("South");
        } else if (projectionName === "North Gnomonic") {
            this.flatGlobe.projection = new WorldWind.ProjectionGnomonic("North");
        } else if (projectionName === "South Gnomonic") {
            this.flatGlobe.projection = new WorldWind.ProjectionGnomonic("South");
        }

        if (this.wwd.globe !== this.flatGlobe) {
            this.wwd.globe = this.flatGlobe;
        }
    }

    this.wwd.redraw();
};
//test
LayerManager.prototype.onLayerClick = function (layerButton) {
    var layerNameButton = layerButton.val();
    if (layerNameButton == "satelite") {
        $("#layer-toggle-button")[0].value = "street";
        $("#layer-toggle-button").find("i").html("map")
        layerName = "Bing Roads";
    } else if (layerNameButton == "street") {
        $("#layer-toggle-button")[0].value = "satelite";
        $("#layer-toggle-button").find("i").html("satellite")
        layerName = "Bing Aerial with Labels";
    }
    // Update the layer state for the selected layer.
    for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
        var layer = this.wwd.layers[i];

        if (layer.hide) {
            continue;
        }

        if (layer.displayName === layerName) {
            layer.enabled = !layer.enabled;
            this.wwd.redraw();
            break;
        }
    }
};

LayerManager.prototype.synchronizeLayerList = function () {
    // Synchronize the displayed layer list with the WorldWindow's layer list.
    for (var i = 0, len = this.wwd.layers.length; i < len; i++) {
        var layer = this.wwd.layers[i];
        if (layer.hide) {
            continue;
        }

    }
    var self = this;
    $("#layer-toggle-button").on("click", function (e) {
        self.onLayerClick($(this));
    });
    $("#markers-toggle-button").on("click", function (e) {
        self.onLayerClick($(this));
    });
};
//
//LayerManager.prototype.updateVisibilityState = function (worldWindow) {
//    var layerButtons = $("#layerList").find("button"),
//        layers = worldWindow.layers;
//
//    for (var i = 0; i < layers.length; i++) {
//        var layer = layers[i];
//        for (var j = 0; j < layerButtons.length; j++) {
//            var button = layerButtons[j];
//
//            if (layer.displayName === button.innerText) {
//                if (layer.inCurrentFrame) {
//                    button.innerHTML = "<em>" + layer.displayName + "</em>";
//                } else {
//                    button.innerHTML = layer.displayName;
//                }
//            }
//        }
//    }
//};

LayerManager.prototype.createProjectionList = function () {
    var projectionNames = [
        "3D",
        "Mercator",
    ];
    var projectionDropdown = $("#projectionDropdown");

    var dropdownButton = $('<button class="btn btn-info btn-block dropdown-toggle" type="button" data-toggle="dropdown">3D<span class="caret"></span></button>');
    projectionDropdown.append(dropdownButton);

    var ulItem = $('<ul class="dropdown-menu">');
    projectionDropdown.append(ulItem);

    for (var i = 0; i < projectionNames.length; i++) {
        var projectionItem = $('<li><a >' + projectionNames[i] + '</a></li>');
        ulItem.append(projectionItem);
    }

    ulItem = $('</ul>');
    projectionDropdown.append(ulItem);
};

LayerManager.prototype.onSearchButton = function (event) {
    this.performSearch($("#searchText")[0].value)
};

LayerManager.prototype.onSearchTextKeyPress = function (searchInput, event) {
    if (event.keyCode === 13) {
        searchInput.blur();
        this.performSearch($("#searchText")[0].value)
    }
};

LayerManager.prototype.performSearch = function (queryString) {
    if (queryString) {
        var thisLayerManager = this,
            latitude, longitude;

        if (queryString.match(WorldWind.WWUtil.latLonRegex)) {
            var tokens = queryString.split(",");
            latitude = parseFloat(tokens[0]);
            longitude = parseFloat(tokens[1]);
            thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
        } else {
            this.geocoder.lookup(queryString, function (geocoder, result) {
                if (result.length > 0) {
                    latitude = parseFloat(result[0].lat);
                    longitude = parseFloat(result[0].lon);

                    WorldWind.Logger.log(
                        WorldWind.Logger.LEVEL_INFO, queryString + ": " + latitude + ", " + longitude);

                    thisLayerManager.goToAnimator.goTo(new WorldWind.Location(latitude, longitude));
                }
            });
        }
    }
};
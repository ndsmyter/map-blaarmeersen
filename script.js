// TODO Add measurement tool
// TODO Check the coordinates from Peter T with the coordinates here

function addLocationMarkers(app) {
    var map = app.map;
    var features = [];

    for (var i = 0, length = markers.length; i < length; i++) {
        var marker = markers[i];
        var coordinates = ol.proj.transform(marker.coordinates, 'EPSG:4326', 'EPSG:3857');
        var feature = new ol.Feature({
            type: marker.type,
            geometry: new ol.geom.Point(coordinates),
            coordinates: coordinates,
            description: marker.description
        });
        features.push(feature);
    }
    app.popup = new ol.Overlay({
        element: document.getElementById('popup'),
        offset: [0, -50],
        positioning: 'bottom-center'
    });
    var closeButton = '<div id="close-btn" onclick="closeOverlay()">' +
        '<i class="fa fa-times-circle-o" aria-hidden="true"></i></div>';
    map.on("click", function (e) {
        map.forEachFeatureAtPixel(e.pixel, function (feature) {
            var coord = e.coordinate;
            var properties = feature.getProperties();
            var popup = app.popup;
            popup.getElement().innerHTML = closeButton + properties.description;
            popup.setPosition(properties.coordinates);
            map.addOverlay(popup);
        })
    });
    app.featureLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: features
        }),
        style: function (feature) {
            return styles[feature.get('type')];
        }
    });
    map.addLayer(app.featureLayer);
}

function addRopeLines(app) {
    var lines = [];
    for (var i = 0, length = ropes.length; i < length; i++) {
        var rope = ropes[i];
        for(var j = 0, l = rope.length ; j < l;j++){
            rope[j] = ol.proj.transform(rope[j], 'EPSG:4326', 'EPSG:3857');
        }
        var line = new ol.Feature({
            geometry: new ol.geom.LineString(rope)
        });
        lines.push(line);
    }
    app.lineLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: lines
        })
    });
    app.map.addLayer(app.lineLayer);
}

function closeOverlay() {
    var app = window.app;
    app.map.removeOverlay(app.popup);
}

function addLayerSwitcher(app) {
    app.osm = new ol.layer.Tile({
        source: new ol.source.OSM(),
        visible: true
    });
    app.orthofotos = new ol.layer.Tile({
        source: new ol.source.TileWMS({
            url: 'http://geoservices.informatievlaanderen.be/raadpleegdiensten/omwrgbmrvl/wms',
            params: {
                'LAYERS': 'Ortho',
                'TILED': true,
                'STYLES': 'default',
                'srs': this.featureProjection,
                'CRS': this.featureProjection,
                'TRANSPARENT': 'TRUE',
                'FORMAT': 'image/png'
            }
        }),
        visible: false
    });
    app.LayerSelector = function (opt_options) {
        var options = opt_options || {};

        var button = document.createElement('button');
        button.innerHTML = '<img src="images/layers-20x20.png">';

        var switchLayers = function (showOrtho) {
            app.orthofotos.setVisible(showOrtho);
            app.osm.setVisible(!showOrtho);
        };
        var orthoButton = document.createElement('div');
        orthoButton.className = 'layer-selector-btn';
        orthoButton.innerHTML = '<img src="images/ortho.png"><div class="layer-name">Ortho foto\'s</div>';
        var selectOrtho = function () {
            switchLayers(true);
            toggleSwitchDialog();
        };
        orthoButton.addEventListener('click', selectOrtho, false);
        orthoButton.addEventListener('touchstart', selectOrtho, false);

        var osmButton = document.createElement('div');
        osmButton.className = 'layer-selector-btn';
        osmButton.innerHTML = '<img src="images/osm.jpg"><div class="layer-name">OpenStreetMap</div>';
        var selectOsm = function () {
            switchLayers(false);
            toggleSwitchDialog();
        };
        osmButton.addEventListener('click', selectOsm, false);
        osmButton.addEventListener('touchstart', selectOsm, false);

        var panel = document.createElement('div');
        panel.setAttribute('id', 'layer-selector-panel');
        panel.setAttribute('style', 'display: none');
        panel.innerHTML = 'Kies uw achtergrond:';
        panel.appendChild(orthoButton);
        panel.appendChild(osmButton);

        var toggleSwitchDialog = function () {
            var element = document.getElementById('layer-selector-panel');
            element.style.display = element.style.display === 'none' ? 'inline-block' : 'none';
        };

        button.addEventListener('click', toggleSwitchDialog, false);
        button.addEventListener('touchstart', toggleSwitchDialog, false);

        app.element.appendChild(button);
        app.element.appendChild(panel);

        ol.control.Control.call(this, {
            element: app.element,
            target: options.target
        });

    };
    ol.inherits(app.LayerSelector, ol.control.Control);
}

function createRotateControl(app) {
    /**
     * @constructor
     * @extends {ol.control.Control}
     * @param {Object=} opt_options Control options.
     */
    app.RotateControl = function (opt_options) {
        var options = opt_options || {};
        var button = document.createElement('button');
        button.innerHTML = opt_options.letter || 'N';
        button.title = opt_options.title || '';

        var scope = this;
        var handleRotate = function () {
            scope.getMap().getView().setRotation(opt_options.rotation || 0);
        };

        button.addEventListener('click', handleRotate, false);
        button.addEventListener('touchstart', handleRotate, false);

        app.element.appendChild(button);

        ol.control.Control.call(this, {
            element: app.element,
            target: options.target
        });
    };

    ol.inherits(app.RotateControl, ol.control.Control);
}

function addGeolocation(app) {
    var view = app.view;
    var map = app.map;
    var geolocation = new ol.Geolocation({
        // take the projection to use from the map's view
        projection: view.getProjection(),
        tracking: true
    });
    // handle geolocation error.
    geolocation.on('error', function (error) {
        console.error(error);
    });
    var accuracyFeature = new ol.Feature();
    geolocation.on('change:accuracyGeometry', function () {
        accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
    });

    var positionFeature = new ol.Feature();
    positionFeature.setStyle(new ol.style.Style({
        image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
                color: '#3399CC'
            }),
            stroke: new ol.style.Stroke({
                color: '#fff',
                width: 2
            })
        })
    }));

    geolocation.on('change:position', function () {
        var coordinates = geolocation.getPosition();
        positionFeature.setGeometry(coordinates ? new ol.geom.Point(coordinates) : null);
    });
    new ol.layer.Vector({
        map: map,
        source: new ol.source.Vector({
            features: [accuracyFeature, positionFeature]
        })
    });
}
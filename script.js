// TODO Add measurement tool
// TODO Check the coordinates from Peter T with the coordinates here

function addLocationMarkers(map) {
    var markers = [
        {
            coordinates: [3.683052, 51.044527],
            type: 'icon',
            title: 'Plaform 5m',
            description: 'Dit duikplatform werd door de duikclub Bubble Divers 14 oktober 2015 op de bodem van de' +
            ' Blaarmeersen  geplaatst, op een diepte van ongeveer 5 meter. Het platform is 4 op 2 meter groot en ' +
            'is aan de  oppervlakte gemarkeerd met een witte boei met daarop het logo van de Bubble Divers. ' +
            'Om het platform eenvoudig terug te vinden, is er een touw gespannen van aan de duikladder tot aan het ' +
            'platform.<br/>' +
            '<div><b>Diepte</b>: 5m</div><div><b>Grootte</b>: 4 x 2m</div><div><b>Geplaatst op</b>: 14 okt 2015</div>' +
            '<div><b>Geplaatst door</b>: Bubble Divers</div>'
        },
        {
            coordinates: [3.682982, 51.044823],
            type: 'icon',
            title: 'Duiktrap',
            description: 'De duiktrap is de beginplaats van de meeste duiken.'
        },
        {
            coordinates: [3.682745, 51.044370],
            type: 'icon',
            title: 'Silo',
            description: 'TODO'
        },
        {
            coordinates: [3.681968, 51.044130],
            type: 'car',
            title: 'Volvo 1',
            description: 'TODO'
        },
        {
            coordinates: [3.681526, 51.044141],
            type: 'car',
            title: 'Volvo 2',
            description: 'TODO'
        },
        {
            coordinates: [3.682993, 51.044327],
            type: 'icon',
            title: 'Platform 10m',
            description: 'TODO'
        },
        {
            coordinates: [3.683715, 51.044080],
            type: 'icon',
            title: 'Kerkhof',
            description: 'TODO'
        }
    ];
    // TODO Add some more styles
    var styles = {
        icon: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: '3rdparty/font-awesome/font-awesome_4-7-0_map-marker_50_0_000000_none.png'
            })
        }),
        car: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: '3rdparty/font-awesome/font-awesome_4-7-0_car_50_0_000000_none.png'
            })
        })
    };
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
    var popup = new ol.Overlay({
        element: document.getElementById('popup'),
        offset: [0, -50],
        positioning: 'bottom-center'
    });
    map.on("click", function (e) {
        map.forEachFeatureAtPixel(e.pixel, function (feature) {
            var coord = e.coordinate;
            var properties = feature.getProperties();
            popup.getElement().innerHTML = properties.description;
            popup.setPosition(properties.coordinates);
            map.addOverlay(popup);
        })
    });
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: features
        }),
        style: function (feature) {
            return styles[feature.get('type')];
        }
    });
    map.addLayer(vectorLayer);
}

function addLayerSwitcher(map, app) {
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

        if (!app.element) {
            app.element = document.createElement('div');
            app.element.className = 'extra-controls ol-unselectable ol-control';
        }
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

        if (!app.element) {
            app.element = document.createElement('div');
            app.element.className = 'extra-controls ol-unselectable ol-control';
        }
        app.element.appendChild(button);

        ol.control.Control.call(this, {
            element: app.element,
            target: options.target
        });
    };

    ol.inherits(app.RotateControl, ol.control.Control);
}

function addGeolocation(view, map) {
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
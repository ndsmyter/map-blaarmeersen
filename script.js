function createRotateControl(app){
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
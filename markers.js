var ladder = {
    coordinates: [3.682982, 51.044823],
    type: 'icon',
    title: 'Duiktrap',
    description: 'De duiktrap is de beginplaats van de meeste duiken.'
};
var bubblePlatform = {
    coordinates: [3.683052, 51.044527],
    type: 'platform',
    title: 'Plaform 5m',
    description: 'Dit duikplatform werd door de duikclub Bubble Divers 14 oktober 2015 op de bodem van de' +
    ' Blaarmeersen geplaatst, op een diepte van ongeveer 5 meter. Het platform is 4 op 2 meter groot en ' +
    'is aan de  oppervlakte gemarkeerd met een witte boei met daarop het logo van de Bubble Divers. ' +
    'Om het platform eenvoudig terug te vinden, is er een touw gespannen van aan de duikladder tot aan het ' +
    'platform.<br/>' +
    '<table>' +
    '<tr><th><b>Diepte?</b></th><td>5 m</td></tr>' +
    '<tr><th><b>Grootte?</b></th><td>4 x 2 m</td></tr>' +
    '<tr><th><b>Gemarkeerd?</b></th><td>witte boei</td></tr>' +
    '<tr><th><b>Hoe te vinden?</b></th><td>touw gespannen van aan de duiktrap,<br/>touw tussen platform op 5m en 10m</td></tr>' +
    '<tr><th><b>Geplaatst op?</b></th><td>14 okt 2015</td></tr>' +
    '<tr><th><b>Geplaatst door?</b></th><td>Bubble Divers</td></tr>' +
    '</table>'
};
var ovosPlatform = {
    coordinates: [3.682917, 51.044000],
    type: 'platform',
    title: 'Platform 10m',
    description: 'Dit duikplatform werd door <a href="http://ovos.be" target="_blank">OVOS</a> geplaatst op ' +
    '29 november 2016 op de bodem van de Blaarmeersen, op een diepte van ongeveer 10 meter. ' +
    'Het platform is 3 op 2.40 meter groot en is aan de  oppervlakte gemarkeerd met een gele druppelboei. ' +
    'Om het platform eenvoudig terug te vinden, is er een touw gespannen van aan het duikplatform op 5m tot aan ' +
    'het platform. Het platform is ook te bereiken door 90m naar het zuiden te zwemmen van aan de duiktrap.<br/>' +
    '<table>' +
    '<tr><th><b>Diepte onderaan?</b></th><td>10.10 m</td></tr>' +
    '<tr><th><b>Diepte bovenaan?</b></th><td>9.20 m</td></tr>' +
    '<tr><th><b>Grootte?</b></th><td>3 x 2.40 m</td></tr>' +
    '<tr><th><b>Gemarkeerd?</b></th><td>Gele druppelboei</td></tr>' +
    '<tr><th><b>Hoe te vinden?</b></th><td>Touw tussen platform op 5m en 10m</td></tr>' +
    '<tr><th><b>Geplaatst op?</b></th><td>29 nov 2016</td></tr>' +
    '<tr><th><b>Geplaatst door?</b></th><td>Oost-Vlaamse vereniging voor Onderwateronderzoek en -Sport</td></tr>' +
    '</table>'
};
var volvo1 = {
    coordinates: [3.681664, 51.044141],
    type: 'car',
    title: 'Volvo 1',
    description: 'TODO'
};
var volvo2 = {
    coordinates: [3.681184, 51.044180],
    type: 'car',
    title: 'Volvo 2',
    description: 'TODO'
};
var markers = [
    ladder,
    bubblePlatform,
    ovosPlatform,
    volvo1,
    volvo2,
    {
        coordinates: [3.682581, 51.044057],
        type: 'icon',
        title: 'Silo',
        description: 'TODO'
    },
    {
        coordinates: [3.683715, 51.044080],
        type: 'icon',
        title: 'Kerkhof',
        description: 'TODO'
    }
];
var ropes = [
    [ladder.coordinates, bubblePlatform.coordinates],
    [bubblePlatform.coordinates, ovosPlatform.coordinates],
    [volvo1.coordinates, volvo2.coordinates],
    [[3.681704, 51.044325], volvo1.coordinates],
    [[3.681356, 51.044396], volvo2.coordinates]
];
// TODO Add some more styles
// Generated using http://fa2png.io/
var styles = {
    icon: new ol.style.Style({
        image: new ol.style.Icon({
            scale: 0.7,
            anchor: [0.5, 1],
            src: '3rdparty/font-awesome/font-awesome_4-7-0_map-marker_50_0_000000_none.png'
        })
    }),
    car: new ol.style.Style({
        image: new ol.style.Icon({
            scale: 0.7,
            anchor: [0.5, 0.5],
            src: '3rdparty/font-awesome/font-awesome_4-7-0_car_50_0_000000_none.png'
        })
    }),
    platform: new ol.style.Style({
        image: new ol.style.Icon({
            scale: 0.7,
            anchor: [0.5, 0.5],
            src: 'images/box_50x32.png'
        })
    })
};
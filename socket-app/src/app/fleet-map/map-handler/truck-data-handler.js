
import Feature from 'ol/Feature';
import {Point,LineString} from 'ol/geom';
import {Style, Icon, Text, Fill} from 'ol/style';

import * as olProjections from 'ol/proj';

export class TruckDataHandler {

    constructor(truckJson) {
        this.imagesPath = `assets/images/maps/`;
        this.id = truckJson.id;
        this.infotext = truckJson.txt;
        this.truckRegistrationNumber = truckJson.reg;

        this.truckTrackFeatures = [];
        this.truckTrackMarkerFeatures = [];
        this.truckInformationMarkerFeature;
        this.truckPositionFeature;
        this.currentPosition;

        this.storeJsonData(truckJson);

    }


    storeJsonData(truckJson) {

        var coordinates = olProjections.transform([truckJson.lon, truckJson.lat], 'EPSG:4326', 'EPSG:3857');

        var lastCoordinates;
        var ph = 0;
        while (ph < truckJson.hist.length) {

            var pos = truckJson.hist[ph++];
            var coordinates = olProjections.transform([pos.lon, pos.lat], 'EPSG:4326', 'EPSG:3857');
            if (lastCoordinates != null) {
                var dx = coordinates[0] - lastCoordinates[0];
                var dy = coordinates[1] - lastCoordinates[1];
                var rotation = Math.atan2(dy, dx);

                this.truckTrackMarkerFeatures.push(this.createTruckTrackMarker(coordinates, rotation, pos.ts));

                this.truckTrackFeatures.push(this.createTruckTrackLine(lastCoordinates, coordinates));
            }
            lastCoordinates = coordinates;
        }
        this.truckPositionFeature = this.createTruckPositionMarker(coordinates, rotation);
        this.truckInformationMarkerFeature = this.createTruckInformationMarker(coordinates);
        this.currentPosition = lastCoordinates;
    };

    updateTruckPosition(layerData, lat, lon) {
        var coordinates = olProjections.transform([lon, lat], 'EPSG:4326', 'EPSG:3857');
        var rotation = 0;
        if (this.currentPosition != null) {
            var dx = coordinates[0] - this.currentPosition[0];
            var dy = coordinates[1] - this.currentPosition[1];
            rotation = Math.atan2(dy, dx);
        }

        layerData.truckPositionLayer.getSource().removeFeature(this.truckPositionFeature);
        this.truckPositionFeature = this.createTruckPositionMarker(coordinates, rotation);
        layerData.truckPositionLayer.getSource().addFeature(this.truckPositionFeature);

        layerData.truckInformationMarkerLayer.getSource().removeFeature(this.truckInformationMarkerFeature);
        this.truckInformationMarkerFeature = this.createTruckInformationMarker(coordinates);
        layerData.truckInformationMarkerLayer.getSource().addFeature(this.truckInformationMarkerFeature);

        var newTrackFeature = this.createTruckTrackLine(this.currentPosition, coordinates);
        layerData.truckTrackLayer.getSource().addFeature(newTrackFeature);
        this.truckTrackFeatures.push(this.createTruckTrackLine(this.currentPosition, coordinates));
        this.currentPosition = coordinates;
    }


    createTruckPositionMarker(coordinates, rotation) {
        let markerFeature = new Feature({
            geometry: new Point([coordinates[0], coordinates[1]]),
            type: 'po',
            id: this.id,
            text: this.infotext
        });

        let imageFile;
        if (Math.abs(rotation) < (Math.PI / 2))
            imageFile = `${this.imagesPath}TruckR.png`;
        else {
            imageFile = `${this.imagesPath}TruckL.png`;
            rotation = rotation - Math.PI;
        }

        let iconStyle = new Style({
            image: new Icon(({
                anchor: [16, 16],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 1,
                rotateWithView: false,
                rotation: -rotation,
                src: imageFile
            }))
        });
        markerFeature.setStyle(iconStyle);
        return markerFeature;
    }


    createTruckInformationMarker(coordinates) {
        var markerFeature = new Feature({
            geometry: new Point([coordinates[0], coordinates[1]]),
            type: 'ti',
        });
        var imagePath = './images/maps/numplate.png'; //replace with no-plate
        // var iconStyle = new ol.style.Style({
        //     image: new ol.style.Icon(({
        //         anchor: [0, 30],
        //         anchorXUnits: 'pixels',
        //         anchorYUnits: 'pixels',
        //         opacity: 1,
        //         rotateWithView: false,
        //         src: imagePath
        //     }))
        // });

        let iconStyle = [
            new Style({
                image: new Icon(/** @type {olx.style.IconOptions} */ ({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: 'assets/images/maps/marker-48.png',
                }))
            }),
            new Style({
                text: new Text({
                    text: this.truckRegistrationNumber,
                    offsetY: 25,
                    scale:1.5,
                    fill: new Fill({
                        color: '#ff0000'
                    })
                })
            })
        ];

        markerFeature.setStyle(iconStyle);
        return markerFeature;
    }


    createTruckTrackMarker(coordinates, rotation, timestamp) {
        var markerFeature = new Feature({
            geometry: new Point([coordinates[0], coordinates[1]]),
            type: 'ts',
            timestamp: timestamp
        });
        var iconStyle = new Style({
            image: new Icon(({
                anchor: [8, 8],
                anchorXUnits: 'pixels',
                anchorYUnits: 'pixels',
                opacity: 0.75,
                rotateWithView: false,
                rotation: -rotation,
                src: 'assets/images/maps/arrow2.png'
            }))
        });

        markerFeature.setStyle(iconStyle);
        return markerFeature;
    }

    createTruckTrackLine(prevCoordinates, coordinates) {
        return new Feature({
            geometry: new LineString([[prevCoordinates[0], prevCoordinates[1]], [coordinates[0], coordinates[1]]]),
            type: 'tr',
            registrationNumber: this.truckRegistrationNumber
        });
    }



}

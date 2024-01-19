import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';;

export class LayerData {

    constructor(truckDataHandlerArray){
        this.truckDataHandlerArray = truckDataHandlerArray;

        this.truckPositionLayer = new  VectorLayer();
        this.truckInformationMarkerLayer = new VectorLayer();

        this.truckTrackLayer = new VectorLayer();
        this.truckTrackMarkerLayer = new VectorLayer();
    }

    buildTruckTrackLayers(truckHandler){
        let trackMarkerVectorSource = new VectorSource();
        let trackLineVectorSource = new VectorSource();
        if (truckHandler) {
            trackMarkerVectorSource.addFeatures(truckHandler.truckTrackMarkerFeatures);
            trackLineVectorSource.addFeatures(truckHandler.truckTrackFeatures);
        }
        else {
            for (var tr = 0; tr < this.truckDataHandlerArray.length; tr++) {
                truckHandler = this.truckDataHandlerArray[tr];
                
                trackMarkerVectorSource.addFeatures(truckHandler.truckTrackMarkerFeatures);
                trackLineVectorSource.addFeatures(truckHandler.truckTrackFeatures);
            }
        }

        this.truckTrackMarkerLayer.setSource(trackMarkerVectorSource);
        this.truckTrackLayer.setSource(trackLineVectorSource);
        this.truckTrackLayer.setStyle(this.getTruckLineStyleFunction);
    }

    buildTruckMarkerLayers(){
        
        let truckPositionMarkerVectorSource = new VectorSource();
        let truckInformationMarkerVectorSource = new VectorSource();

        for (var tr = 0; tr < this.truckDataHandlerArray.length; tr++) {
            var truckDataHandler = this.truckDataHandlerArray[tr];
            truckPositionMarkerVectorSource.addFeature(truckDataHandler.truckPositionFeature);
            truckInformationMarkerVectorSource.addFeature(truckDataHandler.truckInformationMarkerFeature);
        }

        this.truckPositionLayer.setSource(truckPositionMarkerVectorSource);
        this.truckInformationMarkerLayer.setSource(truckInformationMarkerVectorSource);
    }
}
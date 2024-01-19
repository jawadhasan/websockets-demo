import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import * as olProjections from "ol/proj";
import { fromLonLat } from "ol/proj";

import { TruckDataHandler } from "./truck-data-handler.js";
import { LayerData } from "./layer-data.js";

export class MapHandler {
  constructor() {
    this.map;
    this.truckDataHandlerArray = [];
    this.layerData = new LayerData(this.truckDataHandlerArray);
  }

  loadTruckMapJsonData(json) {
    let truckDataHandler;
    for (var tr = 0; tr < json.data.length; tr++) {
      const truckJson = json.data[tr];
      truckDataHandler = new TruckDataHandler(truckJson);
      this.truckDataHandlerArray.push(truckDataHandler);
    }
    this.layerData.buildTruckTrackLayers();
    this.layerData.buildTruckMarkerLayers();

    return truckDataHandler; //just in-case
  }

  setupTruck(json) {
    let truckDataHandler = new TruckDataHandler(json);
    this.truckDataHandlerArray.push(truckDataHandler);
    this.layerData.buildTruckTrackLayers();
    this.layerData.buildTruckMarkerLayers();
    return truckDataHandler; //just in-case
  }

  createMap(target) {
    // this.info = $('#info');
    // this.info.tooltip({
    // animation: false,
    // trigger: 'manual'
    // });

    const osmLayer = new TileLayer({
      source: new OSM(),
    });
    // Create latitude and longitude and convert them to default projection
    const berlin = olProjections.transform(
      [13.138977, 52.52761],
      "EPSG:4326",
      "EPSG:3857"
    );

    // Create a View, set it center and zoom level
    const view = new View({
      center: berlin,
     // center: fromLonLat([-98, 46.47]),
      zoom: 12,
    });

    // Instanciate a Map, set the object target to the map DOM id
    const myMap = new Map();
    myMap.setTarget(target);
    myMap.addLayer(osmLayer); // Add the created layer to the Map

    //add truck layers
    myMap.addLayer(this.layerData.truckTrackLayer);
    myMap.addLayer(this.layerData.truckTrackMarkerLayer);

    myMap.addLayer(this.layerData.truckPositionLayer);
    myMap.addLayer(this.layerData.truckInformationMarkerLayer);

    // Set the view for the map
    myMap.setView(view);

    myMap.on("click", (evt) => {
      console.log("evt", evt);
      // $("#logs").find("span").text(`${evt.pixel}`);
      // this.info
      //   .tooltip("hide")
      //   .attr("data-original-title", "text")
      //   .tooltip("fixTitle")
      //   .tooltip("show");

      this.onClick(evt); //this = mapHandler
    });

    myMap.on("pointermove", (evt) => {
      if (evt.dragging) {
        //    this.info.tooltip('hide')
        console.log("dragging");

        return;
      }
      var pixel = myMap.getEventPixel(evt.originalEvent);
      this.onMouseOver(pixel);
    });

    this.map = myMap;

    //needed to display (resize window otherwise)
    setTimeout(() => {
      this.map.updateSize();
    }, 1);
  }

  onClick(evt) {
    let feature = this.map.forEachFeatureAtPixel(
      evt.pixel,
      function (feature, layer) {
        console.log("Click (feature,layer)", feature, layer);
      }
    );
    return feature;
  }

  onMouseOver(pixel) {
    var text;

    var feature = this.map.forEachFeatureAtPixel(
      pixel,
      function (feature, layer) {
        return feature;
      }
    );

    if (feature) {
      var properties = feature.getProperties();
      if (properties.type == "tr") {
        text = properties.registrationNumber;
      } else if (properties.type == "ts") {
        text = properties.timestamp;
      } else if (properties.type == "po") {
        var truckDataHolder = this.findTruckById(properties.id);
        this.layerData.buildTruckTrackLayers(truckDataHolder);
        text = truckDataHolder.infotext;
      }
    }

    // if (text) {
    //   $("#info").css({
    //     left: pixel[0] + "px",
    //     top: pixel[1] - 15 + "px",
    //   });
    //   $("#info").tooltip("hide");

    //   $("#info").attr("data-toggle", text).attr("title", text).tooltip("show");

    //   $("#logs").find("span").text(`${text}`);
    // } else {
    //   $("#logs").find("span").text(`Info...`);
    //   $("#info").tooltip("hide");
    // }
  }

  findTruckById(id) {
    for (var i = 0; i < this.truckDataHandlerArray.length; i++) {
      const truckDataHandler = this.truckDataHandlerArray[i];
      if (truckDataHandler.id == id) return truckDataHandler;
    }
    return null;
  }

  updateTruckData(d) {
    let truckDataHolder = this.findTruckById(d.id);
    truckDataHolder.updateTruckPosition(this.layerData, d.lat, d.lon);
  }

  test() {
    console.log("Test button clicked!");
    const truckDataHandler = this.truckDataHandlerArray[0];
    truckDataHandler.updateTruckPosition(this.layerData, 52.533976, 13.15624);
  }

  simulate(json) {
    var delayInMilliseconds = 1000; //1 second
    let truckJson = json[0];

    console.log("simulate button clicked!", truckJson);

    let truckDataHandler = this.loadTruckMapJsonData({ data: json });

    let counter = 0;
    const interval1 = setInterval(() => {
      truckDataHandler.updateTruckPosition(
        this.layerData,
        truckJson.hist[counter].lat,
        truckJson.hist[counter].lon
      );
      counter += 1;
      // $("#logs").find("span").text(`${truckDataHandler.truckRegistrationNumber} : coordinates[${truckDataHandler.currentPosition}]`);

      if (counter === truckJson.hist.length) {
        console.log("done");
        clearInterval(interval1); //cancel
      }
    }, delayInMilliseconds);

    // truckDataHandler.updateTruckPosition(this.layerData, 52.533976, 13.156240);
  }
}

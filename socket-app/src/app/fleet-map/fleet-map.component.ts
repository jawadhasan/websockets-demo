import { Component, OnInit } from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';

import { MapHandler } from './map-handler/map-handler.js';
import { Simulator } from './map-handler/simulator.js';
import { WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-fleet-map',
  templateUrl: './fleet-map.component.html',
  styleUrls: ['./fleet-map.component.css'],
})
export class FleetMapComponent implements OnInit {
  map: Map;
  mapHandler: MapHandler;
  messages: string[] = [];

  constructor(private websocketService: WebsocketService) {}

  ngOnInit(): void {
    this.mapHandler = new MapHandler();
    const mapDiv = document.getElementById('ol-map');
    this.mapHandler.createMap(mapDiv); //this div should exist before
    // console.log('mapHandler', this.mapHandler);

    //event wiring
    this.websocketService.connect();

    //subscribing to messages
    this.websocketService.messageReceived.subscribe((message: string) => {
      let d = JSON.parse(message);

      let truckHandler = this.mapHandler.findTruckById(d.licensePlate);
      console.log('foundHandler', truckHandler);

      if (truckHandler === null) {
        //setup truck
        let truckData = {
          id: d.licensePlate,
          reg: d.licensePlate,
          txt: `simulated data for ${d.licensePlate}`,
          lon: d.lon,
          lat: d.lat,
          ts: d.ts,
          hist: [{ lon: d.lon, lat: d.lat, ts: new Date().getTime() }],
        };

        this.mapHandler.setupTruck(truckData);
      } else {
        let trucUpdate = {
          id: d.licensePlate,
          lon: d.lon,
          lat: d.lat,
          ts: new Date().getTime(),
        };

        // truckHandler
        this.mapHandler.updateTruckData(trucUpdate);
      }


    });

    // this.map = new Map({
    //   view: new View({
    //     center: [0, 0],
    //     zoom: 1,
    //   }),
    //   layers: [
    //     new TileLayer({
    //       source: new OSM(),
    //     }),
    //   ],
    //   target: 'ol-map'
    // });

    // let simulator = new Simulator();
    // simulator.getSimulatedData(1);

    // this.mapHandler.loadTruckMapJsonData({data:simulator.data}); //truckPositionData
  }

  simulate() {
    console.log('simulate');

    let simulator = new Simulator();
    simulator.getSimulatedData(1);

    this.mapHandler.simulate(simulator.data);
  }

  test() {}
}

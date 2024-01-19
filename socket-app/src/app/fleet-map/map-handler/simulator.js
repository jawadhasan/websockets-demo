

export class Simulator {

    constructor() {
        this.data = [];
    }

    simulate() {

        let rideId = Math.floor(Math.random() * 1000);
        const driveTime = 2 * 60; // 2 hours in minutes
        let counter = 0;
        let endTime = new Date();

        const initialCoordinates = {
            lat: 46.6314609,
            lon: -99.34467
        };

        const endingCoordinates = {
            lat: 46.6302106,
            lon: -96.8319174
        };


        let truckData =  {
            "id": `PC ${rideId}`,
            "reg": `B-UM ${rideId}`,
            "txt": `simulated data for ${rideId}`,
            "lon": endingCoordinates.lon,
            "lat": endingCoordinates.lat,
            "ts": new Date().getTime(),
            "hist": [                    
            ]
          }

        while (counter < driveTime) {

            let currentCoordinates = {
                lat: initialCoordinates.lat + (endingCoordinates.lat - initialCoordinates.lat) * (counter / driveTime),
                lon: initialCoordinates.lon + (endingCoordinates.lon - initialCoordinates.lon) * (counter / driveTime)
            };
        
            counter++;

            let histData = {                
                temperature: 77.2 + 0.02 * counter,
                ts: Math.floor(new Date(endTime.getTime() - (driveTime - counter) * 60 * 1000).getTime()),
                lat: currentCoordinates.lat,
                lon: currentCoordinates.lon
            };    

            truckData.hist.push({ "lon": histData.lon, "lat": histData.lat, "ts": histData.ts }) 
        }

        return truckData;

    }


    getSimulatedData(truckCount=1){       

        for(let i=0;i<truckCount;i++){
            let truckData = this.simulate();
            this.data.push(truckData);
        }

    }
}






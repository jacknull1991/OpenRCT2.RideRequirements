import { RRWindow } from "./rrwindow"
import reqsJson from "./reqs.json";

const initializeUI = (): void => {
  if (typeof ui === 'undefined') {
    return;
  }

  // get data
  // const allRides: RideObject[] = context.getAllObjects("ride").filter(r => r.carsPerFlatRide !== 0);
  // allRides.sort((a,b) => a.rideType[0] - b.rideType[0]);
  // const JC_LDB = allRides[2];
  // const JC_LOG = allRides[3];
  
  // console.log(`${JC_LDB.name}`);
  // const vehicles = JC_LDB.vehicles.filter(v => v.baseImageId > 0);
  // vehicles.forEach(v => {
  //   console.log(v.flags)
  // })
  // console.log(`--------------------`)
  // console.log(`${JC_LOG.rideType}`)
  

  
  ui.registerMenuItem("Ride Requirements", () => {
    const rides: RideObject[] = context.getAllObjects("ride");

    let reqWindow = new RRWindow("reqs", "Ride Stat Requirements", reqsJson, rides);
    reqWindow.open();
  });
}

const main = (): void => {
  initializeUI();
};

export default main;

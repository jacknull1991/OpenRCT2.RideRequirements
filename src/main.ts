import { RRWindow } from "./rrwindow"
import reqsJson from "./reqs.json";

const initializeUI = (): void => {
  if (typeof ui === 'undefined') {
    return;
  }

  // get data
  // const rides: RideObject[] = context.getAllObjects("ride");
  
  ui.registerMenuItem("Ride Requirements", () => {
    let reqWindow = new RRWindow("reqs", "Ride Stat Requirements", reqsJson);
    reqWindow.open();
  });
}

const main = (): void => {
  initializeUI();
};

export default main;

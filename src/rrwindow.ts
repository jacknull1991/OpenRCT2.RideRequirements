import { RideRequirement } from "./types";

export class RRWindow {

  _handle: Window | undefined;
  _classification: string;
  _width: number;
  _height: number;
  _title: string;
  _x: number;
  _y: number;
  _openAtPosition: Boolean;
  _availableRides: RideObject[];
  _reqList: RideRequirement[];
  _filteredList: RideRequirement[];
  _widgets: WidgetBase[];

  constructor(classification: string, title: string, json: object, availableRides: RideObject[]) {
    this._handle = undefined;
    this._classification = classification;
    this._width = 390;
    this._height = 220;
    this._title = title;
    this._x = 0;
    this._y = 0;
    this._openAtPosition = false;
    this._availableRides = availableRides.sort((a,b) => a.rideType[0] - b.rideType[0]);

    this._reqList = parseJson(json);
    this._filteredList = this._reqList;
    this._widgets = this._getWidgets();
  }

  open() {
    let desc = this._getDescription();
    this._handle = ui.openWindow(desc);
    this._openAtPosition = true;
  }

  _getDescription(): WindowDesc {
    let desc: WindowDesc = {
      classification: this._classification,
      title: this._title,
      width: this._width,
      height: this._height,
      widgets: this._widgets
    }
    if (this._openAtPosition) {
      desc.x = this._x;
      desc.y = this._y;
    }

    return desc;
  }

  _getWidgets(): WidgetBase[] {
    const widgets: WidgetBase[] = [];

    // filter checkbox
    const checkboxW: CheckboxWidget = {
      type:'checkbox',
      name:'filterCheck',
      text:'Show available rides only',
      x:10,
      y:20,
      width:180,
      height:10,
      isChecked: false,
      onChange: (isChecked) => {
        if (this._handle) {
          const list = this._handle.findWidget<ListViewWidget>("rideList");
          if (isChecked) {
            this._filterRides();
            list.items = this._filteredList.map(r => r.name);
          } else {
            this._filteredList = this._reqList;
            list.items = this._filteredList.map(r => r.name);
          }
        }
      }
    }

    let y = 45;
    const heightW= this._createLabelWidget(y, "Highest drop height: ", "height");
    const dropW = this._createLabelWidget(y+=12, "Drops: ", "drop");
    const speedW = this._createLabelWidget(y+=12, "Max. speed: ", "speed");
    const lengthW = this._createLabelWidget(y+=12, "Ride length: ", "length");
    const negGW = this._createLabelWidget(y+=12, "Max. negative Gs: ", "negG");
    const latGW = this._createLabelWidget(y+=12, "Max. lateral Gs: ", "latG");
    const inverW = this._createLabelWidget(y+=12, "Inversions: ", "inver");
    const noteW = this._createLabelWidget(y+=24, "A * means the stat requirement\nonly applies if the ride has no\ninversion.","note");

    const groupboxW: GroupBoxWidget = {
      type:'groupbox',
      name:'details',
      text:'Requirements Details',
      x:200,
      y:30,
      width:180,
      height:this._height-40
    };
    const listViewW: ListViewWidget = {
      type: 'listview',
      name: "rideList",
      x: 10,
      y: 30,
      width: 180,
      height: this._height - 40,
      scrollbars: 'vertical',
      showColumnHeaders: true,
      canSelect: true,
      columns: [{
        width: this._width - 20,
        minWidth: this._width - 30,
        maxWidth: this._width - 30,
        header: "Select a ride"
      }],
      items: this._filteredList.map(r => r.name),
      onClick: (item: number, _column: number) => {
        if (this._handle) {
          const ride = this._filteredList[item];
          // name
          let gbW = this._handle.findWidget<GroupBoxWidget>("details");
          gbW.text = ride.name;
          // height
          let heightW = this._handle.findWidget<LabelWidget>("height");
          if (ride.highest_drop_height) {
            heightW.text = `Highest drop height: ${Number.parseFloat(ride.highest_drop_height)}m`;
            if (ride.highest_drop_height.match(/\*$/)) {
              heightW.text += '*';
            }
          } else {
            heightW.text = "------------------";
          }
          // drop
          let dropW = this._handle.findWidget<LabelWidget>("drop");
          if (ride.number_of_drops) {
            dropW.text = `Drops: ${Number.parseFloat(ride.number_of_drops)}`;
            if (ride.number_of_drops.match(/\*$/)) {
              dropW.text += '*';
            }
          } else {
            dropW.text = "------------------";
          }
          // speed
          let speedW = this._handle.findWidget<LabelWidget>("speed");
          if (ride.max_speed) {
            speedW.text = `Max. speed: ${Number.parseFloat(ride.max_speed)}km/h`;
            if (ride.max_speed.match(/\*$/)) {
              speedW.text += '*';
            }
          } else {
            speedW.text = "------------------";
          }
          // length
          let lengthW = this._handle.findWidget<LabelWidget>("length");
          if (ride.ride_length) {
            lengthW.text = `Ride length: ${Number.parseFloat(ride.ride_length)}m`;
            if (ride.ride_length.match(/\*$/)) {
              lengthW.text += '*';
            }
          } else {
            lengthW.text = "------------------";
          }
          // negative G
          let negGW = this._handle.findWidget<LabelWidget>("negG");
          if (ride.max_negative_g) {
            negGW.text = `Max. negative Gs: ${Number.parseFloat(ride.max_negative_g).toFixed(2)}g`;
            if (ride.max_negative_g.match(/\*$/)) {
              negGW.text += '*';
            }
          } else {
            negGW.text = "------------------";
          }
          // lateral G
          let latGW = this._handle.findWidget<LabelWidget>("latG");
          if (ride.max_lateral_g) {
            latGW.text = `Max. lateral Gs: ${Number.parseFloat(ride.max_lateral_g).toFixed(2)}g`;
            if (ride.max_lateral_g.match(/\*$/)) {
              latGW.text += '*';
            }
          } else {
            latGW.text = "------------------";
          }
          // inversion
          let inverW = this._handle.findWidget<LabelWidget>("inver");
          if (ride.inversion) {
            inverW.text = `Inversions: ${ride.inversion}`;
            inverW.isVisible = true;
          } else {
            inverW.isVisible = false;
          }
        }
      }
    };

    widgets.push(checkboxW);
    widgets.push(listViewW);
    widgets.push(groupboxW);
    widgets.push(heightW);
    widgets.push(dropW);
    widgets.push(speedW);
    widgets.push(lengthW);
    widgets.push(negGW);
    widgets.push(latGW);
    widgets.push(inverW);
    widgets.push(noteW);
    return widgets;
  }

  _createLabelWidget(y: number, label: string, name: string): LabelWidget {
    return {
      type: 'label',
      name,
      text: label,
      x: 205,
      y,
      width: 180,
      height: 10
    }
  }

  _filterRides() {
    const typeList: number[] = [];
    this._availableRides.forEach(ride => {
      typeList.push(ride.rideType[0])
    });
    this._filteredList = [];
    this._reqList.forEach((ride) => {
      if (typeList.indexOf(Number.parseInt(ride.ride_type)) !== -1) {
        this._filteredList.push(ride);
      }
    });
  }

}

function parseJson(json: object): RideRequirement[] {
  const arr: RideRequirement[] = [];
  for (let key in json) {
    //@ts-ignore
    let ride = json[key] as RideRequirement;
    arr.push(ride);
  }
  return arr;
}

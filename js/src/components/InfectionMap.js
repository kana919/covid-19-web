import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import JapanMap from "./JapanMap.js";


export class InfectionMap {
  constructor(divId) {
    am4core.useTheme(am4themes_animated);
    this.chart = am4core.create(divId, am4maps.MapChart);
    this.chart.geodata = new JapanMap().getGeoData();
    this.eventFunc = null;
  }

  _update_prefecture_name() {
    this.chart.geodata.features[0].properties.name = '北海道';
  }

  render() {
    // Set projection
    this.chart.projection = new am4maps.projections.Miller();
    this.chart.panBehavior = "rotateLongLat";

    // Create map polygon series
    let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.nonScalingStroke = true;
    polygonSeries.mapPolygons.template.strokeOpacity = 0.5;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.tooltipText = "{name}";
    polygonTemplate.fill = this.chart.colors.getIndex(0);

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    hs.properties.fill = this.chart.colors.getIndex(0).brighten(-0.5);
    polygonTemplate.events.on("over", this.eventFunc);
  }

  addEventFunc(func) {
    this.eventFunc = func;
  }
}

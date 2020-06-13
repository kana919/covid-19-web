import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

import { JapanMap } from "./JapanMap.js";


export class InfectionMap {
  constructor(divId, isLogoEnabled = true, prefIds = []) {
    am4core.useTheme(am4themes_animated);
    this.chart = am4core.create(divId, am4maps.MapChart);
    this.chart.geodata = new JapanMap().getGeoData(prefIds);
    this.eventFunc = null;
    if (!isLogoEnabled) {
      this.chart.logo.height = -15000;
    }
  }

  render(infectionInfo) {
    // Set projection
    this.chart.projection = new am4maps.projections.Miller();
    // this.chart.panBehavior = "rotateLongLat";
    this.chart.seriesContainer.draggable = false;
    this.chart.seriesContainer.resizable = false;
    this.chart.maxZoomLevel = 1;

    // Create map polygon series
    let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.nonScalingStroke = true;
    polygonSeries.mapPolygons.template.strokeOpacity = 0.5;

    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.fill = this.chart.colors.getIndex(0);
    polygonTemplate.adapter.add("fill", function(fill, target) {
      if (target.dataItem.dataContext) {
        const index = parseInt(target.dataItem.dataContext.id.split("JP-")[1]) - 1;
        const num = infectionInfo[index].daily[0].current_infected;
        if (num >= 1000) {
          return am4core.color("#8c0a00");
        }
        if (num >= 500) {
          return am4core.color("#bf2a11");
        }
        if (num >= 100) {
          return am4core.color("#ea5432");
        }
        if (num >= 50) {
          return am4core.color("#ff771d");
        }
        if (num >= 10) {
          return am4core.color("#ff9d56");
        }
        if (num >= 1) {
          return am4core.color("#ffceab");
        }
        return am4core.color("#eaeaea");
      }
    });
    polygonTemplate.tooltipText = "{name}";

    // Create hover state and set alternative fill color
    let hs = polygonTemplate.states.create("hover");
    // hs.properties.fill = this.chart.colors.getIndex(0).brighten(-0.5);
    polygonTemplate.events.on("over", this.eventFunc);
  }

  loaded() {
    const mapChart = document.querySelector('#map-chart');
    mapChart.classList.remove('hidden');
  }

  addEventFunc(func) {
    this.eventFunc = func;
  }
}

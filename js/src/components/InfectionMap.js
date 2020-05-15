import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_japanLow from "@amcharts/amcharts4-geodata/japanLow";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";

export default class InfectionMap {
  constructor(divId) {
    am4core.useTheme(am4themes_animated);
    this.chart = am4core.create(divId, am4maps.MapChart);
    this.chart.geodata = am4geodata_japanLow;
  }

  render() {
    // Set projection
    this.chart.projection = new am4maps.projections.Miller();
    this.chart.panBehavior = "rotateLongLat";

    let grid = this.chart.series.push(new am4maps.GraticuleSeries());
    grid.toBack();

    // Create map polygon series
    let polygonSeries = this.chart.series.push(new am4maps.MapPolygonSeries());

    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    polygonSeries.mapPolygons.template.nonScalingStroke = true;
    polygonSeries.mapPolygons.template.strokeOpacity = 0.5;
  }
}

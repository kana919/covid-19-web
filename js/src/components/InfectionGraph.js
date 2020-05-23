import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_material from "@amcharts/amcharts4/themes/material";


export class InfectionGraph {
  constructor(divId) {
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    this.chart = am4core.create(divId, am4charts.XYChart);
    this.chart.width = am4core.percent(98);
    this.chart.height = am4core.percent(98);
    // disable logo
    // this.chart.logo.height = -15000;
  }

  render(data) {
    this.chart.data = data;
    let dateAxis = this.chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.startLocation = 0.5;
    dateAxis.endLocation = 0.5;
    dateAxis.baseInterval = {
      timeUnit: "day",
      count: 1
    };
    dateAxis.dateFormatter = new am4core.DateFormatter();
    dateAxis.dateFormats.setKey("day", "MM/dd");
    let valueAxis = this.chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;

    let death = this.chart.series.push(new am4charts.LineSeries());
    death.name = "死亡者数";
    death.dataFields.dateX = "reported_date";
    death.dataFields.valueY = "total_death";
    death.tooltipHTML = "<span style='font-size:14px; color:#000000;'>死亡者数:<b>{valueY.value}</b></span>";
    death.tooltipText = "[#000]{valueY.value}[/]";
    death.tooltip.background.fill = am4core.color("#FFF");
    death.tooltip.getFillFromObject = false;
    death.tooltip.getStrokeFromObject = true;
    death.tooltip.background.strokeWidth = 3;
    death.sequencedInterpolation = true;
    death.fill = am4core.color("#999999");
    death.fillOpacity = 0.6;
    death.defaultState.transitionDuration = 1000;
    death.stacked = true;
    death.stroke = am4core.color("#999999");
    death.strokeWidth = 2;

    let recovery = this.chart.series.push(new am4charts.LineSeries());
    recovery.name = "回復者数";
    recovery.dataFields.dateX = "reported_date";
    recovery.dataFields.valueY = "total_recovered";
    recovery.tooltipHTML = "<span style='font-size:14px; color:#000000;'>回復者数:<b>{valueY.value}</b></span>";
    recovery.tooltipText = "[#000]{valueY.value}[/]";
    recovery.tooltip.background.fill = am4core.color("#FFF");
    recovery.tooltip.getFillFromObject = false;
    recovery.tooltip.getStrokeFromObject = true;
    recovery.tooltip.background.strokeWidth = 3;
    recovery.sequencedInterpolation = true;
    recovery.fill = am4core.color("#93c47d");
    recovery.fillOpacity = 0.6;
    recovery.stacked = true;
    recovery.stroke = am4core.color("#93c47d");
    recovery.strokeWidth = 2;

    let infection = this.chart.series.push(new am4charts.LineSeries());
    infection.dataFields.dateX = "reported_date";
    infection.name = "感染者数";
    infection.dataFields.valueY = "current_infected";
    infection.tooltipHTML = "<span style='font-size:14px; color:#000000;'>感染者数:<b>{valueY.value}</b></span>";
    infection.tooltipText = "[#000]{valueY.value}[/]";
    infection.tooltip.background.fill = am4core.color("#FFF");
    infection.tooltip.getStrokeFromObject = true;
    infection.tooltip.background.strokeWidth = 3;
    infection.tooltip.getFillFromObject = false;
    infection.fill = am4core.color("#e06666");
    infection.fillOpacity = 0.6;
    infection.stroke = am4core.color("#e06666");
    infection.strokeWidth = 2;
    infection.stacked = true;

    this.chart.cursor = new am4charts.XYCursor();
    this.chart.cursor.xAxis = dateAxis;
    // Add a legend
    this.chart.legend = new am4charts.Legend();
    this.chart.legend.position = "top";
  }

  update(data) {
    this.chart.data = data;
  }
}

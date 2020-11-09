import { AfterViewInit, Component } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Chart } from 'Chart.js';
import * as d3 from 'd3';
import { DataService } from '../data.service';
import { map } from 'rxjs/operators';
import { Mybudget } from '../Models/budget';
import { from } from 'rxjs';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements AfterViewInit {


  private componentBudget: any;
  private svg;
  private margin = 50;
  private width = 750 - (this.margin * 2);
  private height = 400 - (this.margin * 2);

  public dataSource = {
    datasets: [
        {
    data: [],
    backgroundColor: [
       '#ffcd56',
       '#ff6384',
       '#36a2eb',
       '#fdb19',
       '#FF00FF',
       '#00FFFF',
       '#FFFF00'
      ]
  }
],
labels: []
};


  constructor(private http: HttpClient,private dataService: DataService) {  }

  ngAfterViewInit(): void {

if (this.dataService.BudgetData !== null && this.dataService.BudgetData !== undefined  )
{
  this.componentBudget = this.dataService.BudgetData;
}

this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
        for (var i = 0; i < res.length; i++) {
        this.dataSource.datasets[0].data[i] = res[i].budget;
        this.dataSource.labels[i] = res[i].title;
        this.createChart();
    }


  });




this.createSvg();
if (this.componentBudget === undefined || this.componentBudget === null)
  {
this.dataService.getData().subscribe(
  (data: any) => {
    this.dataService.BudgetData = data;
    this.componentBudget = data;
    this.drawBars(this.componentBudget);
  });
  }
  else
  {
    this.drawBars(this.componentBudget);
  }
}




  private createSvg(): void {
    this.svg = d3.select('figure#bar')
    .append('svg')
    .attr('width', this.width + (this.margin * 2))
    .attr('height', this.height + (this.margin * 2))
    .append('g')
    .attr('transform', 'translate(' + this.margin + ',' + this.margin + ')');
}


private drawBars(data: any[]): void {
  // Create the X-axis band scale
  const x = d3.scaleBand()
  .range([0, this.width])
  .domain(data.map(d => d.title))
  .padding(0.2);


  // Draw the X-axis on the DOM
  this.svg.append('g')
  .attr('transform', 'translate(0,' + this.height + ')')
  .call(d3.axisBottom(x))
  .selectAll('text')
  .attr('transform', 'translate(-10,0)rotate(-45)')
  .style('text-anchor', 'end');

  // Create the Y-axis band scale
  const y = d3.scaleLinear()
  .domain([0, 500])
  .range([this.height, 0]);

  // Draw the Y-axis on the DOM
  this.svg.append('g')
  .call(d3.axisLeft(y));

  // Create and fill the bars
  this.svg.selectAll('bars')
  .data(data)
  .enter()
  .append('rect')
  .attr('x', d => x(d.title))
  .attr('y', d => y(d.budget))
  .attr('width', x.bandwidth())
  .attr('height', (d) => this.height - y(d.budget))
  .attr('fill', '#d04a35');
}


  // tslint:disable-next-line: typedef
  createChart() {
    // var ctx = document.getElementById('myChart').getContext('2d');
    var ctx = document.getElementById('myChart');
    var myPieChart = new Chart (ctx, {
        type: 'pie',
        data: this.dataSource
        });
    }

}

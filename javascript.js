const req = new XMLHttpRequest();
           req.open("GET",'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json', true);
           req.send();
           req.onload = function(){
             const json = JSON.parse(req.responseText);
             const baseTemp = json["baseTemperature"];
             const infoMes = json["monthlyVariance"];



             const graphConteiner = d3.select("body")
                                      .append("div")
                                      .attr("id","graphConteiner");
            graphConteiner.append("h1")
                          .attr("id","title")
                          .text("Monthly Global Land-Surface Temperature");
            graphConteiner.append("h2")
                          .attr("id","description")
                          .text("1753 - 2015: base temperature 8.66℃");

            const w = 1000;
            const h = 700;
            const padding = 60;


            const yearMin = d3.min(infoMes, (d) => (d["year"]));
            const yearMax = d3.max(infoMes, (d) => (d["year"]));

            const timeMin = d3.min(infoMes, (d) => d["month"]);
            const timeMax = d3.max(infoMes, (d) => d["month"]);

            const xScale = d3.scaleLinear()
                             .domain([yearMin, yearMax])
                             .range([padding, w - padding]);

            const yScale = d3.scaleLinear()
                             .domain([timeMin, timeMax + 0.5])
                             .range([padding, h - padding]);

            const svg = d3.select("#graphConteiner")
                          .append("svg")
                          .attr("width", w)
                          .attr("height", h)
                          .attr("class","graph");

            const xAxis = d3.axisBottom(xScale).tickFormat((x) => x.toString());

              svg.append("g")
                  .attr("id","x-axis")
                  .attr("transform", "translate(0, " + (h - padding) + ")")
                  .call(xAxis);

              var month = ['January',"February","March","April","May","June","July", "August","September","October","November","December"];

              const yAxis = d3.axisLeft(yScale).tickFormat(function(d, i){
                        return month[i];
             });

              svg.append("g")
                  .attr("id","y-axis")
                  .attr("transform", "translate(" + (padding) + ", 0)")
                  .call(yAxis);

              let tooltip = d3.select("#graphConteiner")
                              .append("div")
                              .attr("id", "tooltip")
                              .style("visibility", "hidden")
                              .style("position", "absolute");

              svg.selectAll("rect")
                 .data(infoMes)
                 .enter()
                 .append("rect")
                 .attr("x", (d) => xScale(d["year"]))
                 .attr("y", (d) => yScale(d["month"] - 0.5))
                 .attr("width", ((w - 2 * padding) / (yearMax - yearMin)))
                 .attr("height", ((h - 2 * padding) / 12))
                 .attr("class","cell")
                 .attr("data-year",(d) => d["year"])
                 .attr("data-month", (d) => d["month"] - 1)
                 .attr("data-temp", (d) => d["variance"] + baseTemp)
                 .attr("fill", (d) => {
                   let valor = baseTemp + d["variance"];
                   if (valor >= 11.7){
                     return "rgb(215, 48, 39)"
                   } else if (valor > 10.6 && valor < 11.7) {
                     return "rgb(244, 109, 67)"
                   } else if (valor >= 9.5 && valor < 10.6) {
                     return "rgb(253, 174, 97)"
                   } else if (valor >= 8.3 && valor < 9.5) {
                     return "rgb(254, 224, 144)"
                   } else if (valor >= 7.2 && valor < 8.3) {
                     return "rgb(255, 255, 191)"
                   } else if (valor >= 6.1 && valor < 7.2) {
                     return "rgb(224, 243, 248)"
                   } else if (valor >= 5.0 && valor < 6.1) {
                     return "rgb(171, 217, 233)"
                   } else if (valor >= 3.9 && valor < 5.0) {
                     return "rgb(116, 173, 209)"
                   } else if (valor >= 2.8 && valor < 3.9) {
                     return "rgb(69, 117, 180)"
                   }
                 })
                 .on("mouseover", function (d, event) {
                    tooltip
                      .html("")
                      .attr("data-year", d["year"])
                      .style('visibility', 'visible')
                      .style('top', event.pageY + 300 + "px")
                      .style('left', event.pageX + 100 + "px");

                    tooltip.append('h3').text(d.year + " - " + month[d.month - 1]);
                    tooltip.append('h4').text((baseTemp + d.variance).toFixed(2));
                    tooltip.append('h4').text(d.variance);

                  })
                  .on("mouseout", function() {
                    tooltip.style('visibility', 'hidden');
                  });
              const scaleFill = [
                {valorMin: "2.8", color: "rgb(69, 117, 180)"},
                {valorMin: "3.9", color: "rgb(116, 173, 209)"},
                {valorMin: "5.0", color: "rgb(171, 217, 233)"},
                {valorMin: "6.1", color: "rgb(224, 243, 248)"},
                {valorMin: "7.2", color: "rgb(255, 255, 191)"},
                {valorMin: "8.3", color: "rgb(254, 224, 144)"},
                {valorMin: "9.5", color: "rgb(253, 174, 97)"},
                {valorMin: "10.6", color: "rgb(244, 109, 67)"},
                {valorMin: "11.7", color: "rgb(215, 48, 39)"}
              ];
              const wLegend = 500;
              const hLegend = 70;
              const paddingLegend = 20;

              const legend = graphConteiner.append("svg")
                                           .attr("id","legend")
                                           .attr("width", wLegend)
                                           .attr("height", hLegend);

              const legendXMin = d3.min(scaleFill, (d) => parseFloat(d["valorMin"]));
              const legendXMax = d3.max(scaleFill, (d) => parseFloat(d["valorMin"]));

              const xScaleLegend = d3.scaleLinear()
                               .domain([legendXMin - 1, legendXMax + 2])
                               .range([paddingLegend, wLegend - paddingLegend]);

               const xAxisLegend = d3.axisBottom(xScaleLegend);

                 legend.append("g")
                     .attr("transform", "translate(0, " + (hLegend - paddingLegend) + ")")
                     .call(xAxisLegend);


              legend.selectAll("rect")
                    .data(scaleFill)
                    .enter()
                    .append("rect")
                    .attr("x", (d) => xScaleLegend(parseFloat(d["valorMin"])))
                    .attr("width", (d) => (wLegend - paddingLegend)/scaleFill.length)
                    .attr("height","50px")
                    .attr("fill", (d) => d["color"]);


           }

// @TODO: YOUR CODE HERE!

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data using d3.csv

d3.csv("assets/data/data.csv").then(function(censusData, err) {
    if (err) throw err;

    // parse data
    censusData.forEach(function(data) {
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    // xLinearScale function above csv import
    var xLinearScale = d3.scaleLinear()
    .domain([d3.min(censusData, d => d.poverty) -5,
      d3.max(censusData, d => d.poverty) +5
    ])
    .range([0, width]);

    // Create y scale function
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(censusData, d => d.healthcare) -5,
        d3.max(censusData, d => d.healthcare) +5
        ])
        .range([height, 0]);

    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
        .call(leftAxis);

    // append initial circles
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.poverty))
        .attr("cy", d => yLinearScale(d.healthcare))
        .attr("r", 8)
        .attr("fill", "pink")
        .attr("opacity", ".5");
    
    // Create tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([0, 0])
        .html(function(d) {
        return (`${d.state}<br>${d.healthcare} ${d.poverty}`);
    });

    svg.call(toolTip);

    // Tooltip events
    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
      })
        // onmouseout event
        .on("mouseout", function(data, index) {
          toolTip.hide(data);
        });
    
    // Append axis labels for y and x axis
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .classed("axis-text", true)
        .text("Lacks Healthcare (%)");
    
    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + 25})`)
        .text("In Poverty (%)");
    
    // Add States to the circles
    circlesGroup.append("text")
    .attr("class", "states")
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .selectAll("census")
    .data(censusData)
    .enter()
    .append("census")
    .attr("xaxis", function(data) {
        return xLinearScale(data.poverty);
    })
    .attr("yaxis", function(data) {
        return yLinearScale(data.healthcare);
    })
    .text(function(data) {
        return data.abbr
    });

}).catch(function(error) {
    console.log(error);
});


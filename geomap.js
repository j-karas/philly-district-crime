var width = 800,
height = 700;

Promise.all([
d3.json("./Boundaries_District.json"),
d3.csv("./incidents_part1_part2.csv"),
d3.csv("./crime_types.csv")
]).then((data) =>{
//console.log(data);
const topology = data[0];
const crime = data[1];
const types = data[2];

console.log(types);

function getCrimeData(filterValue) {
    if (!filterValue) {
        return crime;
    }

    var filteredData = crime.filter((el) => {
        //console.log(filterValue);
        return el.ucr_general === filterValue
    })

    //console.log(filteredData);
    return filteredData;
  }

    // add the options to the button
    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(types)
        .enter()
        .append('option')
        .text(function (d) { return d.type; }) // text showed in the menu
        .attr("value", function (d) { return d.id; }) // corresponding value returned by the button

//console.log(topology);

const crimeDictionary = new Map();

crime.forEach((crime) => {  // this is basically a for loop
    if (!crimeDictionary.has(crime.ucr_general)) {
        crimeDictionary.set(crime.ucr_general, 1);
    } else {
        crimeDictionary.set(crime.ucr_general, crimeDictionary.get(crime.ucr_general) + 1);
    }
})  

var projection = d3.geoMercator()
.center([-75.12, 40.05])
.scale(100000);

var path = d3.geoPath()
.projection(projection);

const svg = d3.select("#geomap").attr('transform', 'translate(300,50)')
.attr("width", width)
.attr("height", height);


var districtText = svg.append("text")
.attr("y", height / 10)
.attr("class", "district")
.attr("text-anchor", "left");

svg.selectAll("path")
.data(topojson.object(topology, topology.objects.Boundaries_District).geometries)
.enter().append("path")
.attr("class", "districts")
.attr("id", function (d) {return d.properties.DIST_NUM;})
.attr("d", path)
.on("mouseover", function () {
    d3.select(this).style("fill", "yellow");
    districtText.text("District: " + this.id);
})
.on("mouseout", function () {
    d3.select(this).style("stroke", "black");
    d3.select(this).style("fill", "rgb(196, 202, 199)");
    d3.select(this).style("stroke-width", ".75px");
    districtText.text("");
})

function updateCircles(crime) {
    d3.select("#geomap")
        .selectAll("circle")
        .data(crime)
        .join(
            function(enter) {
                return enter.append("circle")
                    .attr("visibility", "visible");
            },
            function(update) {
                return update.attr("visibility", "visible");
            }
        )
        .attr("class", (d) => { return d.ucr_general })
        .attr("d", path)
        // .attr("fill", (d) => {
        //     return colors(d.ucr_general);
        // })
        // .attr("stroke", (d) => {
        //     return colors(d.ucr_general);
        // })
        .attr("fill", "red")
        .attr("stroke", "red")
        .attr("opacity", .4)
        .attr("r", "1.5px")
        .attr("cx", (d) => { return projection([d.lng, d.lat])[0] })
        .attr("cy", (d) => { return projection([d.lng, d.lat])[1] });
}

function updateCrime(value) {
    let newData = getCrimeData(value);
    updateCircles(newData);
    console.log(value);
}

d3.select("#selectButton").on("change", function(d) {
    // recover the option that has been chosen
    var selectedOption = d3.select(this).property("value")
    // run the updateChart function with this selected option
    updateCrime(selectedOption)
})

updateCrime("600");
});

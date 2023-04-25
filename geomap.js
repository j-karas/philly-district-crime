(function() { 

var width = 800,
height = 700;

Promise.all([
d3.json("./Boundaries_District.json"),
d3.csv("./incidents_part1_part2.csv")
]).then((data) =>{
//console.log(data);
const topology = data[0];
const crime = data[1];
//console.log(topology);

const crimeDictionary = new Map();

crime.forEach((crime) => {  // this is basically a for loop
    if (!crimeDictionary.has(crime.ucr_general)) {
        crimeDictionary.set(crime.ucr_general, 1);
    } else {
        crimeDictionary.set(crime.ucr_general, crimeDictionary.get(crime.ucr_general) + 1);
    }
})  

console.log(crimeDictionary);

var colors = d3.scaleOrdinal()
.domain(crimeDictionary.keys())
.range(['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D'])


var projection = d3.geoMercator()
.center([-75.12, 40.05])
.scale(100000);

var path = d3.geoPath()
.projection(projection);

// var path2 = d3.geo.path()
//     .projection(projection);

const svg = d3.select("#geomap").attr('transform', 'translate(50,50)')
.attr("width", width)
.attr("height", height);

var neighborhoodText = svg.append("text")
.attr("y", height / 8)
.attr("text-anchor", "left");

var districtText = svg.append("text")
.attr("y", height / 10)
.attr("text-anchor", "left");

svg.selectAll("path")
.data(topojson.object(topology, topology.objects.Boundaries_District).geometries)
.enter().append("path")
.attr("class", "districts")
.attr("id", function (d) {return d.properties.DIST_NUM;})
.attr("d", path)
.on("mouseover", function () {
    d3.select(this).style("stroke", "red");
    // d3.select(this).style("fill", "white");
    d3.select(this).style("stroke-width", "2px");
    districtText.text("District: " + this.id);
})
.on("mouseout", function () {
    d3.select(this).style("stroke", "black");
    d3.select(this).style("fill", "#aaa");
    d3.select(this).style("stroke-width", ".75px");
    districtText.text("");
})

svg.append("g")
    .selectAll("circle")
    .data(crime)
    .join("circle")
    .attr("class", (d) => {return d.ucr_general})
    .attr("d", path)
    .attr("visibility", "visible")
    .attr("fill", (d) => {
        return colors(d.ucr_general);
    })
    .attr("stroke", (d) => {
        return colors(d.ucr_general);
    })
    .attr("r", "2px")
    .attr("cx", (d) => { return projection([d.lng, d.lat])[0] })
    .attr("cy", (d) => { return projection([d.lng, d.lat])[1] });

// var i = 8;
// for (const [key, value] of crimeDictionary.entries()) {
//     console.log(key, value);
//     svg.append("rect")
//         .data(crimeDictionary.entries())
//         .attr("height", 40)
//         .attr("width", 70)
//         .attr("y", i)
//         .attr("class", key)
//         .attr("fill", (d) => {
//             console.log(key)
//             return colors(key);
//         })
//         .on("click", (d) => {
//             d3.selectAll("circle")
            
//             //svg.selectAll("circle")
//             // .filter(() => {
//             //     // console.log(d3.select(this).attr("class"))
//             //     return d3.select(this).attr("class") === key;
//             // })
//                 .attr("visibility", (d) => {
//                     // if (d3.selectAll("circle").attr("visibility") === "visible") {
//                     //     return "hidden";
//                     // } else {return "visible";}
//                         return "hidden";
//                 })
//         })

//     i=i+48;
// }


// d3.json("philadelphia.json", function (error, topology) {
//     svg.selectAll("path")
//         .data(topojson.object(topology, topology.objects.philadelphia).geometries)
//         .enter().append("path")
//         .attr("class", "neighborhoods")
//         .attr("id", function (d) { return d.properties.name; })
//         .attr("d", path)
//         .on("mouseover", function () {
//             d3.select(this).style("fill", "#ff0");
//             neighborhoodText.text("Neighborhood: " + this.id);
//         })
//         .on("mouseout", function () {
//             d3.select(this).style("fill", "#aaa");
//             neighborhoodText.text("");
//         });
// });

// d3.json("Boundaries_District.json", function (error, topology){
//     svg.selectAll("path")
//         .data(topojson.object(topology, topology.objects.Boundaries_District).geometries)
//         .enter().append("path")
//         .attr("class", "districts")
//         .attr("id", function (d) {return d.properties.DIST_NUM;})
//         .attr("d", path)
//         .on("mouseover", function () {
//             d3.select(this).style("stroke", "red");
//             // d3.select(this).style("fill", "white");
//             d3.select(this).style("stroke-width", "2px");
//             districtText.text("District: " + this.id);
//         })
//         .on("mouseout", function () {
//             d3.select(this).style("stroke", "black");
//             d3.select(this).style("fill", "#aaa");
//             d3.select(this).style("stroke-width", ".75px");
//             districtText.text("");
//         })
// });

})

})();
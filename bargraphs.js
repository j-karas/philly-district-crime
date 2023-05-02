(function() {

    // var width = 800,
    // height = 700;

    Promise.all([
        d3.csv("./Boundaries_District.csv"),
        d3.csv("./incidents_part1_part2.csv"),
        d3.csv("./crime_types.csv")
    ]).then((data) =>{
        var districts = data[0];
        var crime = data[1];
        var crimeTypes = data[2];
        console.log(districts);
        console.log(crime);
        console.log(crimeTypes);

        
        //NECESSARY STRUCTURE:
        /*
        [
            {district_num: "1", crimes: [{type: 600, count: 100},{type: 400, count: 24},{type: 1000, count: 1}]},
            {...},
            ...
        ]
        */

        var crimePerDistrict = [];
        var districtObject = {};
        districts.forEach(district => {
            var obj = {}
            obj["district_num"] = district.DIST_NUMC;
            districtObject[district.DIST_NUMC] = [];
            crimePerDistrict.push(obj);
        });

        console.log(districtObject);

        var types = [];
        var typeMap = new Map();

        crimeTypes.forEach(type => {
            if (type.id) {
                types.push(type.type);
            };
            typeMap.set(type.id, type.type);
        });

        crime.forEach((crime) => {  // this is basically a for loop
            const i = districtObject[crime.dc_dist].findIndex(e => e.type === typeMap.get(crime.ucr_general));
            if (i > -1) {
                /* districtObject contains the element we're looking for, at index "i" */
                districtObject[crime.dc_dist][i].count +=1;
            } else {
                //create that element and append it to our list of objects.
                tempObj = {"type": typeMap.get(crime.ucr_general), "count": 1};
                districtObject[crime.dc_dist].push(tempObj);
            }

        })
        
        crimePerDistrict.forEach(obj => {
            obj["crimes"] = districtObject[obj.district_num];
        })

        console.log(crimePerDistrict);

        console.log(districtObject);

        function createBargraph(selectButton, graph, color, h, w) {

            // add the options to the button
            d3.select(selectButton)
                .selectAll('myOptions')
                .data(crimePerDistrict)
                .enter()
                .append('option')
                .text(function (d) { return d.district_num; }) // text showed in the menu
                .attr("value", function (d, i) { return i; }) // corresponding value returned by the button

            // set the dimensions and margins of the graph
            var margin = { top: 10, right: 30, bottom: 30, left: 285 },
                width = w - margin.left - margin.right,
                height = h - margin.top - margin.bottom;

            var svg = d3.select(graph)
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            // Add y axis
            var y = d3.scaleBand()
                .domain(types)
                .range([0, height])
                .padding(.1)
            var yAxis = svg.append("g")
                .call(d3.axisLeft(y));


            // Add x axis
            var x = d3.scaleLinear()
                .domain([0, d3.max(crimePerDistrict[0].crimes, (d) => { return (d.count) })])
                .range([0, width]);
            var xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).tickSize(3))
                .attr("font-size", "5px");

            function update(data) {

                //update the y scale:
                //data.map(function (d) { return d.type; })
                y.domain(types)
                yAxis.transition().duration(1000).call(d3.axisLeft(y))

                //update the x scale:
                x.domain([0, d3.max(data, (d) => { return (d.count) })])
                xAxis.transition().duration(1000).call(d3.axisBottom(x).tickSize(3))

                var u = svg.selectAll("rect")
                    .data(data)
                u
                    .enter()
                    .append("rect")
                    .merge(u)
                    .transition()
                    .duration(1000)
                    .attr("x", x(0))
                    .attr("y", function (d) { return y(d.type); })
                    .attr("width", function (d) { return x(d.count); })
                    .attr("height", y.bandwidth())
                    .attr("fill", color)

                var t = svg.selectAll("rect")
                t
                    .on('mouseover', (event, d) => { //when mouse is over point
                        d3.select(event.currentTarget) //add a stroke to highlighted point 
                            .style("fill", "yellow");


                        d3.select('#tooltip') // add text inside the tooltip div
                            .style('visibility', 'visible') //make it visible
                            .html(`
                          <h3 class="tooltip-title">${d.type}</h1>          
                          Number of instances: ${d.count}
                  `);
                    })
                    .on('mouseleave', (event) => {  //when mouse isn’t over point
                        d3.select('#tooltip').style('visibility', 'hidden'); // hide tooltip
                        d3.select(event.currentTarget) //remove the stroke from point
                            .style("fill", color);


                    })

                u
                    .exit()
                    .remove()
                t
                    .exit()
                    .remove()
            }




            d3.select(selectButton).on("change", function (d) {
                // recover the option that has been chosen
                var selectedOption = d3.select(this).property("value")
                // run the updateChart function with this selected option
                update(crimePerDistrict[selectedOption].crimes);
            })

            update(crimePerDistrict[0].crimes);

        }

        createBargraph("#selectButton2", "#bargraph", "#69b3a2", 500 ,800);
        createBargraph("#selectButton3", "#bargraph2", "#69b444", 500, 800);

    })



})();
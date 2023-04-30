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

        var types = []

        crimeTypes.forEach(type => {
            if (type.id) {
                types.push(type.id);
            };
        });

        // var crimeList = d3.rollup(crime, v =>
        //     );



        //console.log(districtObject);


        crime.forEach((crime) => {  // this is basically a for loop
            const i = districtObject[crime.dc_dist].findIndex(e => e.type === crime.ucr_general);
            if (i > -1) {
                /* districtObject contains the element we're looking for, at index "i" */
                districtObject[crime.dc_dist][i].count +=1;
            } else {
                //create that element and append it to our list of objects.
                tempObj = {"type": crime.ucr_general, "count": 1};
                districtObject[crime.dc_dist].push(tempObj);
            }


            // if (!districtObject[crime.dc_dist].has(crime.ucr_general)) {
            //     districtObject[crime.dc_dist].set(crime.ucr_general, 1);
            // } else {
            //     districtObject[crime.dc_dist].set(crime.ucr_general, districtObject[crime.dc_dist].get(crime.ucr_general) + 1);
            // }
        })
        
        crimePerDistrict.forEach(obj => {
            obj["crimes"] = districtObject[obj.district_num];
        })

        console.log(crimePerDistrict);

        console.log(districtObject);

        // set the dimensions and margins of the graph
        var margin = { top: 10, right: 30, bottom: 30, left: 480 },
            width = 1300 - margin.left - margin.right,
            height = 750 - margin.top - margin.bottom;

        var svg = d3.select("#bargraph")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
            .append("g")
                .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        // Add y axis
        var y = d3.scaleBand()
            .domain(types)
            .range([0, height])
            .padding([1])
        svg.append("g")
            .call(d3.axisLeft(y));


        // Add x axis
        var x = d3.scaleLinear()
            .domain([0, 1000])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x).tickSize(3));

        svg.selectAll("myRect")
            .data(crimePerDistrict[0].crimes)
            .enter()
            .append("rect")
            .attr("x", x(0))
            .attr("y", function (d) {console.log(d); return y(d.count); })
            .attr("width", function (d) { return x(d.type); })
            .attr("height", y.bandwidth())
            .attr("fill", "#69b3a2")

        

    })


})();
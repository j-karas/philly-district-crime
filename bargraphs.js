(function() {

    var width = 800,
    height = 700;

    Promise.all([
        d3.csv("./Boundaries_District.csv"),
        d3.csv("./incidents_part1_part2.csv")
    ]).then((data) =>{
        var districts = data[0];
        var crime = data[1];
        console.log(districts);
        console.log(crime);

        var districtObject = {};

        districts.forEach(district => {
            districtObject[district.DIST_NUMC] = new Map();
        });

        console.log(districtObject);


        crime.forEach((crime) => {  // this is basically a for loop
            if (!districtObject[crime.dc_dist].has(crime.ucr_general)) {
                districtObject[crime.dc_dist].set(crime.ucr_general, 1);
            } else {
                districtObject[crime.dc_dist].set(crime.ucr_general, districtObject[crime.dc_dist].get(crime.ucr_general) + 1);
            }
        }) 

        console.log(districtObject);



    })


})();
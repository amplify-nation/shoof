$.getJSON('/data', {'path': $('#path').val() } ,function(data){
    if (data && data.results ){
        total = data.results[1]
        dir_list = data.results[0];
        for (i=0; i < dir_list.length ; i++){
            //console.log(dir_list[i]);
            dir_list[i].label = dir_list[i].name + ' (' + ((parseInt(dir_list[i].size)/total)*100).toFixed(1)  + '%)' ;
            //{'label': f.name + ' (' + psize.toFixed(1) + '%)' , 'value': psize }
        }
        $('#total').html(bytesToSize(total));
        // draw_pie_result = pie_data;
        draw_nvd3_pie_result = [{'key': 'System Dir', 'values': dir_list}];
        draw_nvd3pie(draw_nvd3_pie_result);
        //draw_pie(res);
    }

});


function draw_nvd3pie(data){
    console.log(data);
    nv.addGraph(function() {
    var chart = nv.models.pieChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.size })
        .showLabels(true);

        d3.select("#viz svg")
            .datum(data)
        .transition().duration(1200)
            .call(chart);

        d3.selectAll('.nv-slice')
            .on('click', function(d){
                if (d.data.type == 'dir'){
                    window.location.replace('http://localhost:5000?path=' + d.data.path);
                }
        });

    return chart;
    });

}








function draw_pie(data){
    var w = 700,
        h = 700,
        r = 150,
        color = d3.scale.category20c();     //builtin range of colors

        cx = w/2;
        cy = h/2;

        // data = [{"label":"one", "value":10}, 
        //         {"label":"two", "value":10},
        //         {"label":"two", "value":10},
        //         {"label":"two", "value":20},
        //         {"label":"three", "value":50}];

        var vis = d3.select("#viz")
            .append("svg:svg")              //create the SVG element inside the <body>
            .data([data])                   //associate our data with the document
                .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
                .attr("height", h)
            .append("svg:g")                //make a group to hold our pie chart
                .attr("transform", "translate(" + cx + "," + cy + ")")    //move the center of the pie chart from 0, 0 to radius, radius

        var arc = d3.svg.arc()              //this will create <path> elements for us using arc data
            .outerRadius(r);

        var pie = d3.layout.pie()           //this will create arc data for us given a list of values
            .value(function(d) { return d.value; });    //we must tell it out to access the value of each element in our data array

        var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
            .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
            .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
                .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                    .attr("class", "slice");    //allow us to style things in the slices (like text)

            arcs.append("svg:path")
                    .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                    .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

            arcs.append("svg:text")                                     //add a label to each slice
                    .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                    //we have to make sure to set these before calling arc.centroid
                    d.innerRadius = r + (r*1.2);
                    d.outerRadius = r;
                    return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
                })
                .attr("text-anchor", "middle")                          //center the text on it's origin
                .text(function(d, i) { return data[i].label; });        //get the label from our original data array
}




 function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Bytes';

    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

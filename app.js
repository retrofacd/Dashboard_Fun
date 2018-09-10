//////////////////////////////////////////////
//////////////////////////////////////////////
//// I. BUILD METADATA [PANEL]:
// FUNCTION A = createPanel
function buildMetaDataPanel (data) {
      // [SELECT --> PANEL], ID = "sample-metadata"
  var panel = document.getElementById("sample-metadata");
  // CLEAR any EXISTING metadata --> .html("")
  panel.innerHTML = " ";
  // ADD each [KEY - VALUE] pair --> [PANEL]
  for(var key in data) {
       h6tag = document.createElement("h6");
       h6Text = document.createTextNode("${key}: ${data[key]}");
       // APPEND new TAGS for each [KEY - VALUE] in metadata
       h6tag.append(h6Text);
       panel.appendChild(h6tag);
       console.log(h6Text);
       console.log("this is working for key values");
   }
 }
//////////////////////////////////////////////
//////////////////////////////////////////////
// II. FETCH SAMPLE DATA:
          // GRAB top 10 --> ["sample_values"], [otu_ids], [labels]
          // --> "slice()"
              //"/samples/<sample>"
              // "otu_ids" = x values
              // "sample_values" = y values
              // "sample_values" = marker size
              // "otu_ids" = marker colors
              // "otu_labels" = text values
// FUNCTION B = buildCharts(sample)
function buildCharts(sampleData,otuData) {
    var labels = sampleData[0]["otu_ids"].map(function(item){
        return otuData[item]
      });
// a. BUBBLE CHART ------in the html ->    <div id="bubble"></div>
    var bubbleLayout = {
          margin: { t: 0 },
          hovermode: "closest",
          xaxis: { title: "OTU ID" }
    };
    var bubbleData = [{
          x: sampleData[0]["otu_ids"],
          y: sampleData[0]["sample_values"],
          text: labels,
          mode: "markers",
          marker: {
              size: sampleData[0]['sample_values'],
              color: sampleData[0]['otu_ids'],
          }
        }];
///.. VARIABLE ../// var bubbleChart = document.getElementById("bubble");
    var bubbleChart = document.getElementById("bubble");
    Plotly.plot(bubbleChart, bubbleData, bubbleLayout);
  // b. PIE CHART ------in the html ->      <div id="pie"></div>
    console.log(sampleData[0]["sample_values"].slice(0, 10));
  ///.. VARIABLE ..///  var pieChart = document.getElementById("pie");
            // "sample_values" --> PIE values
            // "otu_ids" --> PIE otu_labels
            // "otu_labels" --> HOVERTEXT
            // "/samples/<sample>"
    var pieData = [{
          values: sampleData[0]["sample_values"].slice(0, 10),
          labels: sampleData[0]["otu_ids"].slice(0, 10),
          hovertext: labels.slice(0, 10),
          hoverinfo: "hovertext",
          type: "pie",
        }];
    var pieLayout = {margin: { t: 0, l: 0 }};
    var pieChart = document.getElementById("pie");
    Plotly.plot(pieChart,pieData,pieLayout);
  };
//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////
function customizeCharts(sampleData, otuData) {
    var sampleValues = sampleData[0]["sample_values"];
    var otuIDs = sampleData[0]["otu_ids"];
    var labels = otuIDs.map(function(item) {
        return otuData[item]
    });
    //UPDATING BUBBLE WITH NEW DATA
    var bubbleChart = document.getElementById("bubble");
    Plotly.restyle(bubbleChart, "x", [otuIDs]);
    Plotly.restyle(bubbleChart, "y", [sampleValues]);
    Plotly.restyle(bubbleChart, "text", [labels]);
    Plotly.restyle(bubbleChart, "marker.size", [sampleValues]);
    Plotly.restyle(bubbleChart, "marker.color", [otuIDs]);
    // Update the Pie Chart with the new data
    // Use slice to select only the top 10 OTUs for the pie chart
    var pieChart = document.getElementById("pie");
    var pieUpdate = {
        values: [sampleValues.slice(0, 10)],
        labels: [otuIDs.slice(0, 10)],
        hovertext: [labels.slice(0, 10)],
        hoverinfo: "hovertext",
        type: "pie"
    };
    Plotly.restyle(pieChart, pieUpdate);
  }
//////////////////////////////////////////////
//////////////////////////////////////////////
  // II. FETCH SAMPLE DATA:
      // "d3.json" to FETCH sample data for "PLOTS"
function fetchData (sample, callback) {
    d3.json(`/samples/${sample}`, function(error, sampleData) {
        if (error) return console.warn(error);
    d3.json('/otu', function(error, otuData) {
        if (error) return console.warn(error);
    callback(sampleData, otuData);
    });
  });
  // each [KEY - VALUE] in metadata --> "/metadata/<sample>"
    d3.json(`/metadata/${sample}`, function(error, metaData) {
        if (error) return console.warn(error);
    buildMetaDataPanel(metaData);
   })
  };
//////////////////////////////////////////////
//////////////////////////////////////////////
// III. INITIALIZE PANEL:
// FUNCTION C = init()
function customizeSample() {
// GRAB REFERENCE to [DROPDOWN] select ELEMENT --> ["selDataset"]
///.. VARIABLE ../// var selDataset = document.getElementById("selDataset");
    var selector = d3.select("#selDataset");
// POPULATE --> "select OPTIONS" with
// DROPDOWN "LIST" --> [sample NAMES] --> ("/names")
    d3.json("/names").then((sampleNames) => {
      sampleNames.forEach((sample) => {
        selector
            .append("option")
            .text(sample)
            .property("value", sample);
            });
// BUILD INITIAL PLOTS
// with --> "FIRST sample" --> ([0]) from NAMES LIST
            const firstSample = sampleNames[0];
            buildCharts(firstSample);
            buildMetadata(firstSample);
          });
        }
//////////////////////////////////////////////
//////////////////////////////////////////////
// IV. FETCH, REFRESH, RENDER VISUAL REPRESENTATION + SAMPLE DATA:
    // charts use [NEW SAMPLE] value from NAMES for UPDATED VERSION
// FUNCTION D = optionChanged(newSample)
function optionChanged(newSample) {
  fetchData(newSample,customizeCharts);
}
function init() {
  customizeSample();
}
// INITIALIZE PANEL:
init();

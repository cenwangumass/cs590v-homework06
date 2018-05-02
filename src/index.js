import d3 from "./d3";


import WordCloud from "./WordCloud";
import scatterplot from "./scatterplot";
import State from "./State";

function resizeSVG(svg, width, height) {
  svg.attr("width", width).attr("height", height);
}

/**
 * Load data from server and do transformations
 */
async function loadData() {
  let data = await d3.json("data.json");

  let i = 0;
  data = data.map(d => {
    const rv = {
      id: i,
      word: d.word,
      frequency: d.frequency,
      nFiles: d.n_files,
      keyword: d.keyword
    };
    i++;
    return rv;
  });

  return data;
}

function setResetButton(state) {
  d3.select("#reset-selection").on("click", () => {
    state.unlock();
    state.clear();
  });
}

function setDropdown(data, state) {
  let categories = ["All", "Python keyword", "Django"];

  const python = [];
  const django = [];

  for (let d of data) {
    if (d.keyword) {
      python.push(d.id);
    } else {
      django.push(d.id);
    }
  }

  // Find the dropdown menu
  const dropdown = d3.select("#dropdown");

  // Add categories
  dropdown
    .selectAll("option")
    .data(categories)
    .enter()
    .append("option")
    .text(d => d);

  // Set event listener for value change
  dropdown.on("change", function() {
    if (this.value == "All") {
      state.unlock();
      state.clear();
    } else if (this.value == categories[1]) {
      state.lock();
      state.set(python, this);
    } else {
      state.lock();
      state.set(django, this);
    }
  });
}

function setRotationControl(wordCloud, state) {
  // Default rotation is 0
  const initial = 0;

  // Select the rotation control
  const rotationControl = d3.select("#rotation");

  // Setup the initial value and show the value
  rotationControl.property("value", initial);
  const showRotation = d3.select("#show-rotation");
  showRotation.text(initial + "°");

  // Setup event listener for value change
  rotationControl.on("change", function() {
    showRotation.text(this.value + "°");
    wordCloud.restart(this.value);
    state.clear();
  });
}

async function main() {
  // Load data
  const data = await loadData();

  // Select SVG elements and set size
  const wordCloudSVG = d3.select("#word-cloud");
  const scatterplotSVG = d3.select("#scatterplot");

  resizeSVG(wordCloudSVG, 1000, 560);
  resizeSVG(scatterplotSVG, 800, 560);

  // Define state object that is consistent across two views
  const state = new State(wordCloudSVG, scatterplotSVG);

  // Plot the word cloud and scatterplot
  const wordCloud = new WordCloud(wordCloudSVG, data, state);
  wordCloud.draw();
  scatterplot(scatterplotSVG, data, state);

  // Setup interactions
  setResetButton(state);
  setDropdown(data, state);
  setRotationControl(wordCloud, state);
}

main();

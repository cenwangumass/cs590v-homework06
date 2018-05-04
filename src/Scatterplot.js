import d3 from "./d3";

class Scatterplot {
  constructor(svg, data, state) {
    this.svg = svg;
    this.data = data;
    this.state = state;
  }

  draw() {
    let svg = this.svg;
    const data = this.data;
    const state = this.state;

    const svgID = svg.attr("id");

    // Get size of SVG
    const svgWidth = svg.attr("width"),
      svgHeight = svg.attr("height");

    // D3 margin convention
    const margin = {
      top: 20,
      right: 20,
      bottom: 80,
      left: 80
    };

    // Inner width and height
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create inner g element
    svg = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // D3 tooltip
    const tip = d3
      .tip()
      .attr("class", "d3-tip")
      .html(d => {
        return `
        <div>
          <div>Word: ${d.word}</div>
          <div>Appears in ${d.nFiles} files</div>
          <div>Frequency: ${d.frequency}</div>
        </div>
      `;
      });

    // Create the tooltip
    svg.call(tip);

    // Setup x and y scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.nFiles))
      .range([0, width]);

    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.frequency))
      .range([height, 0]);

    // Setup x and y axes
    const xAxis = d3.axisBottom().scale(xScale);
    const yAxis = d3.axisLeft().scale(yScale);

    // Plot x and y axes
    svg
      .append("g")
      .attr("class", "axis")
      .attr("id", "x-axis")
      .attr("transform", "translate(0, " + height + ")")
      .call(xAxis);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("id", "y-axis")
      .call(yAxis);

    // Plot x and y labels
    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("id", "x-label")
      .attr("x", width / 2)
      .attr("y", height + margin.top + 30)
      .text("Number of Files");

    svg
      .append("text")
      .attr("class", "axis-label")
      .attr("id", "y-label")
      .attr("y", -margin.left + 20)
      .attr("x", -height / 2)
      .attr("transform", "rotate(-90)")
      .text("Frequency");

    // Add brushing to select data points
    // This must be added before drawing the circles
    const brush = d3
      .brush()
      .extent([[0, 0], [width, height]])
      .on("end", brushed);

    const brushG = svg
      .append("g")
      .attr("class", "brush")
      .call(brush);

    function brushed() {
      const ids = computeSelectedElementIds(
        data,
        d3.event.selection,
        "nFiles",
        "frequency",
        xScale,
        yScale
      );

      if (ids.length > 0) {
        state.lock();
      } else {
        state.unlock();
      }

      state.set(ids, svg);
    }

    // Plot data points
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "data-point")
      .attr("cx", d => xScale(d.nFiles))
      .attr("cy", d => yScale(d.frequency))
      .attr("r", 3)
      .on("mouseover", function(d) {
        tip.show(d);
        if (!state.isLocked()) {
          state.set([d.id]);
        }
      })
      .on("mouseout", d => {
        tip.hide(d);
        if (!state.isLocked()) {
          state.clear();
        }
      });
  }

  reset() {
    this.svg
      .selectAll("circle")
      .attr("class", "data-point")
      .style("opacity", 1);
  }
}

/**
 * Find the ID of elements inside the selection area
 */
function computeSelectedElementIds(
  data,
  selection,
  xVariable,
  yVariable,
  xScale,
  yScale
) {
  if (selection == null) {
    return [];
  }

  let ids = [];

  const xUpperLeft = selection[0][0];
  const yUpperLeft = selection[0][1];
  const xLowerRight = selection[1][0];
  const yLowerRight = selection[1][1];

  for (let d of data) {
    let x = xScale(d[xVariable]);
    let y = yScale(d[yVariable]);
    if (
      x >= xUpperLeft &&
      x <= xLowerRight &&
      y >= yUpperLeft &&
      y <= yLowerRight
    ) {
      ids.push(d.id);
    }
  }
  return ids;
}

export default Scatterplot;

import d3 from "./d3";

class WordCloud {
  constructor(svg, data, state) {
    this.svg = svg;
    this.data = data;
    this.state = state;

    this._layout = null;
    this._draw = null;
    this._text = null;
  }

  draw() {
    const self = this;

    let svg = self.svg;
    const data = self.data;
    const state = self.state;

    // Get SVG width and height
    const svgWidth = svg.attr("width");
    const svgHeight = svg.attr("height");

    // D3 margin convention
    const margin = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    };

    // Inner width and height
    const width = svgWidth - margin.left - margin.right;
    const height = svgHeight - margin.top - margin.bottom;

    // Create inner g element
    svg = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

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

    svg.call(tip);

    // Text colors
    const colorScale = d3.scaleOrdinal().range(d3.schemeCategory10);

    // Convert from frequency to text font size
    const fontSizeScale = d3
      .scaleLinear()
      .domain(d3.extent(data, d => d.frequency))
      .range([20, 80]);

    // Plot word cloud
    function draw(words) {
      self._text = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`)
        .selectAll("text")
        .data(words)
        .enter()
        .append("text")
        .style("font-size", d => fontSizeScale(d.frequency) + "px")
        .attr("text-anchor", "middle")
        .style("fill", (_, i) => colorScale(i))
        .attr("transform", d => `translate(${d.x}, ${d.y}) rotate(${d.rotate})`)
        .text(d => d.word)
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
        })
        .on("click", d => {
          state.lock();
          state.add(d.id);
        });
    }

    const layout = d3
      .cloud()
      .size([width, height])
      .words(data)
      .rotate(0)
      .fontSize(d => fontSizeScale(d.frequency))
      .on("end", draw);

    self._draw = draw;
    self._layout = layout;

    layout.start();
  }

  restart(rotation) {
    const self = this;

    // Clear existing texts
    self._text.remove();
    self._layout.rotate(rotation).on("end", self._draw);
    self._layout.start();
  }

  reset() {
    this.svg.selectAll("text").style("opacity", 1);
  }
}

export default WordCloud;

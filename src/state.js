class State {
  constructor(wordCloud, scatterplot) {
    this.wordCloud = wordCloud;
    this.scatterplot = scatterplot;
    this.state = new Set();
    this.currentElement = null;
    this.locked = false;
  }

  checkElement(element) {
    if (this.currentElement != element) {
      this.state.clear();
    }
    this.currentElement = element;
  }

  clear() {
    this.state.clear();
    this.refresh();
  }

  set(ids, element) {
    this.checkElement(element);
    this.state = new Set(ids);
    this.refresh();
  }

  add(id, element) {
    this.checkElement(element);
    this.state.add(id);
    this.refresh();
  }

  refresh() {
    const opacity = this.state.size == 0 ? 1 : 0.1;

    this.wordCloud.selectAll("text").style("opacity", opacity);

    this.wordCloud
      .selectAll("text")
      .filter(d => this.state.has(d.id))
      .style("opacity", 1)
      .attr("class", "selected");

    this.scatterplot
      .selectAll("circle")
      .attr("class", "data-point")
      .attr("opacity", opacity);

    this.scatterplot
      .selectAll("circle")
      .filter(d => this.state.has(d.id))
      .attr("class", "selected");
  }

  lock() {
    this.locked = true;
  }

  unlock() {
    this.locked = false;
  }

  isLocked() {
    return this.locked;
  }
}

export default State;

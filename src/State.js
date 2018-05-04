class State {
  constructor() {
    this.wordCloud = null;
    this.scatterplot = null;
    this.state = new Set();
    this.currentElement = null;
    this.locked = false;
  }

  setWordCloud(wordCloud) {
    this.wordCloud = wordCloud;
  }

  setScatterplot(scatterplot) {
    this.scatterplot = scatterplot;
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

    this.wordCloud.svg.selectAll("text").style("opacity", opacity);

    this.wordCloud.svg
      .selectAll("text")
      .filter(d => this.state.has(d.id))
      .style("opacity", 1)
      .attr("class", "selected");

    this.scatterplot.svg
      .selectAll("circle")
      .attr("class", "data-point")
      .attr("opacity", opacity);

    this.scatterplot.svg
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

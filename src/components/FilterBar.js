import React, { Component } from 'react';
import MainFilter from './MainFilter';
import SubFilter from './SubFilter';
var apiUrl = "https://covid-project-api-2020.herokuapp.com/";
export class FilterBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regionData: "",
      filterSelections: {}
    };
  }
  setFilterSelection(name, value) {
    let currSelection = this.state.filterSelections;
    let obj = {};
    obj[name] = value;
    let newSelection = Object.assign({}, currSelection, obj);
    this.setState({
      filterSelections: newSelection
    });
  }
  async getRegions(dataObj) {
    await fetch(apiUrl+'regions',
    {
      method: "GET",
      headers: {
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      console.log("regions:", data);
      //   dataObj.regions = data.name;
      this.setState({ regions: data.name });
    });
  }
  async getRegionData(selected) {
    await fetch(apiUrl+`regions:${selected}`,
    {
      method: "GET",
      headers: {
        'Accept': 'application/json'
      }
    }
    ).then(res => res.json()).then(data => {
      console.log(data);
      this.setState({
        regionData: data
      });
    });
  }

  async handleSubmit(event) {
    //alert('check this filter data out');
    event.preventDefault();
    //if only
    await fetch(apiUrl+`regionData`, {
      method: "POST",
      body: JSON.stringify(this.state.filterSelections),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    }).then(res => res.json()).then(data => {
      console.log('check this filtered data', data);
      this.props.setFilteredData(data);
    });
  }
  componentDidMount() {
    this.getRegions();
  }
  componentWillUnmount() {
  }
  render() {
    const regionData = this.state.regionData;
    let regionFilters;
    let submit;
    if (regionData) {
      regionFilters = Object.keys(regionData).map((name) => {
        let min = regionData[name].Min;
        let max = regionData[name].Max;
        return max - min > 0 ? (
          <SubFilter setSelection={this.setFilterSelection.bind(this)} key={name} name={name} min={min} max={max}>
          </SubFilter>
        ) : null;

      });
      regionFilters = regionFilters.filter((value) => { return value != null });

      submit = <input type="submit" value="Submit" />;
    }
    return (
      <form className="FilterBar" onSubmit={this.handleSubmit.bind(this)}>
        <MainFilter setSelection={this.setFilterSelection.bind(this)} changeFunc={this.getRegionData.bind(this)} regions={this.state.regions}></MainFilter>
        {regionFilters}
        {submit}
      </form>
    )
  }
}

export default FilterBar

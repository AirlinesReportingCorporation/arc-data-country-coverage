import React, { Component, useState } from "react";

import * as moment from "moment";
import axios from "axios";
import XLSX from "xlsx";

import ReactTooltip from "react-tooltip";

import MapChart from "./MapChart";

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

class App extends Component {
  constructor() {
    super();
    this.state = {
      jsonHeaders: [],
      jsonData: [],
      refundData: [],
      filter: "ALL",
      filterTicket: "ALL",
      filterObj: [],
      refundFilter: [],
      refundList: [],
      sortType: "asc",
      content: "",
      setContent: ""
    };
    this.setFilter = this.setFilter.bind(this);
    this.setTicketFilter = this.setTicketFilter.bind(this);
    this.setSort = this.setSort.bind(this);
  }

  setFilter(val) {
    this.setState({ filter: val });
  }

  setTicketFilter(val) {
    this.setState({ filterTicket: val });
  }

  setSort(val) {
    var jsonData1 = this.state.jsonData;

    if (val == "asc") {
      jsonData1.sort(propComparator("Name", 1));
    } else if (val == "code") {
      jsonData1.sort(propComparator("Numeric Code", 1));
    } else if (val == "recent") {
      jsonData1.sort(
        propComparator("Refund or Ticket Validity Information Last Updated", 1)
      );
    }

    console.log(jsonData1);

    console.log(val);

    this.setState({ sortType: val });

    this.setState({ jsonData: jsonData1 });
  }

  /* Component did Mount
  componentDidMount() {
    var e = this;
    //https://www2.arccorp.com/globalassets/support--training/agency-support/credit-refund-acceptance/cc-acceptance-chart.xlsx
    axios({
      method: "get",
      url:
        "https://www2.arccorp.com/globalassets/country-data-coverage/country-coverage.xlsx?" +
        new Date().toLocaleString(),
      responseType: "arraybuffer"
    }).then(function(response) {
      console.log("===== Country Coverage Chart Loaded ===== ");
      var data = new Uint8Array(response.data);
      var workbook = XLSX.read(data, { type: "array" });

      var workbookData = workbook["Sheets"]["Sheet1"];

      console.log(workbookData);

      var json = XLSX.utils.sheet_to_json(workbookData, { raw: false });

      var refundTypes = [];
      var jsonHeadersTemp = [];

      e.setState({ jsonData: json });

      //traverseEntireWorkBook
      for (var key in workbookData) {
        //value in cell
        var val = workbookData[key].w;

        var str = key.match(/[a-z]+|[^a-z]+/gi);

        if (str[1] === "1") {
          jsonHeadersTemp.push(val);
          //e.state.jsonHeaders[key[0]] = val; ///.replace(/ /g,"_").replace(":", "");
        }
        //console.log(val + ":" + str);
      }

      e.setState({ refundList: refundTypes });
      e.setState({ jsonHeaders: jsonHeadersTemp });

      console.log(e.state.jsonHeaders);
      //console.log(e.state.jsonData);
    });
  }*/

  render() {
    //const jsonHeaders = this.state.jsonHeaders;
    //var filter = this.state.filter;

    return (
      <div className="refundPage">
        <div className="refundJumboContainer">
          <div className="refundJumbo">
            <h1>ARC Data Coverage by Geography</h1>
            <p>
              ARC manages the world’s most comprehensive air transaction data.
              ARC’s data is derived from airline sales transactions, reflecting
              both historical and advance travel purchases. This makes ARC’s
              data more versatile and reliable than both search and reservation
              data.
            </p>

            <p>
              Managed in partnership with IATA, this dataset represents 57% of
              all trips taken globally, more than any other source of air
              passenger travel data. It is sourced from transactions via all
              channels for approximately 100 global airlines and travel agency
              sales transactions from around the world for more than 290
              additional airlines.
            </p>
          </div>
        </div>

        <div className="refundsTable countryMap">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-12">
                <div>
                  <MyMap type="indirect" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="legaleseContainer">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                ARC will update this coverage on a semi-annual basis. Download
                the{" "}
                <a
                  target="_blank"
                  href="https://www2.arccorp.com/globalassets/country-data-coverage/country-coverage.xlsx"
                >
                  data coverage
                </a>
                . Learn more about{" "}
                <a href="https://www2.arccorp.com/about-us/our-data/">
                  ARC Data
                </a>
                .
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function MyMap() {
  const [content, setContent] = useState("");
  return (
    <div>
      <MapChart setTooltipContent={setContent} />
      <ReactTooltip>{content}</ReactTooltip>
    </div>
  );
}

export default App;

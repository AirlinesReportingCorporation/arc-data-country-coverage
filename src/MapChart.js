import React, { useEffect, useState, memo } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup
} from "react-simple-maps";

const rounded = num => {
  if (num > 1000000000) {
    return Math.round(num / 100000000) / 10 + "Bn";
  } else if (num > 1000000) {
    return Math.round(num / 100000) / 10 + "M";
  } else {
    return Math.round(num / 100) / 10 + "K";
  }
};

const geoUrl =
  "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const colorScale = scaleLinear()
  .domain([0.29, 0.68])
  .range(["#B9E1E7", "#189bb0"]);

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);
  const [type, setType] = useState("indirect");

  useEffect(() => {
    csv(
      `https://www2.arccorp.com/globalassets/country-data-coverage/country-coverage.csv`
    ).then(data => {
      setData(data);
    });
  }, []);

  return (
    <div>
      <div className="map-controls" style={{ textAlign: "center" }}>
        <div className="optionGroup">
          <div
            onClick={() => setType("indirect")}
            className={
              "optionGroupItem" + (type == "indirect" ? " active" : "")
            }
          >
            Indirect Coverage
          </div>
          <div
            onClick={() => setType("total")}
            className={"optionGroupItem" + (type == "total" ? " active" : "")}
          >
            Total Coverage
          </div>
        </div>
      </div>
      <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
        <Sphere stroke="#E4E5E6" strokeWidth={0.5} />
        <Graticule stroke="#E4E5E6" strokeWidth={0.5} />
        <ZoomableGroup>
          {data.length > 0 && (
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map(geo => {
                  const d = data.find(s => s.ISO3 === geo.properties.ISO_A3);

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        const { NAME, POP_EST } = geo.properties;
                        if (d != undefined) {
                          setTooltipContent(
                            `${NAME} — ${
                              type == "indirect"
                                ? d["Indirect Coverage"]
                                : d["Total Coverage"]
                            }`
                          );
                        }
                      }}
                      onMouseLeave={() => {
                        setTooltipContent("");
                      }}
                      fill={
                        d
                          ? colorScale(
                              (type == "indirect"
                                ? d["Indirect Coverage"]
                                : d["Total Coverage"]
                              ).replace("%", "") / 100.0
                            )
                          : "#F5F4F6"
                      }
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default memo(MapChart);

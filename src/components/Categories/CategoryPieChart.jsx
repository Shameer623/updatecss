import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

// Defining a consistent color scheme
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FF00FF",
  "#FFFF00",
  "#00FFFF",
  "#800080",
  "#008000",
  "#000080",
  "#808000",
  "#800000",
  "#008080",
  "#808080",
  "#FFA500",
  "#A52A2A",
];

const CategoryPieChart = ({ data, type }) => {
  // Filter out categories with zero values
  const filteredData = data.filter((entry) => entry.value > 0);

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h5 className="card-title">
          {type === "income" ? "Income Distribution" : "Expense Distribution"}
        </h5>
        <PieChart width={400} height={300}>
          <Pie
            data={filteredData}
            cx="60%" //Positions the pie chart
            cy="50%"
            outerRadius={95}
            fill="#8884d8"
            dataKey="value" // data to use for the pie slices' values
            label
          >
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`} // sets a unique key for each cell
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip /> {/*displays the data value when a slice is hovered */}
          <Legend /> {/*adds a legend to the chart */}
        </PieChart>
      </div>
    </div>
  );
};

export default CategoryPieChart;

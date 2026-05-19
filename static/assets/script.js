document.getElementById("uploadBtn").addEventListener("click", uploadFile);

async function uploadFile() {

    const fileInput = document.getElementById("fileInput");

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const response = await fetch(
        "https://ab-test-web-application.onrender.com/analyze",
        {
            method: "POST",
            body: formData
        }
    );

    const dataset = await response.json();

    console.log(dataset);

   

document.getElementById("pvalue").innerHTML = `
  ${Math.round(dataset.p_value * 100) / 100}
`;
document.getElementById("zstatics").innerHTML = `
      
       ${Math.round(dataset.z_stat * 100) / 100}
       
    `;

    var xValue = ['Conversion A', 'Conversion B'];

var yValue = [
    (dataset.conversion_rate.A * 100).toFixed(2) + '%',
    (dataset.conversion_rate.B * 100).toFixed(2) + '%'
];

var trace1 = {
  x: xValue,
  y: yValue,
  type: 'bar',
  text: yValue.map(String),
  textposition: 'auto',
  hoverinfo: 'none',
  marker: {
    color: 'rgb(158,202,225)',
    opacity: 0.6,
    line: {
      color: 'rgb(8,48,107)',
      width: 1.5
    }
  }
};

var data = [trace1];

var layout = {
  title: {
    text: 'A/B Test Conversion Rates'
  },
  barmode: 'stack', barcornerradius: 15,
};

Plotly.newPlot('bar', data, layout);


const tbody = document.querySelector("#resultsTable tbody");
tbody.innerHTML = "";
function addRow(metric, aValue, bValue) {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td>${metric}</td>
        <td>${aValue}</td>
        <td>${bValue}</td>
    `;

    tbody.appendChild(row);
}

// Add rows
addRow(
    "Count",
    dataset.count.A,
    dataset.count.B
);

addRow(
    "Sum",
    dataset.sum.A,
    dataset.sum.B
);

addRow(
    "Confidence High",
    (dataset.Confidence_intervals_high.A * 100).toFixed(2) + "%",
    (dataset.Confidence_intervals_high.B * 100).toFixed(2) + "%"
);

addRow(
    "Confidence Low",
    (dataset.Confidence_intervals_low.A * 100).toFixed(2) + "%",
    (dataset.Confidence_intervals_low.B * 100).toFixed(2) + "%"
);


const alpha = 0.05;

document.getElementById("bottom-chart").innerHTML = `
    <h5>Hypothesis Decision</h5>
    <p><strong>P-Value:</strong> ${Number(dataset.p_value).toFixed(4)}</p>
    <p><strong>Alpha:</strong> ${alpha}</p>

    ${
        dataset.p_value < alpha
        ? `<div class="alert alert-success">
              Reject H0 → Significant difference detected 🎯
           </div>`
        : `<div class="alert alert-warning">
              Fail to reject H0 -→ No significant difference ❌
           </div>`
    }
`;


}


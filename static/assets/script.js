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

    document.getElementById("result").innerHTML = `
        <h3>A/B Test Results</h3>
        <p>Conversion A: ${dataset.conversion_rate.A}</p>
        <p>Conversion B: ${dataset.conversion_rate.B}</p>
        <p>P-Value: ${dataset.p_value}</p>
        <p>Z-Statistic: ${dataset.z_stat}</p>
    `;


    var xValue = ['Conversion A', 'Conversion B'];

var yValue = [dataset.conversion_rate.A, dataset.conversion_rate.B];

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
    text: 'January 2013 Sales Report'
  },
  barmode: 'stack', barcornerradius: 15,
};

Plotly.newPlot('bar', data, layout);
}


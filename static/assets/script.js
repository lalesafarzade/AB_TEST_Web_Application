
async function uploadFile() {
  const API_BASE = "https://yhq5da2dyb.execute-api.us-east-1.amazonaws.com/prod";
  const file = document.getElementById("fileInput").files[0];
  const status = document.getElementById("status");

  if (!file) {
    status.innerText = "Please select a file";
    return;
  }

  const jobId = crypto.randomUUID();

  try {
    //  get presigned upload URL
    status.innerText = "Getting upload URL...";

    const response = await fetch(
      `${API_BASE}/create-job?jobId=${jobId}`
    );

    const data = await response.json();

    console.log("UPLOAD DATA:", data);

    //  upload file to S3
    status.innerText = "Uploading...";

    const uploadResponse = await fetch(data.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": "text/csv"
      }
    });

    if (!uploadResponse.ok) {
      throw new Error("Upload failed");
    }

    status.innerText = "Upload successful! Processing...";

    // poll for result
    await waitForResult(jobId, status);

  } catch (err) {
    console.error(err);
    status.innerText = "Your file should be modified based on direction! "
  }
}

async function waitForResult(jobId, status) {

  const API_BASE = "https://yhq5da2dyb.execute-api.us-east-1.amazonaws.com/prod";

  while (true) {

    await new Promise(r => setTimeout(r, 3000));

    const resultResponse = await fetch(
      `${API_BASE}/result?jobId=${jobId}`
    );

    const resultData = await resultResponse.json();

    console.log("RESULT:", resultData);

    if (resultData.downloadUrl) {

      const jsonResponse = await fetch(resultData.downloadUrl);
      const data = await jsonResponse.json();

      renderResults(data);

      status.innerText = "Done!";
      break;
    }

    status.innerText = "Processing...";
  }
}


 function renderResults(data) {
 document.getElementById("zstatics").innerHTML = `
      
        ${Math.round(data.z_stat * 100) / 100}
       
     `;

 document.getElementById("pvalue").innerHTML = `
      
        ${Math.round(data.p_value * 100) / 100}
       
     `;

    var xValue = ['Conversion A', 'Conversion B'];

 var yValue = [
     (data.groups.group_1.conversion_rate * 100).toFixed(2) + '%',
     (data.groups.group_2.conversion_rate * 100).toFixed(2) + '%'
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

var dataset = [trace1];

var layout = {
  title: {
    text: 'A/B Test Conversion Rates'
  },
  barmode: 'stack', barcornerradius: 15,
};

Plotly.newPlot('bar', dataset, layout);



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
    data.groups.group_1.count,
    data.groups.group_2.count
);

addRow(
    "Sum",
     data.groups.group_1.sum,
     data.groups.group_2.sum
 );

addRow(
    "Confidence High",
    (data.groups.group_1.ci[1] * 100).toFixed(2) + "%",
    (data.groups.group_2.ci[1] * 100).toFixed(2) + "%"
);

addRow(
    "Confidence Low",
    (data.groups.group_1.ci[0] * 100).toFixed(2) + "%",
    (data.groups.group_2.ci[0] * 100).toFixed(2) + "%"
);

const alpha = 0.05;

document.getElementById("bottom-chart").innerHTML = `
    <h5>Hypothesis Decision</h5>

    ${
        data.valid_ztest
        ? `
            <p><strong>P-Value:</strong> ${Number(data.p_value).toFixed(4)}</p>
            <p><strong>Alpha:</strong> ${alpha}</p>

            ${
                data.p_value < alpha
                ? `<div class="alert alert-success">
                      Reject H0 → Significant difference detected 🎯
                   </div>`
                : `<div class="alert alert-warning">
                      Fail to reject H0 → No significant difference ❌
                   </div>`
            }
          `
        : `
            <div class="alert alert-danger">
                ${data.warnings.join("<br>")}
            </div>
          `
    }
`;







}   









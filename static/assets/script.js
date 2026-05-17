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

    const data = await response.json();

    console.log(data);

    document.getElementById("result").innerHTML = `
        <h3>A/B Test Results</h3>
        <p>Conversion A: ${data.conversion_rate.A}</p>
        <p>Conversion B: ${data.conversion_rate.B}</p>
        <p>P-Value: ${data.p_value}</p>
        <p>Z-Statistic: ${data.z_stat}</p>
    `;
}
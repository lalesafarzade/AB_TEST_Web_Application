async function upload() {



    const file = document.getElementById("fileInput").files[0];



    const formData = new FormData();



    formData.append("file", file);



    const response = await fetch("https://ab-test-web-application.onrender.com/analyze", {



        method: "POST",



        body: formData



    });



    const data = await response.json();



    console.log(data);}



    // Take first numeric column



//     const firstColumn = Object.keys(data.numeric_summary)[0];



//     const values = Object.values(data.numeric_summary[firstColumn]);



//     const labels = Object.keys(data.numeric_summary[firstColumn]);



//     const ctx = document.getElementById('chart');



//     new Chart(ctx, {



//         type: 'bar',



//         data: {



//             labels: labels,



//             datasets: [{



//                 label: firstColumn,



//                 data: values



//             }]



//         }



//     });



// 
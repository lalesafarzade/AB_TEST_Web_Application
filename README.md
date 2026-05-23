# AB_TEST_Web_Application

# 📊 A/B Test Analytics Pipeline (Serverless)

A full-stack serverless A/B testing analytics system. Users upload a CSV file, trigger backend analysis using AWS Lambda, and visualize statistical results in the browser using Plotly.

---

## 🚀 Live Demo
https://lalesafarzade.github.io/AB_TEST_Web_Application/

---

## 🧠 Architecture

```text
Frontend (GitHub Pages)
        ↓
API Gateway
        ↓
AWS Lambda (create job + presigned S3 URL)
        ↓
Amazon S3 (file upload)
        ↓
AWS Lambda (data analysis)
        ↓
AWS Lambda (result retrieval)
        ↓
Frontend visualization (Plotly.js)

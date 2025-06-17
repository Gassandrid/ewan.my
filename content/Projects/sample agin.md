---
date: 2025-06-17
updated: 2025-06-17
---
<div style="border: 1px solid #ccc; border-radius: 8px; padding: 20px; width: 320px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-family: sans-serif; text-align: center;"> <h2 style="margin-top: 0; color: #333;">Random Cat Fact</h2> <p id="cat-fact" style="color: #555; min-height: 60px; border-left: 3px solid #007BFF; padding-left: 10px; text-align: left; margin: 20px 0;">Click the button to get a fun fact about cats!</p> <button onclick="document.getElementById('cat-fact').innerHTML='Fetching...'; fetch('https://meowfacts.herokuapp.com/').then(response => response.json()).then(data => { document.getElementById('cat-fact').innerHTML = data.data[0]; }).catch(error => { document.getElementById('cat-fact').innerHTML = 'Sorry, could not fetch a fact.'; })" style="background-color: #007BFF; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;"> Get a Cat Fact! </button> </div>

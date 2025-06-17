---
date: 2025-06-17
updated: 2025-06-17
---


<div style="border: 1px solid #ccc; border-radius: 8px; padding: 20px; width: 320px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); font-family: sans-serif; text-align: center;">

  <h2 style="margin-top: 0; color: #333;">Random Cat Fact</h2>

  <p id="cat-fact" style="color: #555; min-height: 60px; border-left: 3px solid #4CAF50; padding-left: 10px; text-align: left; margin: 20px 0;">Click the button to get a fun fact about cats!</p>

  <button onclick="getCatFact()" style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">Get a Cat Fact!</button>

</div>

<script>
  function getCatFact() {
    // Get the element where we will display the fact
    const factElement = document.getElementById('cat-fact');
    factElement.innerHTML = 'Fetching a new fact...';

    // Use the fetch API to get a cat fact
    fetch('https://meowfacts.herokuapp.com/')
      .then(response => {
        // Check if the request was successful
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update the paragraph with the new cat fact
        factElement.innerHTML = data.data[0];
      })
      .catch(error => {
        // Handle any errors that occurred during the fetch
        console.error('Error fetching cat fact:', error);
        factElement.innerHTML = 'Sorry, could not fetch a cat fact at this time. Please try again.';
      });
  }
</script>



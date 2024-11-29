document.getElementById('registration-form').addEventListener('submit', async function(event) {
  event.preventDefault();// this prevents the form being submitted when reloading
  
  const formData = new FormData(this);
  
  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const result = await response.json();
      alert('Registration submitted successfully! We will review your documents.');
      // Clear the form
      this.reset();
    } else {
      throw new Error('Registration failed');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('There was an error submitting your registration. Please try again.');
  }
});

// Function to check registration status
async function checkStatus(email) {
  try {
    const response = await fetch(`http://localhost:3000/status/${email}`);
    const data = await response.json();
    
    if (response.ok) {
      return data.status;
    } else {
      throw new Error('Failed to fetch status');
    }
  } catch (error) {
    console.error('Error checking status:', error);
    return null;
  }
}
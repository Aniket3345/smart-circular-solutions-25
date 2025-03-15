
// Sample data
const userData = {
  name: "Rohan Sharma",
  email: "rohan.sharma@example.com",
  location: "Mumbai, India",
  pincode: "400001",
  address: "123 Marine Drive, Mumbai",
  rewardPoints: 125,
  totalReports: 7
};

const reportsData = [
  {
    id: 1,
    title: "Garbage pile on Marine Drive",
    location: "Marine Drive, Mumbai",
    date: "2023-12-10",
    category: "waste",
    image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyYmFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 2,
    title: "Street flooding near railway station",
    location: "Dadar, Mumbai",
    date: "2024-01-15",
    category: "flood",
    image: "https://images.unsplash.com/photo-1613559806609-790411b0cea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 3,
    title: "Power line down after storm",
    location: "Bandra, Mumbai",
    date: "2024-02-20",
    category: "electricity",
    image: "https://images.unsplash.com/photo-1621954809142-7c5c73da001c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG93ZXIlMjBsaW5lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 4,
    title: "Plastic waste on beach",
    location: "Juhu Beach, Mumbai",
    date: "2024-03-05",
    category: "waste",
    image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyYmFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 5,
    title: "Electricity pole damaged",
    location: "Andheri, Mumbai",
    date: "2024-04-10",
    category: "electricity",
    image: "https://images.unsplash.com/photo-1621954809142-7c5c73da001c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cG93ZXIlMjBsaW5lfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 6,
    title: "Water logging at intersection",
    location: "Kurla, Mumbai",
    date: "2024-05-15",
    category: "flood",
    image: "https://images.unsplash.com/photo-1613559806609-790411b0cea4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Zmxvb2R8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60"
  },
  {
    id: 7,
    title: "Trash accumulated in park",
    location: "Shivaji Park, Mumbai",
    date: "2024-06-20",
    category: "waste",
    image: "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FyYmFnZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60"
  }
];

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
  // Update user information
  updateUserInfo();
  
  // Update progress bar
  updateProgressBar();
  
  // Display all reports initially
  displayReports('all');
  
  // Add event listeners for tab buttons
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all tabs
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked tab
      button.classList.add('active');
      
      // Display reports for selected category
      const category = button.getAttribute('data-tab');
      displayReports(category);
    });
  });
  
  // Add event listener for update profile button
  document.getElementById('update-profile').addEventListener('click', updateProfile);
});

// Function to update user information
function updateUserInfo() {
  document.getElementById('user-name').textContent = userData.name;
  document.getElementById('user-email').textContent = userData.email;
  document.getElementById('fullname').value = userData.name;
  document.getElementById('email').value = userData.email;
  document.getElementById('pincode').value = userData.pincode;
  document.getElementById('address').value = userData.address;
  document.getElementById('points-value').textContent = userData.rewardPoints;
  document.getElementById('total-reports').textContent = userData.totalReports;
}

// Function to update progress bar
function updateProgressBar() {
  const progressPercentage = Math.min((userData.totalReports / 10) * 100, 100);
  document.getElementById('progress-fill').style.width = `${progressPercentage}%`;
}

// Function to display reports based on category
function displayReports(category) {
  const reportsList = document.getElementById('reports-list');
  reportsList.innerHTML = ''; // Clear previous reports
  
  // Filter reports based on category
  const filteredReports = category === 'all' 
    ? reportsData 
    : reportsData.filter(report => report.category === category);
  
  // Display filtered reports
  if (filteredReports.length === 0) {
    reportsList.innerHTML = '<p class="text-center py-4">No reports found for this category.</p>';
    return;
  }
  
  filteredReports.forEach(report => {
    const reportElement = document.createElement('div');
    reportElement.className = 'report-item';
    reportElement.innerHTML = `
      <div class="report-image">
        <img src="${report.image}" alt="${report.title}">
      </div>
      <div class="report-details">
        <div class="report-title">${report.title}</div>
        <div class="report-location">
          <i class="location-icon">📍</i> ${report.location}
        </div>
        <div class="report-date">
          <i class="date-icon">📅</i> ${formatDate(report.date)}
        </div>
        <div class="report-category ${report.category}">
          ${capitalizeFirstLetter(report.category)}
        </div>
      </div>
    `;
    
    reportsList.appendChild(reportElement);
  });
}

// Function to handle profile update
function updateProfile() {
  // Get updated values
  const name = document.getElementById('fullname').value;
  const email = document.getElementById('email').value;
  const pincode = document.getElementById('pincode').value;
  const address = document.getElementById('address').value;
  
  // Update userData
  userData.name = name;
  userData.email = email;
  userData.pincode = pincode;
  userData.address = address;
  
  // Update UI
  document.getElementById('user-name').textContent = name;
  document.getElementById('user-email').textContent = email;
  
  // Show success message (simple alert for this example)
  alert('Profile updated successfully!');
}

// Helper function to format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Helper function to capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

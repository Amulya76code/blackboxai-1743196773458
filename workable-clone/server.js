import express from 'express';
import cors from 'cors';
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// In-memory storage for demo purposes
let savedDescriptions = [];

// Generate realistic job description
app.post('/generate-job-description', (req, res) => {
  const { 
    title, 
    company, 
    location, 
    type, 
    salary, 
    experience, 
    responsibilities, 
    requirements, 
    benefits 
  } = req.body;
  
  // Simulate processing delay
  setTimeout(() => {
    try {
      const description = `
        <div class="space-y-4">
          <h2 class="text-2xl font-bold">${title}</h2>
          
          <div class="flex flex-wrap gap-4 text-sm text-gray-600">
            ${company ? `<div><strong>Company:</strong> ${company}</div>` : ''}
            ${location ? `<div><strong>Location:</strong> ${location}</div>` : ''}
            ${type ? `<div><strong>Type:</strong> ${type}</div>` : ''}
            ${salary ? `<div><strong>Salary:</strong> ${salary}</div>` : ''}
            ${experience ? `<div><strong>Experience:</strong> ${experience}</div>` : ''}
          </div>
          
          ${company ? `
          <div>
            <h3 class="text-lg font-semibold mt-4">About ${company}</h3>
            <p>${company} is a leading company in our industry...</p>
          </div>
          ` : ''}
          
          ${responsibilities ? `
          <div>
            <h3 class="text-lg font-semibold mt-4">Key Responsibilities</h3>
            <ul class="list-disc pl-5 space-y-1">
              ${responsibilities.split('\n').filter(r => r.trim()).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${requirements ? `
          <div>
            <h3 class="text-lg font-semibold mt-4">Requirements</h3>
            <ul class="list-disc pl-5 space-y-1">
              ${requirements.split('\n').filter(r => r.trim()).map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
          
          ${benefits ? `
          <div>
            <h3 class="text-lg font-semibold mt-4">Benefits</h3>
            <ul class="list-disc pl-5 space-y-1">
              ${benefits.split('\n').filter(b => b.trim()).map(b => `<li>${b}</li>`).join('')}
            </ul>
          </div>
          ` : ''}
        </div>
      `;

      const suggestions = [
        'Consider adding benefits information',
        'Include company culture details',
        'Add specific technical requirements'
      ];

      res.json({ description, suggestions });
    } catch (error) {
      res.status(500).json({ error: 'Generation failed' });
    }
  }, 1500);
});

// Save description
app.post('/save-description', (req, res) => {
  const description = req.body;
  description.id = Date.now();
  description.createdAt = new Date();
  savedDescriptions.push(description);
  res.json({ success: true });
});

// Get saved descriptions
app.get('/saved-descriptions', (req, res) => {
  res.json(savedDescriptions);
});

app.listen(PORT, () => {
  console.log(`Mock API running on port ${PORT}`);
});
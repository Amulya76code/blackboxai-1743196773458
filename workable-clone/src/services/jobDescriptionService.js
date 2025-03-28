import API from '../api.js';

export default {
  async generateJobDescription(jobDetails) {
    try {
      const response = await API.post('/generate-job-description', {
        title: jobDetails.title,
        company: jobDetails.company,
        location: jobDetails.location,
        type: jobDetails.type,
        salary: jobDetails.salary,
        experience: jobDetails.experience,
        responsibilities: jobDetails.responsibilities,
        requirements: jobDetails.requirements,
        benefits: jobDetails.benefits
      });
      
      return {
        success: true,
        description: response.description,
        suggestions: response.suggestions || [],
        meta: {
          ...(response.meta || {}),
          fieldsUsed: {
            title: !!jobDetails.title,
            company: !!jobDetails.company,
            location: !!jobDetails.location,
            type: !!jobDetails.type,
            salary: !!jobDetails.salary,
            experience: !!jobDetails.experience,
            responsibilities: !!jobDetails.responsibilities,
            requirements: !!jobDetails.requirements,
            benefits: !!jobDetails.benefits
          }
        }
      };
    } catch (error) {
      console.error('Job Description Generation Error:', error);
      throw new Error(error.message || 'Failed to generate job description');
    }
  },

  async saveJobDescription(descriptionData) {
    try {
      await API.post('/save-description', descriptionData);
      return true;
    } catch (error) {
      console.error('Save Description Error:', error);
      throw new Error(error.message || 'Failed to save job description');
    }
  },

  async getSavedDescriptions() {
    try {
      return await API.get('/saved-descriptions');
    } catch (error) {
      console.error('Get Descriptions Error:', error);
      throw new Error(error.message || 'Failed to fetch saved descriptions');
    }
  }
};

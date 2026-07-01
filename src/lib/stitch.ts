import { stitch } from '@google/stitch-sdk';

/**
 * Helper to check if Google Stitch is configured.
 */
export const isStitchConfigured = (): boolean => {
  return !!process.env.STITCH_API_KEY;
};

/**
 * Get a Stitch Project instance.
 * @param projectId Optional project ID (falls back to process.env.STITCH_PROJECT_ID)
 */
export const getStitchProject = (projectId?: string) => {
  const pId = projectId || process.env.STITCH_PROJECT_ID || 'default-project';
  if (!isStitchConfigured()) {
    console.warn('STITCH_API_KEY environment variable is missing. Stitch operations will fail.');
  }
  return stitch.project(pId);
};

/**
 * Generate a new UI screen mockup using Google Stitch AI.
 * @param prompt Natural language description of the UI
 * @param projectId Optional project ID
 */
export const generateUIScreen = async (prompt: string, projectId?: string) => {
  if (!isStitchConfigured()) {
    throw new Error('Google Stitch SDK is not configured. Please set the STITCH_API_KEY environment variable.');
  }
  
  try {
    const project = getStitchProject(projectId);
    const screen = await project.generate(prompt);
    
    return {
      success: true,
      screenId: screen.id,
      html: await screen.getHtml(),
      imageUrl: await screen.getImage(),
    };
  } catch (error) {
    console.error('Error generating UI screen via Stitch:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Stitch SDK error',
    };
  }
};

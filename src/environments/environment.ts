interface Environment {
  baseURL: string;
  production: boolean;
  surveyBaseURL?: string;
  projectsBaseURL?:string;
  capabilities:'all' | 'project' | 'survey';
  LOGIN_URL?:string
}

//projects and survey for non-docker
// export const environment:Environment = {
//   production: true,
//   baseURL: '<base-url>',
//   projectsBaseURL: '<project-base-url>',
//   surveyBaseURL: '<survey-base-url>'
// }s

//projects and survey for docker
export const environment:Environment = {
  production: true,
  baseURL: 'https://project-dev.elevate-apis.shikshalokam.org',
  projectsBaseURL: 'https://project-dev.elevate-apis.shikshalokam.org',
  surveyBaseURL: 'https://survey-dev.elevate-apis.shikshalokam.org',
  capabilities: 'all',
  LOGIN_URL:'http://localhost:3000/',
  }

//survey-only

// export const environment = {
//   production: true,
//   baseURL: "<survey-base-url>"
// };

//projects-only

// export const environment = {
//   production: true,
//   baseURL: "<projects-base-url>"
// };
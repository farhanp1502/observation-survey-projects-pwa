window["env"] = {
    production: true,
    baseURL: 'https://saas-qa.tekdinext.com',
    projectsBaseURL: 'https://saas-qa.tekdinext.com',
    surveyBaseURL: 'https://saas-qa.tekdinext.com',
    capabilities: 'all',
    restrictedPages: ["HOME_PAGE","PROFILE","EDIT_PROFILE"],
    unauthorizedRedirectUrl: "/home",
    isAuthBypassed: true,
    profileRedirectPath: "/profile-edit",
    config:{
        logoPath:'/assets/images/logo.png',
        faviconPath:'/assets/icons/elevate-logo.png',
        title:"Elevate test",
        redirectUrl:"/home"
    },
    showHeader:true,
    contentPolicyURL:"https://shikshalokam.org/mentoring/privacy-policy/"
};

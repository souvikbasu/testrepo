var appConfig = {
    logging: {
        enableDebug: true,
        logServer: null
    },
    serviceEndPoints: {
        zones: 'cls/newui/CATCmaDashboardServlet/getUserPreferences',
        homeData: 'data/home-data.json',
        fullCourseList: 'cls/newui/CATCmaHomePageServlet/getfullCourseList',
        library: 'cls/newui/CATCmaUserLibraryServlet/getUserLibraryCourses',
        assignments: 'cls/newui/CATCmaUserAssignmentServlet/getUserAssignment',
        assignmentLevel2: 'cls/newui/CATCmaUserAssignmentServlet/getAssignmentDetails',
        trainingCatalog: 'cls/newui/CATCmaUserAssignmentServlet/getCatalog',
        trainingCatalogLevel2: 'cls/newui/CATCmaUserAssignmentServlet/getCatalogDetails',
        dsTnc: 'http://ds-tnc',
        publicTnc: 'http://public-tnc',
        favorites: 'cls/newui/CATCmaUserLibraryServlet/getFavoriteCourses',
        addRemFavorite: 'cls/newui/CATCmaUserLibraryServlet/addRemoveFavorite',
        courseMetaData: 'cls/newui/CATCmaCourseMetaDataServlet/getCourseMetadata',
        lnchURLs: 'cls/newui/CATCmaUserLibraryServlet/getCourseLaunchUrl',
        login: 'cls/login/CATCmaUserAthenticationServlet/login',
        logout: 'cls/login/CATCmaUserAthenticationServlet/logout',
        switchRole: 'cls/newui/CATCmaUserChangeRoleServlet/switchRole',
        courseFilters: 'data/filters.json',
        searchCourses: 'cls/newui/CATCmaCourseSearchServlet/searchPublicCourses',
        getPdfDetails: 'cls/newui/CATCmaUserAssignmentServlet/downloadPdf',
        termsOfUse: 'cls/login/CATCmaUserAthenticationServlet/termsOfUse',
        changePass: 'cls/login/CATCmaUserAthenticationServlet/changePassword',
        cancelChangePass: 'cls/login/CATCmaUserAthenticationServlet/cancelChangePassword',
        privateSearch: 'cls/newui/CATCmaCourseSearchServlet/searchPrivateCourses',
        privateSearchAll: 'cls/newui/CATCmaCourseSearchServlet/exaleadSearch',
        exaleadFilters: 'cls/newui/CATCmaCourseSearchServlet/exaleadFilters',
        addRemFavExalead: 'cls/newui/CATCmaCourseSearchServlet/addRemFavExalead',
        requestLicenseInLibrary: 'cls/newui/CATCmaUserLibraryServlet/requestLicenseInLibrary',
        getUserProfile: 'cls/newui/CATCmaDashboardServlet/getUserProfile',
        exaleadScreenLaunch: 'cls/newui/CATCmaCourseSearchServlet/getLaunchUrl',
        forgotPass: 'cls/login/CATCmaUserAthenticationServlet/forgotPassword',
        privateSearchTypeAhead: 'cls/newui/CATCmaCourseSearchServlet/getFullPrivateCourses',
        saveUserSettings: 'cls/newui/CATCmaDashboardServlet/saveUserSettings',
        getCountries: 'cls/newui/CATCmaDashboardServlet/getCountries'
    },
    clsUrls: {
        newuiLogin: 'newUI',
        termsOfUse: 'catcma/ui/ssl/CATCmaTermsofUse.xhtml',
        adminUrl: 'catcma/ui/secure/CATCmaWelcomePageAdmin.xhtml',
        teacherUrl: 'catcma/ui/secure/CATCmaWelcomePageTeacher.xhtml',
        changePassword: 'catcma/ui/ssl/CATCmaChangePassword.xhtml'
    },
    userHomePage: {
        infiniteScrollItemsToRender: 15,
        infiniteScrollItemsToFetch: 60,
        userProfileLanguage: ''
    },
    deploy: {
        cdnPathPrefix: 'http://cdn.epp.3ds.com/CompanionManager_sd/newUI/',
        envPathPrefix: 'http://epp.3ds.com/CompanionManager_sd/'
    },
    layout: {
        cardContainerSideMarginInPercentage: 5,
        cardWidth: 230,
        cardHeight: 422
    }
};

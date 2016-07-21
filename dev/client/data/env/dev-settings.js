var appConfig = {
    logging: {
        enableDebug: false,
        logServer: null
    },
    serviceEndPoints: {
        zones: 'data/zones.json',
        homeData: 'data/home-data.json',
        fullCourseList: 'data/home-full-course-list.json',
        // library: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserLibraryServlet/getUserLibraryCourses',
        // favorites: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserLibraryServlet/getFavoriteCourses',
        // addRemFavorite: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserLibraryServlet/addRemoveFavorite',
        // assignments: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserAssignmentServlet/getUserAssignment',
        // assignmentLevel2: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserAssignmentServlet/getAssignmentDetails',
        // trainingCatalog: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserAssignmentServlet/getCatalog',
        // trainingCatalogLevel2: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserAssignmentServlet/getCatalogDetails',
        library: 'data/my-library.json',
        favorites: 'data/my-favorites.json',
        // library: 'http://dcn6win764plp:7071/cls_newui_d8/cls/newui/CATCmaUserLibraryServlet/getUserLibraryCourses',
        // favorites: 'http://dcn6win764plp:7071/cls_newui_d8/cls/newui/CATCmaUserLibraryServlet/getFavoriteCourses',
        addRemFavorite: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserLibraryServlet/addRemoveFavorite',
        assignments: 'data/my-assignments.json',
        assignmentLevel2: 'data/my-training-catalog-level2.json',
        trainingCatalog: 'data/my-training-catalog.json',
        trainingCatalogLevel2: 'data/my-training-catalog-level2.json',
        dsTnc: 'http://ds-tnc',
        publicTnc: 'http://public-tnc',
        courseMetaData: 'data/course-meta-data.json',
        lnchURLs: 'data/launch-URLs.json',
        login: 'http://epp.3ds.com/CompanionManager_sd/cls/login/CATCmaUserAthenticationServlet/login',
        logout: 'http://epp.3ds.com/CompanionManager_sd/cls/login/CATCmaUserAthenticationServlet/logout',
        switchRole: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserChangeRoleServlet/switchRole',
        courseFilters: 'data/filters.json',
        searchCourses: 'data/public-search.json',
        getPdfDetails: 'http://epp.3ds.com/CompanionManager_sd/cls/newui/CATCmaUserAssignmentServlet/downloadPdf',
        termsOfUse: 'http://epp.3ds.com/CompanionManager_sd/cls/login/CATCmaUserAthenticationServlet/termsOfUse',
        changePass: 'http://epp.3ds.com/CompanionManager_sd/cls/login/CATCmaUserAthenticationServlet/changePassword',
        cancelChangePass: 
            'http://epp.3ds.com/CompanionManager_sd/cls/login/CATCmaUserAthenticationServlet/cancelChangePassword',
        privateSearch: 'data/private-search.json',
        privateSearchAll: 'data/exalead-courses.json',
        exaleadFilters: 'data/exalead-filters.json',
        addRemFavExalead: 'http://dcn6win764plp:7071/cls_newui_d8/cls/newui/CATCmaCourseSearchServlet/addRemFavExalead',
        requestLicenseInLibrary: 'http://dcn6win764plp:7071/cls_newui_d8/cls/newui/CATCmaUserLibraryServlet/requestLicenseInLibrary',
        getUserProfile: 'data/user-profile.json',
        exaleadScreenLaunch: 'http://dcn6win764plp:7071/cls_newui_d8/cls/newui/CATCmaCourseSearchServlet/getLaunchUrl',
        forgotPass: 'http://epp.3ds.com/CompanionManager_sd/cls/login/CATCmaUserAthenticationServlet/forgotPassword',
        privateSearchTypeAhead: 'data/private-search-typeahead.json',
        saveUserSettings: 'cls/newui/CATCmaDashboardServlet/saveUserSettings',
        getCountries: 'cls/newui/CATCmaDashboardServlet/getCountries'
    },
    clsUrls: {
        newuiLogin: 'http://epp.3ds.com/CompanionManager_sd/catcma/newui',
        termsOfUse: 'http://epp.3ds.com/CompanionManager_sd/catcma/ui/ssl/CATCmaTermsofUse.xhtml',
        adminUrl: 'http://epp.3ds.com/CompanionManager_sd/catcma/ui/secure/CATCmaWelcomePageAdmin.xhtml',
        teacherUrl: 'http://epp.3ds.com/CompanionManager_sd/catcma/ui/secure/CATCmaWelcomePageTeacher.xhtml',
        changePassword: 'http://epp.3ds.com/CompanionManager_sd/catcma/ui/ssl/CATCmaChangePassword.xhtml'
    },
    userHomePage: {
        infiniteScrollItemsToRender: 5,
        infiniteScrollItemsToFetch: 15,
        userProfileLanguage: ''
    },
    deploy: {
        cdnPathPrefix: '',
        envPathPrefix: ''
    },
    layout: {
        cardContainerSideMarginInPercentage: 5,
        cardWidth: 230,
        cardHeight: 422
    }
};

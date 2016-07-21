var appConfig = {
    logging: {
        enableDebug: false,
        logServer: null
    },
    serviceEndPoints: {
        zones: 'data/zones.json',
        homeData: 'data/home-data.json',
        fullCourseList: 'data/home-full-course-list.json',
        library: 'data/my-library.json',
        assignments: 'data/my-assignments.json',
        dsTnc: 'http://ds-tnc',
        publicTnc: 'http://public-tnc'
    },
    userHomePage: {
        infiniteScrollItemsToRender: 5,
        infiniteScrollItemsToFetch: 15
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

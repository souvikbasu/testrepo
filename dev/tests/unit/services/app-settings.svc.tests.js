describe('Service: appSettingsService', function() {
    var $httpBackend, service;

    beforeEach(module('cls'));

    beforeEach(inject(function(appSettingsService, _$httpBackend_) {
        service = appSettingsService;
        $httpBackend = _$httpBackend_;
    }));

    it('should get app zones settings', function() {
        var result = {};
        $httpBackend.expect('GET', 'data/zones.json').respond(200, {
            industries: [
                {
                    indId: 1,
                    indT: 'Aerospace & Defense',
                    indD: 'Reaching New Heights in Program Success'
                }
            ],
            brands: [
                {
                    bId: 1,
                    bNm: 'NA',
                    bImg: '/static/images/3DS_2014_3DExcite_SteelBlue_RGB.png'
                },
                {
                    bId: 2,
                    bNm: 'CATIA',
                    bImg: '/static/images/CATIA_Logotype_RGB_Blue.png'
                }
            ]
        });

        service.getZoneSettings()
            .then(function(settings) {
                result = settings;
            });

        $httpBackend.flush();
        expect(result.industries.length).toBe(1);
        expect(result.industries[0].indD).toBe('Reaching New Heights in Program Success');
        expect(result.brands.length).toBe(2);
        expect(result.brands[1].bNm).toBe('CATIA');
    });

    it('should get app zones settings from cache', function() {
        var result = {};
        $httpBackend.expect('GET', 'data/zones.json').respond(200, {
            industries: [
                {
                    indId: 1,
                    indT: 'Aerospace & Defense',
                    indD: 'Reaching New Heights in Program Success'
                }
            ],
            brands: [
                {
                    bId: 1,
                    bNm: 'NA',
                    bImg: '/static/images/3DS_2014_3DExcite_SteelBlue_RGB.png'
                },
                {
                    bId: 2,
                    bNm: 'CATIA',
                    bImg: '/static/images/CATIA_Logotype_RGB_Blue.png'
                }
            ]
        });

        service.getZoneSettings()
            .then(function(settings) {
                result = settings;
            });

        $httpBackend.flush(1);
        expect(result.industries.length).toBe(1);
        expect(result.industries[0].indD).toBe('Reaching New Heights in Program Success');
        expect(result.brands.length).toBe(2);
        expect(result.brands[1].bNm).toBe('CATIA');

        service.getZoneSettings()
            .then(function(settings) {
                result = settings;
            });

        expect(result.industries.length).toBe(1);
        expect(result.industries[0].indD).toBe('Reaching New Heights in Program Success');
        expect(result.brands.length).toBe(2);
        expect(result.brands[1].bNm).toBe('CATIA');
    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });
});

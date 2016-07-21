(function() {
    'use strict';

    /**
     * @ngdoc controller
     * @name cls.controller:MySettingsCtrl
     * @description Controller for course meta data page. Shows all information
     *              for a course and allows to launch a course
     */
    angular.module('cls').controller('MySettingsCtrl', ['$scope', 'loginService', MySettingsCtrl]);

    function MySettingsCtrl($scope, loginService) {
        $scope.showProfile = false;
        $scope.showZone = false;
        $scope.showAccount = true;
        $scope.showPwd = false;
        $scope.warningImg = 'static/images/warning-pic.png';
        $scope.selectedMenu = 'myAccount';
        $scope.showDSUsers = false;
        $scope.showOthers = false;
        $scope.showPwdMsg = false;
        $scope.showZoneMsg = false;

        loginService.getUserProfile().then(function(data) {
            console.log(data.myAcc);
            $scope.fn = data.myAcc.fn;
            $scope.ln = data.myAcc.ln;
            $scope.email = data.myAcc.email;
            $scope.confEmail = data.myAcc.email;
            $scope.phone = data.myAcc.phone;
            $scope.certId = ' ';
            $scope.comp = data.myAcc.company;
            if (data.myAcc.addr === '') {
                $scope.add = ' ';
            } else {
                $scope.add = data.myAcc.addr;
            }
            $scope.city = data.myAcc.city;
            $scope.state = ' ';
            $scope.zip = ' ';
            $scope.country = data.myAcc.country;
            $scope.roles = data.myAcc.roles;
            $scope.login = data.myAcc.login;
            $scope.uType = data.myAcc.userType;
            showPassword();
        });

        $scope.myProfile = function() {
            $scope.showProfile = true;
            $scope.showAccount = false;
            $scope.showZone = false;
            $scope.showPwd = false;
            $scope.selectedMenu = 'myProfile';
        };

        $scope.myAccount = function() {
            $scope.showAccount = true;
            $scope.showProfile = false;
            $scope.showZone = false;
            $scope.showPwd = false;
            $scope.selectedMenu = 'myAccount';
        };

        $scope.myZone = function() {
            $scope.showZone = true;
            $scope.showAccount = false;
            $scope.showProfile = false;
            $scope.showPwd = false;
            $scope.selectedMenu = 'zoneSettings';
        };

        $scope.changePwd = function() {
            $scope.showPwd = true;
            $scope.showZone = false;
            $scope.showAccount = false;
            $scope.showProfile = false;
            $scope.selectedMenu = 'changePwd';
        };

        $scope.saveZoneSettings = function() {
            var checkboxes = document.getElementsByName('zoneCheckboxes'), params = [], p = {zones: []}, selectedZones,
            oneSelFlag = false;
            // params = {zones: []}
            // loop over them all
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    oneSelFlag = true;
                    break;
                } else {
                    oneSelFlag = false;
                }
            }
            if (oneSelFlag) {
                for (i = 0; i < checkboxes.length; i++) {
                    params.push({
                        id: parseInt(checkboxes[i].value),
                        visible: checkboxes[i].checked
                    });
                    p.zones.push({
                        id: parseInt(checkboxes[i].value),
                        visible: checkboxes[i].checked
                    });
                }
                console.log(JSON.stringify(p));
                console.log(p);
                console.log(JSON.stringify(params));
                console.log(params);
                // selectedZones = JSON.stringify(params);
                selectedZones = params;

                loginService.saveUserSettings(selectedZones).then(function() {});
            } else {
                $scope.showZoneMsg = true;
                $scope.infoMsg = 'At least one zone must be selected';
            }
        };

        var showPassword = function() {
            console.log('in pwd fun');
            console.log($scope.uType);
            if ($scope.uType === 'ds_passport') {
                console.log('if');
                $scope.showDSUsers = true;
                $scope.showOthers = false;
            } else {
                console.log('else');
                $scope.showDSUsers = false;
                $scope.showOthers = true;
            }
        };

        $scope.savePassword = function() {
            loginService.changePassword($scope.oldPassword, $scope.newPassword, $scope.confirmPassword).then(
                function(result) {
                    if (result === 'successAdmin' || result === 'successStudent' || result === 'successTeacher') {
                        $scope.showPwdMsg = true;
                        $scope.infoMsg = 'your password has been reset';
                        document.getElementById('oldPwd').value = '';
                        document.getElementById('newPwd').value = '';
                        document.getElementById('confNewPwd').value = '';
                        document.getElementById('oldPwd').focus();
                    } else if (result !== '' || result !== null) {
                        var errorText = result.split('|');
                        alert(errorText[1]);
                    }
                });
        };
    }
})();


﻿"use strict";

angular.module('umbraco').controller('cDoc.DocumentationController', ['$scope', 'notificationsService', '$location', function ($scope, notificationsService, $location) {

    function getHtmlCode(url) {
        let successResult = "";
        const filePath = getFilePath();
        const urlWithQuery = url + "?filePath=" + filePath;
        $.ajax({
            url: urlWithQuery,
            dataType: "JSON",
            async: false,
            success: function (data) {
                successResult = data;
            },
            error: function (jqXHR, textStatus, errorThrown) {
                notificationsService.error("Something went wrong while getting the html code. " + textStatus + " " + errorThrown);
            }
        });
        return successResult;
    }

    function setHtmlCode(htmlCode) {
        $("#markdownDiv").html(htmlCode);
    }

    function getFilePath() {
        let path = $location.path();
        let partAfterEdit = path.split("edit/")[1];
        return partAfterEdit.replace('&', '/');
    }

    function setTitle() {
        let filePath = getFilePath();
        let filePathParts = filePath.split('/');
        let fileName = filePathParts[filePathParts.length - 1];
        let fileNameWithoutExtension = removeExtension(fileName);
        $scope.title = fileNameWithoutExtension;
    }

    function removeExtension(fileName) {
        if (fileName.indexOf(".md") !== -1) {
            return fileName.replace(".md", "");
        }
        if (fileName.indexOf(".html") !== -1) {
            return fileName.replace(".html", "");
        }
        if (fileName.indexOf(".txt") !== -1) {
            return fileName.replace(".txt", "");
        }
        return fileName;
    }

    function init() {
        setTitle();
        var htmlCode = getHtmlCode("/umbraco/backoffice/api/CustomDocumentation/GetHtmlForRoute");
        setHtmlCode(htmlCode);
    }

    init();
}]);
<!DOCTYPE html>
<html lang="en" ng-app="app">
<head>
	<meta charset="UTF-8">
	<meta name="theme-color" content="#3F51B5" />
	<!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Personiv Appraisal</title>
	<!-- Favicon -->
    <link rel="shortcut icon" href="/img/2Color-Favicon_512x512-1.png">
	<!-- Goolge Fonts Roboto -->
	<link href='https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic' rel='stylesheet' type='text/css'>
	<!-- Vendor CSS -->
	<link rel="stylesheet" href="/css/vendor.css">
	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="/css/app.css">
	<!-- Vendor CSS -->
	<link rel="stylesheet" href="/css/application.css">
</head>
<body>
	<!-- Main View -->
	<div class="main-view" ui-view></div>
	<!-- Vendor Scripts -->
	<script src="/js/vendor.js"></script>
	<!-- Shared Scripts -->
	<script src="/js/shared.js"></script>
	<!-- App Script -->
	<script src="/js/app.js"></script>
</body>
</html>
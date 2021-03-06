var propertyApp = angular.module('propertyApp', ['ngSanitize','ngAnimate','ui.bootstrap','ngMap']);

var api = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2F1dGguZGV6cmV6LmNvbS9BcGlLZXlJc3N1ZXIiLCJhdWQiOiJodHRwczovL2FwaS5kZXpyZXouY29tL3NpbXBsZXdlYmdhdGV3YXkiLCJuYmYiOjE0Njc5NjU3NDUsImV4cCI6NDYyMzYzOTM0NSwiSXNzdWVkVG9Hcm91cElkIjoiNDg5ODI4IiwiQWdlbmN5SWQiOiI4Iiwic2NvcGUiOlsiaW1wZXJzb25hdGVfd2ViX3VzZXIiLCJwcm9wZXJ0eV9iYXNpY19yZWFkIl19.8HsZkJLPqWDnpItYlszcwiy9_9dxC3ZVlABqq0mEggI";

//Search results app use ngcontroller=searchresults to call.

propertyApp.controller('SearchResults',function ($scope, $http){

	//Get params from Url 
	function getUrlParameter(sParam)
		{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++) 
		{
			var sParameterName = sURLVariables[i].split('=');
			if (sParameterName[0] == sParam) 
			{
				return sParameterName[1];
			}
		}
	} 

          

//Setting search parameters as js variables to be called in api request        

	 var MiniPrice = getUrlParameter('minprice');
	 var MaxiPrice = getUrlParameter('maxprice');
	 var MinBed = getUrlParameter('bedrooms');
	 var page = getUrlParameter('page');
	 var add = getUrlParameter('searchTown');
	 var rent = getUrlParameter('rentalperiod');
	 

	 if (rent == "4"){
		salerent = "Letting" 
	 }
	 else {
		 salerent = "Selling"
	 }


	//Setting request variables - API key, Headers and search queries.  

	var req = {
	

				url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKEY=' + api,

				method: 'POST',

				headers: {

				'Rezi-Api-Version' : '1.0',

				'Content-Type' : 'application/json'

				},

				data:

				 { 	BranchIdList:[],

					MinimumPrice:MiniPrice,

					MaximumPrice:MaxiPrice,

					MinimumBedrooms:MinBed,

					PageNumber:page, 

					Address:add,

					PageSize:12,

					RoleTypes:[salerent],
					
					MarketingFlags: ["ApprovedForMarketingWebsite"],
					
					IncludeSTC: true
					
					//Test
					

				}

			  }

				$http(req).success(function(data){

				$scope.data = data;

				$scope.status = status;

				$scope.Property =  data.Collection;
				
				console.log($scope.Property);
				
				//set page variable to use for simplepagination.

				page = data.TotalCount / data.PageSize;

				//Pagination call

					$('#pages').pagination({

					items: data.TotalCount,

					itemsOnPage: data.PageSize,

					cssStyle: 'light-theme'

					});
					
					$('#pages-2').pagination({

					items: data.TotalCount,

					itemsOnPage: data.PageSize,

					cssStyle: 'light-theme'

					});

				}); 
				
				

});


//Full details controller



propertyApp.controller('FullDetails',function ($scope, $http){

	//Get params from Url 

	function getUrlParameter(sParam)
	{
		var sPageURL = window.location.search.substring(1);
		var sURLVariables = sPageURL.split('&');
		for (var i = 0; i < sURLVariables.length; i++){ 
				var sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == sParam){
					return sParameterName[1];
				}
		}
	} 

	//Set Property ID param
	var pid = getUrlParameter('pid');
		//Setting request variables - API key, Headers and RoleID.
		var req = {
			url: 'https://api.dezrez.com/api/simplepropertyrole/'+ pid + '?APIKey=' + api,
			method: 'Get',
			headers: {
			'Rezi-Api-Version' : '1.0',
			'Content-Type' : 'application/json'
		},
	};

	//Setting scope variables to call here

	$scope.featuresArr=[];

	$scope.imagesArr=[];

	$scope.roomstitleArr=[];

	$scope.roomstextArr=[];

	$scope.epcArr=[];

	$http(req).success(function(data){

		$scope.data = data;	
		$scope.status = status;	
		$scope.Property =  data;	
		$scope.id = pid;
		
		$.each(data.ViewPoints, function(){		
			$scope.latitude = this.Point.Latitude;		
			$scope.longitude = this.Point.Longitude;			
			$scope.pitch = this.Pitch;			
			$scope.heading = this.Heading;				
		});	
		
		
		console.log($scope.Property); 
			  			
			$.each(data.Images, function(i){	
				$scope.imagesArr.push({image: this.Url + '?width=1200', id: i});						
			});	
			
			console.log($scope.imagesArr); 		
			
			//call to sort floorplans and epc apart.
			
			var floorplans = $scope.floorplans = [];
			
			$.each(data.Documents, function(){	
				if(this.DocumentSubType.SystemName == "Floorplan"){	
					floorplans.push({image:this.Url});	
				}	
				if(this.DocumentSubType.SystemName == "EPC"){	
					$scope.epc = this.Url;	
				}
				if(this.DocumentSubType.SystemName == "Brochure"){			
					$scope.brochure = this.Url;				
				}	
			});
	
			//call to sort descriptions to sepearate variables.
	
			$.each(data.Descriptions,function(){	
				if (this.DescriptionType.SystemName == 'Feature'){	
					$.each(this.Features, function (i,v){	
						$scope.featuresArr.push(v.Feature);	
					});	
				}	
				if(this.DescriptionType.SystemName === "StyleAge"){	
					$scope.Proptype = this.PropertyType.DisplayName;	
				}
	
				if(this.DescriptionType.SystemName == "RoomCount"){	
					$scope.bed = this.Bedrooms;	
					$scope.bath = this.Bathrooms;	
					$scope.rec = this.Receptions;	
				}	
				if(this.DescriptionType.SystemName == "Amenity"){	
					$scope.garden = this.Gardens;	
					$scope.parking = this.ParkingSpaces;	
					$scope.garage = this.Garages;	
				}	
				if(this.Name == "Main Marketing"){	
					$scope.maintext = this.Text;
				}
	
				if (this.DescriptionType.SystemName === "SummaryText"){	
					$scope.summary = this.Text;	
				}
	
				if(this.DescriptionType.SystemName == "Room"){	
					$.each(this.Rooms, function (i,v){	
						$scope.roomstitleArr.push(v);
					});	
				}	
			});	   	
	
		});

});


//Featured properties controller

propertyApp.controller('FeaturedProp',function ($scope, $http){
	
var req = {

 url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKey=' + api,



 method: 'POST',

 headers: {

'Rezi-Api-Version' : '1.0',

'Content-Type' : 'application/json'

 },

data: {

	MinimumPrice: "",

	MaximumPrice:"",

	MinimumBedrooms:0,

	MaximumBedrooms:"",

	BranchIdList:[],

	PageSize:4,

	MarketingFlags: ["Featured", "ApprovedForMarketingWebsite"]

	}

};  

$http(req).success(function(data){
  $scope.data = data;
  $scope.status = status;
  $scope.Property =  data.Collection;
  console.log($scope.Property);
}); 


});







propertyApp.controller('Latestprop-Sales',function ($scope, $http){





var req = {

   url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKey=' + api,

	 method: 'POST',
	
	 headers: {
	
	'Rezi-Api-Version' : '1.0',
	
	'Content-Type' : 'application/json'
	
	 },
	
	data: {
	
		MinimumPrice: "",
	
		MaximumPrice:"",
	
		MinimumBedrooms:"",
	
		MaximumBedrooms:"",
	
		BranchIdList:[],
		
		RoleTypes:["selling"],
		
		MarketingFlags: ["ApprovedForMarketingWebsite"],	
		
		PageSize:4,
		
		SortBy: 2,
		
		SortOrder: 1,
		}



	}

 

	$http(req).success(function(data){
	
	  $scope.data = data;
	
	  $scope.status = status;
	
	  $scope.Property =  data.Collection;
	
	  console.log($scope.Property);
	
	}); 



});

propertyApp.controller('Latestprop-Lettings',function ($scope, $http){
	
var req = {

   url: 'https://api.dezrez.com/api/simplepropertyrole/search?APIKey=' + api,

	 method: 'POST',
	
	 headers: {
	
	'Rezi-Api-Version' : '1.0',
	
	'Content-Type' : 'application/json'
	
	 },
	
	data: {
	
		MinimumPrice: "",
	
		MaximumPrice:"",
	
		MinimumBedrooms:"",
	
		MaximumBedrooms:"",
	
		BranchIdList:[],
		
		RoleTypes:["letting"],
		
		MarketingFlags: ["ApprovedForMarketingWebsite"],	
		
		PageSize:4,
		
		SortBy: 2,
		
		SortOrder: 1,
		}



	}

 

	$http(req).success(function(data){
	
	  $scope.data = data;
	
	  $scope.status = status;
	
	  $scope.Property =  data.Collection;
	
	  console.log($scope.Property);
	
	}); 



});











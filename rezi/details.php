<div  ng-app="propertyApp">
<div ng-controller="FullDetails" >

        <div class="row">
        	
            <!-- Product Image & Available Colors -->
            <div class="col-sm-6">
                <div class="product-image-large">                        	
                    <img ng-src="{{Property.Images[0].Url}}" alt="Item Name">                            
                </div>                         
            </div>
            <!-- End Product Image & Available Colors -->
            
            <!-- Product Summary & Options -->
            <div class="col-sm-6 product-details">
                <h2>{{Property.Address.Street}}, {{Property.Address.Town}}</h2>
                <div class="price">
                    {{Property.Price.PriceValue | currency:"£": "0"}}  {{Property.Price.PriceText}}
                </div>
                
                <div class="room-counts">
                	Bedrooms {{bed}}&nbsp;
                    Bathrooms {{bath}}&nbsp;
                    Receptions {{rec}}&nbsp;
                    Gardens {{garden}}&nbsp;
                    Parking {{parking}}&nbsp;
                    Garages {{garage}}
                </div>
                
                <div class="row nm brief">
                    <h3>Summary</h3>
                    <p ng-bind-html="summary"></p>
                    <p></p>
                </div>
                
                <div class="row nm brief">
                    <h3>Main Marketing text</h3>
                    <p ng-bind-html="maintext"></p>
                    <p></p>
                </div> 
                
                <div class="row nm brief">
                	<h3>EPC</h3>
                	<img style="width:250px;" src="{{epc}}" />                  
                </div>      
                
                <div class="row nm brief" >
                    <h3>Images</h3>
                    <div ng-repeat="Id in imagesArr">                
                    <span class="col-xs-1" style="padding:0px;">
                        <a rel="gallery" href="{{Id.image}}?width=1000" title="" >
                            <img style="margin:10px;" width="80" height="60" src="{{Id.image}}?width=100" alt="" />
                        </a>
                    </span>  
                    </div>
                </div>
                <div class="row nm brief">
                    <h3>Room Details</h3>
                    <span ng-repeat="room in roomstitleArr" class="text-left">
                        <p>
                            <span style="font-weight:bold;">{{room.Name}} - </span>
                            <span>{{room.Text}}</span><br/>
                        </p>
                    </span> 
                </div>
                
            </div>
            
           </div>
           
           
            
            

</div>
</div>
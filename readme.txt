#### WELCOME ####

This is your copy of the SAPUI5 Master-Detail Freestyle Application Template.
You can find the template version in the .project.json - file in your workspace

Standalone runnable files (*.html) are located in the test-folder

This application is ready for client-side build in the SAP Web IDE and deployment to ABAP/HCP repositories

Documentation of all template-app features can be found in the SAPUI5 demokit here:
https://sapui5.hana.ondemand.com/#docs/guide/a460a7348a6c431a8bd967ab9fb8d918.html


 #### Happy Development! ####
 
 showNavButton="{device>/system/phone}"
 
parameters: {expand: { "to_Items" : 
				                           { select : ["Matnr", "Werks"] }}  
				
				
		<Table
		  id="tab11"  items="{to_Items}">
			<tooltip></tooltip><!-- sap.ui.core.TooltipBase -->
			<items>
				      <ColumnListItem>
        <cells>
          <ObjectIdentifier
            title="{ZI_MDOC/Matnr}"
            text="sdsdsd"
            class="sapMTableContentMargin" />
          <Text
            text="{Lgort}" />
        </cells>
      </ColumnListItem>
      
			</items><!-- sap.m.ListItemBase -->
			<columns>
				      <Column
        width="12em">
        <Text text="Product" />
      </Column>
       <Column
        minScreenWidth="Tablet"
        demandPopin="true">
        <Text text="Supplier" />
      </Column>
			</columns><!-- sap.m.Column -->
		</Table>
import {
    getCommonHeader,
    getCommonContainer,
    getLabel,
    getCommonCard
} from "egov-ui-framework/ui-config/screens/specs/utils";
import { getQueryArg, setDocuments } from "egov-ui-framework/ui-utils/commons";
import { getSearchResults } from "../../../../ui-utils/commons";
import { setRoute } from "egov-ui-framework/ui-redux/app/actions";
import { getReviewOwner, getReviewProperty, getReviewAddress, getReviewRentDetails, getReviewPaymentDetails,getReviewGrantDetails ,getGrantDetails,getGrantDetailsAvailed} from "./applyResource/review-property";
import { getReviewDocuments } from "./applyResource/review-documents";
import { getUserInfo ,getTenantId} from "egov-ui-kit/utils/localStorageUtils";
import { prepareFinalObject, handleScreenConfigurationFieldChange as handleField,
} from "egov-ui-framework/ui-redux/screen-configuration/actions";
const userInfo = JSON.parse(getUserInfo());
const {roles = []} = userInfo
const findItem = roles.find(item => item.code === "RP_CLERK");

let transitNumber = getQueryArg(window.location.href, "transitNumber");

export const headerrow = getCommonContainer({
  header: getCommonHeader({
    labelName: "Rented Properties",
    labelKey: "RP_COMMON_RENTED_PROPERTIES"
  })
});
const reviewOwnerDetails = getReviewOwner(false);
const reviewPropertyDetails = getReviewProperty(false);
const reviewAddressDetails = getReviewAddress(false);
const reviewRentDetails = getReviewRentDetails(false);
const reviewPaymentDetails = getReviewPaymentDetails(false);
const reviewDocumentDetails = getReviewDocuments(false, "apply")
const grantDetailAvailed=getGrantDetailsAvailed(false)
const reviewGrantDetails = getReviewGrantDetails(false)
const grantDetail=getGrantDetails(false)
export const propertyReviewDetails = getCommonCard({
  reviewPropertyDetails,
  reviewAddressDetails,
  reviewOwnerDetails,
  reviewRentDetails,
  reviewPaymentDetails,
  reviewDocumentDetails,
  grantDetailAvailed,
  reviewGrantDetails,
  grantDetail
  
});

export const searchResults = async (action, state, dispatch, transitNumber) => {
  let queryObject = [
    { key: "transitNumber", value: transitNumber }
  ];
  let payload = await getSearchResults(queryObject);
  if(payload) {
    let properties = payload.Properties;
    const grandDetails=properties[0].grantDetails
    let state = properties[0].masterDataState;
    let applicationDocuments = properties[0].propertyDetails.applicationDocuments || [];
    const removedDocs = applicationDocuments.filter(item => !item.active)
    applicationDocuments = applicationDocuments.filter(item => !!item.active)
    properties = [{...properties[0], propertyDetails: {...properties[0].propertyDetails, applicationDocuments}}]
    dispatch(prepareFinalObject("Properties[0]", properties[0]));
    dispatch(
      prepareFinalObject(
        "PropertiesTemp[0].removedDocs",
        removedDocs
      )
    );
    await setDocuments(
      payload,
      "Properties[0].propertyDetails.applicationDocuments",
      "PropertiesTemp[0].reviewDocData",
      dispatch,'RP'
    );

    const getGrantDetailsAvailed = grandDetails !==null
    dispatch(
      handleField(
        "search-preview",
        "components.div.children.propertyReviewDetails.children.cardContent.children.grantDetailAvailed",
        "visible",
        getGrantDetailsAvailed
    ),
  );
  const isGrantDetails = grandDetails ===null
  dispatch(
    handleField(
      "search-preview",
      "components.div.children.propertyReviewDetails.children.cardContent.children.grantDetail",
      "visible",
      isGrantDetails
  ),
);
      const showEstimate = grandDetails !==null
      dispatch(
        handleField(
            "search-preview",
            "components.div.children.propertyReviewDetails.children.cardContent.children.reviewGrantDetails",
            "visible",
            showEstimate
        ),
      );
  
        
    if(state == 'PM_REJECTED'){
      let path = "components.div.children.headerDiv.children.searchButton"
      dispatch(
        handleField(
          "search-preview",
          path,
          "visible",
          false
        )
      );
      let tabs = [
        {
          tabButton: { labelName: "Property Details", labelKey: "RP_PROPERTY_DETAILS" }
        }
      ]
      const props = {
        tabs,
        activeIndex: 0,
        onTabChange
      }
      dispatch(
        handleField(
          "search-preview",
          "components.div.children.tabSection",
          "props",
          props
        )
      );
    }
  }
}

const beforeInitFn = async (action, state, dispatch, transitNumber) => {
  dispatch(prepareFinalObject("workflow.ProcessInstances", []))
  if(transitNumber){
    await searchResults(action, state, dispatch, transitNumber)
  }
}

export const onTabChange = async(tabIndex, dispatch, state) => {
  transitNumber = getQueryArg(window.location.href, "transitNumber");
  const tenantId = getQueryArg(window.location.href, "tenantId");
  let path = ""
  if(tabIndex === 0) {
    path = `/rented-properties/search-preview?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 1) {
    path = `/rented-properties/property-transitImages?transitNumber=${transitNumber}&tenantId=${tenantId}`
  } else if(tabIndex === 2) {
    path = `/rented-properties/notices?transitNumber=${transitNumber}&tenantId=${tenantId}`
  }
  dispatch(setRoute(path))
}

export const tabs = [
  {
    tabButton: { labelName: "Property Details", labelKey: "RP_PROPERTY_DETAILS" },
  },
  {
    tabButton: { labelName: "Transit Site Image", labelKey: "RP_TRANSIT_SITE_IMAGES" },
  },
  {
    tabButton: { labelName: "Notices", labelKey: "RP_NOTICES" },
  }
]

const rentedPropertiesDetailPreview = {
  uiFramework: "material-ui",
  name: "search-preview",
  beforeInitScreen: (action, state, dispatch) => {
    transitNumber = getQueryArg(window.location.href, "transitNumber");
    beforeInitFn(action, state, dispatch, transitNumber);
    return action;
  },
  components: {
    div: {
      uiFramework: "custom-atoms",
      componentPath: "Div",
      props: {
        className: "common-div-css search-preview"
      },
      children: {
        headerDiv: {
          uiFramework: "custom-atoms",
          componentPath: "Container",
          children: {
            header1: {
              gridDefination: {
                xs: 12,
                sm: 8
              },
             ...headerrow
            },
            }
          },
          tabSection: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "CustomTabContainer",
            props: {
              tabs,
              activeIndex: 0,
              onTabChange
            },
            type: "array",
          },
          taskStatus: {
            uiFramework: "custom-containers-local",
            moduleName: "egov-rented-properties",
            componentPath: "WorkFlowContainer",
            props: {
              dataPath: "Properties",
              moduleName: "MasterRP",
              updateUrl: "/rp-services/property/_update"
            }
          },
        propertyReviewDetails
      }
    }
  }
};

export default rentedPropertiesDetailPreview;
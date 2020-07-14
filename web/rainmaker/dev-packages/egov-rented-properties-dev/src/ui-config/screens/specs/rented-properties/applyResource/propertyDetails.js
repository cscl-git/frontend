import { getCommonCard, getSelectField, getTextField, getDateField, getCommonTitle, getPattern, getCommonContainer } from "egov-ui-framework/ui-config/screens/specs/utils";
import { prepareFinalObject } from "egov-ui-framework/ui-redux/screen-configuration/actions";
import { getTodaysDateInYMD } from "../../utils";
import get from "lodash/get";
import { getDetailsFromProperty ,getDuplicateDetailsFromProperty} from "../../../../../ui-utils/apply";


export const propertyHeader = getCommonTitle(
        {
            labelName: "Property Details",
            labelKey: "RP_PROPERTY_DETAILS_HEADER"
        },
        {
            style: {
                    marginBottom: 18,
                    marginTop: 18
            }
        }
      )
export const pincodeField = {
    label: {
        labelName: "Pincode",
        labelKey: "RP_PINCODE_LABEL"
    },
    placeholder: {
        labelName: "Enter Pincode",
        labelKey: "RP_PINCODE_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 6,
    maxLength: 6,
    required: true,
  }
const colonyFieldConfig = {
    label: {
        labelName: "Colony",
        labelKey: "RP_COLONY_LABEL"
    },
    placeholder: {
        labelName: "Enter Colony",
        labelKey: "RP_COLONY_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].colony",
    optionValue: "code",
    optionLabel: "label",
    sourceJsonPath: "applyScreenMdmsData.propertyTypes",
    gridDefination: {
        xs: 12,
        sm: 6
    },
}

const colonyField = {
    ...colonyFieldConfig,
    beforeFieldChange: (action, state, dispatch) => {
        const rentedPropertyColonies = get(state.screenConfiguration.preparedFinalObject, "applyScreenMdmsData.rentedPropertyColonies") || []
        const findItem = rentedPropertyColonies.find(item => item.code === action.value)
        const propertyAreas = !!findItem ? findItem.area.map(item => ({
          code: item.code,
          label: item.sqyd
        })) : [];
        const rentPerSqyd = !!findItem ? findItem.costPerSqyd : ""
        dispatch(prepareFinalObject("applyScreenMdmsData.propertyAreas", propertyAreas))
        dispatch(prepareFinalObject("Properties[0].propertyDetails.rentPerSqyd", rentPerSqyd))
      }
}

export const transitNumberConfig = {
    label: {
        labelName: "Transit Site/Plot number",
        labelKey: "RP_SITE_PLOT_LABEL"
    },
    placeholder: {
        labelName: "Enter Transit Site/Plot number",
        labelKey: "RP_SITE_PLOT_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 4,
    maxLength: 25,
    required: true,
}

const ownershipTransitNumberField = {
    ...transitNumberConfig,
    jsonPath: "Duplicate[0].property.transitNumber",
    iconObj: {
        iconName: "search",
        position: "end",
        color: "#FE7A51",
        onClickDefination: {
          action: "condition",
          callBack: (state, dispatch) => {
            getDuplicateDetailsFromProperty(state, dispatch);
          }
        }
      },
      title: {
        value:
          "If you have already assessed your property, then please search your property by your transit Number",
        key: "If you have already assessed your property, then please search your property by your transit Number"
      },
      infoIcon: "info_circle",
      beforeFieldChange: (action, state, dispatch) => {
        dispatch(
            prepareFinalObject(
              "Duplicate[0].property.id",
              ""
            )
          )
        dispatch(
            prepareFinalObject(
              "Properties[0].colony",
              ""
            )
          )
          dispatch(
            prepareFinalObject(
              "Properties[0].pincode",
              ""
            )
          )
      }
}

const transitNumberField = {
    ...transitNumberConfig,
    jsonPath: "Properties[0].transitNumber"
  }

  const allotmentDateField = {
    label: {
        labelName: "Date of Allotment",
        labelKey: "RP_ALLOTMENT_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Allotment",
        labelKey: "RP_ALLOTMENT_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.allotmentStartdate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
  }

  const allotmentNumberField = {
    label: {
        labelName: "Allotment Number",
        labelKey: "RP_ALLOTMENT_NUMBER_LABEL"
    },
    placeholder: {
        labelName: "Enter Allotment Number",
        labelKey: "RP_ALLOTMENT_NUMBER_PLACEHOLDER"
    },
    gridDefination: {
        xs: 12,
        sm: 6
    },
    minLength: 3,
    maxLength: 20,
    required: true,
    jsonPath: "Properties[0].owners[0].allotmenNumber"
  }

  const areaField = {
    label: {
        labelName: "Area of the property",
        labelKey: "RP_AREA_PROPERTY_LABEL"
    },
    placeholder: {
        labelName: "Enter Area of the property",
        labelKey: "RP_AREA_PROPERTY_PLACEHOLDER"
    },
    required: true,
    jsonPath: "Properties[0].propertyDetails.area",
    // optionValue: "code",
    // optionLabel: "label",
    // sourceJsonPath: "applyScreenMdmsData.propertyAreas",
    gridDefination: {
        xs: 12,
        sm: 6
    }
  }

  const posessionDateField = {
    label: {
        labelName: "Date of Possession",
        labelKey: "RP_POSSESSION_DATE_LABEL"
    },
    placeholder: {
        labelName: "Enter Date of Possession",
        labelKey: "RP_POSSESSION_DATE_PLACEHOLDER"
    },
    required: true,
    pattern: getPattern("Date"),
    jsonPath: "Properties[0].owners[0].ownerDetails.posessionStartdate",
    props: {
        inputProps: {
            max: getTodaysDateInYMD()
        }
    }
  }

const getPropertyDetails = () => {
    return {
        header: propertyHeader,
        detailsContainer: getCommonContainer({
            colony: getSelectField(colonyField),
            transitNumber: getTextField(transitNumberField),
            areaOfProperty: getTextField(areaField),
            dateOfAllotment: getDateField(allotmentDateField),
            allotmentNumber: getTextField(allotmentNumberField),
            posessionDate: getDateField(posessionDateField)
        })
    }
}

const transitSiteHeader = getCommonTitle(
    {
        labelName: "Transit Site Details",
        labelKey: "RP_TRANSIT_SITE_DETAILS_HEADER"
    },
    {
        style: {
                marginBottom: 18,
                marginTop: 18
        }
    }
  )

const getTransitSiteDetails = () => {
    return {
        header: transitSiteHeader,
        detailsContainer: getCommonContainer({
            transitNumber: getTextField(ownershipTransitNumberField),
            colony: getTextField({...colonyFieldConfig,jsonPath: "Properties[0].colony", required: false, props: {...colonyFieldConfig.props, disabled: true}}),
            pincode: getTextField({...pincodeField, jsonPath: "Properties[0].pincode", required: false, props: {...pincodeField.props, disabled: true}}),
        })
    }
}

export const propertyDetails = getCommonCard(getPropertyDetails())
export const transitSiteDetails = getCommonCard(getTransitSiteDetails())
